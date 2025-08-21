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

// Interface for the final summary output
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
