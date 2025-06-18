
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  Home, 
  FolderOpen, 
  Users, 
  MessageCircle, 
  Bot, 
  RefreshCw,
  Settings,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/storage/private', icon: FolderOpen, label: 'My Storage' },
    { path: '/storage/shared', icon: Users, label: 'Shared' },
    { path: '/feed', icon: MessageCircle, label: 'Feed' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/converter', icon: RefreshCw, label: 'Converter' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SamuelIndraBastian Cloud
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome, {profile?.username || 'User'}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600"
            >
              <Settings className="w-4 h-4" />
            </Button>
            {profile && (
              <Link to={`/profile/${profile.username}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
