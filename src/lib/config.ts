
export const IMAGEKIT_CONFIG = {
  publicKey: 'public_US5VRdFnHVT1xVrE3bHloagUYYo=',
  privateKey: 'private_Mp8yk5fUx2oguuzkcxk1Q1A6OyE=',
  urlEndpoint: 'https://ik.imagekit.io/storageweb',
  authenticationEndpoint: '/api/imagekit/auth'
};

export const API_CONFIG = {
  backend: {
    url: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com' 
      : 'http://localhost:3001',
    endpoints: {
      verifyOTP: '/api/verify-otp',
      sendEmail: '/api/send-otp-email'
    }
  },
  openRouter: {
    apiKey: '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',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions'
  },
  deepAI: {
    apiKey: 'b0a1a71b-b482-43c0-8d33-e3ea411ac668',
    textToImage: 'https://api.deepai.org/api/text2img',
    sentiment: 'https://api.deepai.org/api/sentiment-analysis'
  },
  gmail: {
    user: 'renungankristensite@gmail.com',
    pass: 'zglq snms qjfs wtfy'
  },
  // EmailJS configuration (alternative email service)
  emailjs: {
    serviceId: 'service_gmail',
    templateId: 'template_otp',
    publicKey: 'your_emailjs_public_key'
  }
};
