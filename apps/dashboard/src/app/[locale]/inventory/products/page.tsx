"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetch } from "@services/application/products";
import { Product } from "@/types/products";
import { getProductSummaryMetrics } from "@/utils/products";
import { Header, SummaryCards, DataControls } from "app-core/src/components";
import {
  MetricsData,
  ActiveFilters,
  SortConfig,
  Pagination,
} from "app-core/src/types";
import {
  productFilterDrawerData,
  productSortableFields,
  productCategoryFilters,
} from "@/constants/products";

const headerData = {
  title: "Products",
  buttonTxt: "Create Product",
};

export default function Products() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();

  const [summaryProducts, setSummaryProducts] = useState<Product[]>([]);
  const [isFetchingSummaryProducts, setIsFetchingSummaryProducts] =
    useState(true);
  const [cardMetrics, setCardMetrics] = useState<MetricsData[]>([]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
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
        const response = await fetch("/inventory/products");

        if (response.status !== 200) {
          throw new Error(
            response.data.message || "Failed to fetch products from API."
          );
        }

        const data: Product[] = response.data.orders;
        console.log(data);

        setSummaryProducts(data);
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
        value: metricsData.totalUniqueProducts,
        change: metricsData.totalUniqueProductsChange,
      },
      {
        title: "Total Units Sold",
        value: metricsData.totalUnitsSold,
        change: metricsData.totalUnitsSoldChange,
      },
      {
        title: "Sales Revenue",
        value: "$" + metricsData.totalSalesRevenue.toFixed(2),
        change: metricsData.totalSalesRevenueChange,
      },
      {
        title: "Total Units In Stock",
        value: metricsData.totalUnitsInStock,
        change: undefined,
      },
    ]);
  }, [summaryProducts]);

  const exportData = () => {};

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
        DrawerData={productFilterDrawerData}
        sortableFields={productSortableFields}
        filterOptions={productCategoryFilters}
      />
      {/*
        <TableView
          data={tableOrders}
          isFetchingData={isFetchingTableOrders}
          currentPage={pagination.page}
          totalPages={pagination?.totalPages ? pagination.totalPages : 0}
          setPagination={setPagination}
        >
          <DataTable<Order> data={tableOrders} columns={tableColumns} />
        </TableView> */}
    </section>
  );
}
