
import React, { useState } from 'react';
import { Bot, MessageSquare, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AIHelper: React.FC = () => {
  const [message, setMessage] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const quickSuggestions = [
    "Convert PDF to text",
    "Compress my images",
    "Download YouTube video",
    "Convert images to WebP",
    "Compress video file"
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setSuggestion(suggestion);
    setMessage('');
    
    // Simple NLP to determine the service
    if (suggestion.includes('convert') || suggestion.includes('PDF') || suggestion.includes('text')) {
      // Auto-focus converter tab
    } else if (suggestion.includes('compress')) {
      // Auto-focus compression tab
    } else if (suggestion.includes('YouTube') || suggestion.includes('download')) {
      // Auto-focus YouTube downloader tab
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Assistant
          </span>
          <Sparkles className="w-4 h-4 text-purple-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me what you want to do... (e.g., 'Convert PDF to text')"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white/50 border-purple-200"
          />
          <Button 
            variant="outline" 
            className="border-purple-200 hover:bg-purple-50"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>

        {suggestion && (
          <div className="p-3 bg-white/50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>AI Suggestion:</strong> {suggestion}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((sug, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer border-purple-200 hover:bg-purple-50 transition-colors"
                onClick={() => handleQuickSuggestion(sug)}
              >
                {sug}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIHelper;
