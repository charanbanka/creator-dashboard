import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  CreditCard,
  BadgeDollarSign,
  TrendingUp,
} from "lucide-react";
import { CreditActivity } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ServiceRequest from "@/lib/service-request";
import { BASE_URL } from "@/common/config";
import constants from "@/common/const";

// Helper function to group credit activities by date
const groupCreditsByDate = (credits: CreditActivity[]) => {
  const grouped: { [date: string]: number } = {};

  credits.forEach((credit) => {
    const date = new Date(credit.createdAt).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + credit.amount;
  });

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, credits: value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Get last 7 days
};

const CreditsPage: React.FC = () => {
  const { authState } = useAuth();
  const [creditHistory, setCreditHistory] = useState<CreditActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = authState;

  // Calculate next milestone (for demo purposes)
  const currentCredits = user?.credits || 0;
  const nextMilestone = Math.ceil(currentCredits / 100) * 100;
  const progressToNextMilestone = (currentCredits % 100) / 100;

  async function fetchCreditLogs() {
    try {
      // Fetch credit logs from the backend
      const response = await ServiceRequest({
        url: `${BASE_URL}/credit-logs/user-credits`, // Replace with your actual API endpoint
        method: "GET",
      });

      if (response.data.status === "success") {
        // Transform the data
        const transformedData = response.data.data.map((log: any) => {
          let description = log.description;

          // Customize description based on action type
          switch (log.type) {
            case "daily_login":
              description = "Daily login bonus";
              break;
            case "profile_complete":
              description = "Profile Completed!";
              break;
            case "interaction":
              switch (log.action) {
                case "save":
                  description = "Saved a post";
                  break;
                case "unsave":
                  description = "Un Saved a post";
                  break;
                case "share":
                  description = "Shared a post";
                  break;
                case "report":
                  description = "Repoted a post";
                  break;
                default:
                  description = "a post";
                  break;
              }

              break;
            case "admin_adjustment":
              description = `Admin adjustment: ${
                log.action || "No details provided"
              }`;
              break;
            default:
              description = log.action || "Performed an action";
          }

          return {
            id: log._id, // Use the unique ID from the backend
            userId: log.userId,
            amount: log.credits,
            type: log.type,
            description,
            createdAt: log.createdAt,
          };
        });

        // Update the state with the transformed data
        setCreditHistory(transformedData);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch credit logs:", response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching credit logs:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      fetchCreditLogs();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const creditsEarnedToday = creditHistory
    .filter(
      (c) => new Date(c.createdAt).toDateString() === new Date().toDateString()
    )
    .reduce((sum, c) => sum + c.amount, 0);

  const creditsEarnedThisWeek = creditHistory
    .filter((c) => {
      const date = new Date(c.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    })
    .reduce((sum, c) => sum + c.amount, 0);

  // Group by type for distribution chart
  const creditsByType: { [key: string]: number } = {};
  creditHistory.forEach((c) => {
    creditsByType[c.type] = (creditsByType[c.type] || 0) + c.amount;
  });

  const distributionData = Object.entries(creditsByType).map(([t, amount]) => ({
    type: t
      .split("_")
      .map((word) => word[0].toUpperCase()) // Take the first letter of each word and capitalize it
      .join(""), // Join the letters together
    amount,
  }));

  // Group by date for timeline chart
  const timelineData = groupCreditsByDate(creditHistory);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Credits Dashboard</h1>
        </div>

        {/* Credit overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BadgeDollarSign className="mr-2 h-5 w-5" />
              Credit Overview
            </CardTitle>
            <CardDescription>
              Your current credit balance and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-5xl font-bold text-creator-primary">
                {currentCredits}
              </div>
              <div className="text-sm text-muted-foreground">Total Credits</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div>Progress to next milestone ({nextMilestone} credits)</div>
                <div>{Math.round(progressToNextMilestone * 100)}%</div>
              </div>
              <Progress value={progressToNextMilestone * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="creator-stat">
                <CreditCard className="h-8 w-8 text-creator-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Earned Today
                  </p>
                  <p className="text-2xl font-bold">+{creditsEarnedToday}</p>
                </div>
              </div>

              <div className="creator-stat">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    This Week
                  </p>
                  <p className="text-2xl font-bold">+{creditsEarnedThisWeek}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Recent Credits
              </CardTitle>
              <CardDescription>Credits earned in the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="credits" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Credit Sources
              </CardTitle>
              <CardDescription>Where your credits come from</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#A78BFA" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Credit history */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BadgeDollarSign className="mr-2 h-5 w-5" />
              Credit History
            </CardTitle>
            <CardDescription>
              Detailed log of all credit transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="py-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
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
            ) : creditHistory.length > 0 ? (
              <div className="space-y-1">
                {creditHistory.map((credit) => (
                  <div
                    key={credit.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-creator-primary/10 flex items-center justify-center">
                        <BadgeDollarSign className="h-5 w-5 text-creator-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{credit.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(credit.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold text-creator-primary">
                      {credit.amount <0 ? credit.amount : `+${credit.amount}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>No credit history found.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreditsPage;
