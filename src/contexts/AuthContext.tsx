
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

  useEffect(() => {
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
      console.log('Starting signup process for:', email);
      
      // Generate OTP for verification
      const otp = generateOTP();
      setCurrentOTP(otp);
      
      console.log('Generated OTP for verification');

      // Send OTP email directly without backend health check
      try {
        console.log('Sending OTP email...');
        const emailResult = await sendOTPEmail({
          email,
          fullName,
          otp
        });
        console.log('Email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        toast({
          title: "Gagal mengirim email verifikasi",
          description: emailError instanceof Error ? emailError.message : "Tidak dapat mengirim kode verifikasi. Periksa koneksi internet dan pengaturan server.",
          variant: "destructive",
        });
        return { error: emailError };
      }

      // Store user data temporarily
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
        console.log('User data stored in session storage');
      } catch (storageError) {
        console.error('Failed to store user data:', storageError);
        toast({
          title: "Error penyimpanan",
          description: "Gagal menyimpan data sementara",
          variant: "destructive",
        });
        return { error: storageError };
      }

      toast({
        title: "Kode verifikasi terkirim!",
        description: `Silakan cek email ${email} dan masukkan kode verifikasi 6 digit`,
      });

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
