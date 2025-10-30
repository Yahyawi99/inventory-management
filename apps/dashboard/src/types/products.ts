import { Category } from "./categories";
import { OrderLine } from "./orders";
import { StockItem } from "./stocks";

export interface Product {
  _id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  barcode: string;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  organizationId: string;
  categoryId: string;
  category: Category;
  stockItems: StockItem[];
  orderLines: OrderLine[];
  totalStockQuantity: number;
}

export interface ProductsSummaryMetrics {
  totalUniqueProducts: number;
  totalUnitsInStock: number;
  totalUnitsSold: number;
  totalSalesRevenue: number;

  totalUniqueProductsChange: number;
  totalUnitsSoldChange: number;
  totalSalesRevenueChange: number;
}

export type ProductStatus = "All" | "In Stock" | "Low Stock" | "Out of Stock";

export interface SubmitData {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  categoryId: string;
}
