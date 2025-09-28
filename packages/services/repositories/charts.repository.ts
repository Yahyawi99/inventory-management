import Prisma from "database";
import { OrderType, Order } from "database/generated/prisma/index.js";

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  barcode: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  categoryId: string;
  orderLines: { quantity: number; unitPrice: number }[];
}

export const ChartsRepository = {
  async SalesChart(
    orgId: string
  ): Promise<{ date: Date; revenue: number; orderCount: number }[] | null> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
      const orders = await Prisma.order.findMany({
        where: {
          organizationId: orgId,
          orderType: OrderType.SALES,
          orderDate: { gte: thirtyDaysAgo },
        },
      });

      // calculate metrics
      const groupedOrders = orders.reduce((acc, order: Order) => {
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
      const result = Object.entries(groupedOrders)
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

  async AOVChart(
    orgId: string
  ): Promise<{ month: string; aov: number }[] | null> {
    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    try {
      const orders = await Prisma.order.findMany({
        where: {
          organizationId: orgId,
          orderType: OrderType.SALES,
          orderDate: { gte: yearAgo },
        },
      });

      // calculate metrics
      const groupedOrders = orders.reduce((acc, order: Order) => {
        const dateKey = order.orderDate.toISOString().split("T")[0];

        const month = new Date(dateKey).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!acc[month]) {
          acc[month] = {
            month,
            totalRevenue: 0,
            totalOrderCount: 0,
          };
        }

        acc[month].totalRevenue += order.totalAmount;
        acc[month].totalOrderCount += 1;

        return acc;
      }, {} as Record<string, { month: string; totalRevenue: number; totalOrderCount: number }>);

      // Convert to desired format
      const result = Object.entries(groupedOrders)
        .map(([month, data]) => {
          console.log(data.totalRevenue);
          console.log(data.totalOrderCount);

          return {
            month,
            aov: parseInt(
              (data.totalRevenue / data.totalOrderCount).toFixed(2)
            ),
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        });

      return result;
    } catch (e) {
      console.log("Error while fetching aov chart data: ", e);
      return null;
    }
  },

  async topProductsChart(orgId: string): Promise<
    | {
        productName: string;
        quantitySold: number;
        revenueGenerated: number;
      }[]
    | null
  > {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
      const products = await Prisma.product.findMany({
        where: {
          organizationId: orgId,
          createdAt: {
            gte: monthAgo,
          },
        },
        include: {
          orderLines: {
            select: { quantity: true, unitPrice: true },
          },
        },
      });

      // calculate metrics
      const formattedProductsData = products.reduce(
        (acc, product: Product) => {
          const name = product.name;

          if (!acc[name]) {
            acc[name] = {
              productName: name,
              quantitySold: 0,
              revenueGenerated: 0,
            };
          }

          product.orderLines.forEach((orderLine) => {
            acc[name].quantitySold += orderLine.quantity;
            acc[name].revenueGenerated += orderLine.unitPrice;
          });

          return acc;
        },
        {} as Record<
          string,
          {
            productName: string;
            quantitySold: number;
            revenueGenerated: number;
          }
        >
      );

      // Convert to desired format
      const result = Object.entries(formattedProductsData)
        .map(([name, data]) => {
          const { quantitySold, revenueGenerated } = data;

          return {
            productName: name,
            quantitySold,
            revenueGenerated,
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.quantitySold);
          const dateB = new Date(b.quantitySold);
          return dateA.getTime() - dateB.getTime();
        });

      return result;
    } catch (e) {
      console.log("Error while fetching aov chart data: ", e);
      return null;
    }
  },
};
