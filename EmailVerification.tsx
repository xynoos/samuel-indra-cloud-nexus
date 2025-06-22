
import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email: string;
  onResend?: () => Promise<void>;
  onVerificationComplete?: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onResend,
  onVerificationComplete 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { toast } = useToast();

  const handleResend = async () => {
    if (!onResend) return;
    
    setIsResending(true);
    try {
      await onResend();
      setResent(true);
      toast({
        title: "Email terkirim ulang",
        description: "Periksa inbox email Anda untuk kode verifikasi baru",
      });
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      console.error('Failed to resend email:', error);
      toast({
        title: "Gagal mengirim ulang",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Verifikasi Email
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Kode verifikasi telah dikirim ke:
          </p>
          <p className="font-semibold text-gray-800 bg-gray-100 p-2 rounded">
            {email}
          </p>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Silakan cek inbox email Anda dan masukkan kode verifikasi 6 digit pada halaman verifikasi.
          </AlertDescription>
        </Alert>

        {resent && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-600">
              Email verifikasi baru telah dikirim!
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
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Mengirim ulang...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Kirim Ulang Email
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Periksa juga folder spam atau junk mail Anda.<br/>
            Kode verifikasi berlaku selama 5 menit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
