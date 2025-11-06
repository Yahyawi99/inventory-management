"use client";

import React, { useEffect, useState } from "react";
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
          throw new Error(response.statusText || "Failed to fetch user.");
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
        setError(
          err.message || "An unexpected error occurred while fetching user."
        );
      } finally {
        setIsFetchingUser(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // const handleSave = async (section: string) => {
  //   setIsLoading(true);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   setIsLoading(false);
  //   console.log(`Saving ${section} settings`);
  // };

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Personal Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your personal account preferences and settings
          </p>
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
