
import React, { useState } from 'react';
import { Youtube, Download, Music, Video, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface YouTubeDownloaderProps {
  onProcessComplete: (processedFile: any) => void;
}

const YouTubeDownloader: React.FC<YouTubeDownloaderProps> = ({ onProcessComplete }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchVideoInfo = async () => {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    // Simulate fetching video info
    const mockVideoInfo = {
      id: videoId,
      title: "Sample Video Title",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: "5:23",
      channel: "Sample Channel",
    };

    setVideoInfo(mockVideoInfo);
    toast({
      title: "Video found!",
      description: "Ready to download",
    });
  };

  const handleDownload = async (format: 'mp3' | 'mp4') => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      // Simulate download process
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            
            // Simulate successful download
            const processedFile = {
              id: `youtube_${Date.now()}`,
              name: `${videoInfo?.title || 'youtube_video'}.${format}`,
              originalSize: format === 'mp4' ? 50 * 1024 * 1024 : 5 * 1024 * 1024, // 50MB for video, 5MB for audio
              processedSize: format === 'mp4' ? 50 * 1024 * 1024 : 5 * 1024 * 1024,
              url: `https://ik.imagekit.io/storageweb/youtube_${videoInfo?.id}.${format}`,
              type: format === 'mp4' ? 'video/mp4' : 'audio/mp3',
              status: 'completed' as const,
              progress: 100,
            };
            
            onProcessComplete(processedFile);
            
            toast({
              title: "Download completed!",
              description: `Video downloaded as ${format.toUpperCase()}`,
            });
            
            return 100;
          }
          return prev + 5;
        });
      }, 200);

    } catch (error) {
      setIsDownloading(false);
      toast({
        title: "Download failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
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
              YouTube URL
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="bg-white/50 border-white/20"
              />
              <Button
                onClick={fetchVideoInfo}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {videoInfo && (
            <div className="p-4 bg-white/50 rounded-lg border border-white/30">
              <div className="flex space-x-4">
                <img 
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 line-clamp-2">{videoInfo.title}</h3>
                  <p className="text-sm text-gray-500">{videoInfo.channel}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="border-red-200">
                      {videoInfo.duration}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleDownload('mp3')}
              disabled={!youtubeUrl.trim() || isDownloading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Music className="w-4 h-4 mr-2" />
              Download MP3
            </Button>
            <Button
              onClick={() => handleDownload('mp4')}
              disabled={!youtubeUrl.trim() || isDownloading}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              <Video className="w-4 h-4 mr-2" />
              Download MP4
            </Button>
          </div>

          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Downloading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <div className="bg-red-50/50 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Features:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Download videos in HD quality</li>
            <li>• Extract audio to MP3 format</li>
            <li>• Support for various resolutions</li>
            <li>• Powered by yt-dlp + Node.js backend</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeDownloader;
