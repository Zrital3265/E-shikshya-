import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import {
  useSendPasswordResetMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const [sendPasswordReset, { isLoading: isSending }] = useSendPasswordResetMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation(); // New API call for OTP verification
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const response = await sendPasswordReset({ email }).unwrap();
      toast.success(response?.message || "Reset code sent to your email.");
      setStep(2); // Move to OTP step
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const response = await verifyOtp({ email, resetCode: otp }).unwrap();
      toast.success(response?.message || "OTP Verified!");
      setStep(3); // Move to password reset step
    } catch (error) {
      toast.error(error?.data?.message || "Invalid OTP. Try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Please enter valid 6 character long password.");
      return;
    }

    try {
      const response = await resetPassword({ email, resetCode: otp, newPassword }).unwrap();
      toast.success(response?.message || "Password reset successful!");
      navigate("/login");
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <div className="w-[400px]">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <Label htmlFor="email">Enter your email</Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Eg. kritanbabu@gmail.com"
              required
            />
            <Button disabled={isSending} onClick={handleSendOtp} className="mt-4">
              {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              type="number" // Makes OTP field number-only
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <Button disabled={isVerifying} onClick={handleVerifyOtp} className="mt-4">
              {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify OTP"}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Enter New Password</h2>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <Button disabled={isResetting} onClick={handleResetPassword} className="mt-4">
              {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
