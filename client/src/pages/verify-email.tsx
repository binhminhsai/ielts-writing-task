import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, RotateCcw, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const CORRECT_OTP = "123456"; // Sample data as requested

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && verificationCode.length > 0) {
      setError("");
    }
  }, [verificationCode, error]);

  const handleVerify = async () => {
    if (verificationCode.length === 6) {
      setIsVerifying(true);
      setError("");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (verificationCode === CORRECT_OTP) {
        // Success case
        toast({
          title: "✅ Email Verified Successfully!",
          description:
            "Welcome! Your account has been activated. Redirecting to homepage...",
          variant: "default",
          className: "border-green-200 bg-green-50 text-green-800",
        });

        // Show success for 1 second then redirect
        setTimeout(() => {
          setLocation("/login");
        }, 1000);
      } else {
        // Error case
        setError("Invalid verification code. Please try again.");
        setVerificationCode(""); // Clear the input
      }

      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setCountdown(60); // 60 seconds countdown

    try {
      // Handle resend logic here
      console.log("Resending verification code");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to resend code:", error);
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = verificationCode.length === 6;
  const canResend = countdown === 0 && !isResending;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-teal-700">
              Verify Your Email
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to your email address.
              Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={(value) => setVerificationCode(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <Button
                onClick={handleVerify}
                disabled={!isCodeComplete || isVerifying}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-200 disabled:!text-teal-500"
              >
                {isVerifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 ${
                  !canResend
                    ? "opacity-80 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <RotateCcw
                  size={14}
                  className={isResending ? "animate-spin" : ""}
                />
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </div>

            <div className="pt-4 border-t">
              <Link href="/register">
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={16} />
                  Back to Registration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
