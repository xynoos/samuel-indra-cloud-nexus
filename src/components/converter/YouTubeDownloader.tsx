
import React, { useState } from 'react';
import { Youtube, Download, Play, Music, Video, Loader, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  uploader: string;
}

interface DownloadJob {
  id: string;
  url: string;
  format: 'mp3' | 'mp4';
  quality: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  videoInfo?: VideoInfo;
  downloadUrl?: string;
  error?: string;
}

export const YouTubeDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'mp3' | 'mp4'>('mp3');
  const [quality, setQuality] = useState('medium');
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const qualityOptions = {
    mp3: [
      { value: 'low', label: '128kbps' },
      { value: 'medium', label: '192kbps' },
      { value: 'high', label: '320kbps' }
    ],
    mp4: [
      { value: 'low', label: '480p' },
      { value: 'medium', label: '720p' },
      { value: 'high', label: '1080p' }
    ]
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return regex.test(url);
  };

  const extractVideoId = (url: string): string => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const mockVideoInfo = (videoId: string): VideoInfo => {
    return {
      title: "Sample Video Title - Amazing Content",
      duration: "5:42",
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      views: "1.2M views",
      uploader: "Sample Channel"
    };
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({
        title: "URL kosong",
        description: "Masukkan URL YouTube terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      toast({
        title: "URL tidak valid",
        description: "Masukkan URL YouTube yang valid",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractVideoId(url);
    const job: DownloadJob = {
      id: Date.now().toString(),
      url,
      format,
      quality,
      status: 'pending',
      progress: 0,
      videoInfo: mockVideoInfo(videoId)
    };

    setJobs(prev => [...prev, job]);
    setUrl('');
    startDownload(job);
  };

  const startDownload = async (job: DownloadJob) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'downloading', progress: 5 } : j));

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setJobs(prev => prev.map(j => {
          if (j.id === job.id && j.progress < 95) {
            return { ...j, progress: j.progress + 5 };
          }
          return j;
        }));
      }, 200);

      // Simulate download time (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);

      // Simulate successful download
      setJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { 
              ...j, 
              status: 'completed', 
              progress: 100,
              downloadUrl: '#download-link' // In real app, this would be the actual download URL
            } 
          : j
      ));

      toast({
        title: "Download selesai!",
        description: `${job.videoInfo?.title} berhasil diunduh`,
      });

    } catch (error) {
      setJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { 
              ...j, 
              status: 'error', 
              progress: 0,
              error: 'Download failed'
            } 
          : j
      ));

      toast({
        title: "Download gagal",
        description: "Terjadi kesalahan saat mengunduh video",
        variant: "destructive",
      });
    }
  };

  const removeJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDownload();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Youtube className="w-5 h-5 text-red-600" />
          <span>YouTube Downloader</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">URL YouTube:</label>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Format:</label>
              <Select value={format} onValueChange={(value: 'mp3' | 'mp4') => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4" />
                      <span>MP3 (Audio)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mp4">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>MP4 (Video)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Kualitas:</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityOptions[format].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleDownload} 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download {format.toUpperCase()}
          </Button>
        </div>

        {/* Download Jobs */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Downloads:</h3>
            {jobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="space-y-3">
                  {/* Video Info */}
                  <div className="flex items-start space-x-3">
                    <img 
                      src={job.videoInfo?.thumbnail} 
                      alt="Thumbnail"
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{job.videoInfo?.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{job.videoInfo?.uploader}</span>
                        <span>•</span>
                        <span>{job.videoInfo?.duration}</span>
                        <span>•</span>
                        <span>{job.videoInfo?.views}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">
                          {job.format.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {qualityOptions[job.format].find(q => q.value === job.quality)?.label}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeJob(job.id)}
                    >
                      ×
                    </Button>
                  </div>

                  {/* Progress */}
                  {job.status === 'downloading' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Downloading...</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {job.status === 'downloading' && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Mengunduh...</span>
                        </div>
                      )}
                      
                      {job.status === 'completed' && (
                        <Badge variant="default" className="bg-green-600">
                          Selesai
                        </Badge>
                      )}
                      
                      {job.status === 'error' && (
                        <Badge variant="destructive">
                          Error
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(job.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Lihat
                      </Button>
                      
                      {job.status === 'completed' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => job.downloadUrl && window.open(job.downloadUrl)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Usage Notes */}
        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
          <p><strong>Catatan penggunaan:</strong></p>
          <p>• Hanya untuk konten yang tidak melanggar hak cipta</p>
          <p>• Kualitas download tergantung pada video asli</p>
          <p>• Format MP3 hanya mengambil audio saja</p>
          <p>• Pastikan koneksi internet stabil untuk download</p>
        </div>
      </CardContent>
    </Card>
  );
};
