"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { UserSettings, User } from "@/types/users";
import { useAuth } from "@/context/AuthContext";
import SettingsNavigation from "@/components/shared/account/settings/SettingsNavigation";
import ProfileSection from "@/components/shared/account/settings/ProfileSection";
import SecuritySection from "@/components/shared/account/settings/SecuritySection";
import PreferencesSection from "@/components/shared/account/settings/PreferencesSection";
import DataPrivacySection from "@/components/shared/account/settings/DataPrivacySection";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const t = useTranslations("personal_settings_page");

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserSettings>({
    name: "",
    email: "",
    emailVerified: true,
    image: null,
  });
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
    }

    const fetchUserData = async () => {
      setIsFetchingUser(true);
      setError(null);
      try {
        const response = await fetch("/api/user/profile");

        if (!response.ok) {
          throw new Error(response.statusText || t("messages.error-1"));
        }

        const { user }: { user: User } = await response.json();

        setUser({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        });
        setIsTwoFactorEnabled(user.twoFactorEnabled);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message || t("messages.error-2"));
      } finally {
        setIsFetchingUser(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            user={user}
            setUser={setUser}
            isFetchingUser={isFetchingUser}
          />
        );
      case "security":
        return <SecuritySection />;
      case "preferences":
        return <PreferencesSection isLoading={isLoading} />;
      case "data":
        return <DataPrivacySection />;
      default:
        return (
          <ProfileSection
            user={user}
            setUser={setUser}
            isFetchingUser={isFetchingUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {t("header.title")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("header.subtitle")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <SettingsNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
