import React, { useState } from 'react';
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
  Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';

const Converter = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleYouTubeDownload = (format: 'mp3' | 'mp4') => {
    if (!youtubeUrl.trim()) return;
    
    setIsProcessing(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const conversionTools = [
    {
      category: "Document",
      tools: [
        { from: "PDF", to: "TXT", icon: <FileType className="w-5 h-5" /> },
        { from: "DOC", to: "PDF", icon: <FileType className="w-5 h-5" /> },
        { from: "TXT", to: "PDF", icon: <FileType className="w-5 h-5" /> }
      ]
    },
    {
      category: "Image",
      tools: [
        { from: "JPG", to: "WebP", icon: <ImageIcon className="w-5 h-5" /> },
        { from: "PNG", to: "JPG", icon: <ImageIcon className="w-5 h-5" /> },
        { from: "GIF", to: "MP4", icon: <ImageIcon className="w-5 h-5" /> }
      ]
    },
    {
      category: "Video",
      tools: [
        { from: "MP4", to: "WebM", icon: <Video className="w-5 h-5" /> },
        { from: "AVI", to: "MP4", icon: <Video className="w-5 h-5" /> },
        { from: "MOV", to: "MP4", icon: <Video className="w-5 h-5" /> }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Converter & Downloader</h1>
          <p className="text-gray-600">Convert file dan download konten dari internet</p>
        </div>

        <Tabs defaultValue="youtube" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-3 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="youtube">YouTube Downloader</TabsTrigger>
            <TabsTrigger value="converter">File Converter</TabsTrigger>
            <TabsTrigger value="tools">Tools Lainnya</TabsTrigger>
          </TabsList>

          {/* YouTube Downloader */}
          <TabsContent value="youtube">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Youtube className="w-6 h-6 text-red-600" />
                  <span>YouTube Downloader</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL YouTube
                    </label>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="bg-white/50 border-white/20"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => handleYouTubeDownload('mp3')}
                      disabled={!youtubeUrl.trim() || isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Download MP3
                    </Button>
                    <Button
                      onClick={() => handleYouTubeDownload('mp4')}
                      disabled={!youtubeUrl.trim() || isProcessing}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Download MP4
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Downloading...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <Progress value={downloadProgress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Fitur:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Download video dalam kualitas HD</li>
                    <li>• Extract audio ke format MP3</li>
                    <li>• Mendukung berbagai resolusi</li>
                    <li>• Download playlist (segera hadir)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Converter */}
          <TabsContent value="converter">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                    <span>File Converter</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop file atau klik untuk upload</p>
                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                      Pilih File
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format Asal
                      </label>
                      <Select>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Auto-detect" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="mp4">MP4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Convert ke
                      </label>
                      <Select>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Pilih format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="txt">TXT</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="webm">WebM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Convert File
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Conversion Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {conversionTools.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-800 mb-3">{category.category}</h3>
                        <div className="space-y-2">
                          {category.tools.map((tool, toolIndex) => (
                            <div key={toolIndex} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30 hover:bg-white/80 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="text-blue-600">{tool.icon}</div>
                                <span className="text-sm font-medium">
                                  {tool.from} → {tool.to}
                                </span>
                              </div>
                              <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                                Use
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tools */}
          <TabsContent value="tools">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    <span>Image Optimizer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Kompres dan optimasi gambar untuk web
                  </p>
                  <Button className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-red-600" />
                    <span>Video Compressor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Kompres video untuk menghemat ruang
                  </p>
                  <Button className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileType className="w-5 h-5 text-blue-600" />
                    <span>Batch Converter</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Convert multiple files sekaligus
                  </p>
                  <Button className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Converter;
