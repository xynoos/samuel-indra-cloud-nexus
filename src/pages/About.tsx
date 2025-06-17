
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Github, Linkedin, Mail, Code, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const skills = [
    'React.js', 'Node.js', 'JavaScript', 'TypeScript', 'Python',
    'MongoDB', 'Firebase', 'Supabase', 'Tailwind CSS', 'AI/ML'
  ];

  const projects = [
    {
      title: "SamuelIndraBastian Cloud Storage",
      description: "Platform cloud storage modern dengan AI Assistant yang powerful",
      tech: ["React", "Node.js", "MongoDB", "AI APIs"]
    },
    {
      title: "AI-Powered Web Apps",
      description: "Berbagai aplikasi web yang mengintegrasikan kecerdasan buatan",
      tech: ["OpenAI", "DeepAI", "React", "Express"]
    },
    {
      title: "Full-Stack Solutions",
      description: "Solusi web development lengkap untuk berbagai kebutuhan bisnis",
      tech: ["MERN Stack", "Firebase", "Tailwind"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SamuelIndraBastian Cloud
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">SI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Samuel Indra Bastian
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Full-Stack Developer & AI Enthusiast
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Saya adalah seorang developer yang passionate dalam menciptakan solusi teknologi inovatif. 
              Dengan keahlian dalam pengembangan web full-stack dan integrasi AI, saya berkomitmen untuk 
              membangun aplikasi yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang luar biasa.
            </p>
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-blue-200 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-purple-200 hover:bg-purple-50"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-indigo-200 hover:bg-indigo-50"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </Button>
          </div>
        </div>

        {/* Skills Section */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-blue-600" />
              <span>Keahlian Teknis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium hover:scale-105 transition-transform"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-purple-600" />
              <span>Proyek Unggulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vision Section */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span>Visi & Misi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Visi</h3>
                <p className="text-gray-600">
                  Menciptakan teknologi yang dapat diakses semua orang dan memberikan dampak positif 
                  bagi kehidupan sehari-hari melalui inovasi yang berkelanjutan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Misi</h3>
                <p className="text-gray-600">
                  Mengembangkan aplikasi web modern yang mengintegrasikan kecerdasan buatan untuk 
                  memudahkan pekerjaan dan meningkatkan produktivitas pengguna di seluruh dunia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Mari Berkolaborasi!
          </h2>
          <p className="text-gray-600 mb-6">
            Tertarik untuk bekerja sama atau memiliki proyek menarik? 
            Jangan ragu untuk menghubungi saya.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Kembali ke Platform
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
