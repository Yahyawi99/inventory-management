import Prisma from "database";
import {
  Prisma as P,
  User,
  UserStatus,
} from "database/generated/prisma/client";

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

interface Activity {
  action: string;
  time: Date;
  type: string;
  entity: string;
}

interface SubmitData {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  image: string;
  emailVerified: boolean;
  banned: boolean;
  banReason: string;
}

// Repository
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

  async getRecentActivities(organizationId: string, userId: string) {
    const activities: Activity[] = [];

    try {
      // 1. STOCK ITEM UPDATES (updatedAt != createdAt)
      const stockUpdates = await Prisma.stockItem.findMany({
        where: {
          organizationId,
          updatedAt: { gt: Prisma.stockItem.fields.createdAt },
        },
        include: {
          product: true,
          stock: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      });

      stockUpdates.forEach((item) => {
        activities.push({
          action: `Updated stock quantity for Product ${item.product.sku} in ${item.stock.name}`,
          time: item.updatedAt,
          type: "stock_update",
          entity: "StockItem",
        });
      });

      // 2. NEW PURCHASE ORDERS (created by user)
      const purchaseOrders = await Prisma.order.findMany({
        where: {
          userId,
          organizationId,
          orderType: "PURCHASE",
        },
        include: { supplier: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      purchaseOrders.forEach((order) => {
        const orderNumber = `PO-${order.id.slice(-8)}`;
        activities.push({
          action: `Created new purchase order ${orderNumber} for ${order.supplier?.name}`,
          time: order.createdAt,
          type: "purchase_order",
          entity: "Order",
        });
      });

      // 3. NEW SALES ORDERS (created by user)
      const salesOrders = await Prisma.order.findMany({
        where: {
          userId,
          organizationId,
          orderType: "SALES",
        },
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      salesOrders.forEach((order) => {
        const orderNumber = `SO-${order.id.slice(-8)}`;
        activities.push({
          action: `Processed sales order ${orderNumber} for ${order.customer?.name}`,
          time: order.createdAt,
          type: "sales_order",
          entity: "Order",
        });
      });

      // 4. NEW CATEGORIES (created recently)
      const newCategories = await Prisma.category.findMany({
        where: {
          organizationId,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      newCategories.forEach((category) => {
        activities.push({
          action: `Added new product category: ${category.name}`,
          time: category.createdAt,
          type: "category_create",
          entity: "Category",
        });
      });

      // 5. UPDATED CATEGORIES
      const updatedCategories = await Prisma.category.findMany({
        where: {
          organizationId,
          updatedAt: { gt: Prisma.category.fields.createdAt },
        },
        orderBy: { updatedAt: "desc" },
        take: 3,
      });

      updatedCategories.forEach((category) => {
        activities.push({
          action: `Updated product category: ${category.name}`,
          time: category.updatedAt,
          type: "category_update",
          entity: "Category",
        });
      });

      // 6. NEW PRODUCTS
      const newProducts = await Prisma.product.findMany({
        where: {
          organizationId,
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      newProducts.forEach((product) => {
        activities.push({
          action: `Added new product: ${product.name} (${product.sku})`,
          time: product.createdAt,
          type: "product_create",
          entity: "Product",
        });
      });

      // 7. UPDATED PRODUCTS
      const updatedProducts = await Prisma.product.findMany({
        where: {
          organizationId,
          updatedAt: { gt: Prisma.product.fields.createdAt },
        },
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        take: 3,
      });

      updatedProducts.forEach((product) => {
        activities.push({
          action: `Updated product information for ${product.name} (${product.sku})`,
          time: product.updatedAt,
          type: "product_update",
          entity: "Product",
        });
      });

      // 8. NEW SUPPLIERS
      const newSuppliers = await Prisma.supplier.findMany({
        where: {
          organizationId,
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      });

      newSuppliers.forEach((supplier) => {
        activities.push({
          action: `Added new supplier: ${supplier.name}`,
          time: supplier.createdAt,
          type: "supplier_create",
          entity: "Supplier",
        });
      });

      // 9. UPDATED SUPPLIERS
      const updatedSuppliers = await Prisma.supplier.findMany({
        where: {
          organizationId,
          updatedAt: { gt: Prisma.supplier.fields.createdAt },
        },
        orderBy: { updatedAt: "desc" },
        take: 2,
      });

      updatedSuppliers.forEach((supplier) => {
        activities.push({
          action: `Updated supplier contact information for ${supplier.name}`,
          time: supplier.updatedAt,
          type: "supplier_update",
          entity: "Supplier",
        });
      });

      // 10. NEW CUSTOMERS
      const newCustomers = await Prisma.customer.findMany({
        where: {
          organizationId,
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      });

      newCustomers.forEach((customer) => {
        activities.push({
          action: `Added new customer: ${customer.name}`,
          time: customer.createdAt,
          type: "customer_create",
          entity: "Customer",
        });
      });

      // 11. NEW INVOICES
      const newInvoices = await Prisma.invoice.findMany({
        where: {
          organizationId,
        },
        include: {
          order: {
            include: { customer: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      newInvoices.forEach((invoice) => {
        activities.push({
          action: `Generated invoice ${invoice.invoiceNumber} for ${invoice.order.customer?.name}`,
          time: invoice.createdAt,
          type: "invoice_create",
          entity: "Invoice",
        });
      });

      // Sort all activities
      const sortedActivities = activities.sort(
        (a, b) => Number(new Date(b.time)) - Number(new Date(a.time))
      );

      return sortedActivities;
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      throw error;
    }
  },

  async delete(orgId: string, memberId: string): Promise<User | null> {
    try {
      return Prisma.$transaction(async (tx) => {
        const member = await Prisma.member.delete({
          where: {
            id: memberId,
            organizationId: orgId,
          },
        });

        const user = await Prisma.user.delete({
          where: { id: member.userId },
        });

        return user;
      });
    } catch (error) {
      console.log("Error while deleting a user: ", error);
      throw error;
    }
  },

  async update(
    orgId: string,
    memberId: string,
    data: SubmitData
  ): Promise<User | null> {
    const { role, image, emailVerified, banned, banReason } = data;

    console.log(data);
    try {
      return await Prisma.$transaction(async (tx) => {
        const member = await Prisma.member.update({
          where: { id: memberId, organizationId: orgId },
          data: {
            role,
          },
        });

        const user = await Prisma.user.update({
          where: { id: member?.userId },
          data: {
            ...data,
            image: image || null,
            emailVerified,
            banned,
            banReason: banReason || null,
          },
        });

        return user;
      });
    } catch (error) {
      console.log("Failed to update a user: ", error);
      throw error;
    }
  },
};
