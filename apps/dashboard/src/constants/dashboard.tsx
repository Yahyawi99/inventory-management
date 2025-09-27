import { DashboardMetric } from "app-core/src/types";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";

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
  orders: [
    {
      title: "Completed Orders Value", // Maps to Paid Invoices
      icon: ShoppingCart,
      dataKey: "totalSalesRevenue",
    },
    {
      title: "Pending & Unpaid Orders", // Maps to Outstanding
      icon: ShoppingCart,
      dataKey: "outstandingReceivables",
    },
    {
      title: "Cancelled Order Value", // Maps to Voided
      icon: ShoppingCart,
      dataKey: "revenueLossFromVoids",
    },
    {
      title: "Total Order Volume", // Maps to Gross Total
      icon: ShoppingCart,
      dataKey: "grossSalesTotal",
    },
  ],

  inventory: [
    {
      title: "Inventory Value Sold", // Maps to Paid Invoices
      icon: Package,
      dataKey: "totalSalesRevenue",
    },
    {
      title: "Inventory Value Pending", // Maps to Outstanding
      icon: Package,
      dataKey: "outstandingReceivables",
    },
    {
      title: "Inventory Value Adjustment (Loss)", // Maps to Voided
      icon: Package,
      dataKey: "revenueLossFromVoids",
    },
    {
      title: "Total Inventory Transactions", // Maps to Gross Total
      icon: Package,
      dataKey: "grossSalesTotal",
    },
  ],
};
