
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { AITextToImage } from '@/components/features/AITextToImage';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Halo! Saya adalah AI Assistant Anda yang menggunakan OpenRouter API dan DeepAI. Saya bisa membantu Anda dengan berbagai hal seperti menganalisis file, menjawab pertanyaan, membuat gambar, dan analisis sentimen. Apa yang bisa saya bantu hari ini?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    const currentMessage = message;
    setMessage('');

    // Simulate AI response with OpenRouter
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: `Terima kasih atas pertanyaan: "${currentMessage}". Saya sedang memproses permintaan Anda menggunakan OpenRouter API dengan model Mistral 7B. Dalam implementasi sebenarnya, saya akan memberikan respons yang lebih detail dan akurat berdasarkan AI terbaru.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Assistant</h1>
          <p className="text-gray-600">Powered by OpenRouter & DeepAI APIs</p>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="chat">Smart Chat</TabsTrigger>
            <TabsTrigger value="image">Text to Image</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="file">File Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
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
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image">
            <AITextToImage />
          </TabsContent>

          <TabsContent value="sentiment">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-red-600" />
                  <span>Sentiment Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to analyze sentiment..."
                  className="min-h-[100px] bg-white/50 border-white/20"
                />
                <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                  Analyze Sentiment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>File Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload PDF or TXT file for AI analysis</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Analyze File
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
