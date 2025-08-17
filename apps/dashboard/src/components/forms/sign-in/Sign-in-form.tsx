"use client";

import * as React from "react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // For redirection after login
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      return "Please fill in all required fields.";
    }

    try {
      const res = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: async (ctx) => {
            setError(ctx.error.message as string);
            return;
          },
        }
      );

      console.log(res);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] mx-auto rounded-lg shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Welcome Back
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 px-6 ">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <Button
          className="w-full bg-sidebar hover:bg-transparent text-white hover:text-sidebar border-1 cursor-pointer border-transparent hover:border-sidebar outline-none  font-bold py-2 px-4 rounded-md transition-colors duration-200"
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        <div className="text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <a
            href="sign-up"
            className="text-sidebar hover:underline font-semibold"
          >
            Register your organization
          </a>
        </div>

        {/* Go back to landing page */}
        <div className="text-center text-sm text-gray-500 mt-2">
          <a
            href="/"
            className="hover:underline flex items-center justify-center space-x-1"
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
            <span>Back to home</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
