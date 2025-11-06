"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Header,
  DataControls,
  DataTable,
  TableView,
} from "app-core/src/components";
import { ActiveFilters, SortConfig, Pagination } from "app-core/src/types";
import {
  headerData,
  tableColumns,
  categoriesFilterDrawerData,
  categorySortableFields,
  categoryCategoryFilters,
  CategoryFormConfig,
} from "@/constants/categories";
import { buildCategoriesApiUrl } from "@/utils/categories";
import { exportOrdersAsJson } from "@/utils/shared";
import { Category } from "@/types/categories";

export default function Products() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();

  const [tableCategories, setTableCategories] = useState<Category[]>([]);
  const [isFetchingTableCategories, setIsFetchingTableCategories] =
    useState(true);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    status: "All",
    category: "All",
    search: "",
  });
  const [activeOrderBy, setActiveOrderBy] = useState<SortConfig>({
    field: "createdAt",
    direction: "desc",
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: null,
  });

  const [error, setError] = useState<string | null>(null);

  // =======================
  // Table Data
  const fetchTableCategories = useCallback(async () => {
    if (!user || !user.activeOrganizationId) {
      setIsFetchingTableCategories(false);
      setError("User or organization ID not available for table.");
      router.push("/auth/sign-in");
      return;
    }

    setIsFetchingTableCategories(true);
    setError(null);
    try {
      const apiUrl = buildCategoriesApiUrl(
        "/api/inventory/categories",
        activeFilters,
        activeOrderBy,
        pagination
      );

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          response.statusText || "Failed to fetch table orders from API."
        );
      }

      const { totalPages, categories } = await response.json();

      setTableCategories(categories);
      setPagination({ ...pagination, totalPages });
    } catch (err: any) {
      console.error("Error fetching table orders:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching table orders."
      );
    } finally {
      setIsFetchingTableCategories(false);
    }
  }, [user, isAuthenticated, activeFilters, activeOrderBy, pagination.page]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchTableCategories();
    }
  }, [isAuthLoading, fetchTableCategories]);

  // =======================
  // Export data
  const exportData = () => {
    exportOrdersAsJson<null>(tableCategories, {
      filter: activeFilters,
      orderBy: activeOrderBy,
    });
  };

  return (
    <section className="overflow-x-hidden">
      <Header
        data={headerData}
        exportData={exportData}
        formConfig={CategoryFormConfig}
      />

      <DataControls
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
        setPagination={setPagination}
        DrawerData={categoriesFilterDrawerData}
        sortableFields={categorySortableFields}
        filterOptions={categoryCategoryFilters}
      />

      <TableView
        data={tableCategories}
        isFetchingData={isFetchingTableCategories}
        currentPage={pagination.page}
        totalPages={pagination?.totalPages ? pagination.totalPages : 0}
        setPagination={setPagination}
      >
        <DataTable<Category> data={tableCategories} columns={tableColumns} />
      </TableView>
    </section>
  );
}
