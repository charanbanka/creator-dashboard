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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserType } from "../types";
import { User, BadgeDollarSign, Search } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ServiceRequest from "@/lib/service-request";
import { BASE_URL } from "@/common/config";

const AdminUsersPage: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = authState;
  const isAdmin = user?.role === "admin";

  // Redirect if not admin
  if (!isAdmin) {
    toast.error("Access denied", {
      description: "You need admin privileges to access this page",
    });
    return <Navigate to="/dashboard" />;
  }

  // Function to fetch all users
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await ServiceRequest({
        url: `${BASE_URL}/user/all?name=${searchTerm}`,
        method: "GET",
      });

      if (response.data.status === "success") {
        setUsers(response.data.data);
      } else {
        toast.error("Failed to fetch users", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, [searchTerm]);

  // Handle opening the dialog
  const handleManageClick = (user) => {
    setSelectedUser(user);
    setCredits(user.credits);
    setIsDialogOpen(true);
  };

  // Handle updating user credits
  const handleUpdateCredits = async () => {
    try {
      const response = await ServiceRequest({
        url: `${BASE_URL}/user/update-credits`,
        method: "PUT",
        data: {
          userId: selectedUser._id,
          credits,
        },
      });

      if (response.data.status === "success") {
        toast.success("User credits updated successfully");
        fetchAllUsers(); // Refresh the user list
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to update credits", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error updating credits:", error);
      toast.error("An error occurred while updating credits");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              All Users
            </CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>

            <div className="flex mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="py-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
            ) : users.length > 0 ? (
              <div className="space-y-1">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3 px-2 border-b last:border-0 hover:bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <BadgeDollarSign className="h-4 w-4 mr-1 text-creator-primary" />
                        <span>{user.credits}</span>
                      </div>
                      <div
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManageClick(user)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No users found matching your search criteria.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for managing user credits */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Update credits for <strong>{selectedUser?.name}</strong>
            </p>
            <Input
              type="number" // Change type to "text" to allow manual entry of negative numbers
              value={credits}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers and a single negative sign
                setCredits(Number(value)); // Convert the value to a number
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCredits}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
