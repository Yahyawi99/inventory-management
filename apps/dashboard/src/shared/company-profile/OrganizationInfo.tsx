"use client";

import { useEffect, useState } from "react";
import { getInitials } from "@/utils/shared";
import { formatDate } from "@/utils/dateHelpers";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
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

const initialOrgData = {
  id: "org_123456",
  name: "LogiTech Solutions",
  slug: "logitech-solutions",
  logo: null,
  email: "info@logitech-solutions.com",
  phone: "+1 (555) 789-0123",
  address: "1234 Industrial Blvd, Denver, CO 80202",
  createdAt: "2023-01-15T09:00:00Z",
  updatedAt: "2024-12-01T10:30:00Z",
};

export default function OrganizationInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
          : "Failed to load organization data"
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
        error instanceof Error ? error.message : "Failed to save changes"
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
      <Card className="mb-2 text-[14px]">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500">Loading organization details...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="mb-2 text-[14px]">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-700 font-medium mb-2">
            Failed to Load Organization
          </p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!orgData) {
    return (
      <Card className="mb-2 text-[14px]">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium mb-2">
            No Organization Found
          </p>
          <p className="text-gray-500 text-sm">
            Organization data is not available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-2 text-[14px]">
      <CardHeader className="flex justify-between">
        <CardTitle>Organization Details</CardTitle>
        {!isEditing ? (
          <Button
            className="bg-sidebar hover:bg-sidebar hover:opacity-75"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2 " />
            Edit
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
              Cancel
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
              Save
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
                Failed to save changes
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
            <p className="text-gray-500">@{orgData && orgData.slug}</p>
            <Badge variant="outline">ID: {orgData?.id}</Badge>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" disabled={isLoading}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
            </Button>
          )}
        </div>

        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            {isEditing ? (
              <Input
                value={orgData?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`p-2 bg-gray-50 ${
                  orgData?.name || "text-gray-500"
                } rounded`}
              >
                {orgData?.name || "N/A"}
              </div>
            )}
          </div>
          <div>
            <Label>Slug</Label>
            {isEditing ? (
              <Input
                value={orgData?.slug || ""}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`p-2 text- bg-gray-50 ${
                  orgData?.slug || "text-gray-500"
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
            <Label>Email</Label>
            {isEditing ? (
              <Input
                value={orgData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`flex items-center p-2 bg-gray-50 ${
                  orgData?.email || "text-gray-500"
                } rounded`}
              >
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {orgData?.email || "N/A"}
              </div>
            )}
          </div>
          <div>
            <Label>Phone</Label>
            {isEditing ? (
              <Input
                value={orgData?.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div
                className={`flex items-center p-2 bg-gray-50 ${
                  orgData?.phone || "text-gray-500"
                } rounded`}
              >
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {orgData?.phone || "N/A"}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          {isEditing ? (
            <Textarea
              value={orgData?.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={isLoading}
            />
          ) : (
            <div
              className={`flex p-2 bg-gray-50 ${
                orgData?.address || "text-gray-500"
              } rounded`}
            >
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {orgData?.address || "N/A"}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Created: {formatDate(orgData?.createdAt as Date)}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            Updated: {formatDate(orgData?.updatedAt as Date)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
