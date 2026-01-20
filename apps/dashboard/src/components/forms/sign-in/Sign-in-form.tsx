"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "app-core/src/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import { Input } from "app-core/src/components";
import { Label } from "app-core/src/components";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const t = useTranslations("auth.signInPage");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message as string);
            return;
          },
          onSuccess: async (ctx) => {
            // Send verification OTP if the email is not verified
            if (ctx.data?.user && !ctx.data.user.emailVerified) {
              setSuccessMessage(
                "Sign in successful! Redirecting to email verification...",
              );

              try {
                await authClient.emailOtp.sendVerificationOtp({
                  email: email,
                  type: "email-verification",
                });
              } catch (otpError) {
                console.warn("Failed to send OTP:", otpError);
              } finally {
                router.push(
                  `/auth/verify-email?email=${encodeURIComponent(email)}`,
                );
                return;
              }
            }

            // If email is verified, set activeOrganizationId and redirect to main app
            setSuccessMessage("Working on it...");

            const { data: organizations, error: _ } =
              await authClient.organization.list();

            if (organizations && organizations?.length > 0) {
              await authClient.organization.setActive({
                organizationId: organizations[0].id,
              });
            }

            setSuccessMessage("Sign in successful! Redirecting...");
            router.push("/en");
          },
        },
      );
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "An unexpected error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] mx-auto rounded-lg shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {t("header")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("subHeader")}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 px-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-muted-foreground">
              {t("form.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("form.email.placeholder")}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border h-10 focus:border-red-500 focus:ring-red-500 rounded-md placeholder:opacity-25"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-muted-foreground">
              {t("form.password.label")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t("form.password.placeholder")}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border h-10 focus:border-red-500 focus:ring-red-500 rounded-md placeholder:opacity-25"
            />
          </div>

          {successMessage && (
            <p className="text-green-500 text-sm text-center">
              {successMessage}
            </p>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            className="w-full bg-sidebar hover:bg-transparent text-white hover:text-sidebar border-1 cursor-pointer border-transparent hover:border-sidebar outline-none font-bold py-2 px-4 rounded-md transition-colors duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t("actions.submitting") : t("actions.submit")}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div className="text-center text-sm text-muted-foreground">
          {t("actions.registerPrompt")}{" "}
          <a
            href="sign-up"
            className="text-sidebar hover:underline font-semibold"
          >
            {t("actions.registerLink")}
          </a>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <a
            href="/en/forgot-password"
            className="text-sidebar hover:underline font-medium"
          >
            {t("actions.forgotPassword")}
          </a>
        </div>

        {/* Go back to landing page */}
        <div className="text-center text-sm text-muted-foreground mt-2">
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
            <span> {t("actions.backToHome")}</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
