import { ProductStatus } from "@/types/products";
import { InputJsonValue } from "@prisma/client/runtime/library";
import Prisma from "database";
import { Category, Stock } from "database/generated/prisma/client";

interface Filters {
  status?: "Available" | "Low" | "Empty";
  search?: string;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const categoryRepository = {
  async findMany(
    orgId: string,
    filters: Filters,
    orderBy: SortConfig = {
      field: "createdAt",
      direction: "desc",
    },
    { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; stocks: Stock[] } | null> {
    // build the $match object
    const filterMatch: Record<string, any> = {
      organizationId: orgId,
    };

    // search
    if (filters.search) {
      const regex = { $regex: filters.search, $options: "i" };

      filterMatch.$or = [{ name: regex }, { location: regex }];
    }

    // build the pipeline
    const pipeline: InputJsonValue[] | undefined = [
      { $match: filterMatch },
      {
        $lookup: {
          from: "stockItem",
          let: { stockId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$stockId", "$$stockId"],
                },
              },
            },
            {
              $lookup: {
                from: "Product",
                localField: "_id",
                foreignField: "productId",
                as: "product",
              },
            },
            {
              $addFields: {
                productPrice: "$product.price",
              },
            },
          ],
          as: "stockItems",
        },
      },
      {
        $addFields: {
          totalQuantity: {
            $sum: "$stockItems.quantity",
          },
        },
      },
    ];

    // status
    const stockFilter: Record<string, any> = {};
    if (filters.status) {
      switch (filters.status) {
        case "Available":
          stockFilter.totalStockQuantity = { $gte: 50 };
          break;
        case "Low":
          stockFilter.totalStockQuantity = { $gt: 0, $lt: 50 };
          break;
        case "Empty":
          stockFilter.totalStockQuantity = { $lte: 0 };
          break;
      }
    }
    if (Object.keys(stockFilter).length > 0) {
      pipeline.push({ $match: stockFilter });
    }

    // OrderBy
    // if (orderBy && orderBy.field) {
    //   if (orderBy.field === "stock") {
    //     pipeline.push({
    //       $sort: {
    //         totalStockQuantity: orderBy.direction === "desc" ? -1 : 1,
    //       },
    //     });
    //   } else {
    //     pipeline.push({
    //       $sort: {
    //         [orderBy.field]: orderBy.direction === "desc" ? -1 : 1,
    //       },
    //     });
    //   }
    // }

    // Facet
    pipeline.push({
      $facet: {
        paginatedResults: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

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
        stocks: result?.paginatedResults as Category[],
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
