
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Cloud, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/lib/config';

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  
  const email = searchParams.get('email') || '';
  const autoCode = searchParams.get('code') || '';

  useEffect(() => {
    if (autoCode) {
      setVerificationCode(autoCode);
      handleVerify(autoCode);
    }
  }, [autoCode]);

  const handleVerify = async (code?: string) => {
    const codeToVerify = code || verificationCode;
    
    if (!codeToVerify || codeToVerify.length !== 6) {
      toast({
        title: "Kode tidak valid",
        description: "Masukkan kode verifikasi 6 digit",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(`${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.verifyOTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: codeToVerify
        }),
      });

      if (response.ok) {
        setIsVerified(true);
        toast({
          title: "Email berhasil diverifikasi!",
          description: "Anda akan diarahkan ke halaman login",
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Verifikasi gagal');
      }
    } catch (error) {
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
    try {
      const response = await fetch(`${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.sendEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Kode verifikasi dikirim ulang",
          description: "Periksa email Anda",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal mengirim ulang",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/60 backdrop-blur-lg border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Terverifikasi!
            </h2>
            <p className="text-gray-600">
              Anda akan diarahkan ke halaman login...
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
              Masukkan kode verifikasi yang dikirim ke: <strong>{email}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Masukkan kode 6 digit"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl font-mono bg-white/50 border-white/20"
              />
            </div>

            <Button
              onClick={() => handleVerify()}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                className="border-blue-200 hover:bg-blue-50"
              >
                Kirim Ulang Kode
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Kembali ke Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
