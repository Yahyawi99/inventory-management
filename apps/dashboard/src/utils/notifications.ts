import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export const getIconAndColor = (type: string) => {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        badge: "bg-green-100",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        color: "text-yellow-600",
        badge: "bg-yellow-100",
      };
    case "info":
    default:
      return { icon: Info, color: "text-blue-600", badge: "bg-blue-100" };
  }
};

export const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
