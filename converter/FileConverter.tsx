
import React, { useState } from 'react';
import { Upload, Download, FileType, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { convertFile } from '@/utils/apiServices';

interface ConversionJob {
  id: string;
  file: File;
  fromFormat: string;
  toFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export const FileConverter: React.FC = () => {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const { toast } = useToast();

  const supportedConversions = [
    { from: 'pdf', to: 'txt', label: 'PDF → TXT' },
    { from: 'docx', to: 'pdf', label: 'DOCX → PDF' },
    { from: 'png', to: 'webp', label: 'PNG → WebP' },
    { from: 'jpg', to: 'webp', label: 'JPG → WebP' },
    { from: 'html', to: 'pdf', label: 'HTML → PDF' },
    { from: 'txt', to: 'pdf', label: 'TXT → PDF' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedFormat) return;

    Array.from(files).forEach(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const conversion = supportedConversions.find(c => c.from === fileExtension);
      
      if (!conversion) {
        toast({
          title: "Format tidak didukung",
          description: `File ${file.name} tidak dapat dikonversi`,
          variant: "destructive",
        });
        return;
      }

      const job: ConversionJob = {
        id: Date.now().toString() + Math.random(),
        file,
        fromFormat: conversion.from,
        toFormat: conversion.to,
        status: 'pending',
        progress: 0
      };

      setJobs(prev => [...prev, job]);
      startConversion(job);
    });
  };

  const startConversion = async (job: ConversionJob) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'converting', progress: 10 } : j));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setJobs(prev => prev.map(j => {
          if (j.id === job.id && j.progress < 90) {
            return { ...j, progress: j.progress + 10 };
          }
          return j;
        }));
      }, 500);

      const result = await convertFile(job.file, job.toFormat);
      
      clearInterval(progressInterval);

      if (result.success) {
        setJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { 
                ...j, 
                status: 'completed', 
                progress: 100,
                downloadUrl: result.downloadUrl 
              } 
            : j
        ));

        toast({
          title: "Konversi berhasil!",
          description: `${job.file.name} berhasil dikonversi`,
        });
      } else {
        throw new Error('Conversion failed');
      }
    } catch (error) {
      setJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { 
              ...j, 
              status: 'error', 
              progress: 0,
              error: error instanceof Error ? error.message : 'Unknown error'
            } 
          : j
      ));

      toast({
        title: "Konversi gagal",
        description: `Gagal mengkonversi ${job.file.name}`,
        variant: "destructive",
      });
    }
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
          <FileType className="w-5 h-5 text-blue-600" />
          <span>File Converter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Jenis Konversi:</label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih format konversi" />
            </SelectTrigger>
            <SelectContent>
              {supportedConversions.map((conversion) => (
                <SelectItem key={conversion.label} value={conversion.label}>
                  {conversion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={!selectedFormat}
              className="hidden"
              id="file-upload"
              accept=".pdf,.docx,.png,.jpg,.jpeg,.html,.txt"
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                disabled={!selectedFormat}
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <span>Pilih File untuk Dikonversi</span>
              </Button>
            </label>
            <p className="text-sm text-gray-500">
              {selectedFormat ? `Mendukung: ${selectedFormat}` : 'Pilih format konversi terlebih dahulu'}
            </p>
          </div>
        </div>

        {/* Conversion Jobs */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">File dalam Proses:</h3>
            {jobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{job.file.name}</h4>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(job.file.size)} • {job.fromFormat.toUpperCase()} → {job.toFormat.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {job.status === 'converting' && (
                        <Loader className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                      {job.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {job.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeJob(job.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>

                  {job.status === 'converting' && (
                    <div className="space-y-1">
                      <Progress value={job.progress} className="h-2" />
                      <p className="text-xs text-gray-500">Mengkonversi... {job.progress}%</p>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => job.downloadUrl && window.open(job.downloadUrl)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Hasil
                    </Button>
                  )}

                  {job.status === 'error' && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      Error: {job.error}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Supported Formats Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Format yang didukung:</strong></p>
          <p>• PDF ↔ TXT • DOCX → PDF • PNG/JPG → WebP • HTML → PDF</p>
          <p>• Maksimal ukuran file: 50MB per file</p>
        </div>
      </CardContent>
    </Card>
  );
};
