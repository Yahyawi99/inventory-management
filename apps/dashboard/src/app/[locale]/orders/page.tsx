"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetch } from "@services/application/orders";
import {
  Order,
  ActiveFilters,
  SortConfig,
  SummaryMetrics,
  Pagination,
} from "@/types/orders";
import Orders from "@/shared/orders/Orders";
import {
  buildOrdersApiUrl,
  exportOrdersAsJson,
  getOrderSummaryMetrics,
} from "@/utils/orders";
import { Card, CardContent } from "@/components/ui/card";
import OrdersHeader from "@/shared/orders/OrdersHeader";
import OrdersSummaryCards from "@/shared/orders/OrdersCards";
import OrdersFilters from "@/shared/orders/OrdersFilters";
import OrdersPagination from "@/shared/orders/OrdersPagination";

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [summaryOrders, setSummaryOrders] = useState<Order[]>([]);
  const [summaryMetricsData, setSummaryMetricsData] =
    useState<SummaryMetrics>();
  const [isFetchingSummaryOrders, setIsFetchingSummaryOrders] = useState(true);

  const [tableOrders, setTableOrders] = useState<Order[]>([]);
  const [isFetchingTableOrders, setIsFetchingTableOrders] = useState(true);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: null,
  });

  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    status: "All",
    search: "",
    customerType: "All",
    orderType: "All",
  });
  const [activeOrderBy, setActiveOrderBy] = useState<SortConfig>({
    field: "orderDate",
    direction: "desc",
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      return router.replace(`/auth/sign-in`);
    }

    const fetchSummaryOrders = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingSummaryOrders(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingSummaryOrders(true);
      setError(null);
      try {
        const response = await fetch("/orders");

        if (response.status !== 200) {
          throw new Error(
            response.data.message || "Failed to fetch orders from API."
          );
        }

        const data: Order[] = response.data.orders;

        setSummaryOrders(data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(
          err.message || "An unexpected error occurred while fetching orders."
        );
      } finally {
        setIsFetchingSummaryOrders(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchSummaryOrders();
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  // Table Data
  const fetchTableOrders = useCallback(async () => {
    if (!user || !user.activeOrganizationId) {
      setIsFetchingTableOrders(false);
      setError("User or organization ID not available for table.");
      return;
    }

    setIsFetchingTableOrders(true);
    setError(null);
    try {
      const apiUrl = buildOrdersApiUrl(
        activeFilters,
        activeOrderBy,
        pagination
      );

      const response = await fetch(apiUrl);

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Failed to fetch table orders from API."
        );
      }

      setTableOrders(response.data.orders);
      setPagination({ ...pagination, totalPages: response.data.totalPages });
    } catch (err: any) {
      console.error("Error fetching table orders:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching table orders."
      );
    } finally {
      setIsFetchingTableOrders(false);
    }
  }, [user, isAuthenticated, activeFilters, activeOrderBy, pagination.page]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchTableOrders();
    }
  }, [isAuthLoading, fetchTableOrders]);

  // export data
  const exportData = () => {
    exportOrdersAsJson(
      tableOrders,
      {
        filter: activeFilters,
        orderBy: activeOrderBy,
      },
      summaryMetricsData
    );
  };

  // pagination
  const onPageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  // MetricsData
  const metricsData = useMemo(() => {
    return getOrderSummaryMetrics(summaryOrders);
  }, [summaryOrders]);

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="overflow-x-hidden">
      <OrdersHeader exportData={exportData} />

      <OrdersSummaryCards metricsData={metricsData} />

      <OrdersFilters
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
      />

      <Card className="w-full mx-auto rounded-lg shadow-lg border border-gray-200">
        <CardContent className="p-0">
          {tableOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No orders found for this organization.</p>
            </div>
          ) : (
            <Orders
              orders={tableOrders}
              isAuthLoading={isAuthLoading}
              isFetchingOrders={isFetchingTableOrders}
            />
          )}

          <OrdersPagination
            currentPage={pagination.page}
            totalPages={pagination?.totalPages ? pagination.totalPages : 0}
            onPageChange={onPageChange}
          />
        </CardContent>
      </Card>
    </section>
  );
}
