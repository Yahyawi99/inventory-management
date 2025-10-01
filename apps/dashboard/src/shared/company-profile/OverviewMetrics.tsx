"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { OrganizationOverview } from "@/types/organization";
import { formatOrganizationStats } from "@/utils/organization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import {
  MapPin,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Team Members",
    value: "24",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    change: "+3 this month",
  },
  {
    label: "Products",
    value: "2,847",
    icon: Package,
    color: "bg-green-50 text-green-600",
    change: "+127 this week",
  },
  {
    label: "Active Orders",
    value: "156",
    icon: ShoppingCart,
    color: "bg-purple-50 text-purple-600",
    change: "12 pending",
  },
  {
    label: "Suppliers",
    value: "48",
    icon: Truck,
    color: "bg-orange-50 text-orange-600",
    change: "+5 this month",
  },
  {
    label: "Stock Locations",
    value: "12",
    icon: MapPin,
    color: "bg-pink-50 text-pink-600",
    change: "3 warehouses",
  },
  {
    label: "Customers",
    value: "342",
    icon: Users,
    color: "bg-indigo-50 text-indigo-600",
    change: "+18 this month",
  },
];

export default function OverviewMetrics() {
  const [orgStats, setOrgStats] = useState<any | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const fetchOrgStats = async () => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch("/api/organization/stats");

      if (!response.ok) {
        throw new Error("Something went wrong, please try again later!");
      }

      const { stats }: { stats: OrganizationOverview } = await response.json();
      const data = formatOrganizationStats(stats);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch organization stats:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load organization stats"
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
      fetchOrgStats();
    }
  }, [isAuthenticated, isAuthLoading, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Overview</CardTitle>
        <CardDescription>
          Key metrics and statistics of your operations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-5 border rounded-xl hover:shadow-lg transition-shadow bg-gray-50/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-blue-600 mt-1 flex items-center font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
