
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cloud, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Brain,
  FileText,
  Share2,
  MessageSquare,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const features = [
    {
      icon: Cloud,
      title: 'Private Cloud Storage',
      description: 'Simpan file pribadi Anda dengan aman dan akses dari mana saja',
      color: 'bg-blue-500'
    },
    {
      icon: Share2,
      title: 'Shared Storage',
      description: 'Bagikan file dengan komunitas dan berkolaborasi dengan mudah',
      color: 'bg-green-500'
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'ChatGPT, Text-to-Image, dan Sentiment Analysis dalam satu tempat',
      color: 'bg-purple-500'
    },
    {
      icon: FileText,
      title: 'File Converter',
      description: 'Konversi file, kompres gambar, dan download YouTube',
      color: 'bg-orange-500'
    },
    {
      icon: MessageSquare,
      title: 'Social Feed',
      description: 'Platform sosial untuk berbagi konten dan berinteraksi',
      color: 'bg-pink-500'
    },
    {
      icon: Users,
      title: 'Real-time Chat',
      description: 'Chat pribadi dengan pengguna lain secara real-time',
      color: 'bg-indigo-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      content: 'Platform terbaik untuk mengelola semua file creative saya. AI Assistant-nya sangat membantu!',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Developer',
      content: 'File converter dan cloud storage yang powerful. Menghemat banyak waktu dalam workflow saya.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Designer',
      content: 'Fitur kompres gambar dan AI text-to-image benar-benar game changer untuk pekerjaan saya.',
      rating: 5,
      avatar: '👩‍🎨'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500TB+', label: 'Files Stored' },
    { number: '1M+', label: 'Files Converted' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SamuelIndraBastian Cloud
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="mb-4">
            🚀 All-in-One Cloud Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Your Complete
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Digital Workspace</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cloud storage, AI assistant, file converter, dan social platform dalam satu tempat. 
            Tingkatkan produktivitas Anda dengan teknologi terdepan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform lengkap dengan fitur-fitur canggih untuk mendukung produktivitas dan kreativitas Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl mx-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja Platform
          </h2>
          <p className="text-xl text-gray-600">
            Mulai dalam 3 langkah sederhana
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Daftar Gratis</h3>
            <p className="text-gray-600">
              Buat akun dalam hitungan detik dengan email verification yang aman
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Upload & Kelola</h3>
            <p className="text-gray-600">
              Upload file, gunakan AI assistant, dan manfaatkan semua fitur yang tersedia
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Bagikan & Kolaborasi</h3>
            <p className="text-gray-600">
              Bagikan dengan komunitas dan berkolaborasi secara real-time
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Pengguna
          </h2>
          <p className="text-xl text-gray-600">
            Ribuan pengguna telah merasakan manfaatnya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Siap Memulai Perjalanan Digital Anda?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Bergabunglah dengan ribuan pengguna yang telah meningkatkan produktivitas mereka
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Cloud className="w-6 h-6" />
                <span className="text-lg font-bold">SamuelIndraBastian Cloud</span>
              </div>
              <p className="text-gray-400">
                Platform cloud terlengkap untuk semua kebutuhan digital Anda.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/storage/private" className="hover:text-white">Private Storage</Link></li>
                <li><Link to="/storage/shared" className="hover:text-white">Shared Storage</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white">AI Assistant</Link></li>
                <li><Link to="/converter" className="hover:text-white">File Converter</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/feed" className="hover:text-white">Social Feed</Link></li>
                <li><Link to="/chat" className="hover:text-white">Chat</Link></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SamuelIndraBastian Cloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
