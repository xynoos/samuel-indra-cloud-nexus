
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Shield, Users, Bot, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Penyimpanan Pribadi",
      description: "Simpan file Anda dengan aman dan akses dari mana saja"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Berbagi Bersama",
      description: "Kolaborasi dan berbagi file dengan pengguna lain"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Assistant",
      description: "Chat dengan AI, analisis file, dan buat gambar"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Converter & Downloader",
      description: "Convert file dan download dari YouTube"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SamuelIndraBastian Cloud
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-blue-200 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Daftar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              SamuelIndraBastian
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
              Cloud Storage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Platform cloud storage modern dengan AI Assistant yang powerful. 
              Simpan, berbagi, dan kelola file Anda dengan teknologi terdepan.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
            >
              Mulai Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-blue-200 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
            >
              Masuk Akun
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10GB</div>
              <div className="text-gray-600">Storage Gratis</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">AI</div>
              <div className="text-gray-600">Assistant Powered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-gray-600">Gratis Selamanya</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cloud className="w-6 h-6" />
            <span className="text-lg font-semibold">SamuelIndraBastian Cloud Storage</span>
          </div>
          <p className="text-gray-400 mb-4">
            Platform cloud storage modern dengan AI Assistant
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
              Register
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
            © 2024 SamuelIndraBastian Cloud Storage. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
