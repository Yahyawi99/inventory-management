import { InputJsonValue } from "@prisma/client/runtime/library";
import Prisma from "database";
import {
  InvoiceStatus,
  OrderType,
  Invoice,
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

interface SubmitData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: InvoiceStatus;
  orderId: string;
}

export const InvoiceRepository = {
  async findMany(
    orgId: string,
    userId: string,
    filters: Filters,
    orderBy: SortConfig = { field: "invoiceDate", direction: "desc" },
    { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; invoices: Invoice[] } | null> {
    // Build the pipeline
    const pipeline: InputJsonValue[] | undefined = [
      {
        $match: {},
      },
      {
        $lookup: {
          from: "Order",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "OrderLine",
          localField: "order._id",
          foreignField: "orderId",
          as: "order.orderLines",
        },
      },
    ];

    const filterMatch: Record<string, any> = {
      organizationId: orgId,
      userId,
    };

    // search
    if (filters.search) {
      const regex = { $regex: filters.search, $options: "i" };

      filterMatch.$or = [
        { invoiceNumber: regex },
        { barcode: regex },
        {
          order: {
            customer: {
              name: regex,
            },
            supplier: {
              name: regex,
            },
          },
        },
      ];
    }

    // Status
    if (filters.status) {
      filterMatch.status = filters.status;
    }

    // OrderType
    if (filters.orderType) {
      filterMatch.order = {
        orderType: filters.orderType,
      };
    }

    //  OrderBy
    pipeline.push({
      $addFields: {
        totalStockQuantity: { $sum: "$order.orderLines.quantity" },
      },
    });

    if (orderBy && orderBy.field) {
      if (orderBy.field === "totalItemsQuantity") {
        pipeline.push({
          $sort: {
            totalStockQuantity: orderBy.direction === "desc" ? -1 : 1,
          },
        });
      } else {
        pipeline.push({
          $sort: {
            [orderBy.field]: orderBy.direction === "desc" ? -1 : 1,
          },
        });
      }
    }

    if (Object.keys(filterMatch).length > 0) {
      pipeline.push({ $match: filterMatch });
    }

    if (pageSize === Infinity) {
      pipeline.push({
        $facet: {
          paginatedResults: [],
          totalCount: [{ $count: "count" }],
        },
      });
    } else {
      pipeline.push({
        $facet: {
          paginatedResults: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          totalCount: [{ $count: "count" }],
        },
      });
    }

    try {
      const response = await Prisma.invoice.aggregateRaw({
        pipeline,
      });

      const result = response[0] as
        | { paginatedResults: Invoice[]; totalCount: [{ count: number }] }
        | undefined;

      const totalInvoices =
        result && result.totalCount && result.totalCount.length > 0
          ? result.totalCount[0].count
          : 0;
      const totalPages = Math.ceil(totalInvoices / pageSize);

      return {
        totalPages,
        invoices: result?.paginatedResults as Invoice[],
      };
    } catch (e) {
      console.log("Error while fetching invoices: ", e);
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

  async create(orgId: string, userId: string, data: SubmitData) {
    try {
      const invoice = await Prisma.invoice.create({
        data: {
          organizationId: orgId,
          userId,
          ...data,
          totalAmount: Number(data.totalAmount),
        },
      });

      return invoice;
    } catch (error) {
      console.log("Failed to create invoice ", error);
      throw error;
    }
  },

  async delete(
    orgId: string,
    userId: string,
    invoiceId: string
  ): Promise<Invoice | null> {
    try {
      const existing = await Prisma.invoice.findFirst({
        where: { id: invoiceId, organizationId: orgId, userId },
      });

      if (!existing) {
        return null;
      }

      const deleted = await Prisma.invoice.delete({ where: { id: invoiceId } });
      return deleted;
    } catch (error) {
      console.log("Failed to delete invoice: ", error);
      throw error;
    }
  },
};
