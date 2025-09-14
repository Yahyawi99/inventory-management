import { authClient } from "@/lib/auth-client";

export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case "Super_Admin":
      return "bg-indigo-100 text-indigo-700";
    case "Admin":
      return "bg-purple-100 text-purple-700";
    case "Manager":
      return "bg-teal-100 text-teal-700";
    case "Analyst":
      return "bg-green-100 text-green-700";
    case "Contributor":
      return "bg-orange-100 text-orange-700";
    case "Employee":
      return "bg-sky-100 text-sky-700";
    case "Intern":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Utility function to format time ago
export const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const diff = Number(now) - Number(new Date(timestamp));

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};
