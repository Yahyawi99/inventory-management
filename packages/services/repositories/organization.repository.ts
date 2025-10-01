import Prisma from "database";
import { OrderStatus, Organization } from "database/generated/prisma/client";

interface NewOrg {
  address: string | null;
  metadata: string | null;
  name: string;
  email: string | null;
  logo: string | null;
  slug: string | null;
  phone: string | null;
}

export const organizationRepository = {
  async findById(orgId: string): Promise<Organization | null> {
    try {
      const res = await Prisma.organization?.findUnique({
        where: {
          id: orgId,
        },
      });

      return res;
    } catch (e) {
      console.log("Error while fetching organization data " + orgId);
      return null;
    }
  },

  async updateById(orgId: string, data: NewOrg): Promise<Organization | null> {
    try {
      const res = await Prisma.organization?.update({
        where: {
          id: orgId,
        },
        data,
      });

      return res;
    } catch (e) {
      console.log("Error while updating organization data " + orgId);
      return null;
    }
  },

  async getOrgStats(orgId: string) {
    try {
      const organization = await Prisma.organization?.findUnique({
        where: {
          id: orgId,
        },
        include: {
          members: true,
          products: true,
          orders: true,
          suppliers: true,
          stocks: true,
          customers: true,
        },
      });

      // Helper function to calculate weekly change
      const calculateWeeklyChange = (
        items: any[],
        statusField?: string,
        statusValues?: string[]
      ) => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000
        );

        let lastWeekItems = items.filter(
          (item) => new Date(item.createdAt) >= sevenDaysAgo
        );

        let weekBeforeItems = items.filter((item) => {
          const date = new Date(item.createdAt);
          return date >= fourteenDaysAgo && date < sevenDaysAgo;
        });

        // Filter by status if provided
        if (statusField && statusValues) {
          lastWeekItems = lastWeekItems.filter(
            (item) => !statusValues.includes(item[statusField])
          );
          weekBeforeItems = weekBeforeItems.filter(
            (item) => !statusValues.includes(item[statusField])
          );
        }

        const lastWeekCount = lastWeekItems.length;
        const weekBeforeCount = weekBeforeItems.length;

        return {
          current: lastWeekCount,
          previous: weekBeforeCount,
          change: lastWeekCount - weekBeforeCount,
        };
      };

      // Calculate weekly changes for each metric
      const membersData = calculateWeeklyChange(organization?.members || []);
      const productsData = calculateWeeklyChange(organization?.products || []);
      const suppliersData = calculateWeeklyChange(
        organization?.suppliers || []
      );
      const customersData = calculateWeeklyChange(
        organization?.customers || []
      );

      // Active orders (active + processing status)
      const activeOrdersData = calculateWeeklyChange(
        organization?.orders || [],
        "status",
        [OrderStatus.Cancelled]
      );

      // Calculate warehouse change
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

      const lastWeekStocks =
        organization?.stocks?.filter(
          (stock) => new Date(stock.createdAt) >= sevenDaysAgo
        ) || [];
      const weekBeforeStocks =
        organization?.stocks?.filter((stock) => {
          const date = new Date(stock.createdAt);
          return date >= fourteenDaysAgo && date < sevenDaysAgo;
        }) || [];

      const lastWeekWarehouses = new Set(
        lastWeekStocks.map((stock) => stock.id)
      ).size;

      const weekBeforeWarehouses = new Set(
        weekBeforeStocks.map((stock) => stock.id)
      ).size;

      const warehousesChange = lastWeekWarehouses - weekBeforeWarehouses;

      // Total counts
      const totalMembers = organization?.members?.length || 0;
      const totalProducts = organization?.products?.length || 0;
      const totalSuppliers = organization?.suppliers?.length || 0;
      const totalCustomers = organization?.customers?.length || 0;
      const totalActiveOrders =
        organization?.orders?.filter((o) => o.status !== OrderStatus.Cancelled)
          .length || 0;
      const totalWarehouses = new Set(organization?.stocks?.map((s) => s.id))
        .size;

      const formattedOutput = {
        id: organization?.id,

        overview: {
          teamMembers: {
            total: totalMembers,
            change: membersData.change,
          },
          products: {
            total: totalProducts,
            change: productsData.change,
          },
          activeOrders: {
            total: totalActiveOrders,
            change: activeOrdersData.change,
          },
          suppliers: {
            total: totalSuppliers,
            change: suppliersData.change,
          },
          stockLocations: {
            total: totalWarehouses,
            change: warehousesChange,
          },
          customers: {
            total: totalCustomers,
            change: customersData.change,
          },
        },
      };

      return formattedOutput;
    } catch (e) {
      console.log("Error while fetching organization data " + orgId);
      return null;
    }
  },
};
