import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  Activity,
  PieChart as PieChartIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { BASE_URL } from "@/common/config";
import ServiceRequest from "@/lib/service-request";

// Mock analytics data
const CREDITS_BY_DAY = [
  { name: "Mon", credits: 240 },
  { name: "Tue", credits: 300 },
  { name: "Wed", credits: 280 },
  { name: "Thu", credits: 200 },
  { name: "Fri", credits: 350 },
  { name: "Sat", credits: 250 },
  { name: "Sun", credits: 220 },
];

const USER_ACTIVITY = [
  { name: "Week 1", logins: 35, posts: 20 },
  { name: "Week 2", logins: 45, posts: 25 },
  { name: "Week 3", logins: 40, posts: 30 },
  { name: "Week 4", logins: 55, posts: 45 },
];

const FEED_SOURCES = [
  { name: "Twitter", value: 65 },
  { name: "Reddit", value: 35 },
];

const FEED_ACTIONS = [
  { name: "Viewed", value: 100 },
  { name: "Saved", value: 35 },
  { name: "Shared", value: 20 },
  { name: "Reported", value: 5 },
];

const COLORS = ["#8B5CF6", "#A78BFA", "#DDD6FE", "#F5F3FF"];

const AdminAnalyticsPage: React.FC = () => {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // State for analytics data
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [feedInteractions, setFeedInteractions] = useState(0);

  const [creditsByDay, setCreditsByDay] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [feedSources, setFeedSources] = useState([]);
  const [feedActions, setFeedActions] = useState([]);

  const { user } = authState;
  const isAdmin = user?.role === "admin";

  // Redirect if not admin
  if (!isAdmin) {
    toast.error("Access denied", {
      description: "You need admin privileges to access this page",
    });
    return <Navigate to="/dashboard" />;
  }

  const fetchCreditsByDay = async () => {
    const response = await ServiceRequest({
      url: `${BASE_URL}/analytics/credits-by-day`,
    });
    return response.data.data;
  };

  const fetchUserActivity = async () => {
    const response = await ServiceRequest({
      url: `${BASE_URL}/analytics/user-activity`,
    });
    return response.data.data;
  };

  const fetchFeedSources = async () => {
    const response = await ServiceRequest({
      url: `${BASE_URL}/analytics/feed-sources`,
    });
    return response.data.data;
  };

  const fetchFeedActions = async () => {
    const response = await ServiceRequest({
      url: `${BASE_URL}/analytics/feed-actions`,
    });
    return response.data.data;
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      const [creditsByDay, userActivity, feedSources, feedActions] =
        await Promise.all([
          fetchCreditsByDay(),
          fetchUserActivity(),
          fetchFeedSources(),
          fetchFeedActions(),
        ]);

      // Set detailed data
      setCreditsByDay(creditsByDay);
      setUserActivity(userActivity);
      setFeedSources(feedSources);
      setFeedActions(feedActions);

      // Calculate summary values
      calculateSummaryValues(creditsByDay, userActivity, feedActions);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary values
  const calculateSummaryValues = (creditsByDay, userActivity, feedActions) => {
    // Total Users (calculated from userActivity data)
    const totalUsers = userActivity.reduce((sum, week) => sum + week.logins, 0); // Sum of all logins across weeks
    setTotalUsers(totalUsers);

    // Active Today (logins for the current day)
   
    setActiveToday(creditsByDay?.length || 0);

    // Credits Earned (sum of all credits)
    const totalCredits = creditsByDay.reduce(
      (sum, day) => sum + day.credits,
      0
    );
    setCreditsEarned(totalCredits);

    // Feed Interactions (sum of all feed actions)
    const totalInteractions = feedActions.reduce(
      (sum, action) => sum + action.value,
      0
    );
    setFeedInteractions(totalInteractions);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : totalUsers}
                </h3>
              </div>
              <Users className="h-8 w-8 text-creator-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Today
                </p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : activeToday}
                </h3>
              </div>
              <Activity className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Credits Earned
                </p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : creditsEarned}
                </h3>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Feed Interactions
                </p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : feedInteractions}
                </h3>
              </div>
              <PieChartIcon className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Daily Credits
              </CardTitle>
              <CardDescription>Credits earned by day of week</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creditsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="credits" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                User Activity
              </CardTitle>
              <CardDescription>
                Logins and post interactions by week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="logins" stroke="#8B5CF6" />
                    <Line type="monotone" dataKey="posts" stroke="#A78BFA" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5" />
                Feed Sources
              </CardTitle>
              <CardDescription>
                Distribution of content by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feedSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {feedSources.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Feed Interactions
              </CardTitle>
              <CardDescription>
                How users interact with feed content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feedActions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {feedActions.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
