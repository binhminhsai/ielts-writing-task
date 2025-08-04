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
import { useAuth } from "@/components/contexts/AuthContext";
import {
  User,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập đúng định dạng email";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        toast({
          title: "✅ Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại với Writing AI-Hub",
          className: "border-green-200 bg-green-50 text-green-800",
        });
        setLocation("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-teal-700">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your Writing AI-Hub account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <User size={16} />
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
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`border-teal-200 focus:border-teal-500 pr-10 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
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
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {errors.general && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.general}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

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
                toast({
                  title: "Coming Soon",
                  description: "Google authentication will be available soon!",
                });
              }}
            >
              <FcGoogle size={20} />
              Continue with Google
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
