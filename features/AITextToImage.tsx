
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { API_CONFIG } from '@/lib/config';

export const AITextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] =  useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setGenerating(true);
    setProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // This would normally call DeepAI API
      // For demo, we'll simulate with a placeholder
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setProgress(100);
      setGeneratedImage('https://picsum.photos/512/512?random=' + Date.now());
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <span>AI Text to Image</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe the image you want to create
          </label>
          <Textarea
            placeholder="A beautiful sunset over mountains, digital art style..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-white/50 border-white/20"
          />
        </div>

        {generating && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Generating your image...
            </p>
            <Progress value={progress} />
            <p className="text-xs text-gray-500">This may take a few moments</p>
          </div>
        )}

        {generatedImage && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                <img
                  src={generatedImage}
                  alt="Generated image"
                  className="w-full max-w-md mx-auto rounded-lg border"
                />
                <div className="flex justify-center">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {generating ? 'Generating...' : 'Generate Image'}
        </Button>
      </CardContent>
    </Card>
  );
};
