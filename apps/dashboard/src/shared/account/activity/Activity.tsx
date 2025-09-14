"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Activity as TActivity } from "@/types/users";
import { formatTimeAgo } from "@/utils/users";
import { Card, Badge, CardContent } from "app-core/src/components";
import {
  Package,
  ShoppingCart,
  CheckCircle,
  Truck,
  Activity,
  Plus,
  Edit,
  Users,
  FileText,
  Folder,
  Clock,
} from "lucide-react";

export default function RecentActivity() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [userActivity, setUserActivity] = useState<TActivity[] | null>(null);
  const [isFetchingUserActivity, setIsFetchingUserActivity] =
    useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
    }

    const fetchUserActivity = async () => {
      setIsFetchingUserActivity(true);
      setError(null);
      try {
        const response = await fetch("/api/user/activity", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            response.statusText || "Failed to fetch user activities."
          );
        }

        const { activities }: { activities: TActivity[] } =
          await response.json();

        setUserActivity(activities);
      } catch (err: any) {
        console.error("Error fetching activities:", err);
        setError(
          err.message ||
            "An unexpected error occurred while fetching activities."
        );
      } finally {
        setIsFetchingUserActivity(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchUserActivity();
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      // Stock activities
      case "stock_update":
        return <Package className="w-4 h-4 text-blue-600" />;

      // Order activities
      case "purchase_order":
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "sales_order":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "order_create":
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "order_process":
        return <CheckCircle className="w-4 h-4 text-green-600" />;

      // Category activities
      case "category_create":
        return <Folder className="w-4 h-4 text-purple-600" />;
      case "category_update":
        return <Edit className="w-4 h-4 text-purple-600" />;

      // Product activities
      case "product_create":
        return <Plus className="w-4 h-4 text-indigo-600" />;
      case "product_update":
        return <Edit className="w-4 h-4 text-indigo-600" />;

      // Supplier activities
      case "supplier_create":
        return <Truck className="w-4 h-4 text-orange-600" />;
      case "supplier_update":
        return <Truck className="w-4 h-4 text-orange-600" />;

      // Customer activities
      case "customer_create":
        return <Users className="w-4 h-4 text-cyan-600" />;
      case "customer_update":
        return <Users className="w-4 h-4 text-cyan-600" />;

      // Invoice activities
      case "invoice_create":
        return <FileText className="w-4 h-4 text-yellow-600" />;
      case "invoice_update":
        return <FileText className="w-4 h-4 text-yellow-600" />;

      // Default fallback
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {userActivity?.map((activity, index) => (
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
                    {formatTimeAgo(activity.time)}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1 sm:mt-0">
                    {activity.entity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
