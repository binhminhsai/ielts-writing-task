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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Mail,
  ArrowLeft,
  Send,
  Loader2,
  Shield,
  Lock,
  CheckCircle,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type Step = "email" | "verification" | "newPassword";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const CORRECT_OTP = "123456"; // Demo purposes

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clear verification code error when user types
  useEffect(() => {
    if (codeError && verificationCode.length > 0) {
      setCodeError("");
    }
  }, [verificationCode, codeError]);

  const handleSendVerificationCode = async () => {
    setEmailError("");
    setSuccessMessage("");

    if (!email) {
      setEmailError("Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Vui lòng nhập đúng định dạng email");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep("verification");
      setCountdown(60);
      toast({
        title: "✅ Mã xác thực đã được gửi",
        description: `Vui lòng kiểm tra email ${email} để lấy mã xác thực 6 số`,
        variant: "default",
        className: "border-green-200 bg-green-50 text-green-800",
      });
    } catch (error) {
      setEmailError("Có lỗi xảy ra khi gửi email. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length === 6) {
      setIsLoading(true);
      setCodeError("");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (verificationCode === CORRECT_OTP) {
        setCurrentStep("newPassword");
      } else {
        setCodeError("Mã xác thực không đúng. Vui lòng thử lại.");
        setVerificationCode("");
      }

      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordError("");

    if (!newPassword) {
      setPasswordError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "✅ Đặt lại mật khẩu thành công",
        description: "Bạn sẽ được chuyển hướng đến trang đăng nhập",
        variant: "default",
        className: "border-green-200 bg-green-50 text-green-800",
      });

      setTimeout(() => {
        setLocation("/login");
      }, 2000);
    } catch (error) {
      setPasswordError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setCountdown(60);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "✅ Đã gửi lại mã xác thực",
        description: `Mã xác thực mới đã được gửi đến ${email}`,
        variant: "default",
        className: "border-blue-200 bg-blue-50 text-blue-800",
      });
    } catch (error) {
      console.error("Error resending code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const isButtonDisabled = isLoading || countdown > 0;

  const renderEmailStep = () => (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-teal-700">
          Đặt lại mật khẩu
        </CardTitle>
        <CardDescription>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác thực
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={16} />
            Địa chỉ email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={email}
            onChange={handleEmailChange}
            className={`border-teal-200 focus:border-teal-500 ${
              emailError ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm mt-1">{successMessage}</p>
          )}
        </div>

        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendVerificationCode}
          disabled={isButtonDisabled}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {countdown > 0
            ? `Gửi mã xác thực (${countdown}s)`
            : isLoading
            ? "Đang gửi..."
            : "Gửi mã xác thực"}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <div>
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Đăng ký tại đây
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Link href="/login">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={16} />
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const renderVerificationStep = () => (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-teal-700 flex items-center justify-center gap-2">
          <Shield size={24} />
          Xác thực email
        </CardTitle>
        <CardDescription>
          Nhập mã xác thực 6 số đã được gửi đến
          <br />
          <span className="font-medium text-teal-600">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            value={verificationCode}
            onChange={setVerificationCode}
            maxLength={6}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {codeError && (
          <p className="text-red-500 text-sm text-center">{codeError}</p>
        )}

        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50"
          onClick={handleVerifyCode}
          disabled={verificationCode.length !== 6 || isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Shield size={16} />
          )}
          {isLoading ? "Đang xác thực..." : "Xác thực"}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <p className="mb-3">Không nhận được mã?</p>
          <div className="flex justify-center">
            <Button
              onClick={handleResendCode}
              variant="outline"
              disabled={countdown > 0 || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RotateCcw size={16} />
              )}
              {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại mã"}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={() => setCurrentStep("email")}
            variant="ghost"
            className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderNewPasswordStep = () => (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-teal-700 flex items-center justify-center gap-2">
          <Lock size={24} />
          Tạo mật khẩu mới
        </CardTitle>
        <CardDescription>
          Nhập mật khẩu mới cho tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-teal-200 focus:border-teal-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-teal-200 focus:border-teal-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}

        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle size={16} />
          )}
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {currentStep === "email" && renderEmailStep()}
        {currentStep === "verification" && renderVerificationStep()}
        {currentStep === "newPassword" && renderNewPasswordStep()}
      </div>
    </main>
  );
}
