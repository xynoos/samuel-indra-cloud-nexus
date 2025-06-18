
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cloud, 
  HardDrive, 
  Users, 
  Bot, 
  Download, 
  Activity, 
  Smartphone,
  BarChart3,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useFiles } from '@/hooks/useFiles';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: privateFiles = [] } = useFiles(false);
  const { data: publicFiles = [] } = useFiles(true);

  // Get user sessions for login history
  const { data: sessions = [] } = useQuery({
    queryKey: ['user_sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate storage usage
  const totalStorageUsed = privateFiles.reduce((acc, file) => acc + (file.file_size || 0), 0);
  const storageInGB = totalStorageUsed / (1024 * 1024 * 1024);
  const storageLimit = 10; // 10GB limit
  const storagePercentage = (storageInGB / storageLimit) * 100;

  const userContributedFiles = publicFiles.filter(file => file.user_id === user?.id);
  const contributedStorageInGB = userContributedFiles.reduce((acc, file) => acc + (file.file_size || 0), 0) / (1024 * 1024 * 1024);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang kembali, {profile?.full_name || 'User'}!
            </p>
          </div>
          <Button 
            onClick={signOut}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Storage Pribadi
              </CardTitle>
              <HardDrive className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {storageInGB.toFixed(1)} GB
              </div>
              <Progress value={storagePercentage} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">
                {storagePercentage.toFixed(1)}% dari {storageLimit} GB
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Storage Bersama
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {contributedStorageInGB.toFixed(1)} GB
              </div>
              <p className="text-xs text-gray-500">Kontribusi Anda</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Files
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {privateFiles.length}
              </div>
              <p className="text-xs text-gray-500">Files tersimpan</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Public Files
              </CardTitle>
              <Bot className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {userContributedFiles.length}
              </div>
              <p className="text-xs text-gray-500">Files dibagikan</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Akses Cepat</CardTitle>
                <CardDescription>
                  Navigasi cepat ke fitur-fitur utama
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link to="/storage/private">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-white/50 hover:bg-white/80 border-white/30"
                  >
                    <HardDrive className="h-6 w-6 text-blue-600" />
                    <span>Storage Pribadi</span>
                  </Button>
                </Link>
                
                <Link to="/storage/shared">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-white/50 hover:bg-white/80 border-white/30"
                  >
                    <Users className="h-6 w-6 text-purple-600" />
                    <span>Storage Bersama</span>
                  </Button>
                </Link>
                
                <Link to="/ai-assistant">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-white/50 hover:bg-white/80 border-white/30"
                  >
                    <Bot className="h-6 w-6 text-green-600" />
                    <span>AI Assistant</span>
                  </Button>
                </Link>
                
                <Link to="/converter">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-white/50 hover:bg-white/80 border-white/30"
                  >
                    <Download className="h-6 w-6 text-orange-600" />
                    <span>Converter</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Device Info */}
          <div className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Aktivitas Terakhir</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {privateFiles.slice(0, 3).map((file, index) => (
                  <div key={file.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="text-gray-800">Upload {file.original_name}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(file.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
                {privateFiles.length === 0 && (
                  <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Riwayat Login</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.slice(0, 3).map((session, index) => (
                  <div key={session.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Perangkat</span>
                      <span className="text-sm font-medium">{session.device_info || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lokasi</span>
                      <span className="text-sm font-medium">{session.location || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Waktu</span>
                      <span className="text-sm font-medium">
                        {new Date(session.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {index < sessions.length - 1 && <hr className="my-2" />}
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-gray-500 text-sm">Belum ada riwayat login</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
