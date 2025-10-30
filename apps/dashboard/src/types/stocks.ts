export interface Stock {
  _id: string;
  name: string;
  location: string | null;
  totalValue: number;
  totalQuantity: number;
  stockItems: StockItem;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
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

export interface StockSummaryMetrics {
  totalProducts: number;
  totalProductsChange: number | undefined;
  totalStockQuantity: number;
  totalStockQuantityChange: number | undefined;
  totalStockLocations: number;
  totalStockLocationsChange: number | undefined;
  totalInventoryValue: number;
  totalInventoryValueChange: number | undefined;
}

export interface SubmitData {
  name: string;
  location: string | null;
  stockItems: {
    productId: string;
    quantity: string;
  }[];
}
