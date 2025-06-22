
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { Card, CardContent } from './card';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'video/*': ['.mp4', '.avi', '.mov'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.doc', '.docx']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setProgress(0);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(acceptedFiles);
      
      setProgress(100);
      setUploadedFiles(acceptedFiles.map(f => f.name));
      
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setUploadedFiles([]);
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setProgress(0);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple
  });

  return (
    <Card className={`${className} transition-all duration-300`}>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
              <div>
                <p className="text-lg font-medium text-gray-800">Uploading files...</p>
                <Progress value={progress} className="mt-2" />
                <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>
              </div>
            </div>
          ) : uploadedFiles.length > 0 ? (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="text-lg font-medium text-green-800">Upload successful!</p>
                <div className="mt-2 space-y-1">
                  {uploadedFiles.map((filename, index) => (
                    <p key={index} className="text-sm text-gray-600">{filename}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-gray-500">or click to browse</p>
                <p className="text-sm text-gray-400 mt-2">
                  Supports images, videos, PDFs, and documents up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
