
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
}

export const sendOTPEmail = async ({ email, fullName, otp }: SendOTPEmailData): Promise<EmailResponse> => {
  try {
    console.log('Attempting to send OTP email via backend API to:', email);
    console.log('Backend URL:', `${API_CONFIG.backend.url}${API_CONFIG.backend.endpoints.sendEmail}`);
    
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

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Backend response data:', result);
    
    if (result.success) {
      console.log('✅ Email sent successfully via Gmail SMTP');
      return {
        success: true,
        message: 'Email berhasil dikirim ke Gmail Anda',
        messageId: result.messageId,
        otp: result.otp
      };
    } else {
      throw new Error(result.message || 'Failed to send email via backend');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to backend email service:', error);
    
    // Only use fallback in development and show clear warning
    if (process.env.NODE_ENV === 'development') {
      console.warn('🚨 DEVELOPMENT MODE: Using email simulation because backend is not available');
      console.log('📧 To receive real emails, please start the backend server:');
      console.log('   cd backend && npm install && npm start');
      console.log('=== EMAIL SIMULATION (DEVELOPMENT ONLY) ===');
      console.log('To:', email);
      console.log('Full Name:', fullName);
      console.log('OTP Code:', otp);
      console.log('===========================================');
      
      return {
        success: true,
        message: '⚠️ Email simulasi (Backend tidak aktif) - Kode OTP: ' + otp,
        messageId: `dev_sim_${Date.now()}`,
        otp
      };
    } else {
      // In production, don't use fallback
      throw new Error('Email service tidak tersedia. Silakan coba lagi nanti.');
    }
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateOTP = (inputOTP: string, actualOTP: string): boolean => {
  return inputOTP === actualOTP;
};
