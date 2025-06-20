
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
    console.log('Sending OTP email via backend API to:', email);
    
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('Email sent successfully via backend');
      return {
        success: true,
        message: 'Email berhasil dikirim',
        messageId: result.messageId,
        otp: result.otp
      };
    } else {
      throw new Error(result.message || 'Failed to send email');
    }
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    // Fallback: simulate email sending for development
    console.log('=== FALLBACK: EMAIL SIMULATION ===');
    console.log('To:', email);
    console.log('Full Name:', fullName);
    console.log('OTP Code:', otp);
    console.log('================================');
    
    return {
      success: true,
      message: 'Email berhasil dikirim (simulasi)',
      messageId: `sim_${Date.now()}`,
      otp
    };
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateOTP = (inputOTP: string, actualOTP: string): boolean => {
  return inputOTP === actualOTP;
};
