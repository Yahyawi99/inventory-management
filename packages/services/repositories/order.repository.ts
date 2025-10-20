import Prisma from "database";
import {
  CustomerType,
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

interface Filters {
  status?: OrderStatus[];
  search?: string;
  customerType?: CustomerType;
  orderType?: OrderType;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
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

      const totalOrders = await Prisma.order.count({
        where: whereClause,
      });
      const totalPages = Math.ceil(totalOrders / pageSize);

      return { totalPages, orders: res };
    } catch (e) {
      console.log("Error while fetching orders: ", e);
      throw e;
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
      throw e;
    }
  },

  async create(orgId: string, userId: string, data: SubmitData) {
    const {
      orderType,
      customerId,
      supplierId,
      orderDate,
      orderNumber,
      status,
      totalAmount,
      orderLines,
    } = data;

    try {
      return await Prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId,
            organizationId: orgId,
            orderType,
            customerId,
            supplierId,
            orderDate,
            orderNumber,
            status,
            totalAmount: Number(totalAmount),
          },
        });

        const orderLineData = orderLines.map((ol) => ({
          orderId: order.id,
          productId: ol.productId,
          quantity: Number(ol.quantity),
          unitPrice: Number(ol.unitPrice),
        }));

        await tx.orderLine.createMany({
          data: orderLineData,
        });

        return order;
      });
    } catch (error) {
      console.log("Failed to create an Order: ", error);
      throw error;
    }
  },
};
