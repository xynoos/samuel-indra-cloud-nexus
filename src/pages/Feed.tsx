
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Hash, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreatePost } from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const mockPosts = [
    {
      id: '1',
      content: 'Selamat pagi semua! 🌅 Hari ini adalah hari yang indah untuk berbagi dan belajar bersama. Mari kita dukung satu sama lain dalam perjalanan ini! #MorningMotivation #Community',
      media_urls: [],
      media_type: null,
      likes_count: 24,
      comments_count: 8,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_id: '1',
      profiles: {
        username: 'samuelindra',
        full_name: 'Samuel Indra Bastian',
        avatar_url: null
      }
    },
    {
      id: '2',
      content: 'Baru saja selesai upload project terbaru ke cloud storage! 🚀 Fitur AI Assistant-nya benar-benar membantu produktivitas. Terima kasih untuk platform yang luar biasa ini!',
      media_urls: ['sample-image-1.jpg'],
      media_type: 'image/jpeg',
      likes_count: 42,
      comments_count: 15,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user_id: '2',
      profiles: {
        username: 'techuser',
        full_name: 'Tech Enthusiast',
        avatar_url: null
      }
    },
    {
      id: '3',
      content: 'Tips hari ini: Gunakan fitur converter untuk mengoptimalkan file Anda sebelum upload. File yang lebih kecil = upload lebih cepat! 💡 #TechTips #Productivity',
      media_urls: [],
      media_type: null,
      likes_count: 18,
      comments_count: 5,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user_id: '3',
      profiles: {
        username: 'productivityguru',
        full_name: 'Productivity Guru',
        avatar_url: null
      }
    }
  ];

  const trendingTopics = [
    { tag: '#CloudStorage', count: 245 },
    { tag: '#AIAssistant', count: 189 },
    { tag: '#TechInnovation', count: 156 },
    { tag: '#Productivity', count: 134 },
    { tag: '#FileConverter', count: 98 }
  ];

  const suggestedUsers = [
    { username: 'cloudexpert', name: 'Cloud Expert', followers: '2.3K' },
    { username: 'airesearcher', name: 'AI Researcher', followers: '1.8K' },
    { username: 'techreview', name: 'Tech Review', followers: '5.2K' }
  ];

  useEffect(() => {
    loadPosts();
  }, [activeFilter]);

  const loadPosts = async () => {
    try {
      // In real app, load from Supabase
      // const { data, error } = await supabase
      //   .from('posts')
      //   .select(`
      //     *,
      //     profiles:user_id (
      //       username,
      //       full_name,
      //       avatar_url
      //     )
      //   `)
      //   .order('created_at', { ascending: false });

      // For demo, use mock data
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLike = async (postId: string) => {
    // Update local state
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count + 1 }
        : post
    ));

    // In real app, update in Supabase
    // await supabase.from('likes').insert({ post_id: postId, user_id: user?.id });
  };

  const handleComment = (postId: string) => {
    // Navigate to post detail with comment focus
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'following') {
      // In real app, filter by followed users
      return true;
    }
    
    if (searchTerm) {
      return post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             post.profiles?.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

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
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-2xl space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Feed</h1>
              <p className="text-gray-600">Bagikan dan temukan konten menarik dari komunitas</p>
            </div>

            {/* Create Post */}
            {user && (
              <CreatePost onPostCreated={handlePostCreated} />
            )}

            {/* Filter Tabs */}
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Semua Post</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              {/* Search */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari post atau pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Posts */}
              <TabsContent value={activeFilter} className="space-y-6 mt-6">
                {filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Belum ada post
                      </h3>
                      <p className="text-gray-500">
                        Jadilah yang pertama membagikan sesuatu yang menarik!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span>Trending Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div>
                      <p className="font-medium text-blue-600">{topic.tag}</p>
                      <p className="text-xs text-gray-500">{topic.count} posts</p>
                    </div>
                    <Hash className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Suggested Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((suggestedUser, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{suggestedUser.name}</p>
                        <p className="text-xs text-gray-500">@{suggestedUser.username}</p>
                        <p className="text-xs text-gray-400">{suggestedUser.followers} followers</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Posts created</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Likes received</span>
                  <Badge variant="secondary">89</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Comments made</span>
                  <Badge variant="secondary">34</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Following</span>
                  <Badge variant="secondary">156</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
