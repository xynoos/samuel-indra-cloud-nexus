
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const ytdlp = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static('downloads'));

// Gmail SMTP configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'storagepagexyn@gmail.com',
    pass: 'zglq snms qjfs wtfy' // App password
  }
});

// In-memory storage for OTPs (use Redis in production)
const otpStore = new Map();

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOTP();
    otpStore.set(email, { otp, expires: Date.now() + 600000 }); // 10 minutes

    const mailOptions = {
      from: 'storagepagexyn@gmail.com',
      to: email,
      subject: 'SamuelIndraBastian Cloud Storage - Kode Verifikasi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Kode Verifikasi Email</h2>
          <p>Halo,</p>
          <p>Terima kasih telah menggunakan SamuelIndraBastian Cloud Storage. Gunakan kode berikut untuk verifikasi email Anda:</p>
          <div style="background: #F3F4F6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #1F2937; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>Kode ini akan kedaluwarsa dalam 10 menit.</p>
          <p>Jika Anda tidak meminta verifikasi ini, abaikan email ini.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #6B7280; font-size: 14px;">
            Email ini dikirim dari SamuelIndraBastian Cloud Storage<br>
            Sistem otomatis - mohon jangan membalas email ini.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Verification email sent' });
    
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    otpStore.delete(email);
    res.json({ success: true, message: 'Email verified successfully' });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// YouTube downloader endpoint
app.post('/download', async (req, res) => {
  try {
    const { url, format } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Ensure downloads directory exists
    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const filename = `video_${Date.now()}.${format}`;
    const outputPath = path.join(downloadsDir, filename);

    const options = {
      format: format === 'mp3' ? 'bestaudio[ext=m4a]' : 'best[ext=mp4]',
      output: outputPath,
    };

    if (format === 'mp3') {
      options['extract-audio'] = true;
      options['audio-format'] = 'mp3';
    }

    await ytdlp(url, options);

    // Check if file exists
    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({ error: 'Download failed' });
    }

    const fileStats = fs.statSync(outputPath);
    
    res.json({
      success: true,
      filename,
      size: fileStats.size,
      downloadUrl: `http://localhost:${PORT}/downloads/${filename}`
    });

  } catch (error) {
    console.error('YouTube download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SamuelIndraBastian Backend Server' });
});

app.listen(PORT, () => {
  console.log(`🚀 SamuelIndraBastian Backend Server running on port ${PORT}`);
  console.log(`📧 Email service configured with Gmail SMTP`);
  console.log(`📺 YouTube downloader ready with yt-dlp`);
});
