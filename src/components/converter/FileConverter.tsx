
import React, { useState } from 'react';
import { RefreshCw, FileType, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileConverterProps {
  files: File[];
  onProcessComplete: (processedFile: any) => void;
}

const FileConverter: React.FC<FileConverterProps> = ({ files, onProcessComplete }) => {
  const [fromFormat, setFromFormat] = useState('');
  const [toFormat, setToFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const conversionOptions = [
    { from: 'pdf', to: 'txt', label: 'PDF to TXT' },
    { from: 'docx', to: 'pdf', label: 'DOCX to PDF' },
    { from: 'jpg', to: 'webp', label: 'JPG to WebP' },
    { from: 'png', to: 'webp', label: 'PNG to WebP' },
    { from: 'html', to: 'pdf', label: 'HTML to PDF' },
    { from: 'xlsx', to: 'pdf', label: 'Excel to PDF' },
  ];

  const handleConvert = async () => {
    if (!fromFormat || !toFormat || files.length === 0) {
      toast({
        title: "Missing requirements",
        description: "Please select files and conversion formats",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      // Simulate conversion process
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsConverting(false);
            
            // Simulate successful conversion
            const processedFile = {
              id: Date.now().toString(),
              name: `converted_${files[0].name}.${toFormat}`,
              originalSize: files[0].size,
              processedSize: files[0].size * 0.8, // Simulate compression
              url: `https://ik.imagekit.io/storageweb/converted_${files[0].name}.${toFormat}`,
              type: `application/${toFormat}`,
              status: 'completed' as const,
              progress: 100,
            };
            
            onProcessComplete(processedFile);
            
            toast({
              title: "Conversion completed!",
              description: `File converted to ${toFormat.toUpperCase()}`,
            });
            
            return 100;
          }
          return prev + 10;
        });
      }, 300);

    } catch (error) {
      setIsConverting(false);
      toast({
        title: "Conversion failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 text-blue-600" />
          <span>File Converter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Format
            </label>
            <Select value={fromFormat} onValueChange={setFromFormat}>
              <SelectTrigger className="bg-white/50 border-white/20">
                <SelectValue placeholder="Select source format" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions.map((option) => (
                  <SelectItem key={option.from} value={option.from}>
                    {option.from.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Format
            </label>
            <Select value={toFormat} onValueChange={setToFormat}>
              <SelectTrigger className="bg-white/50 border-white/20">
                <SelectValue placeholder="Select target format" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions
                  .filter(option => option.from === fromFormat)
                  .map((option) => (
                    <SelectItem key={option.to} value={option.to}>
                      {option.to.toUpperCase()}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isConverting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Converting...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="space-y-4">
          <Button 
            onClick={handleConvert}
            disabled={!fromFormat || !toFormat || files.length === 0 || isConverting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isConverting ? 'animate-spin' : ''}`} />
            {isConverting ? 'Converting...' : 'Start Conversion'}
          </Button>
        </div>

        <div className="bg-blue-50/50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Supported Conversions:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            {conversionOptions.map((option) => (
              <div key={`${option.from}-${option.to}`}>
                • {option.label}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileConverter;
