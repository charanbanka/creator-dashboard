import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Rss,
  Save,
  Share,
  AlertTriangle,
  ExternalLink,
  ThumbsUp,
} from "lucide-react";
import { Post } from "../types";
import ServiceRequest from "../lib/service-request";
import { BASE_URL } from "@/common/config";
import MOCK_TWITTER_DATA from "@/lib/twitter-mock";
import constants from "@/common/const";
// Mock posts that would come from API in a real application

const FeedPage: React.FC = () => {
  const { authState, addCredits, updateUser, fetchUserData } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "twitter" | "reddit"
  >("all");
  const [redditPosts, setRedditPosts] = useState<Post[]>([]);
  const [twitterPosts, setTwitterPosts] = useState<Post[]>([]);
  const { user } = authState;

  function transformRedditPosts(apiResponse) {
    if (!apiResponse?.data?.children) return [];

    return apiResponse.data.children.map((child, index) => {
      const post = child.data;

      return {
        id: post.id || `post-${index}`,
        source: "reddit",
        author: post.author ? `${post.author}` : "u/unknown",
        title: post.title || "",
        content: post.selftext || "",
        mediaUrl: "", // or extract from post.preview if available
        likes: post.ups || 0,
        comments: post.num_comments || 0,
        shares: Math.floor(Math.random() * 100), // Reddit doesn't provide "shares"
        url: post.url ? post.url : `https://reddit.com${post.permalink || ""}`,
        postCreatedAt: new Date(post.created_utc * 1000),
        createdAt: new Date(post.created_utc * 1000),
      };
    });
  }

  async function fetchPosts() {
    // Simulate fetching posts from an API
    let redditResponse = await fetch(
      "https://www.reddit.com/r/javascript/new.json"
    );
    redditResponse = await redditResponse.json();

    let redditData = transformRedditPosts(redditResponse);
    let twitterData = MOCK_TWITTER_DATA;

    // Combine redditData and twitterData
    let combinedData = [...redditData, ...twitterData];

    // Shuffle the combined data randomly
    combinedData = combinedData.sort(() => Math.random() - 0.5);

    // Ensure at least one or two records are swapped
    if (combinedData.length > 1) {
      const index1 = Math.floor(Math.random() * combinedData.length);
      const index2 = Math.floor(Math.random() * combinedData.length);

      // Swap two random records
      [combinedData[index1], combinedData[index2]] = [
        combinedData[index2],
        combinedData[index1],
      ];
    }

    // Update the state with the shuffled data
    setPosts(combinedData);
  }

  const fetchSavedPosts = async () => {
    fetchPosts();
    let resp = await ServiceRequest({ url: `${BASE_URL}/feed/saved-posts` });
    setIsLoading(false);
    console.log("res", resp);
  };

  console.log("redditPosts", redditPosts);

  useEffect(() => {
    // Simulate API loading

    const timer = setTimeout(() => {
      fetchSavedPosts();
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((post) => post.source === activeFilter);

  const handleSavePost = async (post: Post) => {
    // Update local state
    setPosts(
      posts.map((p) => (p.id === post.id ? { ...p, saved: !p.saved } : p))
    );

    // Update user's saved posts
    if (user) {
      //save post
      let body = {
        ...post,
        externalId: post.id,
        isNew: true,
        postCreatedAt: post.createdAt,
      };
      delete body.createdAt;

      let resp = await ServiceRequest({
        url: `${BASE_URL}/feed/save-post`,
        data: body,
        method: "POST",
      });
      console.log("resp=>", resp);
      fetchUserData();
      toast[post.saved ? "info" : "success"](
        post.saved
          ? "Post removed from saved collection"
          : "Post saved to your collection",
        { description: post.saved ? "" : "+2 credits earned" }
      );
    }
  };

  const handleSharePost = async (post: Post) => {
    // In a real app, this would open a share dialog
    // For now, we'll just simulate copying to clipboard
    navigator.clipboard.writeText(
      post.url
        ? post.url
        : `Check out this post by ${post.author}: ${post.content}`
    );
    let body = {
      ...post,
      externalId: post.id,
      isNew: true,
      postCreatedAt: post.createdAt,
    };
    delete body.createdAt;

    let resp = await ServiceRequest({
      url: `${BASE_URL}/feed/share-post`,
      data: body,
      method: "POST",
    });
    console.log("resp=>", resp);
    fetchUserData();
    toast.success("Link copied to clipboard", {
      description: "+3 credits earned for sharing content",
    });
  };

  const handleReportPost = async (post: Post) => {
    let body = {
      ...post,
      externalId: post.id,
      isNew: true,
      postCreatedAt: post.createdAt,
    };
    delete body.createdAt;

    let resp = await ServiceRequest({
      url: `${BASE_URL}/feed/report-post`,
      data: body,
      method: "POST",
    });
    console.log("resp=>", resp);
    toast.success("Post reported", {
      description: "Thank you for helping keep our community safe",
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
            <Tabs
              defaultValue="all"
              value={activeFilter}
              onValueChange={(value: string) => setActiveFilter(value as any)}
            >
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
              Array(4)
                .fill(0)
                .map((_, i) => (
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
              filteredPosts.map((post) => (
                <div key={post.id} className="feed-item">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        {post.source === "twitter" ? "T" : "R"}
                      </div>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {post.source === "twitter" ? "Twitter" : "Reddit"} •{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-muted">
                      {post.source}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p>{post.content}</p>

                    {post.mediaUrl && (
                      <div className="mt-3">
                        <img
                          src={post.mediaUrl}
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
                    <div>{post.comments} comments</div>
                    <div>{post.shares} shares</div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant={post.saved ? "secondary" : "outline"}
                      size="sm"
                      className={
                        post.saved
                          ? "bg-creator-primary/10 text-creator-primary"
                          : ""
                      }
                      onClick={() => handleSavePost(post)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {post.saved ? "Saved" : "Save"}
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
                      onClick={() => window.open(post.url, "_blank")}
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
