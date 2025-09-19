import { ActiveFilters, Pagination, SortConfig } from "app-core/src/types";

// stck status
export const getProductStockStatusDisplay = (totalQuantity: number) => {
  if (totalQuantity > 50) {
    return { text: "In Stock", colorClass: "bg-green-100 text-green-800" };
  } else if (totalQuantity > 0) {
    return { text: "Low Stock", colorClass: "bg-yellow-100 text-yellow-800" };
  }
  return { text: "Out of Stock", colorClass: "bg-red-100 text-red-800" };
};

// generate api URL for table products data fetching
export const buildCategoriesApiUrl = (
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
