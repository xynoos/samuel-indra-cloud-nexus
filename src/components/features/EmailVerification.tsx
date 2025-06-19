
import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailVerificationProps {
  email: string;
  onResend?: () => Promise<void>;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onResend 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!onResend) return;
    
    setIsResending(true);
    try {
      await onResend();
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Verifikasi Email Anda
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Kami telah mengirim email verifikasi ke:
            </p>
            <p className="font-semibold text-gray-800">{email}</p>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Silakan cek inbox email Anda dan klik link verifikasi untuk mengaktifkan akun.
            </AlertDescription>
          </Alert>

          {resent && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-600">
                Email verifikasi telah dikirim ulang!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Tidak menerima email?
            </p>
            
            <Button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isResending ? 'Mengirim...' : 'Kirim Ulang Email'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Periksa juga folder spam atau junk mail Anda
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
