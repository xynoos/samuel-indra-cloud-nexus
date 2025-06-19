
import { API_CONFIG } from '@/lib/config';

interface SendOTPEmailData {
  email: string;
  fullName: string;
  otp: string;
}

export const sendOTPEmail = async ({ email, fullName, otp }: SendOTPEmailData) => {
  try {
    console.log('Attempting to send OTP email to:', email);
    console.log('Backend URL:', API_CONFIG.backend.url);
    
    const response = await fetch(`${API_CONFIG.backend.url}/api/send-otp-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        fullName,
        otp,
        smtpConfig: {
          user: API_CONFIG.gmail.user,
          pass: API_CONFIG.gmail.pass
        }
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email service HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      // Try to parse as JSON, fallback to text
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Pastikan backend server berjalan di port 3001.');
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Terjadi kesalahan yang tidak diketahui saat mengirim email');
    }
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateOTP = (inputOTP: string, actualOTP: string): boolean => {
  return inputOTP === actualOTP;
};
