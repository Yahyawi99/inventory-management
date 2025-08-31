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
  category: Category[];
  stockItems: StockItem[];
  orderLines: OrderLine[];
  totalStockQuantity: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string | null;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  organizationId: string;
}

export interface StockItem {
  _id: string;
  quantity: number;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  organizationId: string;
  productId: string;
  stockId: string;
}

export interface OrderLine {
  _id: string;
  quantity: number;
  unitPrice: number;
  productId: string;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  orderId: string;
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
