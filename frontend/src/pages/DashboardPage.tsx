
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, TrendingUp, TrendingDown, Calendar, User } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;
  
  // Mock recent activity data - would come from API in real app
  const recentActivity = [
    { id: 1, type: 'credit', amount: 10, description: 'Daily login bonus', date: '2 hours ago' },
    { id: 2, type: 'save', description: 'Saved post "10 Tips for Content Creators"', date: 'Yesterday' },
    { id: 3, type: 'interaction', description: 'Shared a Twitter post', date: '3 days ago' },
    { id: 4, type: 'credit', amount: 25, description: 'Profile completion bonus', date: '1 week ago' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <span className="text-sm text-muted-foreground">
            Welcome back, {user?.name}
          </span>
        </div>
        
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                <h3 className="text-2xl font-bold">{user?.credits || 0}</h3>
              </div>
              <BadgeDollarSign className="h-8 w-8 text-creator-primary" />
            </CardContent>
          </Card>
          
          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Login</p>
                <h3 className="text-2xl font-bold">+10 <span className="text-sm font-normal text-muted-foreground">/ day</span></h3>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>
          
          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Completion</p>
                <h3 className="text-2xl font-bold">{user?.profileCompleted ? '100%' : '50%'}</h3>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Milestone</p>
                <h3 className="text-2xl font-bold">200 Credits</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="mr-4">
                    {activity.type === 'credit' ? (
                      <div className="h-10 w-10 rounded-full bg-creator-primary/10 flex items-center justify-center">
                        <BadgeDollarSign className="h-5 w-5 text-creator-primary" />
                      </div>
                    ) : activity.type === 'save' ? (
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.description}
                      {activity.amount && (
                        <span className="text-creator-primary"> +{activity.amount} credits</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
