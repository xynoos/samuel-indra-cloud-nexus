
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { IKImage } from 'imagekitio-react';
import { IMAGEKIT_CONFIG } from '@/lib/config';

interface Post {
  id: string;
  content?: string;
  media_urls?: string[];
  media_type?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare 
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(post.id);
    }
    
    if (!liked) {
      toast({
        title: "Liked!",
        description: "Post telah disukai",
      });
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    }
    
    // Copy link to clipboard
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    
    toast({
      title: "Link disalin!",
      description: "Link post telah disalin ke clipboard",
    });
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Dibatalkan" : "Disimpan!",
      description: bookmarked ? "Post dihapus dari bookmark" : "Post disimpan ke bookmark",
    });
  };

  const renderMedia = () => {
    if (!post.media_urls || post.media_urls.length === 0) return null;

    return (
      <div className="mt-4">
        {post.media_type?.includes('image') ? (
          <div className={`grid gap-2 ${
            post.media_urls.length === 1 ? 'grid-cols-1' :
            post.media_urls.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          }`}>
            {post.media_urls.map((url, index) => (
              <div 
                key={index} 
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  post.media_urls!.length === 3 && index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <IKImage
                  urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
                  path={url}
                  transformation={[{ 
                    width: '600', 
                    height: '600', 
                    crop: 'maintain_ratio' 
                  }]}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => window.open(url, '_blank')}
                />
              </div>
            ))}
          </div>
        ) : post.media_type?.includes('video') ? (
          <div className="mt-4 rounded-lg overflow-hidden">
            <video 
              controls 
              className="w-full max-h-96 bg-black"
              poster={post.media_urls[0]?.replace('.mp4', '_thumbnail.jpg')}
            >
              <source src={post.media_urls[0]} type="video/mp4" />
              Browser Anda tidak mendukung video.
            </video>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback>
                {post.profiles?.username?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm cursor-pointer hover:underline">
                {post.profiles?.full_name || post.profiles?.username}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>@{post.profiles?.username}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: id 
                  })}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        {post.content && (
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        )}

        {/* Media */}
        {renderMedia()}

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes_count + (liked ? 1 : 0)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments_count}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`${
              bookmarked ? 'text-blue-500' : 'text-gray-500'
            } hover:text-blue-500`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
