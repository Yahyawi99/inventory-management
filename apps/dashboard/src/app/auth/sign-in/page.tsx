"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/forms/sign-in/Sign-in-form";
import Logo from "@/components/forms/Auth-logo";

export default function SignIn() {
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
    <div className="h-lvh flex flex-col items-center justify-center">
      <Logo />

      <SignInForm />
    </div>
  );
}
