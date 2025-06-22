
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Share, 
  Trash2,
  File,
  Image,
  Video,
  FileText,
  Plus,
  Folder
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ImageKitUpload } from '@/components/common/ImageKitUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IKImage } from 'imagekitio-react';
import { IMAGEKIT_CONFIG } from '@/lib/config';

interface FileItem {
  id: string;
  name: string;
  original_name: string;
  file_type: string;
  file_size: number;
  imagekit_url: string;
  folder_path: string;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
}

const StoragePrivate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('/');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [user, selectedFolder]);

  const loadFiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .eq('folder_path', selectedFolder)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Gagal memuat file",
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
          folder_path: selectedFolder,
          is_public: false,
          title: uploadResponse.title,
          description: uploadResponse.description
        });

      if (error) throw error;
      
      loadFiles();
      setShowUpload(false);
      
      toast({
        title: "Berhasil!",
        description: "File berhasil diupload ke private storage",
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan informasi file",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      loadFiles();
      toast({
        title: "Berhasil",
        description: "File berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus file",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="w-5 h-5" />;
    if (fileType.includes('video')) return <Video className="w-5 h-5" />;
    if (fileType.includes('text') || fileType.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
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
    file.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Private Storage</h1>
            <p className="text-gray-600 mt-2">Kelola file pribadi Anda</p>
          </div>
          <Button onClick={() => setShowUpload(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload File</h2>
                <Button variant="ghost" onClick={() => setShowUpload(false)}>×</Button>
              </div>
              <ImageKitUpload
                onUploadSuccess={handleUploadSuccess}
                folder={selectedFolder}
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
                placeholder="Cari file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
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
              <Folder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada file</h3>
              <p className="text-gray-500 mb-4">Upload file pertama Anda untuk memulai</p>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {filteredFiles.map((file) => (
              <Card key={file.id} className={viewMode === 'list' ? 'p-4' : ''}>
                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-0'}>
                  {viewMode === 'grid' ? (
                    <div className="space-y-3">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {file.file_type.includes('image') ? (
                          <IKImage
                            urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
                            path={file.imagekit_url}
                            transformation={[{ width: '200', height: '200', crop: 'maintain_ratio' }]}
                            className="w-full h-full object-cover"
                            alt={file.title || file.original_name}
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getFileIcon(file.file_type)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm truncate">{file.title || file.original_name}</h3>
                        {file.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{file.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.file_size)}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {file.file_type.split('/')[1]?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">
                          {getFileIcon(file.file_type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{file.title || file.original_name}</h3>
                          {file.description && (
                            <p className="text-sm text-gray-600">{file.description}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

export default StoragePrivate;
