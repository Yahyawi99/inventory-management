"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FormattedStat, OrganizationOverview } from "@/types/organization";
import { formatOrganizationStats } from "@/utils/organization";
import { useTranslations } from "next-intl";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import {
  AlertCircle,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function OverviewMetrics() {
  const [orgStats, setOrgStats] = useState<FormattedStat[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("company_profile_page.tab-2");

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

      const {
        stats: { overview },
      }: { stats: { overview: OrganizationOverview } } = await response.json();
      const data = formatOrganizationStats(overview);

      setOrgStats(data);
    } catch (error) {
      console.error("Failed to fetch organization stats:", error);
      setError(error instanceof Error ? error.message : t("messages.error-1"));
    } finally {
      setIsFetching(false);
    }
  };

  const handleRetry = () => {
    fetchOrgStats();
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

  return (
    <Card className="shadow-md shadow-accent">
      <CardHeader>
        <CardTitle>{t("card_title")}</CardTitle>
        <CardDescription>{t("card_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgStats &&
            orgStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-5 border rounded-xl hover:shadow-lg transition-shadow bg-gray-50/50 dark:bg-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">
                      {t("stats." + stat.label.split(" ").join("_"))}
                    </p>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : stat.changeType === "decrease"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : stat.changeType === "decrease" ? (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    ) : (
                      <Minus className="w-3 h-3 mr-1" />
                    )}
                    {t("stats." + stat.change.split(" ").join("_"))}
                  </p>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
