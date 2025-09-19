import { InputJsonValue } from "@prisma/client/runtime/library";
import Prisma from "database";
import { Category, Prisma as P } from "database/generated/prisma/client";

interface Filters {
  category?: string;
  search?: string;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const categoryRepository = {
  async findMany(
    orgId: string,
    { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; categories: Category[] } | null> {
    // build the pipeline
    const pipeline: InputJsonValue[] | undefined = [
      {
        $match: {},
      },
      {
        $lookup: {
          from: "Product",
          localField: "productId",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const filterMatch: Record<string, any> = {
      organizationId: orgId,
    };

    // pagination
    pipeline.push({
      $facet: {
        paginatedResults: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    // Push the filter object
    if (Object.keys(filterMatch).length > 0) {
      pipeline.push({ $match: filterMatch });
    }

    try {
      const response = await Prisma.product.aggregateRaw({
        pipeline,
      });

      const result = response[0] as
        | { paginatedResults: Category[]; totalCount: [{ count: number }] }
        | undefined;

      const totalCategories =
        result && result.totalCount && result.totalCount.length > 0
          ? result.totalCount[0].count
          : 0;
      const totalPages = Math.ceil(totalCategories / pageSize);

      return {
        totalPages,
        categories: result?.paginatedResults as Category[],
      };
    } catch (e) {
      console.log("Error while fetching categories: ", e);
      return null;
    }

    // ==============
    // const whereClause: P.CategoryWhereInput = {
    //   organizationId: orgId,
    // };

    // try {
    //   const res = await Prisma.category.findMany({
    //     skip: (page - 1) * pageSize,
    //     take: pageSize,
    //     where: whereClause,
    //   });

    //   return res;
    // } catch (e) {
    //   console.log("Error while fetching categories: ", e);
    //   return null;
    // }
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
