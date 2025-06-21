
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Gmail SMTP configuration - sudah dikonfigurasi dengan benar
const gmailConfig = {
  user: 'renungankristensite@gmail.com', 
  pass: 'zglq snms qjfs wtfy' // App Password Gmail yang sudah diberikan
};

// Create Gmail transporter dengan konfigurasi yang tepat
const createGmailTransporter = () => {
  console.log('Creating Gmail transporter with user:', gmailConfig.user);
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: gmailConfig.user,
      pass: gmailConfig.pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email endpoint
router.post('/send-otp-email', async (req, res) => {
  try {
    console.log('📧 Send OTP email request received:', req.body);
    const { email, fullName, otp } = req.body;
    
    if (!email || !fullName) {
      console.log('❌ Missing required fields:', { email, fullName });
      return res.status(400).json({
        success: false,
        message: 'Email and fullName are required'
      });
    }

    // Use provided OTP or generate new one
    const verificationOTP = otp || generateOTP();
    console.log('🔢 Using OTP:', verificationOTP);
    
    const transporter = createGmailTransporter();
    
    // Test connection first
    try {
      await transporter.verify();
      console.log('✅ Gmail SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ Gmail SMTP verification failed:', verifyError);
      throw new Error('Gmail SMTP configuration error: ' + verifyError.message);
    }
    
    const mailOptions = {
      from: `"SamuelIndraBastian Cloud Storage" <${gmailConfig.user}>`,
      to: email,
      subject: `${verificationOTP} - Kode Verifikasi SamuelIndraBastian Cloud`,
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
                        <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verificationOTP}</div>
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
      text: `Halo ${fullName},\n\nKode verifikasi Anda untuk SamuelIndraBastian Cloud adalah: ${verificationOTP}\n\nKode ini berlaku selama 5 menit.\n\nJika Anda tidak mendaftar untuk layanan ini, abaikan email ini.\n\nTerima kasih,\nTim SamuelIndraBastian Cloud`
    };

    console.log('📤 Sending email to:', email);
    console.log('📧 Email options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📋 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);
    
    res.json({
      success: true,
      message: 'OTP email sent successfully via Gmail SMTP',
      messageId: info.messageId,
      otp: verificationOTP, // Include OTP in response for verification
      emailSent: true,
      provider: 'Gmail SMTP'
    });
    
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    console.error('❌ Full error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email via Gmail SMTP',
      error: error.message,
      errorDetails: {
        name: error.name,
        code: error.code,
        command: error.command
      }
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('🔍 OTP verification request:', req.body);
    const { otp, expectedOtp } = req.body;
    
    if (!otp || !expectedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP and expectedOtp are required'
      });
    }

    const isValid = otp === expectedOtp;
    console.log('✅ OTP validation result:', { otp, expectedOtp, isValid });
    
    res.json({
      success: isValid,
      message: isValid ? 'OTP verified successfully' : 'Invalid OTP code',
      verified: isValid
    });
    
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

module.exports = router;
