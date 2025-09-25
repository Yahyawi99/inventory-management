export interface Stock {
  _id: string;
  name: string;
  location: string | null;
  totalValue: number;
  totalQuantity: number;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
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
