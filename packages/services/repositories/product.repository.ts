import { InputJsonValue } from "@database/generated/prisma/runtime/library";
import Prisma from "database";

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
  status?: "All" | "In Stock" | "Low Stock" | "Out of Stock";
  search?: string;
  category?: string;
}

interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export const ProductRepository = {
  async findMany(
    orgId: string,
    filters: Filters,
    // orderBy: SortConfig = { field: "createdAt", direction: "desc" },
    { page, pageSize }: { page: number; pageSize: number }
  ): Promise<{ totalPages: number; products: Product[] } | null> {
    // build the pipeline
    const pipeline: InputJsonValue[] | undefined = [
      {
        $match: {},
      },
      {
        $lookup: {
          from: "Category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "StockItem",
          localField: "_id",
          foreignField: "productId",
          as: "stockItems",
        },
      },
      {
        $lookup: {
          from: "OrderLine",
          localField: "_id",
          foreignField: "productId",
          as: "orderLines",
        },
      },
    ];

    const filterMatch: Record<string, any> = {
      organizationId: orgId,
    };

    // search
    if (filters.search) {
      const regex = { $regex: filters.search, $options: "i" };

      filterMatch.$or = [
        { sku: regex },
        { barcode: regex },
        { name: regex },
        { description: regex },
        { "category.name": regex },
      ];
    }

    // category
    if (filters.category) {
      filterMatch["category.name"] = filters.category;
    }

    if (Object.keys(filterMatch).length > 0) {
      pipeline.push({ $match: filterMatch });
    }

    // status
    pipeline.push({
      $addFields: {
        totalStockQuantity: { $sum: "$stockItems.quantity" },
      },
    });

    if (filters.status) {
      switch (filters.status) {
        case "In Stock":
          pipeline.push({ $match: { totalStockQuantity: { $gte: 50 } } });
          break;
        case "Low Stock":
          pipeline.push({
            $match: { totalStockQuantity: { $gt: 0, $lt: 50 } },
          });
          break;
        case "Out of Stock":
          pipeline.push({
            $match: { totalStockQuantity: { $lte: 0 } },
          });
          break;
      }
    }

    // if (orderBy && orderBy.field) {
    //   const sortStage = {
    //     $sort: {
    //       [orderBy.field]: orderBy.direction === "desc" ? -1 : 1,
    //     },
    //   };
    //   pipeline.push(sortStage);
    // }

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
      const response = await Prisma.product.aggregateRaw({
        pipeline,
      });

      const result = response[0] as
        | { paginatedResults: Product[]; totalCount: [{ count: number }] }
        | undefined;

      const totalProducts =
        result && result.totalCount && result.totalCount.length > 0
          ? result.totalCount[0].count
          : 0;
      const totalPages = Math.ceil(totalProducts / pageSize);

      return {
        totalPages,
        products: result?.paginatedResults as Product[],
      };
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
