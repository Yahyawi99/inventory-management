import { Order, OrderStatus } from "@/types/orders";
import { OrderLine } from "@database/generated/prisma";
import {
  getDateRangesForComparison,
  isDateWithinRange,
} from "@/utils/dateHelpers";

interface StatusDisplay {
  text: string;
  colorClass: string;
}

interface Metrics {
  totalOrders: number;
  totalOrderItems: number;
  totalCancelledOrders: number;
  totalFulfilledOrders: number;
}

interface SummaryMetrics {
  totalOrders: number;
  totalOrderItems: number;
  totalCancelledOrders: number;
  totalFulfilledOrders: number;
  totalOrdersChange: number;
  totalOrderItemsChange: number;
  totalCancelledOrdersChange: number;
  totalFulfilledOrdersChange: number;
}

// status styles for the orders table
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

// generate a unique order number for the table
export const generateOrderNumber = (
  uuid: string,
  prefix: string = "ORD-",
  length: number = 6
): string => {
  if (!uuid || typeof uuid !== "string" || uuid.length < length) {
    console.warn("Invalid UUID!");

    return "N/A";
  }

  const uuidSubstring = uuid.slice(-length).toUpperCase();

  return `${prefix}${uuidSubstring}`;
};

// get the total items of each order
export const getTotalOrderLineQuantity = (
  orderLines: OrderLine[] | null | undefined
): number => {
  if (!orderLines || orderLines.length === 0) {
    return 0;
  }

  const totalQuantity = orderLines.reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  return totalQuantity;
};

// calculate the summary cards data
const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
};

const accumulateMetrics = (metrics: Metrics, order: Order) => {
  metrics.totalOrders++;
  metrics.totalOrderItems += getTotalOrderLineQuantity(order.orderLines);

  if (order.status === OrderStatus.Cancelled) {
    metrics.totalCancelledOrders++;
  }
  if (
    order.status === OrderStatus.Delivered ||
    order.status === OrderStatus.Shipped
  ) {
    metrics.totalFulfilledOrders++;
  }
};

export const getOrderSummaryMetrics = (orders: Order[]): SummaryMetrics => {
  const { current: currentPeriodRange, previous: previousPeriodRange } =
    getDateRangesForComparison();

  let currentPeriodMetrics: Metrics = {
    totalOrders: 0,
    totalOrderItems: 0,
    totalCancelledOrders: 0,
    totalFulfilledOrders: 0,
  };

  let previousPeriodMetrics: Metrics = {
    totalOrders: 0,
    totalOrderItems: 0,
    totalCancelledOrders: 0,
    totalFulfilledOrders: 0,
  };

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate);

    if (
      isDateWithinRange(
        orderDate,
        currentPeriodRange.startDate,
        currentPeriodRange.endDate
      )
    ) {
      accumulateMetrics(currentPeriodMetrics, order);
    } else if (
      isDateWithinRange(
        orderDate,
        previousPeriodRange.startDate,
        previousPeriodRange.endDate
      )
    ) {
      accumulateMetrics(previousPeriodMetrics, order);
    }
  });

  return {
    totalOrders: currentPeriodMetrics.totalOrders,
    totalOrderItems: currentPeriodMetrics.totalOrderItems,
    totalCancelledOrders: currentPeriodMetrics.totalCancelledOrders,
    totalFulfilledOrders: currentPeriodMetrics.totalFulfilledOrders,

    totalOrdersChange: calculatePercentageChange(
      currentPeriodMetrics.totalOrders,
      previousPeriodMetrics.totalOrders
    ),
    totalOrderItemsChange: calculatePercentageChange(
      currentPeriodMetrics.totalOrderItems,
      previousPeriodMetrics.totalOrderItems
    ),
    totalCancelledOrdersChange: calculatePercentageChange(
      currentPeriodMetrics.totalCancelledOrders,
      previousPeriodMetrics.totalCancelledOrders
    ),
    totalFulfilledOrdersChange: calculatePercentageChange(
      currentPeriodMetrics.totalFulfilledOrders,
      previousPeriodMetrics.totalFulfilledOrders
    ),
  };
};

// generate a json to export
export const exportOrdersAsJson = (
  ordersData: Order[],
  filter: string,
  summaryData?: SummaryMetrics,
  filename: string = "orders_export"
) => {
  if (!ordersData || ordersData.length === 0 || !summaryData) {
    console.warn("No order or summary data to export.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const finalFilename = `${filename}_${timestamp}.json`;

  const dataToExport: {
    orders: { filter: string; data: Order[] };
    summary: { date: Date; data: SummaryMetrics };
  } = {
    summary: { date: new Date(), data: summaryData },
    orders: { filter, data: ordersData },
  };

  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
