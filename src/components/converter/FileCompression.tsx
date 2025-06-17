
import React, { useState } from 'react';
import { Zap, Image as ImageIcon, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FileCompressionProps {
  files: File[];
  onProcessComplete: (processedFile: any) => void;
}

const FileCompression: React.FC<FileCompressionProps> = ({ files, onProcessComplete }) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  const videoFiles = files.filter(file => file.type.startsWith('video/'));

  const handleImageCompression = async () => {
    if (imageFiles.length === 0) {
      toast({
        title: "No images found",
        description: "Please upload image files to compress",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);

    try {
      // Simulate compression process
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCompressing(false);
            
            // Simulate successful compression
            imageFiles.forEach((file, index) => {
              const processedFile = {
                id: `compressed_${Date.now()}_${index}`,
                name: `compressed_${file.name}`,
                originalSize: file.size,
                processedSize: file.size * 0.6, // Simulate 40% compression
                url: `https://ik.imagekit.io/storageweb/compressed_${file.name}`,
                type: file.type,
                status: 'completed' as const,
                progress: 100,
              };
              
              onProcessComplete(processedFile);
            });
            
            toast({
              title: "Compression completed!",
              description: `${imageFiles.length} image(s) compressed successfully`,
            });
            
            return 100;
          }
          return prev + 8;
        });
      }, 200);

    } catch (error) {
      setIsCompressing(false);
      toast({
        title: "Compression failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleVideoCompression = async () => {
    if (videoFiles.length === 0) {
      toast({
        title: "No videos found",
        description: "Please upload video files to compress",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);

    try {
      // Simulate compression process
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCompressing(false);
            
            // Simulate successful compression
            videoFiles.forEach((file, index) => {
              const processedFile = {
                id: `compressed_video_${Date.now()}_${index}`,
                name: `compressed_${file.name}`,
                originalSize: file.size,
                processedSize: file.size * 0.7, // Simulate 30% compression
                url: `https://ik.imagekit.io/storageweb/compressed_${file.name}`,
                type: file.type,
                status: 'completed' as const,
                progress: 100,
              };
              
              onProcessComplete(processedFile);
            });
            
            toast({
              title: "Video compression completed!",
              description: `${videoFiles.length} video(s) compressed successfully`,
            });
            
            return 100;
          }
          return prev + 5;
        });
      }, 400);

    } catch (error) {
      setIsCompressing(false);
      toast({
        title: "Compression failed",
        description: "Please try again later",
        variant: "destructive",
      });
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
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Image Compression */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-6 h-6 text-green-600" />
            <span>Image Compression</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imageFiles.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-3">
                Ready to compress {imageFiles.length} image(s)
              </div>
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <Badge variant="outline" className="border-green-200">
                    Image
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No image files uploaded
            </div>
          )}

          {isCompressing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button 
            onClick={handleImageCompression}
            disabled={imageFiles.length === 0 || isCompressing}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Zap className={`w-4 h-4 mr-2 ${isCompressing ? 'animate-pulse' : ''}`} />
            {isCompressing ? 'Compressing...' : 'Compress Images'}
          </Button>

          <div className="bg-green-50/50 rounded-lg p-3 text-sm">
            <p className="text-green-800 font-medium mb-1">TinyPNG API Integration</p>
            <p className="text-green-700">• Up to 80% size reduction</p>
            <p className="text-green-700">• Maintains visual quality</p>
            <p className="text-green-700">• Supports PNG, JPG, WebP</p>
          </div>
        </CardContent>
      </Card>

      {/* Video Compression */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-6 h-6 text-red-600" />
            <span>Video Compression</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {videoFiles.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-3">
                Ready to compress {videoFiles.length} video(s)
              </div>
              {videoFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <Badge variant="outline" className="border-red-200">
                    Video
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No video files uploaded
            </div>
          )}

          {isCompressing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button 
            onClick={handleVideoCompression}
            disabled={videoFiles.length === 0 || isCompressing}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            <Zap className={`w-4 h-4 mr-2 ${isCompressing ? 'animate-pulse' : ''}`} />
            {isCompressing ? 'Compressing...' : 'Compress Videos'}
          </Button>

          <div className="bg-red-50/50 rounded-lg p-3 text-sm">
            <p className="text-red-800 font-medium mb-1">FFmpeg Backend</p>
            <p className="text-red-700">• H.264/H.265 encoding</p>
            <p className="text-red-700">• Multiple quality options</p>
            <p className="text-red-700">• Batch processing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileCompression;
