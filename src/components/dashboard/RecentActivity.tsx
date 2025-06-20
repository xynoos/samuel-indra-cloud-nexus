
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'upload' | 'download' | 'share' | 'delete';
  description: string;
  timestamp: Date;
  fileType?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'upload': return 'bg-green-100 text-green-800';
      case 'download': return 'bg-blue-100 text-blue-800';
      case 'share': return 'bg-purple-100 text-purple-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'upload': return '↗️';
      case 'download': return '↙️';
      case 'share': return '🔗';
      case 'delete': return '🗑️';
      default: return '📄';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Belum ada aktivitas
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getActivityIcon(activity.type)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { 
                      addSuffix: true, 
                      locale: id 
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className={getActivityColor(activity.type)}>
                  {activity.type}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
