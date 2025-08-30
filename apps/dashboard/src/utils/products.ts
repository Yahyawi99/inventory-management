import { ProductsSummaryMetrics, Product } from "@/types/products";
import { Category } from "@/types/categories";
import { getSeedDateRanges } from "@/utils/dateHelpers";
import { StockItem } from "@/types/products";
import { fetch } from "@services/application/categories";

// Summary cards
const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const getProductSummaryMetrics = (
  allProducts: Product[]
): ProductsSummaryMetrics => {
  const productsCopy = [...allProducts];
  const { current: currentPeriod, previous: previousPeriod } =
    getSeedDateRanges();

  const currentPeriodProducts = productsCopy.filter(
    (product) =>
      new Date(product.createdAt) >= currentPeriod.startDate &&
      new Date(product.createdAt) <= currentPeriod.endDate
  );

  const previousPeriodProducts = productsCopy.filter(
    (product) =>
      new Date(product.createdAt) >= previousPeriod.startDate &&
      new Date(product.createdAt) <= previousPeriod.endDate
  );

  // --- 1. Total Unique Products ---
  const totalUniqueProductsCurrent = currentPeriodProducts.length;
  const totalUniqueProductsPrevious = previousPeriodProducts.length;

  // --- 2. Total Units in Stock (Current Snapshot) ---
  const totalUnitsInStock = productsCopy.reduce(
    (sum, product) => sum + product.stockItems.length,
    0
  );

  // --- 3. Total Units Sold (via OrderLines) ---
  let totalUnitsSoldCurrent = 0;
  let totalUnitsSoldPrevious = 0;
  let totalSalesRevenueCurrent = 0;
  let totalSalesRevenuePrevious = 0;

  productsCopy.forEach((product) => {
    product.orderLines.forEach((orderLine) => {
      const orderLineDate = new Date(
        (orderLine as any).createdAt || product.createdAt
      );

      if (
        orderLineDate >= currentPeriod.startDate &&
        orderLineDate <= currentPeriod.endDate
      ) {
        totalUnitsSoldCurrent += orderLine.quantity;
        totalSalesRevenueCurrent += orderLine.quantity * product.price;
      }
      if (
        orderLineDate >= previousPeriod.startDate &&
        orderLineDate <= previousPeriod.endDate
      ) {
        totalUnitsSoldPrevious += orderLine.quantity;
        totalSalesRevenuePrevious += orderLine.quantity * product.price;
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
  const {
    data: { categories },
  }: { data: { categories: Category[] } } = await fetch(
    "/inventory/categories"
  );

  const categoriesOptions = categories?.map((category) => {
    const { name } = category;
    return { label: name, value: name };
  });

  return [{ label: "All Products", value: "All" }, ...categoriesOptions];
};

// buildOrdersApiUrl;
