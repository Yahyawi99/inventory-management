import { DashboardMetric } from "app-core/src/types";
import { DollarSign, TrendingUp } from "lucide-react";

export const dashboardMetricGroups: Record<string, DashboardMetric[]> = {
  expenses: [
    {
      title: "Total Sales Revenue (Paid)",
      icon: DollarSign,
      dataKey: "totalSalesRevenue",
    },
    {
      title: "Outstanding Receivables",
      icon: TrendingUp,
      dataKey: "outstandingReceivables",
    },
    {
      title: "Revenue Loss (Voided)",
      icon: DollarSign,
      dataKey: "revenueLossFromVoids",
    },
    {
      title: "Gross Sales Volume",
      icon: DollarSign,
      dataKey: "grossSalesTotal",
    },
  ],
  // add other metrics
};
