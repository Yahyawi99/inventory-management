import { DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import { useEffect, useState } from "react";
import { buildInvoicesApiUrl } from "@/utils/invoices";
import { DashboardMetric, FinancialDashboardMetrics } from "app-core/src/types";
import { calculateFinancialMetrics } from "@/utils/dashboard";
import { dashboardMetricGroups } from "@/constants/dashboard";

export default function Cards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");
  const [metric, setMetric] = useState<"expenses" | "orders" | "inventory">(
    "expenses"
  );

  const [data, setData] = useState<FinancialDashboardMetrics>();

  // Expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const apiUrl = buildInvoicesApiUrl(
        "/api/invoices",
        {},
        {
          field: "invoiceDate",
          direction: "desc",
        },
        { page: 1, pageSize: Infinity }
      );
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          response.statusText || "Something went wrong, please try again later!"
        );
      }

      const { invoices } = await response.json();
      const invoicesMetrics = calculateFinancialMetrics(invoices);
      console.log(invoicesMetrics);
      setData(invoicesMetrics);
    } catch (error) {
      setError((error as string) || "Error while fetching invoices!");
      console.log(error);
    } finally {
      setLoading(false);
      console.log(data);
    }
  };

  useEffect(() => {
    if (metric === "expenses") {
      fetchExpenses();
    }
  }, [metric]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Expenses</h2>
        <Select>
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder="Metrics" defaultValue={metric} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expenses">Expenses</SelectItem>
            <SelectItem value="inventory">Inventory Overview</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!loading && data
          ? dashboardMetricGroups[metric].map(
              (dashboardMetric: DashboardMetric) => {
                return (
                  <Card className="rounded-lg shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {dashboardMetric.title}
                      </CardTitle>
                      {
                        <dashboardMetric.icon className="h-4 w-4 text-gray-500" />
                      }
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${data[dashboardMetric.dataKey].value}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {/* +15% Increase since last week. */}
                        {data[dashboardMetric.dataKey].change}
                      </p>
                    </CardContent>
                  </Card>
                );
              }
            )
          : ""}
      </div>
    </div>
  );
}
