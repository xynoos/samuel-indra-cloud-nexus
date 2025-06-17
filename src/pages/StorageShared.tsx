
import React, { useState } from 'react';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  Download,
  Trash2,
  Edit3,
  Eye,
  MessageSquare,
  Tag,
  Users,
  Heart,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';

const StorageShared = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Mock data for shared files
  const sharedFiles = [
    {
      id: 1,
      name: 'Company_Presentation.pptx',
      type: 'presentation',
      size: '12.3 MB',
      date: '2024-01-15',
      uploader: { name: 'John Doe', avatar: '', initials: 'JD' },
      tags: ['presentation', 'company'],
      likes: 8,
      comments: 3,
      description: 'Presentasi perusahaan untuk Q1 2024'
    },
    {
      id: 2,
      name: 'Team_Photo.jpg',
      type: 'image',
      size: '5.2 MB',
      date: '2024-01-14',
      uploader: { name: 'Jane Smith', avatar: '', initials: 'JS' },
      tags: ['photo', 'team'],
      likes: 15,
      comments: 7,
      description: 'Foto tim development terbaru'
    },
    {
      id: 3,
      name: 'Project_Documentation.pdf',
      type: 'pdf',
      size: '3.8 MB',
      date: '2024-01-13',
      uploader: { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
      tags: ['documentation', 'project'],
      likes: 12,
      comments: 5,
      description: 'Dokumentasi lengkap project terbaru'
    },
    {
      id: 4,
      name: 'Tutorial_Video.mp4',
      type: 'video',
      size: '89.5 MB',
      date: '2024-01-12',
      uploader: { name: 'Sarah Wilson', avatar: '', initials: 'SW' },
      tags: ['tutorial', 'video'],
      likes: 23,
      comments: 12,
      description: 'Tutorial penggunaan sistem baru'
    },
    {
      id: 5,
      name: 'Meeting_Notes.txt',
      type: 'text',
      size: '45 KB',
      date: '2024-01-11',
      uploader: { name: 'David Brown', avatar: '', initials: 'DB' },
      tags: ['meeting', 'notes'],
      likes: 6,
      comments: 2,
      description: 'Catatan meeting mingguan'
    }
  ];

  const allTags = ['presentation', 'company', 'photo', 'team', 'documentation', 'project', 'tutorial', 'video', 'meeting', 'notes'];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-green-500" />;
      case 'video': return <Video className="w-8 h-8 text-red-500" />;
      case 'pdf':
      case 'text': return <FileText className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const filteredFiles = sharedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || file.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Storage Bersama</h1>
            <p className="text-gray-600">File yang dibagikan oleh semua pengguna</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 md:mt-0">
            <Upload className="w-4 h-4 mr-2" />
            Upload ke Shared
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Files
              </CardTitle>
              <File className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">1,247</div>
              <p className="text-xs text-gray-500">+12% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">89</div>
              <p className="text-xs text-gray-500">Pengguna aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Storage Used
              </CardTitle>
              <Tag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">45.2 GB</div>
              <p className="text-xs text-gray-500">Total penggunaan</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari file, deskripsi, atau uploader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/20"
            />
          </div>
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === null ? "default" : "secondary"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedTag(null)}
            >
              Semua
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{file.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{file.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{file.size}</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {file.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={file.uploader.avatar} />
                      <AvatarFallback className="text-xs">{file.uploader.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{file.uploader.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Heart className="h-4 w-4" />
                      <span>{file.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                      <span>{file.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorageShared;
