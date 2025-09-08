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
