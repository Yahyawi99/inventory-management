"use client";

import { useEffect, useState, useTransition } from "react";
import { getInitials } from "@/utils/shared";
import { formatDate } from "@/utils/dateHelpers";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Input,
  Textarea,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "app-core/src/components";
import {
  Upload,
  Edit,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Organization } from "@/types/organization";

export default function OrganizationInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const t = useTranslations("company_profile_page.tab-1");

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const fetchOrgData = async () => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch("/api/organization");

      if (!response.ok) {
        throw new Error("Something went wrong, please try again later!");
      }

      const { organization } = await response.json();
      setOrgData(organization);
    } catch (error) {
      console.error("Failed to fetch organization data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load organization data",
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && !isAuthLoading) {
      fetchOrgData();
    }
  }, [isAuthenticated, isAuthLoading, user]);

  const handleInputChange = (field: string, value: string) => {
    if (orgData) setOrgData({ ...orgData, [field]: value });
    setSaveError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/organization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orgData?.name,
          slug: orgData?.slug,
          logo: orgData?.logo,
          metadata: orgData?.metadata,
          address: orgData?.address,
          phone: orgData?.phone,
          email: orgData?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const { organization } = await response.json();
      setOrgData(organization);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save organization data:", error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save changes",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchOrgData();
  };

  // Loading state
  if (isFetching) {
    return (
      <Card className="mb-2 text-[14px] shadow-md shadow-accent">
        <CardHeader>
          <CardTitle>{t("card_title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">{t("messages.loading")}</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="mb-2 text-[14px] shadow-md shadow-accent">
        <CardHeader>
          <CardTitle>{t("card_title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-muted-foreground font-medium mb-2">
            {t("messages.error-2")}
          </p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("actions.try")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!orgData) {
    return (
      <Card className="mb-2 text-[14px] shadow-md shadow-accent">
        <CardHeader>
          <CardTitle>{t("card_title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium mb-2">
            {t("messages.error-3")}
          </p>
          <p className="text-muted-foreground text-sm">
            {t("messages.error-4")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-2 text-[14px] shadow-md shadow-accent">
      <CardHeader className="flex justify-between">
        <CardTitle>{t("card_title")}</CardTitle>
        {!isEditing ? (
          <Button
            className="bg-sidebar hover:bg-sidebar hover:opacity-75"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2 " />
            {t("actions.edit")}
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setSaveError(null);
                fetchOrgData();
              }}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              {t("actions.cancel")}
            </Button>
            <Button
              className="bg-sidebar hover:bg-sidebar hover:opacity-75"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {t("actions.save")}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Save Error Alert */}
        {saveError && (
          <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {t("messages.error")}
              </p>
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-4 flex-wrap gap-1">
          <Avatar className="w-20 h-20">
            <AvatarImage src={orgData?.logo ?? undefined} />
            <AvatarFallback className="text-[16px] bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold text-white">
              {getInitials(orgData?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className=" font-semibold">{orgData?.name}</h2>
            <p className="text-muted-foreground">@{orgData && orgData.slug}</p>
            <Badge variant="outline">
              {t("fields.id")}: {orgData?.id}
            </Badge>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" disabled={isLoading}>
              <Upload className="w-4 h-4 mr-2" />
              {t("actions.update_logo")}
            </Button>
          )}
        </div>

        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t("fields.name")}</Label>
            {isEditing ? (
              <Input
                value={orgData?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`p-2 bg-gray-50 dark:bg-border ${
                  orgData?.name || "text-muted-foreground"
                } rounded`}
              >
                {orgData?.name || "N/A"}
              </div>
            )}
          </div>
          <div>
            <Label>{t("fields.slug")}</Label>
            {isEditing ? (
              <Input
                value={orgData?.slug || ""}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`p-2 text- bg-gray-50 dark:bg-border ${
                  orgData?.slug || "text-muted-foreground"
                } rounded`}
              >
                {orgData?.slug || "N/A"}
              </div>
            )}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t("fields.email")}</Label>
            {isEditing ? (
              <Input
                value={orgData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`flex items-center p-2 bg-gray-50 dark:bg-border ${
                  orgData?.email || "text-muted-foreground"
                } rounded`}
              >
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                {orgData?.email || "N/A"}
              </div>
            )}
          </div>
          <div>
            <Label>{t("fields.phone")}</Label>
            {isEditing ? (
              <Input
                value={orgData?.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`flex items-center p-2 bg-gray-50 dark:bg-border ${
                  orgData?.phone || "text-muted-foreground"
                } rounded`}
              >
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                {orgData?.phone || "N/A"}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <Label>{t("fields.address")}</Label>
          {isEditing ? (
            <Textarea
              value={orgData?.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={isLoading}
            />
          ) : (
            <div
              className={`flex p-2 bg-gray-50 dark:bg-border ${
                orgData?.address || "text-muted-foreground"
              } rounded`}
            >
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              {orgData?.address || "N/A"}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {t("footer.created_at")}: {formatDate(orgData?.createdAt as Date)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            {t("footer.updated_at")}: {formatDate(orgData?.updatedAt as Date)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
