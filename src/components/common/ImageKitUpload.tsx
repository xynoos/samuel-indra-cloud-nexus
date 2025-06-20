
import React, { useState } from 'react';
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import { Upload, X, File, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { IMAGEKIT_CONFIG } from '@/lib/config';

interface ImageKitUploadProps {
  onUploadSuccess?: (file: any) => void;
  onUploadError?: (error: any) => void;
  accept?: string;
  folder?: string;
  maxSize?: number;
}

export const ImageKitUpload: React.FC<ImageKitUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  accept = "image/*,video/*,.pdf,.doc,.docx,.txt",
  folder = "/",
  maxSize = 50 * 1024 * 1024 // 50MB default
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const { toast } = useToast();

  // Authentication function for ImageKit
  const authenticator = async () => {
    try {
      // In a real app, this should call your backend authentication endpoint
      const response = await fetch('/api/imagekit/auth');
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      return await response.json();
    } catch (error) {
      // For demo purposes, return mock auth data
      return {
        signature: 'mock_signature',
        expire: Math.floor(Date.now() / 1000) + 2400,
        token: 'mock_token'
      };
    }
  };

  const handleUploadStart = () => {
    setUploading(true);
  };

  const handleUploadSuccess = (response: any) => {
    setUploading(false);
    setUploadedFiles(prev => [...prev, response]);
    
    toast({
      title: "Upload berhasil!",
      description: `File ${response.name} berhasil diupload`,
    });

    if (onUploadSuccess) {
      onUploadSuccess(response);
    }
  };

  const handleUploadError = (error: any) => {
    setUploading(false);
    console.error('Upload error:', error);
    
    toast({
      title: "Upload gagal",
      description: error.message || "Terjadi kesalahan saat upload",
      variant: "destructive",
    });

    if (onUploadError) {
      onUploadError(error);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <IKContext 
      publicKey={IMAGEKIT_CONFIG.publicKey}
      urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
      authenticator={authenticator}
    >
      <div className="space-y-4">
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <IKUpload
                  fileName="file"
                  folder={folder}
                  onUploadStart={handleUploadStart}
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadError}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700"
                    asChild
                  >
                    <span>
                      {uploading ? 'Mengupload...' : 'Pilih File'}
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500">
                  Maksimal {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">File yang diupload:</h3>
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.fileType)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round(file.size / 1024)}KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </IKContext>
  );
};
