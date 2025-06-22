
import React, { useState } from 'react';
import { Image, Video, Smile, Send, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ImageKitUpload } from '@/components/common/ImageKitUpload';
import { supabase } from '@/integrations/supabase/client';

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [posting, setPosting] = useState(false);

  const handleMediaUpload = (file: any) => {
    setMediaFiles(prev => [...prev, file]);
    setShowMediaUpload(false);
    
    toast({
      title: "Media berhasil diupload!",
      description: "File siap untuk dipost",
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        title: "Post kosong",
        description: "Tulis sesuatu atau tambahkan media",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk membuat post",
        variant: "destructive",
      });
      return;
    }

    setPosting(true);

    try {
      const postData = {
        content: content.trim() || null,
        media_urls: mediaFiles.map(file => file.imagekit_url || file.url),
        media_type: mediaFiles.length > 0 ? mediaFiles[0].fileType : null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select(`
          *,
          profiles!posts_user_id_profiles_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      const newPost = {
        ...data,
        likes_count: 0,
        comments_count: 0,
        profiles: {
          username: user.user_metadata?.username || 'user',
          full_name: user.user_metadata?.full_name || 'User',
          avatar_url: user.user_metadata?.avatar_url
        }
      };

      if (onPostCreated) {
        onPostCreated(newPost);
      }

      setContent('');
      setMediaFiles([]);
      
      toast({
        title: "Post berhasil!",
        description: "Post Anda telah dipublikasikan",
      });

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Gagal memposting",
        description: "Terjadi kesalahan saat membuat post",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Apa yang sedang Anda pikirkan?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-none p-0 text-lg placeholder:text-gray-400 focus-visible:ring-0"
            />

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative">
                    {file.fileType?.includes('image') ? (
                      <img 
                        src={file.imagekit_url || file.url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Image failed to load:', file);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 w-6 h-6 p-0"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {showMediaUpload && (
              <div className="border rounded-lg p-4">
                <ImageKitUpload
                  onUploadSuccess={handleMediaUpload}
                  folder="/posts"
                  accept="image/*,video/*"
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowMediaUpload(false)}
                  className="mt-2"
                >
                  Batal
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMediaUpload(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Image className="w-4 h-4 mr-1" />
                  Foto
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMediaUpload(true)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Video className="w-4 h-4 mr-1" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Smile className="w-4 h-4 mr-1" />
                  Emoji
                </Button>
              </div>
              
              <Button
                onClick={handlePost}
                disabled={posting || (!content.trim() && mediaFiles.length === 0)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {posting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
