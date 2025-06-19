
import React, { useState } from 'react';
import { Zap, Minimize2, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { FileConverter } from '@/components/features/FileConverter';
import { ImageCompressor } from '@/components/features/ImageCompressor';
import { YouTubeDownloader } from '@/components/features/YouTubeDownloader';

const Converter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">File Converter & Tools</h1>
          <p className="text-gray-600">Convert files, compress images, and download YouTube content</p>
        </div>

        <Tabs defaultValue="converter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="converter" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>File Converter</span>
            </TabsTrigger>
            <TabsTrigger value="compressor" className="flex items-center space-x-2">
              <Minimize2 className="w-4 h-4" />
              <span>Image Compressor</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>YouTube Downloader</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter">
            <FileConverter />
          </TabsContent>

          <TabsContent value="compressor">
            <ImageCompressor />
          </TabsContent>

          <TabsContent value="youtube">
            <YouTubeDownloader />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Converter;
