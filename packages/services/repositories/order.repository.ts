import Prisma from "database";
import {
  CustomerType,
  OrderStatus,
  OrderType,
  Prisma as P,
} from "database/generated/prisma/client";
import { SortConfig } from "@/types/orders";

type Order = {
  id: string;
  orderDate: Date;
  totalItemsQuantity: number | null;
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

interface Filters {
  status?: OrderStatus[];
  search?: string;
  customerType?: CustomerType;
  orderType?: OrderType;
}

export const OrderRepository = {
  async findMany(
    orgId: string,
    userId: string,
    filters: Filters,
    orderBy: SortConfig = { field: "orderDate", direction: "desc" },
    { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; orders: Order[] } | null> {
    // Where clause
    const whereClause: P.OrderWhereInput = {
      organizationId: orgId,
      userId,
    };

    if (filters.search) {
      whereClause.OR = [
        { orderNumber: { contains: filters.search, mode: "insensitive" } },
        {
          customer: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
        {
          supplier: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    if (filters.customerType) {
      whereClause.customer = {
        customerType: filters.customerType,
      };
    }

    if (filters.orderType) {
      whereClause.orderType = filters.orderType;
    }

    if (filters.status) {
      whereClause.status = { in: filters.status };
    }

    // OrderBy clause
    const orderByClause: P.OrderOrderByWithRelationInput = {};
    if (orderBy) {
      orderByClause[orderBy.field as keyof P.OrderOrderByWithRelationInput] =
        orderBy.direction;
    }

    try {
      const res = await Prisma.order.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        orderBy: orderByClause,
        include: {
          orderLines: true,
          customer: true,
          supplier: true,
        },
      });

      const totalOrders = await Prisma.order.count();
      const totalPages = Math.ceil(totalOrders / pageSize);

      return { totalPages, orders: res };
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
