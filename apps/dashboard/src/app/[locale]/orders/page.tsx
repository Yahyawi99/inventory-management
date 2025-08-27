"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetch } from "@services/application/orders";
import { Order, ActiveFilters, SortConfig, Pagination } from "@/types/orders";
import {
  buildOrdersApiUrl,
  exportOrdersAsJson,
  getOrderSummaryMetrics,
} from "@/utils/orders";
import {
  Header,
  SummaryCards,
  DataControls,
  DataTable,
} from "app-core/src/components";
import {
  FilterDrawerData,
  SortableField,
  MetricsData,
} from "app-core/src/types";
import Orders from "@/shared/orders/Orders";

const OrderFilterDrawerData: FilterDrawerData = {
  header: {
    title: "Filter Orders",
    desc: "Refine your Order list",
  },
  filterOptions: {
    status: {
      name: "Order Status",
      options: [
        { label: "All Status", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Processing", value: "Processing" },
        { label: "Fulfilled (Shipped/Delivered)", value: "Fulfilled" },
        { label: "Cancelled", value: "Cancelled" },
      ],
    },

    customerType: {
      name: "Customer Type",
      options: [
        { label: "All Customers", value: "All" },
        { label: "B2B", value: "B2B" },
        { label: "B2c", value: "B2C" },
      ],
    },
    orderType: {
      name: "Order Type",
      options: [
        { label: "All Types", value: "All" },
        { label: "Sales", value: "Sales" },
        { label: "Purchase", value: "Purchase" },
      ],
    },
  },
};

const OrderSortableFields: SortableField[] = [
  { title: "Order Number", field: "orderNumber", direction: "desc" },
  { title: "Order Date", field: "orderDate", direction: "desc" },
  { title: "Total Amount", field: "totalAmount", direction: "desc" },
  { title: "Items Quantity", field: "totalItemsQuantity", direction: "desc" },
];

const orderStatusFilters = [
  "All",
  "Pending",
  "Processing",
  "Fulfilled",
  "Cancelled",
];

export default function OrdersPage() {
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
    exportOrdersAsJson(
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
      <Header exportData={exportData} />

      <SummaryCards data={cardMetrics} isLoading={isFetchingSummaryOrders} />

      <DataControls
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
        setPagination={setPagination}
        DrawerData={OrderFilterDrawerData}
        sortableFields={OrderSortableFields}
        filterOptions={orderStatusFilters}
      />

      <DataTable
        data={tableOrders}
        isFetchingData={isFetchingTableOrders}
        currentPage={pagination.page}
        totalPages={pagination?.totalPages ? pagination.totalPages : 0}
        setPagination={setPagination}
      >
        <Orders orders={tableOrders} />
      </DataTable>
    </section>
  );
}
