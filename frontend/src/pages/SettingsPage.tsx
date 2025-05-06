import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ServiceRequest from "@/lib/service-request";
import { BASE_URL } from "@/common/config";
import constants from "@/common/const";

const SettingsPage: React.FC = () => {
  const { authState, updateUser, addCredits, fetchUserData } = useAuth();
  const { user } = authState;

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
  });

  console.log("console", user);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let resp = await ServiceRequest({
      url: `${BASE_URL}/user/update-profile`,
      data: profile,
      method: "POST",
    });
    if (resp.data.status === constants.SERVICE_SUCCESS) {
      fetchUserData();
      toast.success("Profile updated successfully");
    } else {
      toast.error(resp.data?.message || "Server Error")
    }
  };

  const handleNotificationsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences updated");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account profile information
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                <Avatar className="h-24 w-24">
                  {profile.profilePicture ? (
                    <AvatarImage src={profile.profilePicture} />
                  ) : (
                    <AvatarFallback className="bg-creator-primary text-white text-xl">
                      {profile.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-2 flex-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your profile and in comments
                  </p>
                  <Input
                    placeholder="Avatar URL (e.g., https://example.com/profilePicture.jpg)"
                    value={profile.profilePicture || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, profilePicture: e.target.value })
                    }
                    className="max-w-md"
                  />
                </div>
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit">Save Profile Changes</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Control how we contact you</CardDescription>
          </CardHeader>

          <form onSubmit={handleNotificationsUpdate}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts on your device
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Communications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive tips and special offers
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, marketing: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit">Save Notification Preferences</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Once you delete your account, all of your content and data will be
              permanently removed. This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() =>
                toast.error("This feature is not available in the demo")
              }
            >
              Delete Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
