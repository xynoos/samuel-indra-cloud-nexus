
import React, { useState } from 'react';
import { FileType, Minimize2, Youtube, Zap, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileConverter } from '@/components/converter/FileConverter';
import { ImageCompressor } from '@/components/converter/ImageCompressor';
import { YouTubeDownloader } from '@/components/converter/YouTubeDownloader';

const Converter = () => {
  const [activeTab, setActiveTab] = useState('file-converter');

  const tools = [
    {
      id: 'file-converter',
      title: 'File Converter',
      description: 'Konversi berbagai format file',
      icon: FileType,
      color: 'bg-blue-500',
      features: ['PDF ↔ TXT', 'DOCX → PDF', 'PNG/JPG → WebP', 'HTML → PDF']
    },
    {
      id: 'image-compressor',
      title: 'Image Compressor',
      description: 'Kompres gambar tanpa mengurangi kualitas',
      icon: Minimize2,
      color: 'bg-green-500',
      features: ['PNG & JPG', 'Kontrol kualitas', 'Preview hasil', 'Batch processing']
    },
    {
      id: 'youtube-downloader',
      title: 'YouTube Downloader',
      description: 'Download video YouTube sebagai MP3/MP4',
      icon: Youtube,
      color: 'bg-red-500',
      features: ['MP3 Audio', 'MP4 Video', 'Multiple qualities', 'Batch download']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Converter</h1>
          <p className="text-gray-600">
            Konversi file, kompres gambar, dan download video YouTube dengan mudah
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeTab === tool.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActiveTab(tool.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tool.title}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {tool.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file-converter">File Converter</TabsTrigger>
              <TabsTrigger value="image-compressor">Image Compressor</TabsTrigger>
              <TabsTrigger value="youtube-downloader">YouTube Downloader</TabsTrigger>
            </TabsList>

            <TabsContent value="file-converter">
              <FileConverter />
            </TabsContent>

            <TabsContent value="image-compressor">
              <ImageCompressor />
            </TabsContent>

            <TabsContent value="youtube-downloader">
              <YouTubeDownloader />
            </TabsContent>
          </Tabs>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Informasi & Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">📄 File Converter</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mendukung konversi multi-format</li>
                    <li>• Kualitas output terjaga</li>
                    <li>• Proses batch untuk efisiensi</li>
                    <li>• Maksimal ukuran file: 50MB</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">🖼️ Image Compressor</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Algoritma kompresi lossless</li>
                    <li>• Kontrol kualitas manual</li>
                    <li>• Preview sebelum download</li>
                    <li>• Hemat bandwidth dan storage</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">📺 YouTube Downloader</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Download audio (MP3) atau video (MP4)</li>
                    <li>• Berbagai pilihan kualitas</li>
                    <li>• Ekstraksi thumbnail otomatis</li>
                    <li>• Gunakan secara bijak dan legal</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Konfigurasi API</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Beberapa fitur memerlukan API key eksternal. Untuk fungsionalitas penuh, 
                      Anda perlu mendaftar dan mengkonfigurasi:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• <strong>CloudConvert API</strong> - untuk konversi file advanced</li>
                      <li>• <strong>TinyPNG API</strong> - untuk kompresi gambar optimal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Converter;
