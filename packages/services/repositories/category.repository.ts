import Prisma from "database";
import { Prisma as P } from "database/generated/prisma/client";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}

interface Filters {
  category?: string;
  search?: string;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const categoryRepository = {
  async findMany(orgId: string): Promise<Category[] | null> {
    const whereClause: P.CategoryWhereInput = {
      organizationId: orgId,
    };

    try {
      const res = await Prisma.category.findMany({
        where: whereClause,
      });

      return res;
    } catch (e) {
      console.log("Error while fetching categories: ", e);
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
