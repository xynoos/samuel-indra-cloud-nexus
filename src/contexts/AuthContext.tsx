
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
  if (context === undefined) {
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
      console.log('🏥 Checking backend health...');
      const response = await fetch(`${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.health}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const health = await response.json();
        console.log('✅ Backend server is running and healthy:', health);
        console.log('📧 Gmail SMTP Status:', health.services?.gmail?.status);
        return true;
      } else {
        console.warn('⚠️ Backend server responded with error:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend server is not accessible:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check backend health immediately
    checkBackendHealth().then(isHealthy => {
      if (isHealthy) {
        console.log('🎉 Backend server dan Gmail SMTP siap digunakan!');
      } else {
        console.warn('⚠️ Backend server tidak tersedia. Email tidak akan terkirim.');
        toast({
          title: "⚠️ Backend Server Tidak Berjalan",
          description: "Untuk mengirim email verifikasi, jalankan: cd backend && npm start",
          variant: "destructive",
          duration: 10000,
        });
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
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
      console.log('🔍 Initial session check:', session?.user?.email);
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
      console.log('🚀 Starting registration process for:', email);
      
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
      
      console.log('🔢 Generated OTP for email verification:', otp);

      // Check backend availability first with better error handling
      const isBackendHealthy = await checkBackendHealth();
      if (!isBackendHealthy) {
        toast({
          title: "❌ Backend Server Tidak Berjalan",
          description: "Silakan jalankan backend server terlebih dahulu:\n\n1. Buka terminal baru\n2. cd backend\n3. npm install\n4. npm start\n\nSetelah itu coba registrasi lagi.",
          variant: "destructive",
          duration: 15000,
        });
        throw new Error('Backend server tidak dapat dijangkau. Jalankan: cd backend && npm start');
      }

      // Show loading message
      toast({
        title: "📧 Mengirim kode verifikasi...",
        description: "Menggunakan Gmail SMTP, mohon tunggu sebentar",
      });

      // Send OTP email via Gmail SMTP
      try {
        console.log('📤 Sending OTP email via Gmail SMTP backend...');
        const emailResult = await sendOTPEmail({
          email,
          fullName,
          otp
        });
        
        console.log('📧 Email service response:', emailResult);

        if (!emailResult.success || !emailResult.emailSent) {
          throw new Error(emailResult.message || 'Gagal mengirim email verifikasi');
        }

        // Success - email sent via Gmail SMTP
        console.log('🎉 Email berhasil dikirim via Gmail SMTP!');
        toast({
          title: "✅ Kode verifikasi berhasil dikirim!",
          description: `Email terkirim ke ${email} via Gmail SMTP. Periksa inbox atau folder spam Anda.`,
          duration: 8000,
        });

      } catch (emailError) {
        console.error('❌ Gmail SMTP email sending failed:', emailError);
        
        // Show specific error message
        let errorMessage = 'Gagal mengirim email verifikasi';
        if (emailError.message.includes('Backend server tidak dapat dijangkau')) {
          errorMessage = '🔧 Backend server tidak berjalan.\n\nLangkah perbaikan:\n1. Buka terminal baru\n2. cd backend\n3. npm install\n4. npm start\n5. Refresh halaman ini\n6. Coba registrasi lagi';
        } else if (emailError.message.includes('Gmail SMTP')) {
          errorMessage = '📧 Konfigurasi Gmail SMTP bermasalah. Periksa username dan app password di backend.';
        } else {
          errorMessage = emailError instanceof Error ? emailError.message : 'Terjadi kesalahan pada service email';
        }
        
        toast({
          title: "❌ Email gagal dikirim",
          description: errorMessage,
          variant: "destructive",
          duration: 15000,
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
        console.log('💾 User registration data stored temporarily');
      } catch (storageError) {
        console.error('Failed to store user data:', storageError);
        toast({
          title: "Error penyimpanan",
          description: "Gagal menyimpan data registrasi sementara",
          variant: "destructive",
        });
        return { error: storageError };
      }

      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
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
