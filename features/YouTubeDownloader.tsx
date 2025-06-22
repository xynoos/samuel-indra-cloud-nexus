
import React, { useState } from 'react';
import { Download, Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const YouTubeDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<{
    title: string;
    thumbnail: string;
    duration: string;
  } | null>(null);

  const handleUrlSubmit = async () => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    // Simulate fetching video info
    setVideoInfo({
      title: 'Sample YouTube Video Title',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '3:45'
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-6 h-6 text-red-600" />
            <span>YouTube Downloader</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Paste YouTube URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white/50 border-white/20"
            />
            <Button
              onClick={handleUrlSubmit}
              variant="outline"
              className="border-red-200 hover:bg-red-50"
            >
              Get Info
            </Button>
          </div>

          {videoInfo && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={videoInfo.thumbnail}
                    alt="Video thumbnail"
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">{videoInfo.title}</h3>
                    <p className="text-sm text-gray-600">Duration: {videoInfo.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Format
            </label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp4" id="mp4" />
                <Label htmlFor="mp4" className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-red-500" />
                  <span>MP4 Video</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp3" id="mp3" />
                <Label htmlFor="mp3" className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-green-500" />
                  <span>MP3 Audio</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {downloading && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Downloading {format.toUpperCase()}...
              </p>
              <Progress value={progress} />
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>
          )}

          <Button
            onClick={handleDownload}
            disabled={!videoInfo || downloading}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            {downloading ? 'Downloading...' : `Download ${format.toUpperCase()}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
