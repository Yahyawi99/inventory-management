import {
  OrderStatus,
  OrderType,
  CustomerType,
} from "@database/generated/prisma/client";

export { OrderStatus, OrderType, CustomerType };

export interface Order {
  id: string;
  orderNumber: string;
  totalItemsQuantity: number | null;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  orderType: OrderType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  organizationId: string;
  orderLines: OrderLine[];
  customer?: { name: string; email: string } | null;
  supplier?: { name: string; email: string } | null;
}

export interface OrderLine {
  id: string;
  quantity: number;
  unitPrice: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
}

export interface ActiveFilters {
  status?: "All" | "Pending" | "Processing" | "Fulfilled" | "Cancelled";
  search?: string;
  customerType?: "All" | CustomerType;
  orderType?: "All" | OrderType;
}

export interface Metrics {
  totalOrders: number;
  totalOrderItems: number;
  totalCancelledOrders: number;
  totalFulfilledOrders: number;
}

export interface OrderSummaryMetrics extends Metrics {
  totalOrdersChange: number;
  totalOrderItemsChange: number;
  totalCancelledOrdersChange: number;
  totalFulfilledOrdersChange: number;
}

export interface SubmitData {
  orderNumber: string;
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  orderType: OrderType;
  customerId: string | null;
  supplierId: string | null;
  orderLines: { productId: string; quantity: number; unitPrice: number }[];
}
