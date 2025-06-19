
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
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
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
    version: '1.0.0'
  };
  console.log('Health check requested:', healthInfo);
  res.json(healthInfo);
});

// Auth routes
app.use('/api', authRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error details:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
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
    timestamp: new Date().toISOString()
  };
  console.log('404 - Route not found:', errorInfo);
  res.status(404).json({ 
    success: false, 
    ...errorInfo
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service ready with Gmail SMTP`);
  console.log(`🔐 Auth endpoints available at /api`);
  console.log(`📝 Gmail user: ${process.env.GMAIL_USER || 'renungankristensite@gmail.com'}`);
  console.log(`🌐 CORS enabled for development and production domains`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});
