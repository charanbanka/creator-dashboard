import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeDollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
} from "lucide-react";
import moment from "moment"; // Install moment.js for date formatting
import ServiceRequest from "@/lib/service-request";
import { BASE_URL } from "@/common/config";
import constants from "@/common/const";

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;

  const [recentActivity, setRecentActivity] = useState([]);

  // Mock recent activity data - would come from API in real app
  useEffect(() => {
    fetchUserActivity();
  }, []);

  async function fetchUserActivity() {
    try {
      // Fetch activities from the backend
      const resp = await ServiceRequest({
        url: `${BASE_URL}/activities/user-activities`,
        method: "GET",
      });

      if (resp.data.status === "success") {
        // Transform the data
        const transformedData = resp.data.data.map((activity: any) => {
          let description = "";
          let amount = null;

          // Determine the description and amount based on the action type
          switch (activity.action) {
            case "daily_login":
              description = "Daily login bonus";
              amount = 10; // Example value, adjust as needed
              break;
            case "profile_completion":
              description = "Profile completion bonus";
              amount = 25; // Example value, adjust as needed
              break;
            case "save":
              description = `Saved post "${activity.metadata.postTitle}"`;
              break;
            case "unsave":
              description = `Removed post from collection`;
              break;
            case "share":
              description = `Shared a ${activity.metadata.postSource} post`;
              break;
            case "report":
              description = `Reported a post`;
              break;
            default:
              description = "Performed an action";
          }

          // Format the date using moment.js
          const date = moment(activity.createdAt).fromNow();

          return {
            id: activity._id, // Use the activity's unique ID
            type: activity.action,
            amount,
            description,
            date,
          };
        });

        // Update the state with the transformed data
        setRecentActivity(transformedData);
      } else {
        console.error("Failed to fetch activities:", resp.data.message);
      }
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  }

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
                <p className="text-sm font-medium text-muted-foreground">
                  Total Credits
                </p>
                <h3 className="text-2xl font-bold">{user?.credits || 0}</h3>
              </div>
              <BadgeDollarSign className="h-8 w-8 text-creator-primary" />
            </CardContent>
          </Card>

          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Daily Login
                </p>
                <h3 className="text-2xl font-bold">
                  +10{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / day
                  </span>
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>

          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Profile Completion
                </p>
                <h3 className="text-2xl font-bold">
                  {user?.profileCompleted ? "100%" : user?.name ? "50%" : "25%"}
                </h3>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>

          <Card className="creator-stat hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Next Milestone
                </p>
                <h3 className="text-2xl font-bold">
                  {Math.floor((user?.credits || 0) / 100) * 100 + 100} Credits
                </h3>
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
                    {activity.type === "credit" ? (
                      <div className="h-10 w-10 rounded-full bg-creator-primary/10 flex items-center justify-center">
                        <BadgeDollarSign className="h-5 w-5 text-creator-primary" />
                      </div>
                    ) : activity.type === "save" ? (
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
                        <span className="text-creator-primary">
                          {" "}
                          +{activity.amount} credits
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
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
