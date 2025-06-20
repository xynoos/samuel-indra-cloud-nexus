
import React, { useState } from 'react';
import { Compress, Upload, Download, Image as ImageIcon, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/apiServices';

interface CompressionJob {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  quality: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  preview?: string;
  compressedUrl?: string;
}

export const ImageCompressor: React.FC = () => {
  const [jobs, setJobs] = useState<CompressionJob[]>([]);
  const [defaultQuality, setDefaultQuality] = useState([80]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "File bukan gambar",
          description: `${file.name} bukan file gambar`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const job: CompressionJob = {
          id: Date.now().toString() + Math.random(),
          file,
          originalSize: file.size,
          quality: defaultQuality[0],
          status: 'pending',
          preview: e.target?.result as string
        };

        setJobs(prev => [...prev, job]);
        startCompression(job);
      };
      reader.readAsDataURL(file);
    });
  };

  const startCompression = async (job: CompressionJob) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'compressing' } : j));

    try {
      // Simulate compression process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate compression result
      const compressionRatio = job.quality / 100;
      const compressedSize = Math.floor(job.originalSize * compressionRatio);
      
      const result = {
        success: true,
        compressedUrl: job.preview, // In real app, this would be the compressed image URL
        originalSize: job.originalSize,
        compressedSize: compressedSize
      };

      if (result.success) {
        setJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { 
                ...j, 
                status: 'completed',
                compressedSize: result.compressedSize,
                compressedUrl: result.compressedUrl
              } 
            : j
        ));

        const savings = ((job.originalSize - result.compressedSize) / job.originalSize * 100).toFixed(1);
        
        toast({
          title: "Kompresi berhasil!",
          description: `Ukuran file berkurang ${savings}%`,
        });
      }
    } catch (error) {
      setJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, status: 'error' } 
          : j
      ));

      toast({
        title: "Kompresi gagal",
        description: `Gagal mengompres ${job.file.name}`,
        variant: "destructive",
      });
    }
  };

  const updateQuality = (jobId: string, quality: number) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, quality } : j
    ));
  };

  const recompress = (job: CompressionJob) => {
    startCompression(job);
  };

  const removeJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Compress className="w-5 h-5 text-green-600" />
          <span>Image Compressor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Kualitas Default: {defaultQuality[0]}%</label>
          <Slider
            value={defaultQuality}
            onValueChange={setDefaultQuality}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Ukuran kecil</span>
            <span>Kualitas tinggi</span>
          </div>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              accept="image/png,image/jpeg,image/jpg"
            />
            <label htmlFor="image-upload">
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700"
                asChild
              >
                <span>Pilih Gambar untuk Dikompres</span>
              </Button>
            </label>
            <p className="text-sm text-gray-500">
              Mendukung: PNG, JPG, JPEG • Maksimal 10MB per file
            </p>
          </div>
        </div>

        {/* Compression Jobs */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Gambar dalam Proses:</h3>
            {jobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    {/* Preview */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {job.preview && (
                        <img 
                          src={job.preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{job.file.name}</h4>
                          <p className="text-xs text-gray-500">
                            Original: {formatFileSize(job.originalSize)}
                            {job.compressedSize && (
                              <> → Compressed: {formatFileSize(job.compressedSize)}</>
                            )}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeJob(job.id)}
                        >
                          ×
                        </Button>
                      </div>

                      {/* Quality Control */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Kualitas: {job.quality}%</label>
                        <Slider
                          value={[job.quality]}
                          onValueChange={(value) => updateQuality(job.id, value[0])}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                          disabled={job.status === 'compressing'}
                        />
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center space-x-2">
                        {job.status === 'compressing' && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-xs">Mengompres...</span>
                          </div>
                        )}
                        
                        {job.status === 'completed' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => job.compressedUrl && window.open(job.compressedUrl)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => recompress(job)}
                            >
                              Kompres Ulang
                            </Button>
                          </>
                        )}
                        
                        {job.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startCompression(job)}
                          >
                            Mulai Kompres
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compression Stats */}
                  {job.status === 'completed' && job.compressedSize && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Penghematan:</span>
                        <span className="font-medium text-green-600">
                          {((job.originalSize - job.compressedSize) / job.originalSize * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(job.compressedSize / job.originalSize) * 100} 
                        className="h-2 mt-2"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Tips kompresi gambar:</strong></p>
          <p>• Kualitas 80-90%: Cocok untuk web dan media sosial</p>
          <p>• Kualitas 60-70%: Untuk menghemat bandwidth</p>
          <p>• Kualitas 90-100%: Untuk keperluan print</p>
        </div>
      </CardContent>
    </Card>
  );
};
