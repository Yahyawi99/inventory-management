import {
  OrderStatus,
  OrderType,
  OrderLine,
} from "@database/generated/prisma/client";

export { OrderStatus, OrderType };

export interface Order {
  id: string;
  orderNumber?: string | null;
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
