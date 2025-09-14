"use client";

import React, { useState } from "react";
import { UserSettings } from "@/types/users";
import {
  User,
  Shield,
  Eye,
  EyeOff,
  Save,
  Lock,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Camera,
  Check,
  AlertTriangle,
  RefreshCw,
  Globe,
  Clock,
  Palette,
  Database,
  Download,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from "app-core/src/components";
import SettingsNavigation from "@/shared/account/settings/SettingsNavigation";
import ProfileSection from "@/shared/account/settings/ProfileSection";
import SecuritySection from "@/shared/account/settings/SecuritySection";
import PreferencesSection from "@/shared/account/settings/PreferencesSection";
import DataPrivacySection from "@/shared/account/settings/DataPrivacySection";

export default function Page() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // User settings state based on schema
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "Sarah Johnson",
    email: "sarah.johnson@logitech-solutions.com",
    emailVerified: true,
    image: "null",
    twoFactorEnabled: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            isLoading={isLoading}
          />
        );
      case "security":
        return (
          <SecuritySection
            userSettings={userSettings}
            setUserSettings={setUserSettings}
          />
        );
      case "preferences":
        return <PreferencesSection isLoading={isLoading} />;
      case "data":
        return <DataPrivacySection />;
      default:
        return (
          <ProfileSection
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            isLoading={isLoading}
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
