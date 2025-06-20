
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Cloud, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { sendOTPEmail, validateOTP } from '@/utils/emailService';

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const { currentOTP, setCurrentOTP } = useAuth();
  
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Check if there's pending user data
    const pendingUserData = sessionStorage.getItem('pendingUser');
    if (!pendingUserData) {
      toast({
        title: "Sesi verifikasi tidak valid",
        description: "Silakan daftar ulang",
        variant: "destructive",
      });
      navigate('/register');
    }
  }, [email, navigate, toast]);

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Kode tidak valid",
        description: "Masukkan kode verifikasi 6 digit",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const pendingUserData = sessionStorage.getItem('pendingUser');
      if (!pendingUserData) {
        throw new Error('Data pendaftaran tidak ditemukan');
      }

      const userData = JSON.parse(pendingUserData);
      
      // Validate OTP
      if (!validateOTP(verificationCode, userData.otp)) {
        throw new Error('Kode verifikasi tidak valid');
      }

      // Check OTP expiry (5 minutes)
      const otpAge = Date.now() - userData.timestamp;
      if (otpAge > 5 * 60 * 1000) {
        throw new Error('Kode verifikasi sudah kedaluwarsa');
      }

      console.log('OTP verified, creating user account...');

      // Create user account in Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.fullName,
          }
        }
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        throw signUpError;
      }

      console.log('User created successfully:', authData);

      // Clear temporary data
      sessionStorage.removeItem('pendingUser');
      setCurrentOTP(null);
      setIsVerified(true);

      toast({
        title: "Email berhasil diverifikasi!",
        description: "Akun Anda telah dibuat. Anda akan diarahkan ke halaman login",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verifikasi gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    
    try {
      const pendingUserData = sessionStorage.getItem('pendingUser');
      if (!pendingUserData) {
        throw new Error('Data pendaftaran tidak ditemukan');
      }

      const userData = JSON.parse(pendingUserData);
      
      // Generate new OTP
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send new OTP email
      const emailResult = await sendOTPEmail({
        email: userData.email,
        fullName: userData.fullName,
        otp: newOTP
      });

      if (!emailResult.success) {
        throw new Error(emailResult.message || 'Gagal mengirim email');
      }

      // Update stored data with new OTP
      const updatedUserData = {
        ...userData,
        otp: newOTP,
        timestamp: Date.now()
      };
      sessionStorage.setItem('pendingUser', JSON.stringify(updatedUserData));
      setCurrentOTP(newOTP);

      toast({
        title: "Kode verifikasi baru terkirim",
        description: "Periksa email Anda untuk kode yang baru",
      });
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Gagal mengirim ulang",
        description: error instanceof Error ? error.message : "Silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/60 backdrop-blur-lg border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Terverifikasi!
            </h2>
            <p className="text-gray-600">
              Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SamuelIndraBastian Cloud
            </span>
          </div>
        </div>

        <Card className="bg-white/60 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>Verifikasi Email</span>
            </CardTitle>
            <p className="text-gray-600">
              Masukkan kode verifikasi 6 digit yang dikirim ke: <br />
              <strong className="text-blue-600">{email}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl font-mono bg-white/50 border-white/20 tracking-widest"
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verifikasi Email
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Tidak menerima kode?
              </p>
              <Button
                variant="outline"
                onClick={resendCode}
                disabled={isResending}
                className="border-blue-200 hover:bg-blue-50"
              >
                {isResending ? 'Mengirim...' : 'Kirim Ulang Kode'}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Kode verifikasi berlaku selama 5 menit
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/register')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Kembali ke Pendaftaran
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
