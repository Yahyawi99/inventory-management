import Prisma from "database";
import {
  InvoiceStatus,
  OrderType,
  Invoice,
  Prisma as P,
} from "database/generated/prisma/index.js";

interface Filters {
  status?: InvoiceStatus[];
  search?: string;
  orderType?: OrderType;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const InvoiceRepository = {
  async findMany(
    orgId: string,
    userId: string,
    filters: Filters,
    orderBy: SortConfig = { field: "invoiceDate", direction: "desc" },
    { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; invoices: Invoice[] } | null> {
    // Where clause
    const whereClause: P.InvoiceWhereInput = {
      organizationId: orgId,
      userId,
    };

    if (filters.search) {
      whereClause.OR = [
        { invoiceNumber: { contains: filters.search, mode: "insensitive" } },
        {
          order: {
            customer: {
              name: { contains: filters.search, mode: "insensitive" },
            },
            supplier: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (filters.orderType) {
      whereClause.order = {
        orderType: filters.orderType,
      };
    }

    if (filters.status) {
      whereClause.status = { in: filters.status };
    }

    // OrderBy clause
    const orderByClause: P.InvoiceOrderByWithRelationInput = {};
    if (orderBy) {
      orderByClause[orderBy.field as keyof P.InvoiceOrderByWithRelationInput] =
        orderBy.direction;
    }

    try {
      const res = await Prisma.invoice.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        orderBy: orderByClause,
        include: {
          order: true,
        },
      });

      const totalOrders = await Prisma.invoice.count({
        where: whereClause,
      });
      const totalPages = Math.ceil(totalOrders / pageSize);

      return { totalPages, invoices: res };
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
