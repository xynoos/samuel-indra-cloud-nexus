
import { API_CONFIG } from '@/lib/config';

interface SendOTPEmailData {
  email: string;
  fullName: string;
  otp: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  otp?: string;
  emailSent?: boolean;
  provider?: string;
}

export const sendOTPEmail = async ({ email, fullName, otp }: SendOTPEmailData): Promise<EmailResponse> => {
  try {
    console.log('📧 Attempting to send OTP email via Gmail SMTP backend to:', email);
    console.log('🔗 Backend URL:', `${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.sendEmail}`);
    console.log('📝 Request data:', { email, fullName, otp: otp.substring(0, 2) + '****' });
    
    const response = await fetch(`${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.sendEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        fullName,
        otp
      }),
    });

    console.log('📡 Backend response status:', response.status);
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      
      if (response.status === 500) {
        throw new Error(`Gmail SMTP Error: ${errorText}`);
      } else {
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
    }

    const result = await response.json();
    console.log('✅ Success! Backend response data:', result);
    
    if (result.success && result.emailSent) {
      console.log('🎉 Email berhasil dikirim via Gmail SMTP!');
      console.log('📬 Message ID:', result.messageId);
      console.log('🚀 Provider:', result.provider);
      
      return {
        success: true,
        message: 'Email berhasil dikirim ke Gmail Anda! Periksa inbox atau folder spam.',
        messageId: result.messageId,
        otp: result.otp,
        emailSent: true,
        provider: result.provider || 'Gmail SMTP'
      };
    } else {
      throw new Error(result.message || 'Email gagal dikirim oleh backend');
    }
    
  } catch (error) {
    console.error('❌ Critical error in email service:', error);
    
    // Provide detailed error message based on error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Backend server tidak dapat dijangkau. Pastikan server berjalan di http://localhost:3001');
    } else if (error.message.includes('Gmail SMTP')) {
      throw new Error('Konfigurasi Gmail SMTP bermasalah. Periksa username dan app password.');
    } else {
      throw new Error(error.message || 'Gagal mengirim email verifikasi');
    }
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateOTP = (inputOTP: string, actualOTP: string): boolean => {
  return inputOTP === actualOTP;
};
