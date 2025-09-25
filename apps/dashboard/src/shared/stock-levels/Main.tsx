"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
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
import { Stock, StockSummaryMetrics } from "@/types/stocks";
import { buildStocksApiUrl, getStockLevelsMetrics } from "@/utils/stocks";

export default function Products() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();

  const [tableStocks, setTableStocks] = useState<Stock[]>([]);
  const [isFetchingTableStocks, setIsFetchingTableStocks] = useState(true);

  const [summaryStocks, setSummaryStocks] = useState<Stock[]>([]);
  const [isFetchingSummaryStocks, setIsFetchingSummaryStocks] = useState(true);
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
  const fetchTableStocks = useCallback(async () => {
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
      fetchTableStocks();
    }
  }, [isAuthLoading, fetchTableStocks]);

  // =======================
  // Summary cards Data
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
    }

    const fetchSummaryStocks = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingSummaryStocks(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingSummaryStocks(true);
      setError(null);
      try {
        const response = await fetch("/api/inventory/stocks");

        if (!response.ok) {
          throw new Error(
            response.statusText || "Failed to fetch products from API."
          );
        }

        const { stocks } = await response.json();

        setSummaryStocks(stocks);
      } catch (err: any) {
        console.error("Error fetching stocks:", err);
        setError(
          err.message || "An unexpected error occurred while fetching stocks."
        );
      } finally {
        setIsFetchingSummaryStocks(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchSummaryStocks();
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  const metricsData = useMemo(() => {
    return getStockLevelsMetrics(summaryStocks);
  }, [summaryStocks]);

  useEffect(() => {
    setCardMetrics([
      {
        title: "Total Products",
        value: metricsData.totalProducts,
        change: metricsData.totalProductsChange,
      },
      {
        title: "Total Stock Quantity:",
        value: metricsData.totalStockQuantity,
        change: metricsData.totalStockQuantityChange,
      },

      {
        title: "Total Inventory Value",
        value: "$" + metricsData.totalInventoryValue.toFixed(2),
        change: metricsData.totalInventoryValueChange,
      },
      {
        title: "Total Stock Locations",
        value: metricsData.totalStockLocations,
        change: metricsData.totalStockLocationsChange,
      },
    ]);
  }, [summaryStocks]);

  const exportData = () => {
    exportOrdersAsJson<StockSummaryMetrics>(
      tableStocks,
      {
        filter: activeFilters,
        orderBy: activeOrderBy,
      },
      metricsData
    );
  };

  return (
    <section className="overflow-x-hidden">
      <Header data={headerData} exportData={exportData} />

      <SummaryCards data={cardMetrics} isLoading={isFetchingSummaryStocks} />

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
