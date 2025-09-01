"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User as TUser } from "@/types/users";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Activity,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  Info,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Alert,
  AlertDescription,
} from "app-core/src/components";

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

  const stats = [
    {
      label: "Products Managed",
      value: "2,847",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      change: "+12%",
    },
    {
      label: "Orders Processed",
      value: "1,532",
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
      change: "+8%",
    },
    {
      label: "Active Suppliers",
      value: "48",
      icon: Truck,
      color: "bg-purple-50 text-purple-600",
      change: "+3",
    },
    {
      label: "Stock Locations",
      value: "12",
      icon: MapPin,
      color: "bg-orange-50 text-orange-600",
      change: "+2",
    },
  ];

  const recentActivity = [
    {
      action: "Updated stock quantity for Product SKU-4521 in Warehouse A",
      time: "2 hours ago",
      type: "stock_update",
      entity: "StockItem",
    },
    {
      action: "Created new purchase order PO-2024-0892 for Global Parts Inc.",
      time: "5 hours ago",
      type: "order_create",
      entity: "Order",
    },
    {
      action: "Added new product category: Electronics Components",
      time: "1 day ago",
      type: "category_create",
      entity: "Category",
    },
    {
      action: "Updated supplier contact information for TechCorp Supplies",
      time: "2 days ago",
      type: "supplier_update",
      entity: "Supplier",
    },
    {
      action: "Processed sales order SO-2024-1156 for Acme Corp",
      time: "3 days ago",
      type: "order_process",
      entity: "Order",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "stock_update":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "order_create":
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "order_process":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "category_create":
        return <Info className="w-4 h-4 text-purple-600" />;
      case "supplier_update":
        return <Truck className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        {/* Loading State */}
        {isFetchingUserData && (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading profile...
          </div>
        )}

        {/* Error State */}
        {error && !isFetchingUserData && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {!isFetchingUserData && !error && userData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <Card className="overflow-hidden">
                <div className="relative h-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800"></div>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 -mt-12 mb-6">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-lg mx-auto sm:mx-0">
                      <AvatarImage src={userData?.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl sm:text-2xl font-semibold">
                        {userData?.name
                          ? userData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-4 sm:mt-12 flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {userData?.name || "Unknown User"}
                          </h2>
                          <Badge variant="secondary" className="mt-2">
                            {userData?.memberRole || "Member"}
                          </Badge>
                          <p className="text-xs sm:text-sm text-gray-500 mt-2">
                            Member since{" "}
                            {formatDate(userData?.memberSince as string)}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:text-right space-y-2">
                          {userData?.emailVerified && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900 break-words">
                            {userData?.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Organization Phone
                          </p>
                          <p className="font-medium text-gray-900">
                            {userData?.currentOrganization?.phone ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <p className="font-mono text-sm font-medium text-gray-900 break-words">
                            {userData?.id || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {userData?.currentOrganization?.address ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Two-Factor Auth
                          </p>
                          <Badge
                            variant={
                              userData?.twoFactorEnabled
                                ? "default"
                                : "destructive"
                            }
                          >
                            {userData?.twoFactorEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">
                              {stat.value}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {stat.label}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {stat.change}
                            </Badge>
                          </div>
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Activity className="w-5 h-5 mr-2" /> Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Your recent actions in the inventory management system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="mt-1 flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                          <p className="text-sm text-gray-900 break-words">
                            {activity.action}
                          </p>
                          <div className="flex flex-wrap items-center mt-1 space-x-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 text-gray-400 mr-1" />
                              {activity.time}
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs mt-1 sm:mt-0"
                            >
                              {activity.entity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Common inventory management tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:gap-4">
                  <Button className="w-full justify-start" variant="default">
                    <Package className="w-4 h-4 mr-2" /> Manage Products
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ShoppingCart className="w-4 h-4 mr-2" /> View Orders
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" /> Generate Reports
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Truck className="w-4 h-4 mr-2" /> Manage Suppliers
                  </Button>
                </CardContent>
              </Card>

              {/* Security Alert */}
              {!userData?.twoFactorEnabled && (
                <Alert>
                  <AlertDescription>
                    Consider enabling two-factor authentication for enhanced
                    security.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
