"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Invitation } from "@/types/users";
import { checkUserExists } from "@/lib/actions/checkUserExists";
import { getInvitation } from "@/lib/actions/getInvitation";
import InvitationForm from "@/components/forms/accept-invitation/invitation-form";
import Error from "@/shared/invitation/Error";
import Loading from "@/shared/invitation/Loading";
import Success from "@/shared/invitation/Success";

export default function Page() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id");
  const invitationEmail = searchParams.get("email");
  const router = useRouter();

  const [invitation, setInvitation] = useState<Invitation>();
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [step, setStep] = useState<
    "loading" | "create-account" | "success" | "error"
  >("loading");

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (invitationId) {
      loadInvitation();
    } else {
      setError("No invitation ID provided. Please check your invitation link.");
      setStep("error");
      setLoading(false);
    }
  }, [invitationId]);

  const loadInvitation = async () => {
    try {
      // const result = await authClient.organization.getInvitation({
      //   query: { id: invitationId as string },
      // });

      const result = await getInvitation(invitationId as string);
      console.log(result);
      if (!result.success) {
        // const userExists = await authClient.;
        // console.log(userExists);
        const { exists } = await checkUserExists(invitationEmail as string);

        if (!exists) {
          setTimeout(() => {
            setError("");
            setStep("create-account");
            return;
          }, 3000);
        }
        // /===================
        // ====================
        setError(result.error || "Failed to load invitation");
        setStep("error");
      } else {
        setInvitation(result.data);

        const { data: sessionData } = await authClient.getSession();
        if (sessionData && sessionData?.user?.email === result.data?.email) {
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
        setError(result.error.message || "Failed to accept invitation");
        setStep("error");
      } else {
        setStep("success");
        setTimeout(() => {
          router.push("/en/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to accept invitation");
      setStep("error");
    }
  };

  const createAccountAndAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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

      // Step 1: Create account
      const signUpResult = await authClient.signUp.email({
        email: invitation?.email as string,
        password: formData.password,
        name: formData.name.trim(),
        // Don't set callbackURL here as we want to handle the flow manually
      });

      if (signUpResult.error) {
        if (signUpResult.error.message?.includes("already exists")) {
          setError(
            "An account with this email already exists. Please sign in instead."
          );
          return;
        } else {
          setError(signUpResult.error.message || "Failed to create account");
          return;
        }
      }

      // Step 2: Accept invitation immediately after account creation
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
      setTimeout(() => {
        router.push("/en");
      }, 2000);
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
    return <Loading />;
  }

  // Error state
  if (step === "error") {
    return <Error error={error} />;
  }

  // Success state
  if (step === "success") {
    return <Success invitation={invitation} />;
  }

  // Account creation form
  return (
    <InvitationForm
      invitation={invitation}
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
      createAccountAndAcceptInvitation={createAccountAndAcceptInvitation}
      rejectInvitation={rejectInvitation}
    />
  );
}
