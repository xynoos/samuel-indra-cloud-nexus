
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
  const uploadFile = async (file: File, fileName: string) => {
    // This will be handled by IKUpload component
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
      authenticationEndpoint={IMAGEKIT_CONFIG.authenticationEndpoint}
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
