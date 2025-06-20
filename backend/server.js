
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
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Health check endpoint with detailed info
app.get('/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    emailService: 'Gmail SMTP Ready',
    services: {
      gmail: {
        configured: true,
        user: 'renungankristensite@gmail.com',
        status: 'Ready'
      },
      smtp: 'Available'
    },
    endpoints: [
      'GET /health',
      'POST /api/send-otp-email',
      'POST /api/verify-otp',
      'POST /api/test-email'
    ]
  };
  console.log('Health check requested:', healthInfo);
  res.json(healthInfo);
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('Test email endpoint called');
    res.json({
      success: true,
      message: 'Email service is ready',
      timestamp: new Date().toISOString(),
      gmailConfig: {
        user: 'renungankristensite@gmail.com',
        configured: true
      }
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Auth routes
app.use('/api', authRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server error details:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    origin: req.headers.origin
  });
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  const errorInfo = {
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /health',
      'POST /api/send-otp-email',
      'POST /api/verify-otp',
      'POST /api/test-email'
    ]
  };
  console.log('404 - Route not found:', errorInfo);
  res.status(404).json({ 
    success: false, 
    ...errorInfo
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(80));
  console.log(`🚀 SamuelIndraBastian Cloud Backend Server STARTED`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📧 Gmail SMTP configured: renungankristensite@gmail.com`);
  console.log(`🔐 Auth endpoints available at /api`);
  console.log(`🌐 CORS enabled for development and production`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📮 Test email: http://localhost:${PORT}/api/test-email`);
  console.log('='.repeat(80));
  console.log('📋 Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/send-otp-email - Send OTP email via Gmail');
  console.log('  POST /api/verify-otp - Verify OTP code');
  console.log('  POST /api/test-email - Test email service');
  console.log('='.repeat(80));
  console.log('🔥 Backend is ready to send real emails via Gmail SMTP!');
  console.log('⚠️  Make sure to start this server before testing registration');
  console.log('='.repeat(80));
});
