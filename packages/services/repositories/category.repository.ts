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
      // Step 1: Filter by organizationId first for efficiency
      {
        $match: {
          organizationId: orgId,
        },
      },
      // Step 2: Look up products and their total stock in one go
      {
        $lookup: {
          from: "Product",
          let: { categoryId: "$_id" },
          pipeline: [
            // Match products to the current category
            {
              $match: {
                $expr: {
                  $eq: ["$categoryId", "$$categoryId"],
                },
              },
            },
            // Look up stock items for each product
            {
              $lookup: {
                from: "StockItem",
                localField: "_id",
                foreignField: "productId",
                as: "stockItems",
              },
            },
            // Add a field for the total stock of this product
            {
              $addFields: {
                totalProductStock: { $sum: "$stockItems.quantity" },
              },
            },
          ],
          as: "products",
        },
      },
      // Step 3: Add new fields for the counts and totals
      {
        $addFields: {
          productCount: { $size: "$products" },
          totalStockQuantity: {
            $sum: "$products.totalProductStock",
          },
        },
      },
      // Step 4: Use $facet for pagination and total count
      {
        $facet: {
          paginatedResults: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    try {
      const response = await Prisma.category.aggregateRaw({
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
