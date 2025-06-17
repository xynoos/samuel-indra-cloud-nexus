
import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles,
  Mic,
  Heart,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Halo! Saya adalah AI Assistant Anda. Saya bisa membantu Anda dengan berbagai hal seperti menganalisis file, menjawab pertanyaan, membuat gambar, dan analisis sentimen. Apa yang bisa saya bantu hari ini?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: 'Terima kasih atas pertanyaan Anda! Saya sedang memproses permintaan Anda menggunakan OpenRouter API. Harap tunggu sebentar...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const quickActions = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Analisis File",
      description: "Upload file untuk dianalisis",
      action: "analyze-file"
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Buat Gambar",
      description: "Generate gambar dari teks",
      action: "generate-image"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Analisis Sentimen",
      description: "Analisis perasaan dari teks",
      action: "sentiment-analysis"
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Chat Cerdas",
      description: "Percakapan dengan AI",
      action: "smart-chat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-blue-600" />
                  <span>AI Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Powered by OpenRouter & DeepAI APIs
                </p>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Mistral 7B
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    DeepAI Image
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Heart className="w-3 h-3 mr-1" />
                    Sentiment API
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-3 flex flex-col items-start space-y-1 bg-white/50 hover:bg-white/80 border-white/30"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <div className="text-blue-600">{action.icon}</div>
                      <span className="font-medium text-sm">{action.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-left">{action.description}</p>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>AI Assistant - Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white/70 text-gray-800 border border-white/30'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input Area */}
              <div className="flex-shrink-0 p-4 border-t border-white/20">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Ketik pesan Anda di sini..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[44px] max-h-32 bg-white/50 border-white/20 resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Tekan Enter untuk kirim, Shift+Enter untuk baris baru</span>
                  <span>Powered by OpenRouter API</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Features Info */}
        <div className="mt-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Kemampuan AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Analisis File</h3>
                  <p className="text-sm text-gray-600">Baca dan analisis konten PDF, TXT</p>
                </div>
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Generate Gambar</h3>
                  <p className="text-sm text-gray-600">Buat gambar dari deskripsi teks</p>
                </div>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Analisis Sentimen</h3>
                  <p className="text-sm text-gray-600">Deteksi emosi dalam teks</p>
                </div>
                <div className="text-center">
                  <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Chat Cerdas</h3>
                  <p className="text-sm text-gray-600">Percakapan dengan AI model terbaru</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
