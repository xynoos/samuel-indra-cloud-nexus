
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendOTPEmail, generateOTP } from '@/utils/emailService';
import { API_CONFIG } from '@/lib/config';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  currentOTP: string | null;
  setCurrentOTP: (otp: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentOTP, setCurrentOTP] = useState<string | null>(null);
  const { toast } = useToast();

  // Check backend health on startup
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.health}`);
      if (response.ok) {
        const health = await response.json();
        console.log('✅ Backend server is running:', health);
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Backend server is not running. Emails will use simulation mode.');
      return false;
    }
    return false;
  };

  useEffect(() => {
    // Check backend health
    checkBackendHealth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Log user session
          setTimeout(async () => {
            try {
              await supabase.from('user_sessions').insert({
                user_id: session.user.id,
                device_info: navigator.platform,
                user_agent: navigator.userAgent,
                location: 'Jakarta, ID'
              });
            } catch (error) {
              console.error('Error logging session:', error);
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login gagal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali",
        });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    try {
      console.log('🚀 Starting signup process for:', email);
      
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        const error = new Error('Username sudah digunakan');
        toast({
          title: "Username tidak tersedia",
          description: "Silakan pilih username lain",
          variant: "destructive",
        });
        return { error };
      }
      
      // Generate OTP for verification
      const otp = generateOTP();
      setCurrentOTP(otp);
      
      console.log('📧 Generated OTP for verification:', otp);

      // Check if backend is available
      toast({
        title: "Mengirim kode verifikasi...",
        description: "Mohon tunggu sebentar",
      });

      // Send OTP email
      try {
        console.log('📤 Attempting to send OTP email...');
        const emailResult = await sendOTPEmail({
          email,
          fullName,
          otp
        });
        console.log('📧 Email service response:', emailResult);

        if (!emailResult.success) {
          throw new Error(emailResult.message || 'Gagal mengirim email verifikasi');
        }

        // Show appropriate success message based on whether backend is running
        if (emailResult.messageId?.startsWith('dev_sim_')) {
          toast({
            title: "⚠️ Mode Pengembangan",
            description: `Backend tidak aktif. Kode OTP: ${otp}`,
            duration: 10000,
          });
        } else {
          toast({
            title: "✅ Kode verifikasi terkirim!",
            description: `Kode OTP telah dikirim ke ${email} via Gmail`,
          });
        }

      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        toast({
          title: "Gagal mengirim email verifikasi",
          description: emailError instanceof Error ? emailError.message : "Pastikan backend server berjalan di port 3001",
          variant: "destructive",
          duration: 8000,
        });
        return { error: emailError };
      }

      // Store user data temporarily in sessionStorage
      const userData = {
        email,
        password,
        username,
        fullName,
        otp,
        timestamp: Date.now()
      };
      
      try {
        sessionStorage.setItem('pendingUser', JSON.stringify(userData));
        console.log('💾 User data stored in session storage');
      } catch (storageError) {
        console.error('Failed to store user data:', storageError);
        toast({
          title: "Error penyimpanan",
          description: "Gagal menyimpan data sementara",
          variant: "destructive",
        });
        return { error: storageError };
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Registrasi gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa lagi!",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    currentOTP,
    setCurrentOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
