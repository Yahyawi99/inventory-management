import { Stock, StockSummaryMetrics } from "@/types/stocks";
import { ActiveFilters, Pagination, SortConfig } from "app-core/src/types";

// stock status
export const getStockStatusDisplay = (totalQuantity: number) => {
  if (totalQuantity > 50) {
    return { text: "Available", colorClass: "bg-green-100 text-green-800" };
  } else if (totalQuantity > 0) {
    return { text: "Low", colorClass: "bg-yellow-100 text-yellow-800" };
  }
  return { text: "Empty", colorClass: "bg-red-100 text-red-800" };
};

// generate api URL for table products data fetching
export const buildStocksApiUrl = (
  base: string,
  activeFilters: ActiveFilters,
  activeOrderBy: SortConfig,
  pagination: Pagination
): string => {
  const queryParams = new URLSearchParams();

  if (activeFilters.status && activeFilters.status !== "All") {
    queryParams.append("status", activeFilters.status);
  }

  if (activeFilters.search) {
    queryParams.append("search", activeFilters.search);
  }

  if (activeOrderBy) {
    queryParams.append("orderBy", JSON.stringify(activeOrderBy));
  }

  if (pagination) {
    queryParams.append("page", pagination.page + "");
  }

  const queryString = queryParams.toString();
  return `${base}${queryString ? `?${queryString}` : ""}`;
};

// Summary Metrics
export const getStockLevelsMetrics = (
  allStocks: Stock[]
): StockSummaryMetrics => {
  // --- 1. Total Products and Total Stock Quantity ---
  // Based on your clarification, the total number of products is the sum of all quantities.
  const totalProducts = allStocks.reduce(
    (sum, stock) => sum + stock.totalQuantity,
    0
  );

  // --- 2. Total Inventory Value ---
  const totalInventoryValue = allStocks.reduce(
    (sum, stock) => sum + stock.totalValue,
    0
  );

  return {
    totalProducts,
    totalStockLocations: allStocks.length,
    totalStockQuantity: totalProducts,
    totalInventoryValue: totalInventoryValue,
    totalProductsChange: undefined,
    totalStockQuantityChange: undefined,
    totalInventoryValueChange: undefined,
    totalStockLocationsChange: undefined,
  };
};
