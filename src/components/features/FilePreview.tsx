
import React from 'react';
import { FileText, Image, Video, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    thumbnail?: string;
  };
  onDownload?: () => void;
  onPreview?: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  onDownload, 
  onPreview 
}) => {
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-green-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-8 h-8 text-red-500" />;
    } else {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {file.thumbnail ? (
              <img 
                src={file.thumbnail} 
                alt={file.name}
                className="w-12 h-12 object-cover rounded-md"
              />
            ) : (
              getFileIcon()
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPreview && (
              <Button
                size="sm"
                variant="outline"
                onClick={onPreview}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onDownload && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
