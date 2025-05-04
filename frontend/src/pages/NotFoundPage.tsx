
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const NotFoundPage: React.FC = () => {
  const { authState } = useAuth();
  const defaultPath = authState.isAuthenticated ? '/dashboard' : '/auth';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-5">
        <h1 className="text-6xl font-bold text-creator-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div>
          <Button asChild className="bg-creator-primary hover:bg-creator-dark">
            <Link to={defaultPath}>
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
