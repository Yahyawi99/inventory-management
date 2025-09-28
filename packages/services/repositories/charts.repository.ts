import Prisma from "database";
import { OrderType, Order } from "database/generated/prisma/index.js";

interface Product {
  name: string;
  orderLines: { quantity: number; unitPrice: number }[];
}

interface Category {
  name: string;
  products: { price: number }[];
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

  async inventoryChart(orgId: string): Promise<
    | {
        category: string;
        totalValue: number;
        fill: string;
      }[]
    | null
  > {
    try {
      const products = await Prisma.category.findMany({
        where: {
          organizationId: orgId,
        },
        include: {
          products: {
            select: { price: true },
          },
        },
      });

      // calculate metrics
      const formattedCategoriesData = products.reduce(
        (acc, category: Category) => {
          const name = category.name;

          if (!acc[name]) {
            acc[name] = {
              category: name,
              totalValue: 0,
              fill:
                "rgba(" +
                (Math.random() * 225).toFixed(2) +
                "," +
                (Math.random() * 225).toFixed(2) +
                "," +
                (Math.random() * 225).toFixed(2) +
                ")",
            };
          }

          category.products.forEach((product) => {
            acc[name].totalValue += product.price;
          });

          return acc;
        },
        {} as Record<
          string,
          {
            category: string;
            totalValue: number;
            fill: string;
          }
        >
      );

      // Convert to desired format
      const result = Object.entries(formattedCategoriesData).map(
        ([name, data]) => {
          const { fill, totalValue } = data;

          return {
            category: name,
            totalValue,
            fill,
          };
        }
      );
      console.log(result);

      return result;
    } catch (e) {
      console.log("Error while fetching aov chart data: ", e);
      return null;
    }
  },

  async ordersStatusChart(orgId: string): Promise<
    | {
        status: string;
        count: number;
        fill: string;
      }[]
    | null
  > {
    try {
      const orders = await Prisma.order.findMany({
        where: {
          organizationId: orgId,
        },
      });

      // calculate metrics
      const formattedOrdersData = orders.reduce(
        (acc, order: Order) => {
          const status = order.status;

          if (!acc[status]) {
            acc[status] = {
              status,
              count: 0,
              fill:
                "rgba(" +
                (Math.random() * 225).toFixed(2) +
                "," +
                (Math.random() * 225).toFixed(2) +
                "," +
                (Math.random() * 225).toFixed(2) +
                ")",
            };
          }

          acc[status].count++;

          return acc;
        },
        {} as Record<
          string,
          {
            status: string;
            count: number;
            fill: string;
          }
        >
      );

      // Convert to desired format
      const result = Object.entries(formattedOrdersData).map(
        ([status, data]) => {
          const { fill, count } = data;

          return {
            status,
            count,
            fill,
          };
        }
      );

      return result;
    } catch (e) {
      console.log("Error while fetching aov chart data: ", e);
      return null;
    }
  },
};
