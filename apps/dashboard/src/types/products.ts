export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  barcode: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  category: Category[];
  orderLines: OrderLines[];
  stockItems: StockItems[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}

export interface StockItems {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  quantity: number;
  productId: string;
  stockId: string;
}

export interface OrderLines {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  quantity: number;
  unitPrice: number;
  orderId: string;
  productId: string;
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
