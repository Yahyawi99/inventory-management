import Prisma from "database";
import {
  OrderStatus,
  OrderType,
  Prisma as P,
} from "database/generated/prisma/client";

type Order = {
  id: string;
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  orderType: OrderType;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  userId: string;
  customerId: string | null;
  supplierId: string | null;
};

type Filters = {
  orderDate?: Date;
  status?: OrderStatus;
  orderType?: OrderType;
};

export const OrderRepository = {
  async findMany(
    orgId: string,
    userId: string,
    filters?: Filters,
    search?: string
  ): Promise<Order[] | null> {
    try {
      const res = await Prisma.order.findMany({
        where: {
          organizationId: orgId,
          userId,
        },
      });

      return res;
    } catch (e) {
      console.log("Error while fetching orders: ", e);
      return null;
    }
  },

  async findById(id: string) {
    try {
      const res = await Prisma.order.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      console.log("Error while fetching order " + id);
      console.log(e);
    }
  },
};
