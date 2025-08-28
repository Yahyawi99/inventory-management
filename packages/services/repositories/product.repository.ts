import Prisma from "database";
import { Prisma as P } from "database/generated/prisma/client";

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
}

interface Filters {
  category?: string;
  search?: string;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const ProductRepository = {
  async findMany(
    orgId: string
    // filters?: Filters,
    // orderBy: SortConfig = { field: "createdAt", direction: "desc" },
    // { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; orders: Product[] } | null> {
    // Where clause
    const whereClause: P.ProductWhereInput = {
      organizationId: orgId,
    };

    // if (filters.search) {
    //   whereClause.OR = [
    //     { sku: { contains: filters.search, mode: "insensitive" } },
    //     { barcode: { contains: filters.search, mode: "insensitive" } },
    //     { name: { contains: filters.search, mode: "insensitive" } },
    //     { description: { contains: filters.search, mode: "insensitive" } },
    //     {
    //       category: { name: { contains: filters.search, mode: "insensitive" } },
    //     },
    //   ];
    // }

    // if (filters.category) {
    //   whereClause.category = {
    //     name: filters.category,
    //   };
    // }

    // // OrderBy clause
    // const orderByClause: P.ProductOrderByWithRelationInput = {};
    // if (orderBy) {
    //   orderByClause[orderBy.field as keyof P.ProductOrderByWithRelationInput] =
    //     orderBy.direction;
    // }

    try {
      const res = await Prisma.product.findMany({
        // skip: (page - 1) * pageSize,
        // take: pageSize,
        where: whereClause,
        // orderBy: orderByClause,
        include: {
          category: true,
          stockItems: true,
          orderLines: true,
        },
      });

      const totalProducts = await Prisma.product.count({
        where: whereClause,
      });
      const totalPages = Math.ceil(totalProducts / 10);

      return { totalPages, orders: res };
    } catch (e) {
      console.log("Error while fetching orders: ", e);
      return null;
    }
  },

  async findById(id: string) {
    try {
      const res = await Prisma.product.findUnique({
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
