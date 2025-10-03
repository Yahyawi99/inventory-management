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
      changeType: getChangeType(overview.teamMembers.change),
    },
    {
      label: "Products",
      value: formatNumber(overview.products.total),
      icon: Package,
      color: "bg-green-50 text-green-600",
      change: formatChange(overview.products.change),
      changeType: getChangeType(overview.products.change),
    },
    {
      label: "Active Orders",
      value: formatNumber(overview.activeOrders.total),
      icon: ShoppingCart,
      color: "bg-purple-50 text-purple-600",
      change: formatChange(overview.activeOrders.change),
      changeType: getChangeType(overview.activeOrders.change),
    },
    {
      label: "Suppliers",
      value: formatNumber(overview.suppliers.total),
      icon: Truck,
      color: "bg-orange-50 text-orange-600",
      change: formatChange(overview.suppliers.change),
      changeType: getChangeType(overview.suppliers.change),
    },
    {
      label: "Stock Locations",
      value: formatNumber(overview.stockLocations.total),
      icon: MapPin,
      color: "bg-pink-50 text-pink-600",
      change: formatChange(overview.stockLocations.change, "warehouses"),
      changeType: getChangeType(overview.stockLocations.change),
    },
    {
      label: "Customers",
      value: formatNumber(overview.customers.total),
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
      change: formatChange(overview.customers.change),
      changeType: getChangeType(overview.customers.change),
    },
  ];
};

export const getInitials = (name: string) => {
  if (!name) return "";

  // Split the name, filter out empty strings, and take the first character of the first and last parts.
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  const firstNameInitial = parts[0][0];
  const lastNameInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (firstNameInitial + lastNameInitial).toUpperCase();
};

export const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-indigo-100 text-indigo-800 ring-indigo-500";
    case "editor":
      return "bg-blue-100 text-blue-800 ring-blue-500";
    case "viewer":
      return "bg-green-100 text-green-800 ring-green-500";
    case "guest":
      return "bg-gray-100 text-gray-800 ring-gray-500";
    default:
      return "bg-yellow-100 text-yellow-800 ring-yellow-500";
  }
};
