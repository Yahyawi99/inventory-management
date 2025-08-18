import Prisma from "database";
import {
  OrderStatus,
  OrderType,
  Prisma as P,
} from "database/generated/prisma/client";

type Filters = {
  orderDate?: Date;
  status?: OrderStatus;
  orderType?: OrderType;
};

export const OrderRepository = {
  async findMany(orgId: string, filters?: Filters, search?: string) {
    try {
      const res = await Prisma.order.findMany({
        where: {
          organizationId: orgId,
        },
      });

      return res;
    } catch (e) {
      console.log("Error while fetching orders");
      console.log(e);
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
