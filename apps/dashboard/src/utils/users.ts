import { Monitor, Smartphone, SmartphoneIcon, Tablet } from "lucide-react";

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
export const formatTimeAgo = (timestamp: Date) => {
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

// Last time active
export const timeSince = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 30) return "Active now";

  let interval = seconds / 31536000;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " years ago" : " year ago")
    );
  interval = seconds / 2592000;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " months ago" : " month ago")
    );
  interval = seconds / 86400;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " days ago" : " day ago")
    );
  interval = seconds / 3600;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " hours ago" : " hour ago")
    );
  interval = seconds / 60;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " minutes ago" : " minute ago")
    );

  return "Active now";
};

// Get device Icon
export const parseUserAgent = (userAgent: string) => {
  if (!userAgent) {
    return { device: "Unknown Client/Device", Icon: Monitor };
  }

  let device = "Unknown Device";
  let Icon = Monitor;
  let browser = "Unknown Browser";

  // 1. Browser Detection
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";

  // 2. Device/OS Detection
  if (/(iPhone|iPod)/i.test(userAgent)) {
    device = "iPhone / iOS";
    Icon = SmartphoneIcon;
  } else if (/(iPad|tablet)/i.test(userAgent)) {
    device = "iPad / Tablet";
    Icon = Tablet;
  } else if (/(Android)/i.test(userAgent)) {
    device = userAgent.includes("Mobile") ? "Android Mobile" : "Android Tablet";
    Icon = userAgent.includes("Mobile") ? Smartphone : Tablet;
  } else if (userAgent.includes("Windows NT")) {
    device = "Windows Desktop";
    Icon = Monitor;
  } else if (userAgent.includes("Macintosh")) {
    device = "Mac OS Desktop";
    Icon = Monitor;
  } else if (userAgent.includes("Linux")) {
    device = "Linux Desktop";
    Icon = Monitor;
  } else {
    device = "Unknown OS";
  }

  return { device: `${browser} on ${device}`, Icon };
};
