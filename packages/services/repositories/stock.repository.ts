import { InputJsonValue } from "@prisma/client/runtime/library";
import Prisma from "database";
import { Category, Stock } from "database/generated/prisma/client";

type StockStatus = "Available" | "Low" | "Empty";
interface Filters {
  status?: StockStatus;
  search?: string;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const StockRepository = {
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
          from: "StockItem",
          localField: "_id",
          foreignField: "stockId",
          as: "stockItems",
        },
      },
      {
        $unwind: "$stockItems",
      },
      {
        $lookup: {
          from: "Product",
          localField: "stockItems.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $addFields: {
          totalQuantity: {
            $sum: "$stockItems.quantity",
          },
          itemValue: {
            $multiply: ["$stockItems.quantity", "$product.price"],
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          location: { $first: "$location" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          totalValue: { $sum: "$itemValue" },
          totalQuantity: { $first: "$totalQuantity" },
        },
      },
    ];

    // status;
    const stockFilter: Record<string, any> = {};
    if (filters.status) {
      console.log(filters.status);
      switch (filters.status) {
        case "Available":
          stockFilter.totalQuantity = { $gte: 50 };
          break;
        case "Low":
          stockFilter.totalQuantity = { $gt: 0, $lt: 50 };
          break;
        case "Empty":
          stockFilter.totalQuantity = { $lte: 0 };
          break;
      }
    }
    if (Object.keys(stockFilter).length > 0) {
      pipeline.push({ $match: stockFilter });
    }

    // OrderBy
    if (orderBy && orderBy.field) {
      if (orderBy.field === "quantity") {
        pipeline.push({
          $sort: {
            totalQuantity: orderBy.direction === "desc" ? -1 : 1,
          },
        });
      } else if (orderBy.field === "value") {
        pipeline.push({
          $sort: {
            totalValue: orderBy.direction === "desc" ? -1 : 1,
          },
        });
      } else {
        pipeline.push({
          $sort: {
            [orderBy.field]: orderBy.direction === "desc" ? -1 : 1,
          },
        });
      }
    }

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
      const response = await Prisma.stock.aggregateRaw({
        pipeline,
      });

      const result = response[0] as
        | { paginatedResults: Stock[]; totalCount: [{ count: number }] }
        | undefined;

      const totalCategories =
        result && result.totalCount && result.totalCount.length > 0
          ? result.totalCount[0].count
          : 0;
      const totalPages = Math.ceil(totalCategories / pageSize);

      return {
        totalPages,
        stocks: result?.paginatedResults as Stock[],
      };
    } catch (e) {
      console.log("Error while fetching stocks: ", e);
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
