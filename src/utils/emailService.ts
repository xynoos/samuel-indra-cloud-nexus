
import { API_CONFIG } from '@/lib/config';

interface SendOTPEmailData {
  email: string;
  fullName: string;
  otp: string;
}

export const sendOTPEmail = async ({ email, fullName, otp }: SendOTPEmailData) => {
  try {
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

    if (!response.ok) {
      throw new Error('Failed to send OTP email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateOTP = (inputOTP: string, actualOTP: string): boolean => {
  return inputOTP === actualOTP;
};
