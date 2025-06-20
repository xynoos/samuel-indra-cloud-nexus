
import { API_CONFIG } from '@/lib/config';

interface SendOTPEmailData {
  email: string;
  fullName: string;
  otp: string;
}

export const sendOTPEmail = async ({ email, fullName, otp }: SendOTPEmailData) => {
  try {
    console.log('Attempting to send OTP email to:', email);
    
    // Create a direct SMTP request using a public email service
    const emailContent = {
      to: email,
      subject: `${otp} - Kode Verifikasi SamuelIndraBastian Cloud`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kode Verifikasi - SamuelIndraBastian Cloud</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">☁️ SamuelIndraBastian Cloud</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Verifikasi Email Anda</p>
                </div>
                
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
                    
                    <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                        Terima kasih telah mendaftar di SamuelIndraBastian Cloud Storage. Untuk menyelesaikan pendaftaran Anda, silakan masukkan kode verifikasi berikut:
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0; border: 2px dashed #6366f1;">
                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">KODE VERIFIKASI</div>
                        <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                        <div style="color: #6b7280; font-size: 12px; margin-top: 10px;">Kode berlaku selama 5 menit</div>
                    </div>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0; color: #b45309; font-size: 14px; font-weight: 600;">⚠️ Penting:</p>
                        <p style="margin: 5px 0 0 0; color: #b45309; font-size: 14px;">
                            Jangan bagikan kode ini kepada siapa pun. Tim kami tidak akan pernah meminta kode verifikasi Anda.
                        </p>
                    </div>
                    
                    <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                        Jika Anda tidak mendaftar untuk layanan ini, Anda dapat mengabaikan email ini dengan aman.
                    </p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                        © 2024 SamuelIndraBastian Cloud Storage. Semua hak cipta dilindungi.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px; text-align: center;">
                        Email ini dikirim secara otomatis, mohon jangan membalas email ini.
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `Halo ${fullName},\n\nKode verifikasi Anda untuk SamuelIndraBastian Cloud adalah: ${otp}\n\nKode ini berlaku selama 5 menit.\n\nJika Anda tidak mendaftar untuk layanan ini, abaikan email ini.\n\nTerima kasih,\nTim SamuelIndraBastian Cloud`
    };

    // Use EmailJS or similar service for direct email sending
    // For now, we'll simulate successful email sending and log the OTP
    console.log('=== EMAIL SIMULATION ===');
    console.log('To:', email);
    console.log('Subject:', emailContent.subject);
    console.log('OTP Code:', otp);
    console.log('Full Name:', fullName);
    console.log('========================');

    // Simulate successful email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Email berhasil dikirim (simulasi)',
      messageId: `sim_${Date.now()}`
    };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Gagal mengirim email verifikasi. Silakan coba lagi.');
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateOTP = (inputOTP: string, actualOTP: string): boolean => {
  return inputOTP === actualOTP;
};
