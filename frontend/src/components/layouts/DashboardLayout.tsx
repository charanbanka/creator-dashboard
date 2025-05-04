
import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  LogOut, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Rss,
  Save,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  const { user } = authState;
  const isAdmin = user?.role === 'admin';
  
  const mainNavItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      name: 'Feed', 
      path: '/feed', 
      icon: <Rss className="w-5 h-5" /> 
    },
    { 
      name: 'Saved Content', 
      path: '/saved', 
      icon: <Save className="w-5 h-5" /> 
    },
    { 
      name: 'Credits', 
      path: '/credits', 
      icon: <CreditCard className="w-5 h-5" /> 
    },
  ];
  
  const adminNavItems = [
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-creator-primary text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with logo */}
          <div className="p-5 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Creator Dashboard</span>
            </Link>
          </div>
          
          <Separator className="bg-creator-dark/20" />
          
          {/* User profile */}
          <div className="p-5">
            <div className="flex items-center space-x-3">
              <Avatar>
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} />
                ) : (
                  <AvatarFallback className="bg-creator-dark/40 text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-white/80">{user?.email || ''}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-1 text-sm">
              <CreditCard className="w-4 h-4" />
              <span>{user?.credits || 0} credits</span>
            </div>
          </div>
          
          <Separator className="bg-creator-dark/20" />
          
          {/* Navigation */}
          <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center py-2 px-4 rounded-md transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-creator-dark/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-creator-dark/10'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            
            {isAdmin && (
              <>
                <Separator className="bg-creator-dark/20 my-2" />
                <p className="px-4 text-xs font-semibold uppercase text-white/60 mb-2">Admin</p>
                
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center py-2 px-4 rounded-md transition-colors
                      ${location.pathname === item.path 
                        ? 'bg-creator-dark/20 text-white' 
                        : 'text-white/80 hover:text-white hover:bg-creator-dark/10'}
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>
          
          {/* Bottom actions */}
          <div className="p-5 space-y-2">
            <Link 
              to="/settings" 
              className="flex items-center py-2 px-4 rounded-md text-white/80 hover:text-white hover:bg-creator-dark/10 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="ml-3">Settings</span>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:text-white hover:bg-creator-dark/10"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
