
import React, { useState } from 'react';
import { MessageSquare, Image, Heart, Brain, FileText, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChatInterface } from '@/components/ai/ChatInterface';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const features = [
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Percakapan dengan AI seperti ChatGPT',
      icon: MessageSquare,
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'image',
      title: 'Text to Image',
      description: 'Buat gambar dari deskripsi teks',
      icon: Image,
      color: 'bg-purple-500',
      available: true
    },
    {
      id: 'sentiment',
      title: 'Sentiment Analysis',
      description: 'Analisis perasaan dari teks',
      icon: Heart,
      color: 'bg-red-500',
      available: true
    },
    {
      id: 'document',
      title: 'Document AI',
      description: 'Analisis dokumen PDF/TXT',
      icon: FileText,
      color: 'bg-green-500',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">
            Manfaatkan kekuatan AI untuk berbagai keperluan Anda
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeTab === feature.id ? 'ring-2 ring-blue-500' : ''
                } ${!feature.available ? 'opacity-50' : ''}`}
                onClick={() => feature.available && setActiveTab(feature.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      {!feature.available && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Interface */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>
                {features.find(f => f.id === activeTab)?.title || 'AI Assistant'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-80px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="chat" className="h-full m-0">
                <ChatInterface mode="chat" />
              </TabsContent>
              
              <TabsContent value="image" className="h-full m-0">
                <ChatInterface mode="image" />
              </TabsContent>
              
              <TabsContent value="sentiment" className="h-full m-0">
                <ChatInterface mode="sentiment" />
              </TabsContent>
              
              <TabsContent value="document" className="h-full m-0">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Document AI
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Fitur ini akan segera tersedia.<br />
                      Anda akan dapat menganalisis dokumen PDF dan TXT.
                    </p>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Tips Penggunaan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">💬 AI Chat</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tanyakan apa saja dalam bahasa Indonesia</li>
                  <li>• Minta bantuan coding, writing, atau analisis</li>
                  <li>• Gunakan konteks percakapan sebelumnya</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-purple-600">🎨 Text to Image</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Deskripsikan gambar dengan detail</li>
                  <li>• Sebutkan style (realistis, kartun, dll)</li>
                  <li>• Tambahkan warna dan mood yang diinginkan</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">❤️ Sentiment Analysis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Masukkan teks review, komentar, atau feedback</li>
                  <li>• Dapatkan analisis emosi (positif/negatif/netral)</li>
                  <li>• Berguna untuk analisis media sosial</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
