import {
  Card,
  CardContent,
  Alert,
  AlertDescription,
} from "app-core/src/components";
import { useEffect, useState } from "react";
import { stats } from "@/constants/users";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function StatsGrid() {
  const [statsData, setStatsData] = useState({
    ordersProcessed: 0,
    totalSales: 0,
    totalPurchases: 0,
    stockItemsUpdated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/stats");

      if (!response.ok) {
        throw new Error(
          response.statusText || "Failed to fetch stats from API."
        );
      }

      const data = await response.json();

      setStatsData({
        ordersProcessed: data.stats.ordersProcessed,
        totalSales: data.stats.totalSales,
        totalPurchases: data.stats.totalPurchases,
        stockItemsUpdated: data.stats.stockItemsUpdated,
      });
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load statistics: {error}</span>
            <button
              onClick={fetchStats}
              className="ml-4 inline-flex items-center gap-1 text-sm hover:underline"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {loading ? (
                        <p className="inline-block h-8 w-10 bg-gray-200 dark:bg-muted rounded animate-pulse"></p>
                      ) : (
                        <p>
                          {" "}
                          {statsData[stat.value as keyof typeof statsData]}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {stat.label}
                    </p>
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
    </>
  );
}
