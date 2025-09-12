import Prisma from "database";
import { User, Prisma as P } from "database/generated/prisma/client";

// Format stats
const formatCurrency = (value: number | null | undefined): string => {
  if (!value) return "$0";
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}m`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return `$${value}`;
};

export const UserRepository = {
  async findMany(
    orgId: string,
    { page, pageSize }: { page: number; pageSize: number }
  ) {
    const whereClause: P.MemberWhereInput = {
      organizationId: orgId,
    };

    try {
      const res = await Prisma.member.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        include: {
          user: true,
          organization: true,
        },
      });

      if (!res || res.length === 0) {
        return null;
      }

      const totalUsers = await Prisma.member.count({
        where: whereClause,
      });
      const totalPages = Math.ceil(totalUsers / pageSize);

      const users = res.map((member) => {
        const { user, organization } = member;
        return {
          id: member.id,
          name: user.name,
          email: user.email,
          image: user.image,
          status: user.status,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          currentOrganization: organization
            ? {
                name: organization.name,
                phone: organization.phone,
                address: organization.address,
              }
            : null,
          memberRole: member.role,
          memberSince: member.createdAt,
        };
      });

      return { totalPages, users };
    } catch (e) {
      console.log("Error while fetching users: ", e);
      return null;
    }
  },

  async findUnique(userId: string, orgId: string) {
    try {
      const res = await Prisma.member.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId: orgId,
          },
        },
        include: {
          user: true,
          organization: true,
        },
      });

      if (!res) {
        return null;
      }

      const { user, organization } = res;

      return {
        id: res.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        currentOrganization: {
          name: organization.name,
          phone: organization.phone,
          address: organization.address,
        },
        memberRole: res.role,
        memberSince: res.createdAt,
      };
    } catch (e) {
      console.log("Error while fetching user " + userId);
      console.log(e);
    }
  },

  async findByEmail(email: string) {
    try {
      const res = await Prisma.user.findUnique({
        where: {
          email,
        },
      });

      return res;
    } catch (e) {
      console.log("Error while fetching user " + email);
      console.log(e);
    }
  },

  async getStats(orgId: string, userId: string) {
    try {
      // TRansaction
      const [ordersCount, totalSalesData, totalPurchasesData, productsManaged] =
        await Prisma.$transaction([
          Prisma.order.count({
            where: { userId, organizationId: orgId },
          }),
          Prisma.order.aggregate({
            where: { userId, organizationId: orgId, orderType: "SALES" },
            _sum: { totalAmount: true },
          }),
          Prisma.order.aggregate({
            where: { userId, organizationId: orgId, orderType: "PURCHASE" },
            _sum: { totalAmount: true },
          }),
          Prisma.orderLine.findMany({
            where: {
              order: { userId, organizationId: orgId },
            },
            select: { productId: true },
            distinct: ["productId"],
          }),
        ]);

      const productCount = productsManaged.length;

      // Format the results and construct the stats object
      const stats = {
        ordersProcessed: ordersCount.toLocaleString(),
        totalSales: formatCurrency(totalSalesData._sum.totalAmount),
        totalPurchases: formatCurrency(totalPurchasesData._sum.totalAmount),
        stockItemsUpdated: productCount.toLocaleString(),
      };

      return stats;
    } catch (e) {
      console.log("Error while fetching stats: ", e);
      return null;
    }
  },
};
