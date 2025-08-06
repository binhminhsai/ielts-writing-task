import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService } from "@/Service/AuthService";
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  name: string;
  userId?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = AuthService.getToken();
      if (token) {
        try {
          const profile = await AuthService.getProfile(token);
          setUser({
            email: profile.email,
            name: profile.username,
            userId: profile.userId,
            role: profile.role
          });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          AuthService.removeToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await AuthService.login(email, password);
      
      AuthService.storeToken(response.token);
      
      const profile = await AuthService.getProfile(response.token);
      
      setUser({
        email: profile.email,
        name: profile.username,
        userId: profile.userId,
        role: profile.role
      });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await AuthService.register(username, email, password);
      
      toast({
        title: "Registration Successful",
        description: response.message || "Account created successfully",
        variant: "default",
      });
      
      // Optionally auto-login after registration
      // return await login(email, password);
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.removeToken();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};  