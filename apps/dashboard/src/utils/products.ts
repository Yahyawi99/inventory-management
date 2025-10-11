import { ProductsSummaryMetrics, Product } from "@/types/products";
import { Category } from "@/types/categories";
import { getDateRangesForComparison } from "@/utils/dateHelpers";
import { StockItem } from "@/types/products";
import { ActiveFilters, Pagination, SortConfig } from "app-core/src/types";
import { calculatePercentageChange } from "./shared";

export const getProductSummaryMetrics = (
  allProducts: Product[]
): ProductsSummaryMetrics => {
  const productsCopy = [...allProducts];

  const { current: currentPeriod, previous: previousPeriod } =
    getDateRangesForComparison();

  const currentPeriodProducts = productsCopy.filter((product) => {
    return (
      new Date(product.createdAt.$date) >= new Date(currentPeriod.startDate) &&
      new Date(product.createdAt.$date) <= new Date(currentPeriod.endDate)
    );
  });

  const previousPeriodProducts = productsCopy.filter(
    (product) =>
      new Date(product.createdAt.$date) >= new Date(previousPeriod.startDate) &&
      new Date(product.createdAt.$date) <= new Date(previousPeriod.endDate)
  );

  // --- 1. Total Unique Products ---
  const totalUniqueProductsCurrent = currentPeriodProducts.length;
  const totalUniqueProductsPrevious = previousPeriodProducts.length;

  // --- 2. Total Units in Stock (Current Snapshot) ---
  // This now uses the pre-calculated 'totalStockQuantity' field from the aggregation pipeline.
  const totalUnitsInStock = productsCopy.reduce(
    (sum, product) => sum + product.totalStockQuantity,
    0
  );

  // --- 3. Total Units Sold (via OrderLines) ---
  let totalUnitsSoldCurrent = 0;
  let totalUnitsSoldPrevious = 0;
  let totalSalesRevenueCurrent = 0;
  let totalSalesRevenuePrevious = 0;

  productsCopy.forEach((product) => {
    product.orderLines.forEach((orderLine) => {
      // Use the 'createdAt' and 'unitPrice' fields directly from the OrderLine.
      const orderLineDate = new Date(orderLine.createdAt.$date);

      if (
        orderLineDate >= new Date(currentPeriod.startDate) &&
        orderLineDate <= new Date(currentPeriod.endDate)
      ) {
        totalUnitsSoldCurrent += orderLine.quantity;
        totalSalesRevenueCurrent += orderLine.quantity * orderLine.unitPrice;
      }
      if (
        orderLineDate >= new Date(previousPeriod.startDate) &&
        orderLineDate <= new Date(previousPeriod.endDate)
      ) {
        totalUnitsSoldPrevious += orderLine.quantity;
        totalSalesRevenuePrevious += orderLine.quantity * orderLine.unitPrice;
      }
    });
  });

  // --- Calculate Changes ---
  const totalUniqueProductsChange = calculatePercentageChange(
    totalUniqueProductsCurrent,
    totalUniqueProductsPrevious
  );
  const totalUnitsSoldChange = calculatePercentageChange(
    totalUnitsSoldCurrent,
    totalUnitsSoldPrevious
  );
  const totalSalesRevenueChange = calculatePercentageChange(
    totalSalesRevenueCurrent,
    totalSalesRevenuePrevious
  );

  return {
    totalUniqueProducts: totalUniqueProductsCurrent,
    totalUnitsInStock: totalUnitsInStock,
    totalUnitsSold: totalUnitsSoldCurrent,
    totalSalesRevenue: totalSalesRevenueCurrent,

    totalUniqueProductsChange: totalUniqueProductsChange,
    totalUnitsSoldChange: totalUnitsSoldChange,
    totalSalesRevenueChange: totalSalesRevenueChange,
  };
};

// stock status table display
export const getProductStockStatusDisplay = (stockItems: StockItem[]) => {
  const totalQuantity = stockItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (totalQuantity > 50) {
    return { text: "In Stock", colorClass: "bg-green-100 text-green-800" };
  } else if (totalQuantity > 0) {
    return { text: "Low Stock", colorClass: "bg-yellow-100 text-yellow-800" };
  }
  return { text: "Out of Stock", colorClass: "bg-red-100 text-red-800" };
};

export const getTotalProductStockQuantity = (stockItems: StockItem[]) => {
  return stockItems.reduce((sum, item) => sum + item.quantity, 0);
};

// Categories options for drawer filter
export const buildCategoriesOptions = async () => {
  const response = await fetch("/api/inventory/categories");

  if (!response.ok) {
    throw new Error("Error while fetching categories for Products page");
  }

  const { categories } = await response.json();

  const categoriesOptions = categories?.map((category: Category) => {
    const { name, _id } = category;
    return { id: _id, label: name, value: name };
  });

  return [{ label: "All Products", value: "All" }, ...categoriesOptions];
};

// generate api URL for table products data fetching
export const buildProductsApiUrl = (
  base: string,
  activeFilters: ActiveFilters,
  activeOrderBy: SortConfig,
  pagination: Pagination
): string => {
  const queryParams = new URLSearchParams();

  if (activeFilters.category && activeFilters.category !== "All") {
    queryParams.append("category", activeFilters.category);
  }

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
