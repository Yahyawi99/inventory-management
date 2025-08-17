"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
import { Textarea } from "@/components/ui/textarea";
import AuthOptionsSelector from "./AuthOptionsSelector";

// This component is the comprehensive signup form for creating a company and admin user.
export default function SignUpForm() {
  // State for Organization Information
  const [orgName, setOrgName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedAuthOption, setSelectedAuthOption] = useState<
    "Email" | "Google" | "Phone" | "Code"
  >("Email");

  // State for Admin Account
  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    if (selectedAuthOption === "Email") {
      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
      if (
        !orgName ||
        !description ||
        !orgEmail ||
        !yourName ||
        !yourEmail ||
        !password
      ) {
        return "Please fill in all required fields.";
      }
    }

    // more validation for other auth options
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    const formData = {
      companyName: orgName,
      shortName,
      description,
      companyEmail: orgEmail,
      website,
      adminName: yourName,
      adminEmail: yourEmail,
      password,
      authOption: selectedAuthOption,
    };

    try {
      const { data: signUpData, error: signUpError } =
        await authClient.signUp.email(
          {
            name: formData.adminName,
            email: formData.adminEmail,
            password: formData.password,
          },
          {
            onError(ctx) {
              setError(ctx.error.message);
            },
          }
        );

      // Send email verification OTP
      try {
        const { error: otpError } =
          await authClient.emailOtp.sendVerificationOtp({
            email: formData.adminEmail,
            type: "email-verification",
          });

        if (otpError) {
          setError(
            `Account created but failed to send verification email: ${otpError.message}`
          );
        }
      } catch (otpErr: any) {
        console.warn("Failed to send OTP:", otpErr);
      }

      // Create organization after successful signup
      try {
        const metadata = {
          description: formData.description,
          companyEmail: formData.companyEmail,
          website: formData.website,
        };

        await authClient.organization.create({
          name: formData.companyName,
          slug:
            formData.shortName ||
            formData.companyName.toLowerCase().replace(/\s+/g, "-"),
          metadata,
          keepCurrentActiveOrganization: true,
        });
      } catch (orgError: any) {
        console.error("Organization creation failed:", orgError);
        setError(
          `Account created but failed to create organization: ${orgError.message}`
        );
      }

      // Redirect to email verification page
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(formData.adminEmail)}`
      );
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-lg shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-gray-800">
          Join WF
        </CardTitle>
        <CardDescription className="text-gray-600">
          Register your organization to start managing your inventory
          efficiently. You'll need to verify your email address after
          registration.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6">
        {/* Limited Authentication Section */}
        <AuthOptionsSelector
          selectedOption={selectedAuthOption}
          onSelectOption={setSelectedAuthOption}
        />

        {/* Organization Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Company Information
          </h3>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="org-name" className="text-gray-700">
                  Company Name *
                </Label>
                <Input
                  id="org-name"
                  placeholder="e.g. My Company Inc."
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="short-name" className="text-gray-700">
                  Short Name
                </Label>
                <Input
                  id="short-name"
                  placeholder="e.g. MCI (used for organization slug)"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-700">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of your company's mission and operations"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="org-email" className="text-gray-700">
                  Company Email *
                </Label>
                <Input
                  id="org-email"
                  type="email"
                  placeholder="contact@mycompany.org"
                  required
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website" className="text-gray-700">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://mycompany.org"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Admin Account Section */}
        {selectedAuthOption === "Email" && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Admin Account
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="your-name" className="text-gray-700">
                    Your Name *
                  </Label>
                  <Input
                    id="your-name"
                    placeholder="John Doe"
                    required
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="your-email" className="text-gray-700">
                    Your Email * (verification required)
                  </Label>
                  <Input
                    id="your-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={yourEmail}
                    onChange={(e) => setYourEmail(e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-gray-700">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <Button
          className="w-full bg-sidebar hover:bg-transparent text-white hover:text-sidebar border-1 cursor-pointer border-transparent hover:border-sidebar outline-none  font-bold py-2 px-4 rounded-md transition-colors duration-200"
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading
            ? "Creating Account..."
            : "Create Account & Send Verification"}
        </Button>

        <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          After registration, you'll receive a verification email with a 6-digit
          code. Please check your inbox and verify your email to complete the
          setup.
        </div>

        <div className="text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a
            href="sign-in"
            className="text-sidebar hover:underline font-semibold"
          >
            Sign In
          </a>
        </div>
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
