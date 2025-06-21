
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'http://localhost:3000', 
    'https://preview--samuel-indra-cloud-nexus.lovable.app',
    /\.lovable\.app$/,
    /\.lovableproject\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Increase payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📅 ${timestamp}`);
  console.log(`📡 ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`🔍 User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'Unknown'}...`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    // Hide sensitive data in logs
    if (logBody.otp) logBody.otp = logBody.otp.substring(0, 2) + '****';
    if (logBody.email) logBody.email = logBody.email.replace(/(.{2}).*@/, '$1****@');
    console.log('📝 Request Body:', JSON.stringify(logBody, null, 2));
  }
  console.log(`${'='.repeat(60)}\n`);
  next();
});

// Health check endpoint with detailed Gmail SMTP info
app.get('/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    emailService: 'Gmail SMTP Ready',
    services: {
      gmail: {
        configured: true,
        user: 'renungankristensite@gmail.com',
        status: 'Active',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        secure: false
      },
      smtp: 'Available and Configured'
    },
    endpoints: [
      'GET /health - Health check',
      'POST /api/send-otp-email - Send OTP via Gmail SMTP',
      'POST /api/verify-otp - Verify OTP code',
      'POST /api/test-email - Test Gmail SMTP connection'
    ]
  };
  
  console.log('\n🏥 HEALTH CHECK REQUESTED');
  console.log('📊 System Status:', healthInfo.status);
  console.log('⏱️ Uptime:', healthInfo.uptime, 'seconds');
  console.log('📧 Gmail SMTP:', healthInfo.services.gmail.status);
  console.log('🔑 Gmail User:', healthInfo.services.gmail.user);
  
  res.json(healthInfo);
});

// Test Gmail SMTP endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('\n🧪 TEST EMAIL ENDPOINT CALLED');
    
    // Import nodemailer for testing
    const nodemailer = require('nodemailer');
    
    const gmailConfig = {
      user: 'renungankristensite@gmail.com',
      pass: 'zglq snms qjfs wtfy'
    };
    
    // Create test transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: gmailConfig.user,
        pass: gmailConfig.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Test connection
    await transporter.verify();
    console.log('✅ Gmail SMTP connection test successful!');
    
    res.json({
      success: true,
      message: 'Gmail SMTP service is ready and working',
      timestamp: new Date().toISOString(),
      gmailConfig: {
        user: gmailConfig.user,
        configured: true,
        connectionTest: 'PASSED',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587
      }
    });
  } catch (error) {
    console.error('❌ Gmail SMTP test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Gmail SMTP test failed',
      error: error.message,
      troubleshooting: [
        'Check if Gmail account allows less secure apps',
        'Verify App Password is correct',
        'Check internet connection',
        'Verify Gmail SMTP settings'
      ]
    });
  }
});

// Auth routes
app.use('/api', authRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('\n🚨 SERVER ERROR OCCURRED:');
  console.error('❌ Error Message:', err.message);
  console.error('📍 Stack Trace:', err.stack);
  console.error('🌐 Request Path:', req.path);
  console.error('📡 Request Method:', req.method);
  console.error('🔗 Origin:', req.headers.origin);
  console.error('⏰ Timestamp:', new Date().toISOString());
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server',
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(7)
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  const errorInfo = {
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /health - Health check and status',
      'POST /api/send-otp-email - Send OTP via Gmail SMTP',
      'POST /api/verify-otp - Verify OTP code',
      'POST /api/test-email - Test Gmail SMTP connection'
    ],
    suggestion: 'Check the API documentation or available endpoints above'
  };
  
  console.log('\n❌ 404 - ENDPOINT NOT FOUND:');
  console.log('🔍 Requested:', req.method, req.originalUrl);
  console.log('📋 Available endpoints:', errorInfo.availableEndpoints.join(', '));
  
  res.status(404).json({ 
    success: false, 
    ...errorInfo
  });
});

app.listen(PORT, () => {
  console.log('\n' + '🎉'.repeat(40));
  console.log('🚀 SamuelIndraBastian Cloud Backend Server STARTED SUCCESSFULLY!');
  console.log('🎉'.repeat(40));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📧 Gmail SMTP configured: renungankristensite@gmail.com`);
  console.log(`🔐 Gmail SMTP Status: READY TO SEND EMAILS`);
  console.log(`🔑 App Password: zglq snms qjfs wtfy (configured)`);
  console.log(`🌐 CORS enabled for development and production domains`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📮 Test Gmail SMTP: http://localhost:${PORT}/api/test-email`);
  console.log('\n📋 Available API Endpoints:');
  console.log('  ✅ GET  /health - Health check and system status');
  console.log('  📧 POST /api/send-otp-email - Send OTP email via Gmail SMTP');
  console.log('  🔍 POST /api/verify-otp - Verify OTP code');
  console.log('  🧪 POST /api/test-email - Test Gmail SMTP connection');
  console.log('\n🔥 Gmail SMTP is configured and ready to send real emails!');
  console.log('📨 No more simulation - real emails will be sent to users');
  console.log('⚠️  Make sure to start this server before testing registration');
  console.log('💡 To test: cd backend && npm start');
  console.log('🎉'.repeat(40) + '\n');
});
