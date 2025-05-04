
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Rss, Save, Share, AlertTriangle, ExternalLink, ThumbsUp } from 'lucide-react';
import { Post } from '../types';

// Mock posts that would come from API in a real application
const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    source: 'twitter',
    author: 'TechGuru',
    content: 'Just launched our new AI tool that helps content creators generate ideas! Check it out #ContentCreation #AI',
    likes: 125,
    comments: 42,
    shares: 23,
    url: 'https://twitter.com',
    createdAt: '2023-05-01T12:34:56Z',
  },
  {
    id: 'post2',
    source: 'twitter',
    author: 'DigitalNomad',
    content: 'Working from a beach in Bali today! The creator lifestyle is all about freedom and flexibility.',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
    likes: 348,
    comments: 89,
    shares: 54,
    url: 'https://twitter.com',
    createdAt: '2023-05-02T09:12:45Z',
  },
  {
    id: 'post3',
    source: 'reddit',
    author: 'u/creativegenius',
    content: "I've been consistently posting content for 30 days straight and my engagement has increased by 400%. Consistency is truly key!",
    likes: 512,
    comments: 78,
    shares: 23,
    url: 'https://reddit.com',
    createdAt: '2023-05-01T18:22:10Z',
  },
  {
    id: 'post4',
    source: 'reddit',
    author: 'u/videowizard',
    content: "What editing software do you all recommend for YouTube videos? I'm currently using Premiere but looking for alternatives.",
    likes: 89,
    comments: 112,
    shares: 5,
    url: 'https://reddit.com',
    createdAt: '2023-05-03T14:11:22Z',
  },
  {
    id: 'post5',
    source: 'twitter',
    author: 'ContentStrategy',
    content: 'New study shows that short-form video content is generating 30% more engagement than long-form across all platforms. Time to adapt your strategy!',
    likes: 276,
    comments: 45,
    shares: 132,
    url: 'https://twitter.com',
    createdAt: '2023-05-03T11:09:18Z',
  },
  {
    id: 'post6',
    source: 'reddit',
    author: 'u/marketing_master',
    content: 'Just hit 100K subscribers on my YouTube channel focusing on digital marketing tips. AMA about growing your audience!',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    likes: 1024,
    comments: 341,
    shares: 89,
    url: 'https://reddit.com',
    createdAt: '2023-05-02T20:45:33Z',
  },
];

const FeedPage: React.FC = () => {
  const { authState, addCredits, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'twitter' | 'reddit'>('all');
  const { user } = authState;
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      const savedPostIds = user?.savedPosts || [];
      const postsWithSavedState = MOCK_POSTS.map(post => ({
        ...post,
        saved: savedPostIds.includes(post.id)
      }));
      
      setPosts(postsWithSavedState);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.source === activeFilter);
    
  const handleSavePost = (post: Post) => {
    // Update local state
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, saved: !p.saved } : p
    ));
    
    // Update user's saved posts
    if (user) {
      const currentSavedPosts = user.savedPosts || [];
      const updatedSavedPosts = post.saved
        ? currentSavedPosts.filter(id => id !== post.id)
        : [...currentSavedPosts, post.id];
      
      updateUser({ savedPosts: updatedSavedPosts });
      
      // If this is a new save (not unsave), award credits
      if (!post.saved) {
        addCredits(2, 'Saved content to your collection');
      }
      
      toast[post.saved ? 'info' : 'success'](
        post.saved ? 'Post removed from saved collection' : 'Post saved to your collection',
        { description: post.saved ? '' : '+2 credits earned' }
      );
    }
  };
  
  const handleSharePost = (post: Post) => {
    // In a real app, this would open a share dialog
    // For now, we'll just simulate copying to clipboard
    navigator.clipboard.writeText(`Check out this post by ${post.author}: ${post.content} ${post.url}`);
    
    toast.success('Link copied to clipboard', {
      description: '+3 credits earned for sharing content'
    });
    
    addCredits(3, 'Shared content from feed');
  };
  
  const handleReportPost = (post: Post) => {
    toast.success('Post reported', {
      description: 'Thank you for helping keep our community safe'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Content Feed</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rss className="mr-2 h-5 w-5" />
              Latest Content
            </CardTitle>
            <Tabs defaultValue="all" value={activeFilter} onValueChange={(value: string) => setActiveFilter(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Sources</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                <TabsTrigger value="reddit">Reddit</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              // Skeleton loading state
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="feed-item-loading space-y-3">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full rounded-md" />
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post.id} className="feed-item">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        {post.source === 'twitter' ? 'T' : 'R'}
                      </div>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {post.source === 'twitter' ? 'Twitter' : 'Reddit'} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-muted">
                      {post.source}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p>{post.content}</p>
                    
                    {post.imageUrl && (
                      <div className="mt-3">
                        <img 
                          src={post.imageUrl} 
                          alt="Post content" 
                          className="w-full h-64 object-cover rounded-md" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </div>
                    <div>
                      {post.comments} comments
                    </div>
                    <div>
                      {post.shares} shares
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      variant={post.saved ? "secondary" : "outline"}
                      size="sm"
                      className={post.saved ? "bg-creator-primary/10 text-creator-primary" : ""}
                      onClick={() => handleSavePost(post)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {post.saved ? 'Saved' : 'Save'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSharePost(post)}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleReportPost(post)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-auto"
                      onClick={() => window.open(post.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Alert>
                <AlertDescription>
                  No posts found for the selected filter. Try another source.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FeedPage;
