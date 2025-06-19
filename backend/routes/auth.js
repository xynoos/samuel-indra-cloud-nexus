
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure Gmail SMTP transporter with better error handling
const createTransporter = (smtpConfig) => {
  console.log('Creating transporter with config:', { user: smtpConfig.user, pass: '***' });
  
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send OTP Email endpoint
router.post('/send-otp-email', async (req, res) => {
  try {
    const { email, fullName, otp, smtpConfig } = req.body;
    
    console.log('Received email request:', { email, fullName, otp: '***', smtpConfig: { user: smtpConfig?.user, pass: '***' } });

    if (!email || !fullName || !otp || !smtpConfig) {
      console.error('Missing required fields:', { email: !!email, fullName: !!fullName, otp: !!otp, smtpConfig: !!smtpConfig });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    if (!smtpConfig.user || !smtpConfig.pass) {
      console.error('Missing SMTP credentials');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing SMTP credentials' 
      });
    }

    const transporter = createTransporter(smtpConfig);

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return res.status(500).json({ 
        success: false, 
        message: 'SMTP configuration error: ' + verifyError.message
      });
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kode Verifikasi - SamuelIndraBastian Cloud</title>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">☁️ SamuelIndraBastian Cloud</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Verifikasi Email Anda</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                    Terima kasih telah mendaftar di SamuelIndraBastian Cloud Storage. Untuk menyelesaikan pendaftaran Anda, silakan masukkan kode verifikasi berikut:
                </p>
                
                <!-- OTP Code -->
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
            
            <!-- Footer -->
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
    `;

    const mailOptions = {
      from: {
        name: 'SamuelIndraBastian Cloud',
        address: smtpConfig.user
      },
      to: email,
      subject: `${otp} - Kode Verifikasi SamuelIndraBastian Cloud`,
      html: htmlContent,
      text: `Halo ${fullName},\n\nKode verifikasi Anda untuk SamuelIndraBastian Cloud adalah: ${otp}\n\nKode ini berlaku selama 5 menit.\n\nJika Anda tidak mendaftar untuk layanan ini, abaikan email ini.\n\nTerima kasih,\nTim SamuelIndraBastian Cloud`
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('OTP Email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
    
    res.json({ 
      success: true, 
      message: 'OTP email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending OTP email:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    let errorMessage = 'Failed to send OTP email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check Gmail credentials and enable "Less secure app access" or use App Password.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Network error. Please check internet connection.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout. Please try again.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message,
      code: error.code
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // In a real application, you would verify the OTP against your database
    // For now, we'll just return success since the frontend handles OTP validation
    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP',
      error: error.message 
    });
  }
});

module.exports = router;
