
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
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang kembali! Berikut ringkasan akun Anda.</p>
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
              <div className="text-2xl font-bold text-gray-800">2.4 GB</div>
              <Progress value={24} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">24% dari 10 GB</p>
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
              <div className="text-2xl font-bold text-gray-800">1.2 GB</div>
              <p className="text-xs text-gray-500">Kontribusi Anda</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                AI Queries
              </CardTitle>
              <Bot className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">47</div>
              <p className="text-xs text-gray-500">Bulan ini</p>
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
              <div className="text-2xl font-bold text-gray-800">156</div>
              <p className="text-xs text-gray-500">Files tersimpan</p>
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
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="text-gray-800">Upload foto.jpg</p>
                    <p className="text-gray-500 text-xs">2 jam lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="text-gray-800">AI Chat session</p>
                    <p className="text-gray-500 text-xs">5 jam lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="text-gray-800">Shared file to group</p>
                    <p className="text-gray-500 text-xs">1 hari lalu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Info Perangkat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Login terakhir</span>
                  <span className="text-sm font-medium">Chrome Desktop</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lokasi</span>
                  <span className="text-sm font-medium">Jakarta, ID</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Waktu</span>
                  <span className="text-sm font-medium">2 jam lalu</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
