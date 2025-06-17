
import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Link as LinkIcon, Users, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Profile = () => {
  const { username } = useParams();

  // Mock user data
  const user = {
    id: '1',
    username: username,
    fullName: 'Samuel Indra Bastian',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Full-stack developer passionate about cloud technology and AI. Creator of SamuelIndraBastian Cloud Storage.',
    website: 'https://samuelindrabastian.dev',
    location: 'Jakarta, Indonesia',
    joinDate: 'March 2024',
    following: 234,
    followers: 1520,
    postsCount: 89,
    filesShared: 156
  };

  const userPosts = [
    {
      id: '1',
      type: 'image',
      content: 'Just finished building a new cloud storage feature! 🚀',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      likes: 45,
      comments: 12,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'text',
      content: 'Working on some exciting AI integrations. The future of cloud storage is here! #AI #CloudStorage #Innovation',
      likes: 78,
      comments: 23,
      timestamp: '1 day ago'
    },
    {
      id: '3',
      type: 'file',
      content: 'Shared a new PDF guide about cloud security best practices',
      fileName: 'cloud-security-guide.pdf',
      fileSize: '2.4 MB',
      likes: 34,
      comments: 8,
      timestamp: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-3xl">{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">{user.fullName}</h1>
                    <p className="text-lg text-gray-600">@{user.username}</p>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Follow
                    </Button>
                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                      Message
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{user.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={user.website} className="text-blue-600 hover:underline">
                      {user.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
                
                <div className="flex space-x-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-800">{user.following}</span>
                    <span className="text-gray-600 ml-1">Following</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{user.followers}</span>
                    <span className="text-gray-600 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{user.postsCount}</span>
                    <span className="text-gray-600 ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{user.filesShared}</span>
                    <span className="text-gray-600 ml-1">Files Shared</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {userPosts.map((post) => (
            <Card key={post.id} className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
                      <span className="text-gray-500">@{user.username}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{post.timestamp}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    
                    {post.type === 'image' && post.image && (
                      <div className="mb-4">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="rounded-lg max-h-96 w-full object-cover"
                        />
                      </div>
                    )}
                    
                    {post.type === 'file' && (
                      <div className="mb-4 p-4 bg-white/50 rounded-lg border border-white/30">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-red-600" />
                          <div>
                            <p className="font-medium text-gray-800">{post.fileName}</p>
                            <p className="text-sm text-gray-500">{post.fileSize}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                        <span>💬</span>
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                        <span>🔄</span>
                        <span>Share</span>
                      </button>
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

export default Profile;
