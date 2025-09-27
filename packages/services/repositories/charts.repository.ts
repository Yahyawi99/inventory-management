import { InputJsonValue } from "@prisma/client/runtime/library";
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

export const ChartsRepository = {
  async SalesChart(
    orgId: string
  ): Promise<{ totalRevenue: number; totalOrderCount: number } | null> {
    // Build the pipeline
    const pipeline: InputJsonValue[] = [
      {
        $match: {
          organizationId: orgId,
          orderType: OrderType.SALES,
          orderDate: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
            day: { $dayOfMonth: "$orderDate" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ];

    try {
      const response = await Prisma.order.aggregateRaw({
        pipeline,
      });

      // const result = response[0] as {
      //   totalRevenue: number;
      //   totalOrderCount: number;
      // };

      // return {
      //   totalRevenue: result.totalRevenue,
      //   totalOrderCount: result.totalOrderCount,
      // };

      console.log(response);

      return null;
    } catch (e) {
      console.log("Error while fetching sales chart data: ", e);
      return null;
    }
  },
};
