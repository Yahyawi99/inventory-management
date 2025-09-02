"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User as TUser } from "@/types/users";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "app-core/src/components";
import RightColumn from "@/shared/account/Actions";
import Profile from "@/shared/account/Profile";
import StatsGrid from "@/shared/account/Stats";
import RecentActivity from "@/shared/account/Activity";

export default function Page() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<TUser | null>(null);
  const [isFetchingUserData, setIsFetchingUserData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
    }

    const fetchUserData = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingUserData(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingUserData(true);
      setError(null);
      try {
        const response = await fetch("/api/user/profile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            response.statusText || "Failed to fetch user profile."
          );
        }

        const { user }: { user: TUser } = await response.json();
        setUserData(user);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(
          err.message || "An unexpected error occurred while fetching profile."
        );
      } finally {
        setIsFetchingUserData(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Account
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Your profile and account information
          </p>
        </div>

        {isFetchingUserData && (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading profile...
          </div>
        )}

        {error && !isFetchingUserData && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isFetchingUserData && !error && userData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Profile userData={userData} />

              <StatsGrid />

              <RecentActivity />
            </div>

            <RightColumn twoFactorEnabled={!userData?.twoFactorEnabled} />
          </div>
        )}
      </div>
    </div>
  );
}
