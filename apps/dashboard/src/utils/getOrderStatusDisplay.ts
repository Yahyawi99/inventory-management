import { OrderStatus } from "@/types/orders";

interface StatusDisplay {
  text: string;
  colorClass: string;
}

export const getOrderStatusDisplay = (status: OrderStatus): StatusDisplay => {
  switch (status) {
    case OrderStatus.Pending:
      return { text: "Pending", colorClass: "bg-yellow-100 text-yellow-800" };
    case OrderStatus.Processing:
      return { text: "Processing", colorClass: "bg-blue-100 text-blue-800" };
    case OrderStatus.Shipped:
      return { text: "Shipped", colorClass: "bg-purple-100 text-purple-800" };
    case OrderStatus.Delivered:
      return { text: "Delivered", colorClass: "bg-green-100 text-green-800" };
    case OrderStatus.Cancelled:
      return { text: "Cancelled", colorClass: "bg-red-100 text-red-800" };
    default:
      return { text: "Unknown", colorClass: "bg-gray-200 text-gray-700" };
  }
};
