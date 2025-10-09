"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetch } from "@services/application/orders";
import {
  Order,
  ActiveFilters,
  OrderSummaryMetrics,
  OrderType,
} from "@/types/orders";
import { buildOrdersApiUrl, getOrderSummaryMetrics } from "@/utils/orders";
import { exportOrdersAsJson } from "@/utils/shared";
import {
  OrderFilterDrawerData,
  OrderSortableFields,
  orderStatusFilters,
  tableColumns,
  headerData,
  orderFormConfig,
} from "@/constants/orders";
import {
  Header,
  SummaryCards,
  DataControls,
  TableView,
  DataTable,
} from "app-core/src/components";
import { MetricsData, SortConfig, Pagination } from "app-core/src/types";

interface OrdersPageProps {
  type: OrderType | null;
}

export default function OrdersPage({ type }: OrdersPageProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [summaryOrders, setSummaryOrders] = useState<Order[]>([]);
  const [isFetchingSummaryOrders, setIsFetchingSummaryOrders] = useState(true);
  const [cardMetrics, setCardMetrics] = useState<MetricsData[]>([]);

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
    orderType: type ? type : "All",
  });
  const [activeOrderBy, setActiveOrderBy] = useState<SortConfig>({
    field: "orderDate",
    direction: "desc",
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
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
        "/orders",
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

  // MetricsData
  const metricsData = useMemo(() => {
    return getOrderSummaryMetrics(summaryOrders);
  }, [summaryOrders]);

  useEffect(() => {
    setCardMetrics([
      {
        title: "Total Orders",
        value: metricsData.totalOrders,
        change: metricsData.totalOrdersChange,
      },
      {
        title: "Order items over time",
        value: metricsData.totalOrderItems,
        change: metricsData.totalOrderItemsChange,
      },
      {
        title: "Cancelled Orders",
        value: metricsData.totalCancelledOrders,
        change: metricsData.totalCancelledOrdersChange,
      },
      {
        title: "Fulfilled Orders",
        value: metricsData.totalFulfilledOrders,
        change: metricsData.totalFulfilledOrdersChange,
      },
    ]);
  }, [summaryOrders]);

  // export data
  const exportData = () => {
    exportOrdersAsJson<OrderSummaryMetrics>(
      tableOrders,
      {
        filter: activeFilters,
        orderBy: activeOrderBy,
      },
      metricsData
    );
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="overflow-x-hidden">
      <Header
        data={headerData}
        exportData={exportData}
        formConfig={orderFormConfig}
      />

      <SummaryCards data={cardMetrics} isLoading={isFetchingSummaryOrders} />

      <DataControls
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
        setPagination={setPagination}
        DrawerData={
          type
            ? {
                header: { ...OrderFilterDrawerData.header },
                filterOptions: {
                  status: { ...OrderFilterDrawerData.filterOptions.status },
                  customerType: {
                    ...OrderFilterDrawerData.filterOptions.customerType,
                  },
                },
              }
            : OrderFilterDrawerData
        }
        sortableFields={OrderSortableFields}
        filterOptions={orderStatusFilters}
      />

      <TableView
        data={tableOrders}
        isFetchingData={isFetchingTableOrders}
        currentPage={pagination.page}
        totalPages={pagination?.totalPages ? pagination.totalPages : 0}
        setPagination={setPagination}
      >
        <DataTable<Order> data={tableOrders} columns={tableColumns} />
      </TableView>
    </section>
  );
}
