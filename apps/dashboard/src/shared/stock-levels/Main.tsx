"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product, ProductsSummaryMetrics } from "@/types/products";
import { getProductSummaryMetrics } from "@/utils/products";
import {
  Header,
  SummaryCards,
  DataControls,
  DataTable,
  TableView,
} from "app-core/src/components";
import {
  MetricsData,
  ActiveFilters,
  SortConfig,
  Pagination,
} from "app-core/src/types";
import {
  headerData,
  stockSortableFields,
  stockStatusFilters,
  stockFilterDrawerData,
  tableColumns,
} from "@/constants/stock";
import { exportOrdersAsJson } from "@/utils/shared";
import { Stock } from "@/types/stocks";
import { buildStocksApiUrl } from "@/utils/stocks";

// Total Products: The total count of unique products in your inventory.

// Total Stock Quantity: The sum of all individual units across all stock locations.

// Total Stock Locations: The number of physical places where you store your inventory.

// Total Inventory Value: The total dollar value of your en tire inventory, calculated by summing up the value of each product based on its price and quantity.

export default function Products() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();

  const [tableStocks, setTableStocks] = useState<Stock[]>([]);
  const [isFetchingTableStocks, setIsFetchingTableStocks] = useState(true);

  const [summaryProducts, setSummaryProducts] = useState<Product[]>([]);
  const [isFetchingSummaryProducts, setIsFetchingSummaryProducts] =
    useState(true);
  const [cardMetrics, setCardMetrics] = useState<MetricsData[]>([]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    status: "All",
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
  const fetchTableProducts = useCallback(async () => {
    if (!user || !user.activeOrganizationId) {
      setIsFetchingTableStocks(false);
      setError("User or organization ID not available for table.");
      return;
    }

    setIsFetchingTableStocks(true);
    setError(null);
    try {
      const apiUrl = buildStocksApiUrl(
        "/api/inventory/stocks",
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

      const { stocks, totalPages } = await response.json();

      setTableStocks(stocks);
      setPagination({ ...pagination, totalPages });
    } catch (err: any) {
      console.error("Error fetching table orders:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching table orders."
      );
    } finally {
      setIsFetchingTableStocks(false);
    }
  }, [user, isAuthenticated, activeFilters, activeOrderBy, pagination.page]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchTableProducts();
    }
  }, [isAuthLoading, fetchTableProducts]);

  // =======================
  // Summary cards Data
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
    }

    const fetchSummaryProducts = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingSummaryProducts(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingSummaryProducts(true);
      setError(null);
      try {
        const response = await fetch("/api/inventory/stocks");

        if (!response.ok) {
          throw new Error(
            response.statusText || "Failed to fetch products from API."
          );
        }

        const { stocks } = await response.json();

        // setSummaryProducts(products);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(
          err.message || "An unexpected error occurred while fetching products."
        );
      } finally {
        setIsFetchingSummaryProducts(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchSummaryProducts();
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  const metricsData = useMemo(() => {
    return getProductSummaryMetrics(summaryProducts);
  }, [summaryProducts]);

  useEffect(() => {
    setCardMetrics([
      {
        title: "Total Products",
        value: 0,
        change: 0,
      },
      {
        title: "Total Stock Quantity:",
        value: 0,
        change: 0,
      },
      {
        title: "Total Stock Locations",
        value: 0,
        change: 0,
      },
      {
        title: "Total Inventory Value",
        value: 0,
        change: 0,
      },
    ]);
  }, [summaryProducts]);

  const exportData = () => {
    // exportOrdersAsJson<ProductsSummaryMetrics>(
    //   tableProducts,
    //   {
    //     filter: activeFilters,
    //     orderBy: activeOrderBy,
    //   },
    //   metricsData
    // );
  };

  return (
    <section className="overflow-x-hidden">
      <Header data={headerData} exportData={exportData} />

      <SummaryCards data={cardMetrics} isLoading={isFetchingSummaryProducts} />

      <DataControls
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
        setPagination={setPagination}
        DrawerData={stockFilterDrawerData}
        sortableFields={stockSortableFields}
        filterOptions={stockStatusFilters}
      />

      <TableView
        data={tableStocks}
        isFetchingData={isFetchingTableStocks}
        currentPage={pagination.page}
        totalPages={pagination?.totalPages ? pagination.totalPages : 0}
        setPagination={setPagination}
      >
        <DataTable<Stock> data={tableStocks} columns={tableColumns} />
      </TableView>
    </section>
  );
}
