import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Save,
  Share,
  AlertTriangle,
  ExternalLink,
  ThumbsUp,
} from "lucide-react";
import { Post } from "../types";
import ServiceRequest from "@/lib/service-request";
import { BASE_URL } from "@/common/config";
import constants from "@/common/const";

const SavedPage: React.FC = () => {
  const { authState, updateUser, fetchUserData } = useAuth();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = authState;

  const fetchSavedPosts = async () => {
    let resp = await ServiceRequest({ url: `${BASE_URL}/feed/saved-posts` });
    console.log("res", resp);
    setSavedPosts(resp.data.data);
  };

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      if (user && user.savedPosts) {
        fetchSavedPosts();
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleUnsavePost = async (post: Post) => {
    let body = {
      id: post._id,
    };
    let resp = await ServiceRequest({
      url: `${BASE_URL}/feed/unsave-post`,
      data: body,
      method: "POST",
    });
    if (resp.data.status == "success") {
      fetchUserData();
      fetchSavedPosts();
      toast.success("Post removed from saved collection", {
        description: "Thank you for helping keep our community safe",
      });
    }
  };

  const handleSharePost = async (post: Post) => {
    // In a real app, this would open a share dialog
    // For now, we'll just simulate copying to clipboard
    navigator.clipboard.writeText(
      `Check out this post by ${post.author}: ${post.content} ${post.url}`
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
    toast.success("Link copied to clipboard");
  };

  const handleReportPost = async (post: Post) => {
    let body = {
      id: post._id,
    };
    let resp = await ServiceRequest({
      url: `${BASE_URL}/feed/report-post`,
      data: body,
      method: "POST",
    });
    if (resp.data.status == "success") {
      fetchUserData();
      toast.success("Post reported", {
        description: "Thank you for helping keep our community safe",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Saved Content</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Save className="mr-2 h-5 w-5" />
              Your Saved Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              // Skeleton loading state
              Array(2)
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
                  </div>
                ))
            ) : savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <div key={post._id || post.id} className="feed-item">
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
                      variant="secondary"
                      size="sm"
                      className="bg-creator-primary/10 text-creator-primary"
                      onClick={() => handleUnsavePost(post)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Unsave
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
                      <AlertTriangle
                        className="h-4 w-4 mr-2 text-danger"
                        color={
                          post?.reportedBy.includes(user._id) ? "red" : "black"
                        }
                      />
                      {post?.reportedBy.includes(user._id)
                        ? "Reported"
                        : "Report"}
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
                  You haven't saved any posts yet. Browse the feed and save
                  posts to see them here.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SavedPage;
