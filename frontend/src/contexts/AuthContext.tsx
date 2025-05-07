import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { AuthState, User } from "../types";
import ServiceRequest from "../lib/service-request";
import { BASE_URL } from "../common/config";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addCredits: (amount: number, reason: string) => void;
  fetchUserData: () => Promise<void>;
  updateAuthStateError: (error: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const fetchUserData = async (): Promise<void> => {
    let resp = await ServiceRequest({
      url: `${BASE_URL}/user/fetch`,
    });
    let user = resp.data.data;
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  useEffect(() => {
    // Check for stored user in localStorage on initial load
    const token = localStorage.getItem("token");

    if (token) {
      try {
        fetchUserData();
      } catch (error) {
        localStorage.removeItem("token");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create request body
      const requestBody = {
        email,
        password,
      };

      // Call the backend API for registration
      const response = await ServiceRequest({
        url: BASE_URL + "/auth/login", // Replace with your actual API endpoint
        method: "POST",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response indicates success
      if (response.data.status === "success") {
        let data = response.data.data;
        // Save user data to localStorage
        localStorage.setItem("token", data.token);

        //fetch another api for user data
        // Update auth state
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Show success toast
        toast.success("Welcome to Creator Dashboard!", {
          description: data?.hasLoggedInToday
            ? "You've received 10 credits for daily login bonus."
            : null,
        });
      } else {
        // Handle backend error response
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: response.data.message || "Login failed",
        });
        toast.error("Login failed", {
          description: response.data.message || "An unexpected error occurred",
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "An error occurred during login",
      });
      toast.error("Login failed", {
        description: "An unexpected error occurred",
      });
    }
  };
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create request body
      const requestBody = {
        name,
        email,
        password,
      };

      // Call the backend API for registration
      const response = await ServiceRequest({
        url: BASE_URL + "/auth/register", // Replace with your actual API endpoint
        method: "POST",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response indicates success
      if (response.data.status === "success") {
        // Save user data to localStorage
        console.log("db", response.data);
        localStorage.setItem("token", response.data.data.token);

        //fetch another api for user data
        // Update auth state
        setAuthState({
          user: response.data.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Show success toast
        toast.success("Welcome to Creator Dashboard!", {
          description: response.data?.data?.hasLoggedInToday
            ? "You've received 60 credits for register and daily login bonus."
            : null,
        });
      } else {
        // Handle backend error response
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: response.data.message || "Registration failed",
        });
        toast.error("Registration failed", {
          description: response.data.message || "An unexpected error occurred",
        });
      }
    } catch (error: any) {
      // Handle unexpected errors
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error.response?.data?.message || error.message || "An error occurred",
      });
      toast.error("Registration failed", {
        description:
          error.response?.data?.message || "An unexpected error occurred",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    toast.info("You have been logged out");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };
    // localStorage.setItem("creator-dashboard-user", JSON.stringify(updatedUser));

    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const addCredits = (amount: number, reason: string) => {
    if (!authState.user) return;

    toast.success(`${amount} Credits Added!`, {
      description: reason,
    });
  };

  const updateAuthStateError = (error = null) => {
    setAuthState((prev) => {
      return { ...prev, error: error };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateUser,
        addCredits,
        fetchUserData,
        updateAuthStateError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
