
// API configuration and helper functions
export const API_CONFIG = {
  cloudConvert: {
    baseUrl: 'https://api.cloudconvert.com/v2',
    // Note: Users should add their API key in environment variables
  },
  tinyPNG: {
    baseUrl: 'https://api.tinify.com',
    // Note: Users should add their API key in environment variables
  },
  imageKit: {
    publicKey: 'public_US5VRdFnHVT1xVrE3bHloagUYYo=',
    urlEndpoint: 'https://ik.imagekit.io/storageweb',
    authenticationEndpoint: 'http://www.yourserver.com/auth'
  },
  youtube: {
    backendUrl: 'http://localhost:3001' // Local Node.js backend
  }
};

export const uploadToImageKit = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    
    const response = await fetch(`${API_CONFIG.imageKit.urlEndpoint}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(API_CONFIG.imageKit.publicKey + ':')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

export const convertFile = async (file: File, fromFormat: string, toFormat: string) => {
  try {
    // First upload to ImageKit
    const uploadResult = await uploadToImageKit(file);
    
    // Simulate conversion process (replace with actual CloudConvert API call)
    const mockConvertedFile = new File(
      [file], 
      `converted_${file.name}.${toFormat}`, 
      { type: `application/${toFormat}` }
    );
    
    const convertedUpload = await uploadToImageKit(mockConvertedFile);
    
    return {
      originalFile: uploadResult,
      convertedFile: convertedUpload,
      conversionType: `${fromFormat} to ${toFormat}`
    };
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

export const compressImage = async (file: File) => {
  try {
    // Upload original to ImageKit first
    const originalUpload = await uploadToImageKit(file);
    
    // Simulate compression (replace with actual TinyPNG API call)
    const compressedSize = Math.floor(file.size * 0.6); // 40% compression
    const compressedFile = new File(
      [file.slice(0, compressedSize)], 
      `compressed_${file.name}`, 
      { type: file.type }
    );
    
    const compressedUpload = await uploadToImageKit(compressedFile);
    
    return {
      originalFile: originalUpload,
      compressedFile: compressedUpload,
      compressionRatio: Math.round(((file.size - compressedSize) / file.size) * 100)
    };
  } catch (error) {
    console.error('Compression error:', error);
    throw error;
  }
};

export const downloadYouTubeVideo = async (url: string, format: 'mp3' | 'mp4') => {
  try {
    const response = await fetch(`${API_CONFIG.youtube.backendUrl}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, format }),
    });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    const blob = await response.blob();
    const file = new File([blob], `youtube_video.${format}`, { type: `${format === 'mp3' ? 'audio' : 'video'}/${format}` });
    
    const uploadResult = await uploadToImageKit(file);
    
    return {
      file: uploadResult,
      originalUrl: url,
      format
    };
  } catch (error) {
    console.error('YouTube download error:', error);
    throw error;
  }
};
