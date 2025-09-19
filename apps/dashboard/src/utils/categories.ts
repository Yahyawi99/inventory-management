import { ActiveFilters, Pagination, SortConfig } from "app-core/src/types";

// generate api URL for table products data fetching
export const buildCategoriesApiUrl = (
  base: string,
  activeFilters: ActiveFilters,
  activeOrderBy: SortConfig,
  pagination: Pagination
): string => {
  const queryParams = new URLSearchParams();

  // if (activeFilters.category && activeFilters.category !== "All") {
  //   queryParams.append("category", activeFilters.category);
  // }

  // if (activeFilters.status && activeFilters.status !== "All") {
  //   queryParams.append("status", activeFilters.status);
  // }

  // if (activeFilters.search) {
  //   queryParams.append("search", activeFilters.search);
  // }

  // if (activeOrderBy) {
  //   queryParams.append("orderBy", JSON.stringify(activeOrderBy));
  // }

  if (pagination) {
    queryParams.append("page", pagination.page + "");
  }

  const queryString = queryParams.toString();
  return `${base}${queryString ? `?${queryString}` : ""}`;
};
