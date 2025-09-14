"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "app-core/src/components";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const URLSearchParams = useSearchParams();
  const token = URLSearchParams.get("token");

  const router = useRouter();

  // Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);
    setIsSuccess(false);

    if (!token) {
      setMessage("Invalid token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.resetPassword(
        {
          newPassword,
          token: token as string,
        },
        {
          onError: (ctx) => {
            setIsSuccess(false);
            setMessage(ctx.error.message);
          },
          onSuccess: () => {
            setIsSuccess(true);
            setMessage("Password updated successfully!");
            setNewPassword("");
            setConfirmPassword("");

            router.push("/auth/sign-in");
          },
        }
      );
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-700">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-10 px-4 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-10 px-4 text-base"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm text-center font-medium ${
                  isSuccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="h-10 w-full bg-sidebar hover:bg-transparent text-white hover:text-sidebar border-1 cursor-pointer border-transparent hover:border-sidebar outline-none font-bold py-2 px-4 rounded-md transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
