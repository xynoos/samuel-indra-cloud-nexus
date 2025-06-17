
import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  onVerified: (email: string) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerified }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const sendVerificationEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email diperlukan",
        description: "Masukkan alamat email untuk verifikasi",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    
    try {
      // Simulate sending email via Gmail SMTP
      // In real implementation, this would call your backend endpoint
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsEmailSent(true);
        toast({
          title: "Email terkirim!",
          description: "Periksa inbox Anda untuk kode verifikasi",
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Gagal mengirim email",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      toast({
        title: "Kode OTP diperlukan",
        description: "Masukkan kode verifikasi yang dikirim ke email",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate OTP verification
      // In real implementation, this would verify against your backend
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        onVerified(email);
        toast({
          title: "Email terverifikasi!",
          description: "Anda dapat menggunakan semua fitur sekarang",
        });
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast({
        title: "Kode OTP salah",
        description: "Periksa kembali kode yang Anda masukkan",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-orange-600" />
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Verifikasi Email
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEmailSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Email
              </label>
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-orange-200"
              />
            </div>
            <Button
              onClick={sendVerificationEmail}
              disabled={isSendingEmail || !email.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Mail className={`w-4 h-4 mr-2 ${isSendingEmail ? 'animate-pulse' : ''}`} />
              {isSendingEmail ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-white/50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <Check className="w-4 h-4 inline mr-1" />
                Email verifikasi telah dikirim ke: <strong>{email}</strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Verifikasi (6 digit)
              </label>
              <Input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="bg-white/50 border-orange-200"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={verifyOTP}
                disabled={isVerifying || otp.length !== 6}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Check className={`w-4 h-4 mr-2 ${isVerifying ? 'animate-spin' : ''}`} />
                {isVerifying ? 'Memverifikasi...' : 'Verifikasi'}
              </Button>
              <Button
                onClick={() => setIsEmailSent(false)}
                variant="outline"
                className="border-orange-200 hover:bg-orange-50"
              >
                Ubah Email
              </Button>
            </div>
          </div>
        )}
        
        <div className="bg-orange-50/50 rounded-lg p-3 text-sm">
          <p className="text-orange-800 font-medium mb-1">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Gmail SMTP Integration
          </p>
          <p className="text-orange-700">• Verifikasi diperlukan untuk fitur premium</p>
          <p className="text-orange-700">• Email dikirim melalui SMTP Gmail</p>
          <p className="text-orange-700">• Kode berlaku 10 menit</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
