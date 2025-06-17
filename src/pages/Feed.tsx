
import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share, 
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Plus,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';

const Feed = () => {
  const [newPost, setNewPost] = useState('');

  // Mock data for feed posts
  const posts = [
    {
      id: 1,
      user: { name: 'John Doe', username: 'johndoe', avatar: '', initials: 'JD' },
      content: 'Baru saja menyelesaikan project AI terbaru! Sangat excited dengan hasilnya. Ada yang mau collaborate untuk project selanjutnya?',
      image: null,
      timestamp: '2 jam lalu',
      likes: 24,
      comments: 8,
      shares: 3,
      liked: false
    },
    {
      id: 2,
      user: { name: 'Jane Smith', username: 'janesmith', avatar: '', initials: 'JS' },
      content: 'Sharing beberapa tips untuk mengoptimalkan storage di cloud. Jangan lupa untuk regularly clean up file yang tidak terpakai!',
      image: '/api/placeholder/500/300',
      timestamp: '4 jam lalu',
      likes: 45,
      comments: 12,
      shares: 7,
      liked: true
    },
    {
      id: 3,
      user: { name: 'Mike Johnson', username: 'mikej', avatar: '', initials: 'MJ' },
      content: 'Demo video untuk fitur baru AI Assistant sudah ready! Check it out dan kasih feedback ya teman-teman 🚀',
      image: null,
      video: true,
      timestamp: '6 jam lalu',
      likes: 67,
      comments: 23,
      shares: 15,
      liked: false
    },
    {
      id: 4,
      user: { name: 'Sarah Wilson', username: 'sarahw', avatar: '', initials: 'SW' },
      content: 'Berhasil migrate semua data ke SamuelIndraBastian Cloud Storage! Performance nya amazing dan UI/UX nya sangat user-friendly. Highly recommended! 💯',
      image: null,
      timestamp: '8 jam lalu',
      likes: 89,
      comments: 34,
      shares: 22,
      liked: true
    }
  ];

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    // TODO: Implement post creation logic
    console.log('Creating post:', newPost);
    setNewPost('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Feed</h1>
          <p className="text-gray-600">Berbagi dan berinteraksi dengan komunitas</p>
        </div>

        {/* Create Post */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  SI
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="Apa yang ingin Anda bagikan hari ini?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] bg-white/50 border-white/20 resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Foto
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                      <p className="text-sm text-gray-500">@{post.user.username} • {post.timestamp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                {post.video && (
                  <div className="mb-4 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Video Content</p>
                    </div>
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-2 ${
                        post.liked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                      <Share className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
