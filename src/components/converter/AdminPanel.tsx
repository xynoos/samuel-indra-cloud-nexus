
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminStats {
  totalConversions: number;
  totalDownloads: number;
  todayConversions: number;
  todayDownloads: number;
  totalUsers: number;
  storageUsed: string;
}

interface FileLog {
  id: string;
  fileName: string;
  type: 'conversion' | 'download' | 'compression';
  timestamp: Date;
  userEmail: string;
  fileSize: number;
  status: 'success' | 'failed';
}

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalConversions: 245,
    totalDownloads: 89,
    todayConversions: 12,
    todayDownloads: 5,
    totalUsers: 34,
    storageUsed: '2.4 GB'
  });

  const [fileLogs, setFileLogs] = useState<FileLog[]>([
    {
      id: '1',
      fileName: 'document.pdf',
      type: 'conversion',
      timestamp: new Date(),
      userEmail: 'user@example.com',
      fileSize: 1024000,
      status: 'success'
    },
    {
      id: '2',
      fileName: 'video.mp4',
      type: 'download',
      timestamp: new Date(Date.now() - 3600000),
      userEmail: 'user2@example.com',
      fileSize: 5242880,
      status: 'success'
    }
  ]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversion': return <FileText className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'compression': return <BarChart3 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const deleteFile = (id: string) => {
    setFileLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Konversi</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalConversions}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Download</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalDownloads}</p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Hari Ini</p>
                <p className="text-2xl font-bold text-purple-800">{stats.todayConversions + stats.todayDownloads}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Total Users</p>
                <p className="text-2xl font-bold text-orange-800">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Logs */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-gray-600" />
            <span>Log Aktivitas File</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fileLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(log.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{log.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {log.userEmail} • {formatFileSize(log.fileSize)} • {log.timestamp.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={log.status === 'success' ? 'default' : 'destructive'}
                    className={log.status === 'success' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                  >
                    {log.type}
                  </Badge>
                  <Badge 
                    variant={log.status === 'success' ? 'default' : 'destructive'}
                  >
                    {log.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFile(log.id)}
                    className="border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-gray-600" />
            <span>Informasi Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Storage Terpakai</p>
              <p className="text-xl font-bold text-gray-800">{stats.storageUsed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Platform</p>
              <p className="text-xl font-bold text-gray-800">ImageKit.io</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
