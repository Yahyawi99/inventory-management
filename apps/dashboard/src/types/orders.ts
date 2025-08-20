import { OrderStatus, OrderType } from "@database/generated/prisma/client";

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
  customerId: string | null;
  supplierId: string | null;
  customer?: { name: string } | null;
  supplier?: { name: string } | null;
  orderLines?: Array<{
    id: string;
    quantity: number;
  }>;
}
