
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserType } from '../types';
import { User, BadgeDollarSign, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

// Mock users - this would come from an API in a real app
const MOCK_USERS: UserType[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    credits: 150,
    role: 'user',
    profileCompleted: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    createdAt: '2023-01-15T09:24:00Z',
    savedPosts: ['post1', 'post3']
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    credits: 500,
    role: 'admin',
    profileCompleted: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    createdAt: '2023-01-10T10:24:00Z',
    savedPosts: []
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    credits: 75,
    role: 'user',
    profileCompleted: false,
    lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: '2023-02-20T14:30:00Z',
    savedPosts: ['post2']
  },
  {
    id: '4',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    credits: 220,
    role: 'user',
    profileCompleted: true,
    lastLogin: new Date(Date.now() - 86400000 * 5).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1527082395-e939b847da0d',
    createdAt: '2023-01-25T11:15:00Z',
    savedPosts: []
  },
];

const AdminUsersPage: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = authState;
  const isAdmin = user?.role === 'admin';
  
  // Redirect if not admin
  if (!isAdmin) {
    toast.error('Access denied', { description: 'You need admin privileges to access this page' });
    return <Navigate to="/dashboard" />;
  }
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setUsers(MOCK_USERS);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;
    
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              All Users
            </CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>
            
            <div className="flex mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="py-4 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px] mt-2" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-1">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between py-3 px-2 border-b last:border-0 hover:bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <BadgeDollarSign className="h-4 w-4 mr-1 text-creator-primary" />
                        <span>{user.credits}</span>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </div>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No users found matching your search criteria.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
