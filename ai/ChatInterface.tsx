
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Image, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage, generateImage, analyzeSentiment } from '@/utils/apiServices';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isImage?: boolean;
  sentiment?: string;
}

interface ChatInterfaceProps {
  mode: 'chat' | 'image' | 'sentiment';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      let botResponse = '';
      let isImage = false;
      let sentiment = '';

      switch (mode) {
        case 'chat':
          botResponse = await sendChatMessage(currentInput);
          break;
        
        case 'image':
          botResponse = await generateImage(currentInput);
          isImage = true;
          break;
        
        case 'sentiment':
          const sentimentResult = await analyzeSentiment(currentInput);
          sentiment = sentimentResult;
          botResponse = `Analisis sentiment: **${sentiment}**\n\nTeks Anda menunjukkan emosi yang ${sentiment === 'Positive' ? 'positif' : sentiment === 'Negative' ? 'negatif' : 'netral'}.`;
          break;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        isImage,
        sentiment
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI request error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses permintaan",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'chat':
        return 'Tanyakan apa saja kepada AI...';
      case 'image':
        return 'Deskripsikan gambar yang ingin dibuat...';
      case 'sentiment':
        return 'Masukkan teks untuk analisis sentiment...';
      default:
        return 'Ketik pesan...';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-medium mb-2">
              {mode === 'chat' && 'AI Chat Assistant'}
              {mode === 'image' && 'AI Image Generator'}
              {mode === 'sentiment' && 'Sentiment Analyzer'}
            </h3>
            <p className="text-sm">
              {mode === 'chat' && 'Mulai percakapan dengan AI assistant'}
              {mode === 'image' && 'Buat gambar dari deskripsi teks'}
              {mode === 'sentiment' && 'Analisis sentiment dari teks Anda'}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%]`}>
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              
              <Card className={`${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                <CardContent className="p-3">
                  {message.isImage ? (
                    <div className="space-y-2">
                      <img 
                        src={message.content} 
                        alt="Generated" 
                        className="rounded-lg max-w-full h-auto"
                        style={{ maxHeight: '300px' }}
                      />
                      <p className="text-xs text-gray-500">Gambar berhasil dibuat</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.sentiment && (
                        <Badge 
                          variant="secondary" 
                          className={`mt-2 ${
                            message.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                            message.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.sentiment}
                        </Badge>
                      )}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </CardContent>
              </Card>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <Card className="bg-white">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">
                      {mode === 'image' ? 'Membuat gambar...' : 'Memproses...'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
