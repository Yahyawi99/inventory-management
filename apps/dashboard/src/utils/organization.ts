import { FormattedStat, OrganizationOverview } from "@/types/organization";
import { Users, Package, ShoppingCart, Truck, MapPin } from "lucide-react";

export const formatOrganizationStats = (
  overview: OrganizationOverview
): FormattedStat[] => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatChange = (
    change: number,
    suffix: string = "this week"
  ): string => {
    if (change === 0) return `No change ${suffix}`;
    const sign = change > 0 ? "+" : "";
    return `${sign}${change} ${suffix}`;
  };

  const getChangeType = (
    change: number
  ): "increase" | "decrease" | "neutral" => {
    if (change > 0) return "increase";
    if (change < 0) return "decrease";
    return "neutral";
  };

  return [
    {
      label: "Team Members",
      value: formatNumber(overview.teamMembers.total),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      change: formatChange(overview.teamMembers.change),
    },
    {
      label: "Products",
      value: formatNumber(overview.products.total),
      icon: Package,
      color: "bg-green-50 text-green-600",
      change: formatChange(overview.products.change),
    },
    {
      label: "Active Orders",
      value: formatNumber(overview.activeOrders.total),
      icon: ShoppingCart,
      color: "bg-purple-50 text-purple-600",
      change: formatChange(overview.activeOrders.change),
    },
    {
      label: "Suppliers",
      value: formatNumber(overview.suppliers.total),
      icon: Truck,
      color: "bg-orange-50 text-orange-600",
      change: formatChange(overview.suppliers.change),
    },
    {
      label: "Stock Locations",
      value: formatNumber(overview.stockLocations.total),
      icon: MapPin,
      color: "bg-pink-50 text-pink-600",
      change: formatChange(overview.stockLocations.change, "warehouses"),
    },
    {
      label: "Customers",
      value: formatNumber(overview.customers.total),
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
      change: formatChange(overview.customers.change),
    },
  ];
};
