
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { AuthState, User } from '../types';

// Mock user data - This would come from a backend API in a real app
const MOCK_USERS: User[] = [
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
  }
];

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addCredits: (amount: number, reason: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check for stored user in localStorage on initial load
    const storedUser = localStorage.getItem('creator-dashboard-user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Add daily login credits if it's a new day
        const lastLogin = new Date(user.lastLogin);
        const today = new Date();
        if (lastLogin.toDateString() !== today.toDateString()) {
          addCredits(10, 'Daily login bonus');
        }
      } catch (error) {
        localStorage.removeItem('creator-dashboard-user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real app, this would be an API call
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (user) {
        // Update last login time
        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('creator-dashboard-user', JSON.stringify(updatedUser));
        
        setAuthState({
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        toast.success(`Welcome back, ${user.name}!`, {
          description: "You've earned 10 credits for logging in today."
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid email or password'
        });
        toast.error('Login failed', { description: 'Invalid email or password' });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'An error occurred during login'
      });
      toast.error('Login failed', { description: 'An unexpected error occurred' });
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Check if email already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      
      if (existingUser) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Email already registered'
        });
        toast.error('Registration failed', { description: 'Email already registered' });
        return;
      }
      
      // In a real app, this would create a user in the database
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        credits: 50, // Starting credits
        role: 'user',
        profileCompleted: false,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        savedPosts: []
      };
      
      localStorage.setItem('creator-dashboard-user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      toast.success('Welcome to Creator Dashboard!', {
        description: "You've received 50 starter credits."
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'An error occurred during registration'
      });
      toast.error('Registration failed', { description: 'An unexpected error occurred' });
    }
  };

  const logout = () => {
    localStorage.removeItem('creator-dashboard-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    toast.info('You have been logged out');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...userData };
    localStorage.setItem('creator-dashboard-user', JSON.stringify(updatedUser));
    
    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  };

  const addCredits = (amount: number, reason: string) => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      credits: authState.user.credits + amount
    };
    
    localStorage.setItem('creator-dashboard-user', JSON.stringify(updatedUser));
    
    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
    
    toast.success(`${amount} Credits Added!`, {
      description: reason
    });
  };  

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, updateUser, addCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
