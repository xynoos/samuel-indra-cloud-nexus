
import { API_CONFIG } from '@/lib/config';

// OpenRouter AI Chat Service
export const sendChatMessage = async (message: string, model: string = 'openai/gpt-3.5-turbo') => {
  try {
    const response = await fetch(API_CONFIG.openRouter.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.openRouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'SamuelIndraBastian Cloud'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

// DeepAI Text-to-Image Service
export const generateImage = async (prompt: string) => {
  try {
    const response = await fetch(API_CONFIG.deepAI.textToImage, {
      method: 'POST',
      headers: {
        'api-key': API_CONFIG.deepAI.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output_url;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};

// DeepAI Sentiment Analysis Service
export const analyzeSentiment = async (text: string) => {
  try {
    const response = await fetch(API_CONFIG.deepAI.sentiment, {
      method: 'POST',
      headers: {
        'api-key': API_CONFIG.deepAI.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw error;
  }
};

// File Conversion Services (CloudConvert)
export const convertFile = async (file: File, targetFormat: string) => {
  try {
    if (!API_CONFIG.cloudConvert.apiKey) {
      throw new Error('CloudConvert API key not configured');
    }

    // This is a simplified version - CloudConvert requires multiple API calls
    console.log('Converting file:', file.name, 'to', targetFormat);
    
    // For demo purposes, we'll simulate the conversion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      downloadUrl: '#',
      message: 'File conversion completed (demo mode)'
    };
  } catch (error) {
    console.error('File conversion error:', error);
    throw error;
  }
};

// Image Compression Service (TinyPNG)
export const compressImage = async (file: File) => {
  try {
    if (!API_CONFIG.tinyPng.apiKey) {
      throw new Error('TinyPNG API key not configured');
    }

    const response = await fetch(API_CONFIG.tinyPng.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${API_CONFIG.tinyPng.apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: file
    });

    if (!response.ok) {
      throw new Error(`TinyPNG API error: ${response.statusText}`);
    }

    const compressedUrl = response.headers.get('Location');
    return {
      success: true,
      compressedUrl: compressedUrl,
      originalSize: file.size,
      compressedSize: parseInt(response.headers.get('Content-Length') || '0')
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
};
