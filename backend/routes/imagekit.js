
const express = require('express');
const router = express.Router();

// ImageKit authentication endpoint
router.get('/auth', (req, res) => {
  try {
    const crypto = require('crypto');
    
    // ImageKit credentials (you should move these to environment variables in production)
    const privateKey = 'private_Mp8yk5fUx2oguuzkcxk1Q1A6OyE=';
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
