
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
      const response = await fetch(IMAGEKIT_CONFIG.authenticationEndpoint);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const uploadFile = async (file: File, fileName: string) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      fetch(`${IMAGEKIT_CONFIG.urlEndpoint}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(IMAGEKIT_CONFIG.privateKey + ':')}`
        },
        body: formData
      })
      .then(response => response.json())
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
