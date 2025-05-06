export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  credits: number;
  role: "user" | "admin";
  profileCompleted: boolean;
  lastLogin: string;
  avatar?: string;
  createdAt: string;
  savedPosts: string[];
}

export interface Post {
  id: string;
  _id?: string;
  source: "twitter" | "reddit";
  author: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  url: string;
  createdAt: string;
  saved?: boolean;
  reportedBy?: []
}

export interface CreditActivity {
  id: string;
  userId: string;
  amount: number;
  type: "login" | "profile" | "interaction" | "admin" | "other";
  description: string;
  createdAt: string;
}

export interface CreditStats {
  total: number;
  earned: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  history: CreditActivity[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
