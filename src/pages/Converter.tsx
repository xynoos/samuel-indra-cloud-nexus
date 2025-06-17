
import React, { useState, useCallback } from 'react';
import { 
  Download, 
  Upload, 
  FileType, 
  Image as ImageIcon, 
  Video, 
  Music,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Youtube,
  Copy,
  Trash2,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import DropzoneUpload from '@/components/converter/DropzoneUpload';
import FileConverter from '@/components/converter/FileConverter';
import FileCompression from '@/components/converter/FileCompression';
import YouTubeDownloader from '@/components/converter/YouTubeDownloader';
import AIHelper from '@/components/converter/AIHelper';

interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  processedSize?: number;
  url: string;
  type: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
}

const Converter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
    toast({
      title: "Files uploaded",
      description: `${selectedFiles.length} file(s) ready for processing`,
    });
  }, [toast]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeProcessedFile = (id: string) => {
    setProcessedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            SamuelIndraBastian Cloud Storage
          </h1>
          <p className="text-xl text-gray-600 mb-2">File Converter & Downloader</p>
          <p className="text-gray-500">Convert, compress, and download files with ease</p>
        </div>

        {/* AI Helper */}
        <AIHelper />

        {/* Drag and Drop Upload Area */}
        <DropzoneUpload onFilesSelected={handleFilesSelected} />

        {/* Uploaded Files Preview */}
        {files.length > 0 && (
          <Card className="mb-6 bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Uploaded Files ({files.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30">
                    <div className="flex items-center space-x-3">
                      <FileType className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-blue-200">
                        {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(index)}
                        className="border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="converter" className="space-y-6">
          <TabsList className="grid w-full lg:w-[800px] mx-auto grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="converter">File Converter</TabsTrigger>
            <TabsTrigger value="compression">Compression</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Downloader</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* File Converter */}
          <TabsContent value="converter">
            <FileConverter 
              files={files} 
              onProcessComplete={(processedFile) => {
                setProcessedFiles(prev => [...prev, processedFile]);
              }}
            />
          </TabsContent>

          {/* File Compression */}
          <TabsContent value="compression">
            <FileCompression 
              files={files} 
              onProcessComplete={(processedFile) => {
                setProcessedFiles(prev => [...prev, processedFile]);
              }}
            />
          </TabsContent>

          {/* YouTube Downloader */}
          <TabsContent value="youtube">
            <YouTubeDownloader 
              onProcessComplete={(processedFile) => {
                setProcessedFiles(prev => [...prev, processedFile]);
              }}
            />
          </TabsContent>

          {/* Results */}
          <TabsContent value="results">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Processed Files ({processedFiles.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {processedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No processed files yet. Start by uploading and converting files.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {processedFiles.map((file) => (
                      <div key={file.id} className="p-4 bg-white/50 rounded-lg border border-white/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {file.type.includes('image') ? (
                              <ImageIcon className="w-6 h-6 text-green-500" />
                            ) : file.type.includes('video') ? (
                              <Video className="w-6 h-6 text-red-500" />
                            ) : file.type.includes('audio') ? (
                              <Music className="w-6 h-6 text-purple-500" />
                            ) : (
                              <FileType className="w-6 h-6 text-blue-500" />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{file.name}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Original: {formatFileSize(file.originalSize)}</span>
                                {file.processedSize && (
                                  <span>Processed: {formatFileSize(file.processedSize)}</span>
                                )}
                                {file.processedSize && file.originalSize && (
                                  <Badge variant="outline" className="border-green-200">
                                    {Math.round(((file.originalSize - file.processedSize) / file.originalSize) * 100)}% saved
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.status === 'processing' && (
                              <>
                                <Progress value={file.progress} className="w-20" />
                                <span className="text-sm text-gray-500">{file.progress}%</span>
                              </>
                            )}
                            {file.status === 'completed' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(file.url)}
                                  className="border-blue-200 hover:bg-blue-50"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                  onClick={() => window.open(file.url, '_blank')}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </>
                            )}
                            {file.status === 'error' && (
                              <Badge variant="destructive">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Error
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeProcessedFile(file.id)}
                              className="border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {file.type.includes('image') && file.status === 'completed' && (
                          <div className="mt-3">
                            <img 
                              src={file.url} 
                              alt={file.name}
                              className="max-w-full h-32 object-cover rounded-lg border border-white/30"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Converter;
