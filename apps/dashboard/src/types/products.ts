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
  orderLines: OrderLine[];
  stockItems: StockItem[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}

export interface StockItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  quantity: number;
  productId: string;
  stockId: string;
}

export interface OrderLine {
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
