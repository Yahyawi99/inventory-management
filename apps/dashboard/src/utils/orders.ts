import {
  Order,
  OrderStatus,
  ActiveFilters,
  StatusDisplay,
  Metrics,
  OrderSummaryMetrics,
} from "@/types/orders";
import { OrderLine } from "@database/generated/prisma";
import {
  getDateRangesForComparison,
  isDateWithinRange,
} from "@/utils/dateHelpers";
import { SortConfig, Pagination, Data } from "app-core/src/types";

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
  prefix: string = "ORD-",
  randomLength: number = 4
): string => {
  const now = new Date();

  // Format year as YY (last two digits)
  const year = String(now.getFullYear()).slice(-2);
  // Format month as MM (01-12)
  const month = String(now.getMonth() + 1).padStart(2, "0");
  // Format day as DD
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const timestampPart = `${year}${month}${day}${hours}${minutes}`;

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 2 + randomLength)
    .toUpperCase();

  return `${prefix}${timestampPart}-${randomPart}`;
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

export const getOrderSummaryMetrics = (
  orders: Order[]
): OrderSummaryMetrics => {
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

// generate api URL for table orders data fetching
export const buildOrdersApiUrl = (
  base: string,
  activeFilters: ActiveFilters,
  activeOrderBy: SortConfig,
  pagination: Pagination
): string => {
  const queryParams = new URLSearchParams();

  if (activeFilters.status && activeFilters.status !== "All") {
    if (activeFilters.status === "Fulfilled") {
      queryParams.append("status", OrderStatus.Shipped);
      queryParams.append("status", OrderStatus.Delivered);
    } else {
      queryParams.append("status", activeFilters.status);
    }
  }

  if (activeFilters.search) {
    queryParams.append("search", activeFilters.search);
  }

  if (activeFilters.customerType && activeFilters.customerType !== "All") {
    queryParams.append("customerType", activeFilters.customerType);
  }

  if (activeFilters.orderType && activeFilters.orderType !== "All") {
    queryParams.append("orderType", activeFilters.orderType);
  }

  if (activeOrderBy) {
    queryParams.append("orderBy", JSON.stringify(activeOrderBy));
  }

  if (pagination) {
    queryParams.append("page", pagination.page + "");
  }

  const queryString = queryParams.toString();
  return `${base}${queryString ? `?${queryString}` : ""}`;
};
