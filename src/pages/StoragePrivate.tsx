
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
  Plus,
  FolderPlus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';

const StoragePrivate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for files and folders
  const folders = [
    { id: 1, name: 'Dokumen', files: 12, size: '2.3 MB' },
    { id: 2, name: 'Foto', files: 45, size: '156.7 MB' },
    { id: 3, name: 'Video', files: 8, size: '1.2 GB' },
    { id: 4, name: 'Proyek', files: 23, size: '45.8 MB' },
  ];

  const files = [
    { id: 1, name: 'Report_2024.pdf', type: 'pdf', size: '2.3 MB', date: '2024-01-15', preview: true },
    { id: 2, name: 'Presentation.pptx', type: 'presentation', size: '5.1 MB', date: '2024-01-14', preview: false },
    { id: 3, name: 'Photo_sunset.jpg', type: 'image', size: '3.2 MB', date: '2024-01-13', preview: true },
    { id: 4, name: 'Video_demo.mp4', type: 'video', size: '45.7 MB', date: '2024-01-12', preview: true },
    { id: 5, name: 'Notes.txt', type: 'text', size: '12 KB', date: '2024-01-11', preview: true },
    { id: 6, name: 'Database_backup.sql', type: 'code', size: '8.9 MB', date: '2024-01-10', preview: false },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-green-500" />;
      case 'video': return <Video className="w-8 h-8 text-red-500" />;
      case 'pdf':
      case 'text': return <FileText className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Storage Pribadi</h1>
            <p className="text-gray-600">Kelola file dan folder pribadi Anda</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
              <FolderPlus className="w-4 h-4 mr-2" />
              Buat Folder
            </Button>
          </div>
        </div>

        {/* Storage Usage */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle>Penggunaan Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>2.4 GB digunakan dari 10 GB</span>
                <span>24%</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari file atau folder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/20"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              List
            </Button>
          </div>
        </div>

        {/* Folders Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Folder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FolderPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{folder.name}</h3>
                      <p className="text-sm text-gray-500">{folder.files} file • {folder.size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Files Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">File Terbaru</h2>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      {getFileIcon(file.type)}
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.preview && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1 truncate">{file.name}</h3>
                    <p className="text-sm text-gray-500">{file.size} • {file.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 hover:bg-white/50 transition-colors group">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <h3 className="font-medium text-gray-800">{file.name}</h3>
                          <p className="text-sm text-gray-500">{file.size} • {file.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.preview && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoragePrivate;
