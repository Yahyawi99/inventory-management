"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SignUpForm from "@/components/forms/sign-up/Sign-up-form";
import Logo from "@/components/forms/Auth-logo";

export default function SignUp() {
  // State for Organization Information
  const [orgName, setOrgName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [website, setWebsite] = useState("");

  // State for Admin Account
  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize Next.js router for navigation

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   // Basic client-side validation
  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match.");
  //     setIsLoading(false);
  //     return;
  //   }
  //   if (
  //     !orgName ||
  //     !description ||
  //     !orgEmail ||
  //     !yourName ||
  //     !yourEmail ||
  //     !password ||
  //     !confirmPassword
  //   ) {
  //     setError("Please fill in all required fields.");
  //     setIsLoading(false);
  //     return;
  //   }

  //   // Prepare data to send to the API
  //   const formData = {
  //     companyName: orgName,
  //     shortName,
  //     description,
  //     companyEmail: orgEmail,
  //     website,
  //     adminName: yourName,
  //     adminEmail: yourEmail,
  //     password,
  //   };

  //   // In a real application, you would make an API call here to your /api/auth/register-organization endpoint.
  //   try {
  //     const response = await fetch("/api/auth/register-organization", {
  //       // Replace with your actual registration API endpoint
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Registration failed.");
  //     }

  //     const data = await response.json();
  //     console.log("Registration successful:", data);
  //     // Handle success: Redirect to login or a welcome/verification page.
  //     // Assuming your sign-in page is at /[locale]/auth/sign-in
  //     router.push(`/`);
  //   } catch (err: any) {
  //     setError(
  //       err.message || "An unexpected error occurred during registration."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex flex-col items-center my-5">
      <Logo />

      <SignUpForm />
    </div>
  );
}
