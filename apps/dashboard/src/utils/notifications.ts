import {
  CheckCircle,
  AlertTriangle,
  Info,
  FileText,
  Package,
  UserPlus,
  ShieldAlert,
  Wrench,
} from "lucide-react";

export const getIconAndColor = (type: string) => {
  switch (type) {
    case "order_created":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        badge: "bg-green-100",
      };

    case "document_uploaded":
      return {
        icon: FileText,
        color: "text-blue-600",
        badge: "bg-blue-100",
      };

    case "low_stock":
      return {
        icon: AlertTriangle,
        color: "text-yellow-600",
        badge: "bg-yellow-100",
      };

    case "out_of_stock":
      return {
        icon: AlertTriangle,
        color: "text-red-600",
        badge: "bg-red-100",
      };

    case "user_registered":
      return {
        icon: UserPlus,
        color: "text-green-600",
        badge: "bg-green-100",
      };

    case "security_alert":
      return {
        icon: ShieldAlert,
        color: "text-red-600",
        badge: "bg-red-100",
      };

    case "system_maintenance":
    case "bug_fix_applied":
      return {
        icon: Wrench,
        color: "text-blue-600",
        badge: "bg-blue-100",
      };

    default:
      return {
        icon: Info,
        color: "text-gray-600",
        badge: "bg-gray-100",
      };
  }
};

export const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
