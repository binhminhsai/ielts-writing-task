import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Mail, UserPlus, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/components/contexts/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Please enter a password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: "" }));

    try {
      const success = await register(
        formData.username,
        formData.email,
        formData.password
      );

      if (success) {
        setLocation("/verify-email");
      }
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: "Registration failed. Please try again." 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-teal-700">
              Create Account
            </CardTitle>
            <CardDescription>
              Join Writing AI-Hub and start your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.general && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.general}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User size={16} />
                Full Name
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`border-teal-200 focus:border-teal-500 ${
                  errors.username ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`border-teal-200 focus:border-teal-500 ${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock size={16} />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`border-teal-200 focus:border-teal-500 pr-10 ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock size={16} />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`border-teal-200 focus:border-teal-500 pr-10 ${
                    errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              onClick={handleCreateAccount}
              className="w-full bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              onClick={() => {
                // Handle Google OAuth registration here
                console.log("Google registration clicked");
              }}
            >
              <FcGoogle size={20} />
              Continue with Google
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
