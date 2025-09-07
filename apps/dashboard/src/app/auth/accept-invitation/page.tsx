"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Invitation } from "@/types/users";
import { useParams } from "next/navigation";

export default function Page() {
  const { id: invitationId } = useParams();
  const router = useRouter();

  const [invitation, setInvitation] = useState<Invitation>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<
    "loading" | "create-account" | "success" | "error"
  >("create-account");
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (invitationId) {
    }
    loadInvitation();
  }, [invitationId]);

  // Load Invitation
  const loadInvitation = async () => {
    try {
      const result = await authClient.organization.getInvitation({
        query: { id: invitationId as string },
      });

      if (result.error) {
        setError(result.error.message || "");
        setStep("error");
      } else {
        setInvitation(result.data);

        const { data: sessionData } = await authClient.getSession();
        if (sessionData && sessionData?.user?.email === result.data.email) {
          acceptInvitationDirectly();
        } else if (sessionData) {
          setError(
            "Please log out and use the invitation link again, or sign in with the invited email address."
          );
          setStep("error");
        } else {
          setStep("create-account");
        }
      }
    } catch (err) {
      setError(
        "Failed to load invitation. The link may be expired or invalid."
      );
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  // Accept Invitation
  const acceptInvitationDirectly = async () => {
    try {
      const result = await authClient.organization.acceptInvitation({
        invitationId: invitationId as string,
      });

      if (result.error) {
        setError(result.error.message || "");
        setStep("error");
      } else {
        setStep("success");
        router.push("/en/dashboard");
      }
    } catch (err) {
      setError("Failed to accept invitation");
      setStep("error");
    }
  };

  // Create Account
  const createAccountAndAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Step 1: Create user account
      const signUpResult = await authClient.signUp.email({
        email: invitation?.email as string,
        password: formData.password,
        name: formData.name.trim(),
        callbackURL: "/en/dashboard",
      });

      if (signUpResult.error) {
        if (
          signUpResult.error.message?.includes("already exists") ||
          signUpResult.error.message?.includes("already registered")
        ) {
          // Try to sign in instead
          const signInResult = await authClient.signIn.email({
            email: invitation?.email as string,
            password: formData.password,
          });

          if (signInResult.error) {
            setError(
              "An account with this email already exists. Please contact your administrator or try signing in with your existing password."
            );
            return;
          }
        } else {
          setError(signUpResult.error.message || "");
          return;
        }
      }

      // Step 2: Accept the invitation
      const acceptResult = await authClient.organization.acceptInvitation({
        invitationId: invitationId as string,
      });

      if (acceptResult.error) {
        setError(
          `Account created successfully, but failed to join organization: ${acceptResult.error.message}`
        );
        return;
      }

      // Success!
      setStep("success");
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reject Invitation
  const rejectInvitation = async () => {
    try {
      await authClient.organization.rejectInvitation({
        invitationId: invitationId as string,
      });

      router.push("/en");
    } catch (err) {
      setError("Failed to reject invitation");
    }
  };

  // Loading state
  if (step === "loading") {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (step === "error") {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Invitation Error
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (step === "success") {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Welcome to {invitation?.organizationName}!
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully joined as a{" "}
            <strong>{invitation?.role}</strong>.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Account creation form
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Join {invitation?.organizationName}
        </h2>
        <p className="text-gray-600">
          You've been invited as a <strong>{invitation?.role}</strong>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Email: <strong>{invitation?.email}</strong>
        </p>
      </div>

      <form onSubmit={createAccountAndAcceptInvitation} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password *
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            minLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a strong password (min 8 characters)"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account & Join"}
          </button>

          <button
            type="button"
            onClick={rejectInvitation}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={loading}
          >
            Decline
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to join{" "}
          {invitation?.organizationName} and accept their terms of use.
        </p>
      </div>
    </div>
  );
}
