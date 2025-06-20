
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Grid, 
  List, 
  Download, 
  Share, 
  Heart,
  MessageCircle,
  Eye,
  User,
  Plus,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageKitUpload } from '@/components/common/ImageKitUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IKImage } from 'imagekitio-react';
import { IMAGEKIT_CONFIG } from '@/lib/config';

interface SharedFile {
  id: string;
  name: string;
  original_name: string;
  file_type: string;
  file_size: number;
  imagekit_url: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
}

const StorageShared = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  useEffect(() => {
    loadSharedFiles();
  }, [sortBy]);

  const loadSharedFiles = async () => {
    try {
      let query = supabase
        .from('files')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('is_public', true);

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('file_size', { ascending: false }); // Placeholder for popularity
          break;
        case 'trending':
          query = query.order('updated_at', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading shared files:', error);
      toast({
        title: "Error",
        description: "Gagal memuat file bersama",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async (uploadResponse: any) => {
    try {
      const { error } = await supabase
        .from('files')
        .insert({
          user_id: user?.id,
          name: uploadResponse.name,
          original_name: uploadResponse.name,
          file_type: uploadResponse.fileType,
          file_size: uploadResponse.size,
          imagekit_url: uploadResponse.url,
          imagekit_file_id: uploadResponse.fileId,
          folder_path: '/shared',
          is_public: true
        });

      if (error) throw error;
      
      loadSharedFiles();
      setShowUpload(false);
      
      toast({
        title: "Berhasil!",
        description: "File berhasil dibagikan ke storage publik",
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      toast({
        title: "Error",
        description: "Gagal membagikan file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.profiles?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shared Storage</h1>
            <p className="text-gray-600 mt-2">Jelajahi dan bagikan file dengan komunitas</p>
          </div>
          <Button onClick={() => setShowUpload(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Share File
          </Button>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Share File</h2>
                <Button variant="ghost" onClick={() => setShowUpload(false)}>×</Button>
              </div>
              <ImageKitUpload
                onUploadSuccess={handleUploadSuccess}
                folder="/shared"
              />
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari file atau pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="newest">Terbaru</option>
              <option value="popular">Populer</option>
              <option value="trending">Trending</option>
            </select>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Files Display */}
        {filteredFiles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Share className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada file yang dibagikan</h3>
              <p className="text-gray-500 mb-4">Jadilah yang pertama membagikan file ke komunitas</p>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Share File
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {viewMode === 'grid' ? (
                    <div className="space-y-4">
                      {/* File Preview */}
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {file.file_type.includes('image') ? (
                          <IKImage
                            urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
                            path={file.imagekit_url}
                            transformation={[{ width: '300', height: '300', crop: 'maintain_ratio' }]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-6xl">📁</div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div>
                        <h3 className="font-medium text-sm truncate mb-1">{file.original_name}</h3>
                        <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {file.file_type.split('/')[1]?.toUpperCase()}
                        </Badge>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={file.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {file.profiles?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 truncate">
                          {file.profiles?.username || 'Anonymous'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">{file.likes_count || 0}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">{file.comments_count || 0}</span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs">{file.views_count || 0}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {file.file_type.includes('image') ? (
                            <IKImage
                              urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
                              path={file.imagekit_url}
                              transformation={[{ width: '48', height: '48', crop: 'maintain_ratio' }]}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-xl">📁</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{file.original_name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{formatFileSize(file.file_size)}</span>
                            <span>•</span>
                            <span>{file.profiles?.username}</span>
                            <span>•</span>
                            <span>{new Date(file.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{file.likes_count || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{file.comments_count || 0}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageShared;
