
const express = require('express');
const router = express.Router();

// ImageKit authentication endpoint
router.get('/auth', (req, res) => {
  try {
    const crypto = require('crypto');
    
    // Load environment variables
    require('dotenv').config();
    
    // ImageKit credentials from environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const token = req.query.token || crypto.randomBytes(16).toString('hex');
    const expire = parseInt(Date.now() / 1000) + 2400; // 40 minutes from now
    
    // Create signature
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');
    
    console.log('🔐 ImageKit Auth Request:', {
      token: token.substring(0, 8) + '...',
      expire,
      signature: signature.substring(0, 8) + '...'
    });
    
    res.setHeader('Content-Type', 'application/json');
    res.json({
      token,
      expire,
      signature
    });
  } catch (error) {
    console.error('❌ ImageKit auth error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
});

module.exports = router;
