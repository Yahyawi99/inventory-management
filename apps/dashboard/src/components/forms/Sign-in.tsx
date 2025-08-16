"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection after login
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  const router = useRouter(); // Initialize Next.js router for navigation

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   // In a real application, you would make an API call to your /api/auth/login endpoint.
  //   // For example:
  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       // Replace with your actual login API endpoint
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message || "Login failed. Please check your credentials."
  //       );
  //     }

  //     const data = await response.json();
  //     console.log("Login successful:", data);
  //   } catch (err: any) {
  //     setError(err.message || "An unexpected error occurred during login.");
  //   } finally {
  //     setIsLoading(false);
  //   }

  //   // // Simulate API call delay (REMOVE THIS IN PRODUCTION)
  //   // await new Promise((resolve) => setTimeout(resolve, 1500));
  //   // setIsLoading(false);
  //   //
  //   // // Placeholder for actual login logic (REMOVE THIS IN PRODUCTION)
  //   // if (email === "test@example.com" && password === "password") {
  //   //   console.log("Simulated Login Success:", { email, password });
  //   //   // Simulate storing a token for demonstration (DO NOT use localStorage for tokens in production)
  //   //   localStorage.setItem('simulated_jwt_token', 'your_mock_jwt_token_here');
  //   //   router.push('/en/orders'); // Example redirect
  //   // } else {
  //   //   setError("Invalid email or password (simulated).");
  //   // }
  // };

  return (
    <Card className="w-[400px] mx-auto rounded-lg shadow-lg">
      <CardHeader className="text-center pb-4">
        {/* Logo */}

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
          className="w-full bg-sidebar hover:bg-transparent text-white hover:text-sidebar border-3 cursor-pointer border-transparent hover:border-sidebar outline-none  font-bold py-2 px-4 rounded-md transition-colors duration-200"
          type="submit"
          // onClick={handleSubmit}
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
