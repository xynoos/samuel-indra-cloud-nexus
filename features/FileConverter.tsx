
import React, { useState } from 'react';
import { FileText, Image, Download, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { FileUpload } from '@/components/ui/file-upload';

const conversionOptions = [
  { from: 'pdf', to: 'txt', label: 'PDF to TXT' },
  { from: 'docx', to: 'pdf', label: 'DOCX to PDF' },
  { from: 'png', to: 'webp', label: 'PNG to WebP' },
  { from: 'jpg', to: 'webp', label: 'JPG to WebP' },
  { from: 'html', to: 'pdf', label: 'HTML to PDF' }
];

export const FileConverter: React.FC = () => {
  const [selectedConversion, setSelectedConversion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    setUploading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploading(false);
  };

  const handleConvert = async () => {
    if (!selectedConversion) return;
    
    setConverting(true);
    setProgress(0);
    
    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConverting(false);
          setConvertedFile('converted-file.pdf');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-orange-600" />
            <span>File Converter</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Jenis Konversi
            </label>
            <Select value={selectedConversion} onValueChange={setSelectedConversion}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih format konversi" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions.map((option) => (
                  <SelectItem key={`${option.from}-${option.to}`} value={`${option.from}-${option.to}`}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FileUpload
            onUpload={handleFileUpload}
            multiple={false}
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'image/*': ['.png', '.jpg', '.jpeg'],
              'text/html': ['.html']
            }}
          />

          {converting && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Converting file...</p>
              <Progress value={progress} />
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>
          )}

          {convertedFile && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Conversion Complete!</p>
                      <p className="text-sm text-green-600">{convertedFile}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleConvert}
            disabled={!selectedConversion || converting}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {converting ? 'Converting...' : 'Convert File'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
