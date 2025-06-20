
import React, { createContext, useContext, ReactNode } from 'react';
import { IKContext } from 'imagekitio-react';
import { IMAGEKIT_CONFIG } from '@/lib/config';

interface ImageKitContextType {
  uploadFile: (file: File, fileName: string) => Promise<any>;
  getImageUrl: (path: string, transformations?: any[]) => string;
}

const ImageKitCustomContext = createContext<ImageKitContextType | null>(null);

interface ImageKitProviderProps {
  children: ReactNode;
}

export const ImageKitProvider: React.FC<ImageKitProviderProps> = ({ children }) => {
  const authenticator = async () => {
    try {
      // For production, this should call your backend authentication endpoint
      // For now, we'll create a mock authentication response
      const authData = {
        signature: 'mock_signature',
        expire: Math.floor(Date.now() / 1000) + 2400, // 40 minutes from now
        token: 'mock_token'
      };
      
      console.log('ImageKit authentication:', authData);
      return authData;
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const uploadFile = async (file: File, fileName: string) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);
      
      fetch(`${IMAGEKIT_CONFIG.urlEndpoint}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(IMAGEKIT_CONFIG.privateKey + ':')}`
        },
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then(resolve)
      .catch(reject);
    });
  };

  const getImageUrl = (path: string, transformations?: any[]) => {
    let url = `${IMAGEKIT_CONFIG.urlEndpoint}/${path}`;
    if (transformations?.length) {
      const transformString = transformations.map(t => `${t.type}-${t.value}`).join(',');
      url += `?tr=${transformString}`;
    }
    return url;
  };

  return (
    <IKContext
      publicKey={IMAGEKIT_CONFIG.publicKey}
      urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
      authenticator={authenticator}
    >
      <ImageKitCustomContext.Provider value={{ uploadFile, getImageUrl }}>
        {children}
      </ImageKitCustomContext.Provider>
    </IKContext>
  );
};

export const useImageKit = () => {
  const context = useContext(ImageKitCustomContext);
  if (!context) {
    throw new Error('useImageKit must be used within ImageKitProvider');
  }
  return context;
};
