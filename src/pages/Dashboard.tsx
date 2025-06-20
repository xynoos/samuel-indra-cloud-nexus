
import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Upload, 
  Download, 
  Users, 
  Activity,
  FileText,
  Image,
  Video,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { StorageChart } from '@/components/dashboard/StorageChart';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalUploads: 0,
    totalDownloads: 0,
    totalShares: 0
  });
  
  const [storageData, setStorageData] = useState({
    used: 0,
    total: 5 * 1024 * 1024 * 1024, // 5GB default
    breakdown: {
      images: 0,
      videos: 0,
      documents: 0,
      others: 0
    }
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: '1',
      type: 'upload' as const,
      description: 'Mengupload dokumen laporan.pdf',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      fileType: 'pdf'
    },
    {
      id: '2',
      type: 'share' as const,
      description: 'Membagikan foto vacation.jpg',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      fileType: 'jpg'
    },
    {
      id: '3',
      type: 'download' as const,
      description: 'Mendownload video presentation.mp4',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      fileType: 'mp4'
    }
  ]);

  const [sessionHistory, setSessionHistory] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        // Load user files
        const { data: files, error: filesError } = await supabase
          .from('files')
          .select('*')
          .eq('user_id', user.id);

        if (!filesError && files) {
          setStats(prev => ({
            ...prev,
            totalFiles: files.length,
            totalUploads: files.length
          }));

          // Calculate storage breakdown
          const breakdown = files.reduce((acc, file) => {
            const fileType = file.file_type.toLowerCase();
            if (fileType.includes('image')) {
              acc.images += file.file_size;
            } else if (fileType.includes('video')) {
              acc.videos += file.file_size;
            } else if (fileType.includes('document') || fileType.includes('pdf') || fileType.includes('text')) {
              acc.documents += file.file_size;
            } else {
              acc.others += file.file_size;
            }
            return acc;
          }, { images: 0, videos: 0, documents: 0, others: 0 });

          const totalUsed = breakdown.images + breakdown.videos + breakdown.documents + breakdown.others;
          setStorageData(prev => ({
            ...prev,
            used: totalUsed,
            breakdown
          }));
        }

        // Load user sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!sessionsError && sessions) {
          setSessionHistory(sessions);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total File"
                value={stats.totalFiles}
                icon={FileText}
                description="File yang tersimpan"
              />
              <StatsCard
                title="Upload"
                value={stats.totalUploads}
                icon={Upload}
                description="File yang diupload"
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Download"
                value={stats.totalDownloads}
                icon={Download}
                description="File yang didownload"
              />
              <StatsCard
                title="Share"
                value={stats.totalShares}
                icon={Users}
                description="File yang dibagikan"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StorageChart data={storageData} />
              <RecentActivity activities={recentActivities} />
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StorageChart data={storageData} />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button className="w-full" variant="outline">
                    <HardDrive className="w-4 h-4 mr-2" />
                    Manage Storage
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Storage Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <RecentActivity activities={recentActivities} />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionHistory.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      Belum ada riwayat login
                    </p>
                  ) : (
                    sessionHistory.map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.device_info || 'Unknown Device'}</p>
                          <p className="text-sm text-gray-500">{session.location || 'Unknown Location'}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(session.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
