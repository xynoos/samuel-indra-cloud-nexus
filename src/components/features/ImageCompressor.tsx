
import React, { useState } from 'react';
import { Minimize2, Image as ImageIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { FileUpload } from '@/components/ui/file-upload';

export const ImageCompressor: React.FC = () => {
  const [quality, setQuality] = useState([80]);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    reduction: number;
  } | null>(null);

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setCompressedImage(null);
    setCompressionStats(null);
  };

  const handleCompress = async () => {
    if (!originalImage) return;
    
    setCompressing(true);
    setProgress(0);
    
    // Simulate compression progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompressing(false);
          // Simulate compressed result
          setCompressedImage(originalImage);
          setCompressionStats({
            originalSize: 2048000, // 2MB
            compressedSize: 512000, // 512KB
            reduction: 75
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Minimize2 className="w-6 h-6 text-purple-600" />
            <span>Image Compressor</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <FileUpload
            onUpload={handleImageUpload}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
            multiple={false}
          />

          {originalImage && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality: {quality[0]}%
                </label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              {compressing && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Compressing image...</p>
                  <Progress value={progress} />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Original</h3>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
                
                {compressedImage && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Compressed</h3>
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {compressionStats && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Compression Results</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Original Size</p>
                        <p className="font-medium">{Math.round(compressionStats.originalSize / 1024)} KB</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Compressed Size</p>
                        <p className="font-medium">{Math.round(compressionStats.compressedSize / 1024)} KB</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reduction</p>
                        <p className="font-medium text-green-600">{compressionStats.reduction}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleCompress}
                  disabled={compressing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {compressing ? 'Compressing...' : 'Compress Image'}
                </Button>
                
                {compressedImage && (
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
