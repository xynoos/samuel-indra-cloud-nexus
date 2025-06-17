
// ImageKit.io Configuration
export const IMAGEKIT_CONFIG = {
  publicKey: "public_US5VRdFnHVT1xVrE3bHloagUYYo=",
  privateKey: "private_Mp8yk5fUx2oguuzkcxk1Q1A6OyE=",
  urlEndpoint: "https://ik.imagekit.io/storageweb",
  authenticationEndpoint: "/api/imagekit-auth"
};

// API Keys and Endpoints
export const API_CONFIG = {
  // OpenRouter API
  openRouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: "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"
  },
  
  // DeepAI
  deepAI: {
    textToImage: "https://api.deepai.org/api/text2img",
    sentiment: "https://api.deepai.org/api/sentiment-analysis",
    key: "b0a1a71b-b482-43c0-8d33-e3ea411ac668"
  },
  
  // CloudConvert
  cloudConvert: {
    url: "https://api.cloudconvert.com/v2/convert",
    key: "" // Will be requested from user
  },
  
  // TinyPNG
  tinyPNG: {
    url: "https://api.tinify.com/shrink",
    key: "" // Will be requested from user
  },
  
  // Backend endpoints
  backend: {
    url: "http://localhost:3001",
    endpoints: {
      sendEmail: "/api/send-verification",
      verifyOTP: "/api/verify-otp",
      downloadYoutube: "/download"
    }
  }
};

// Gmail SMTP Configuration (decoded)
export const GMAIL_CONFIG = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "storagepagexyn@gmail.com",
    pass: "zglq snms qjfs wtfy"
  }
};
