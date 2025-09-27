import { InputJsonValue } from "@prisma/client/runtime/library";
import Prisma from "database";
import {
  InvoiceStatus,
  OrderType,
  Invoice,
  Prisma as P,
  Order,
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
  ): Promise<{ date: Date; revenue: number; orderCount: number }[] | null> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
      const response = await Prisma.order.findMany({
        where: {
          organizationId: orgId,
          orderType: OrderType.SALES,
          orderDate: { gte: thirtyDaysAgo },
        },
      });

      // calculate data
      const dailyGroups = response.reduce((acc, order: Order) => {
        const dateKey = order.orderDate.toISOString().split("T")[0];

        if (!acc[dateKey]) {
          acc[dateKey] = {
            totalRevenue: 0,
            totalOrderCount: 0,
          };
        }

        acc[dateKey].totalRevenue += order.totalAmount;
        acc[dateKey].totalOrderCount += 1;

        return acc;
      }, {} as Record<string, { totalRevenue: number; totalOrderCount: number }>);

      // Convert to desired format
      const result = Object.entries(dailyGroups)
        .map(([dateStr, data]) => {
          const date = new Date(dateStr);
          return {
            date,
            revenue: parseInt(data.totalRevenue.toFixed(2)),
            orderCount: data.totalOrderCount,
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

      return result;
    } catch (e) {
      console.log("Error while fetching sales chart data: ", e);
      return null;
    }
  },
};
