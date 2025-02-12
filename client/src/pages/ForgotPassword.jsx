import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useSendPasswordResetMutation } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sendPasswordReset, { isLoading }] = useSendPasswordResetMutation();

  const handlePasswordReset = async () => {
    try {
      const response = await sendPasswordReset({ email });
      toast.success(response?.data?.message || "Reset link sent to your email.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <div className="w-[400px]">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2> 
        <Label htmlFor="email">Enter your email to reset password</Label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Eg. kritan@gmail.com"
          required
        />
        <Button
          disabled={isLoading}
          onClick={handlePasswordReset}
          className="mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
