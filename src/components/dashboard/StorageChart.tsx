
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StorageData {
  used: number;
  total: number;
  breakdown: {
    images: number;
    videos: number;
    documents: number;
    others: number;
  };
}

interface StorageChartProps {
  data: StorageData;
}

export const StorageChart: React.FC<StorageChartProps> = ({ data }) => {
  const usedPercentage = (data.used / data.total) * 100;
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penggunaan Penyimpanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Terpakai</span>
            <span>{formatBytes(data.used)} / {formatBytes(data.total)}</span>
          </div>
          <Progress 
            value={usedPercentage} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {usedPercentage.toFixed(1)}% dari total penyimpanan
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Breakdown Penggunaan</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Gambar</span>
              </div>
              <span className="text-sm">{formatBytes(data.breakdown.images)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Video</span>
              </div>
              <span className="text-sm">{formatBytes(data.breakdown.videos)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Dokumen</span>
              </div>
              <span className="text-sm">{formatBytes(data.breakdown.documents)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm">Lainnya</span>
              </div>
              <span className="text-sm">{formatBytes(data.breakdown.others)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
