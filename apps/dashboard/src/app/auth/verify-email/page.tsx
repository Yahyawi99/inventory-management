"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailOTPPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // useEffect(() => {
  //   if (!session?.data?.user) {
  //     router.push("/sign-in");
  //     return;
  //   }

  //   if (session?.data.user.emailVerified) {
  //     router.push("/en");
  //     return;
  //   }
  // }, []);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.emailOtp.verifyEmail(
        {
          email: email,
          otp: otp,
        },
        {
          onError: async (ctx) => {
            setError(ctx?.error.message as string);
            return;
          },
        }
      );

      setSuccessMessage("Email verification successful! Redirecting...");
      router.push("/en");
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during verification."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    if (!email) {
      setError("Email address is required to resend code.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("Resending code...");

      const { data, error } = await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: "email-verification",
        },
        {
          onError: async (ctx) => {
            setError(ctx?.error.message as string);
            setSuccessMessage(null);
            return;
          },
        }
      );

      setSuccessMessage("New verification code sent! Please check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md mx-auto rounded-lg shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600">
            A 6-digit verification code has been sent to your email address.
            {email && (
              <span className="block mt-2 font-medium text-gray-800">
                {email}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <form onSubmit={handleVerification} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp-code" className="text-gray-700 text-center">
                Verification Code
              </Label>
              <Input
                id="otp-code"
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                placeholder="000000"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center text-xl tracking-[1rem] border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm text-center">
                {successMessage}
              </p>
            )}
            <Button
              className="w-full bg-sidebar hover:bg-transparent text-white hover:text-sidebar border-1 cursor-pointer border-transparent hover:border-sidebar outline-none  font-bold py-2 px-4 rounded-md transition-colors duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 px-6 pt-4 pb-6">
          <div className="text-center text-sm text-gray-700 mt-2">
            Didn't receive the code?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-sidebar hover:underline font-semibold"
              onClick={handleResendCode}
              disabled={isLoading || !email}
            >
              Resend Code
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            <Button
              variant="link"
              className="hover:underline flex items-center justify-center p-0 h-auto space-x-1"
              onClick={() => router.push("/en/auth/sign-in")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span>Back to login</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
