
import React, { useCallback, useState } from 'react';
import { Upload, FileType, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DropzoneUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const DropzoneUpload: React.FC<DropzoneUploadProps> = ({ onFilesSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDropHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onDrop(files);
    }
  }, [onDrop]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDrop(files);
    }
  };

  return (
    <Card className="mb-6 bg-white/60 backdrop-blur-sm border-white/20">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50/50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDropHandler}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-gray-500 mb-4">
            Support for images, documents, videos, and more
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="border-blue-200 hover:bg-blue-50"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <FileType className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
            />
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Maximum file size: 100MB per file
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DropzoneUpload;
