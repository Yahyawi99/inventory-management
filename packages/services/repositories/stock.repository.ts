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

interface SubmitData {
  name: string;
  location: string | null;
  stockItems: {
    productId: string;
    quantity: string;
  }[];
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
          stockItems: { $push: "$stockItems" },
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

  async create(orgId: string, data: SubmitData): Promise<Stock | null> {
    try {
      return await Prisma.$transaction(async (tx) => {
        const stock = await tx.stock.create({
          data: {
            organizationId: orgId,
            name: data.name,
            location: data.location || null,
          },
        });

        const stockItemsData = data.stockItems.map((ol) => ({
          stockId: stock.id,
          organizationId: orgId,
          productId: ol.productId,
          quantity: Number(ol.quantity),
        }));

        await tx.stockItem.createMany({ data: stockItemsData });

        return stock;
      });
    } catch (e) {
      console.log("Failed to create stock location: ", e);
      throw e;
    }
  },

  async update(
    orgId: string,
    stockId: string,
    data: SubmitData
  ): Promise<Stock | null> {
    try {
      return await Prisma.$transaction(async (tx) => {
        const stock = await tx.stock.update({
          where: { organizationId: orgId, id: stockId },
          data: {
            organizationId: orgId,
            name: data.name,
            location: data.location || null,
          },
        });

        const stockItemsData = data.stockItems.map((ol) => ({
          stockId: stock.id,
          organizationId: orgId,
          productId: ol.productId,
          quantity: Number(ol.quantity),
        }));

        await tx.stockItem.deleteMany({
          where: { stockId },
        });

        await tx.stockItem.createMany({ data: stockItemsData });

        return stock;
      });
    } catch (error) {
      console.log("Something went wrong during stock update!", error);
      throw null;
    }
  },

  async delete(orgId: string, stockId: string): Promise<Stock | null> {
    try {
      const existing = await Prisma.stock.findFirst({
        where: { id: stockId, organizationId: orgId },
      });

      if (!existing) return null;

      const deleted = await Prisma.stock.delete({ where: { id: stockId } });
      return deleted;
    } catch (e) {
      console.log("Failed to delete stock: ", e);
      throw e;
    }
  },
};
