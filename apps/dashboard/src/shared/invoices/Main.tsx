"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetch } from "@services/application/orders";
import { Order, OrderSummaryMetrics } from "@/types/orders";
import { ActiveFilters } from "@/types/invoices";
import { getOrderSummaryMetrics } from "@/utils/orders";
import { exportOrdersAsJson } from "@/utils/shared";
import { OrderFilterDrawerData, tableColumns } from "@/constants/orders";
import {
  // OrderFilterDrawerData,
  InvoiceSortableFields,
  InvoiceStatusFilters,
  // tableColumns,
  headerData,
} from "@/constants/invoices";
import {
  Header,
  SummaryCards,
  DataControls,
  TableView,
  DataTable,
} from "app-core/src/components";
import { MetricsData, SortConfig, Pagination } from "app-core/src/types";

export default function InvoicesPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [summaryInvoices, setSummaryInvoices] = useState<Order[]>([]);
  const [isFetchingSummaryInvoices, setIsFetchingSummaryInvoices] =
    useState(true);
  const [cardMetrics, setCardMetrics] = useState<MetricsData[]>([]);

  const [tableInvoices, setTableInvoices] = useState<Order[]>([]);
  const [isFetchingTableInvoices, setIsFetchingTableInvoices] = useState(true);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: null,
  });

  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    status: "All",
    search: "",
    orderType: "All",
  });
  const [activeOrderBy, setActiveOrderBy] = useState<SortConfig>({
    field: "invoiceDate",
    direction: "desc",
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/auth/sign-in`);
      return;
    }

    const fetchSummaryInvoices = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingSummaryInvoices(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingSummaryInvoices(true);
      setError(null);
      try {
        const response = await fetch("/api/orders/invoices");

        if (response.status !== 200) {
          throw new Error(
            response.data.message || "Failed to fetch invoices from API."
          );
        }

        const data: Order[] = response.data.orders;

        setSummaryInvoices(data);
      } catch (err: any) {
        console.error("Error fetching invoices:", err);
        setError(
          err.message || "An unexpected error occurred while fetching invoices."
        );
      } finally {
        setIsFetchingSummaryInvoices(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchSummaryInvoices();
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  // Table Data
  const fetchTableInvoices = useCallback(async () => {
    if (!user || !user.activeOrganizationId) {
      setIsFetchingTableInvoices(false);
      setError("User or organization ID not available for table.");
      return;
    }

    setIsFetchingTableInvoices(true);
    setError(null);
    try {
      // const apiUrl = buildOrdersApiUrl(
      //   "/api/orders/invoices",
      //   activeFilters,
      //   activeOrderBy,
      //   pagination
      // );
      const apiUrl = "";

      const response = await fetch(apiUrl);

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Failed to fetch table invoices from API."
        );
      }

      setTableInvoices(response.data.orders);
      setPagination({ ...pagination, totalPages: response.data.totalPages });
    } catch (err: any) {
      console.error("Error fetching table invoices:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching table invoices."
      );
    } finally {
      setIsFetchingTableInvoices(false);
    }
  }, [user, isAuthenticated, activeFilters, activeOrderBy, pagination.page]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchTableInvoices();
    }
  }, [isAuthLoading, fetchTableInvoices]);

  // MetricsData
  const metricsData = useMemo(() => {
    return getOrderSummaryMetrics(summaryInvoices);
  }, [summaryInvoices]);

  useEffect(() => {
    setCardMetrics([
      {
        title: "Total Invoices",
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
  }, [summaryInvoices]);

  // export data
  const exportData = () => {
    exportOrdersAsJson<OrderSummaryMetrics>(
      tableInvoices,
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
      <Header data={headerData} exportData={exportData} />

      {/* <SummaryCards data={cardMetrics} isLoading={isFetchingSummaryInvoices} /> */}

      {/* <DataControls
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
        setPagination={setPagination}
        DrawerData={OrderFilterDrawerData}
        sortableFields={InvoiceSortableFields}
        filterOptions={InvoiceStatusFilters}
      /> */}

      {/* <TableView
        data={tableInvoices}
        isFetchingData={isFetchingTableInvoices}
        currentPage={pagination.page}
        totalPages={pagination?.totalPages ? pagination.totalPages : 0}
        setPagination={setPagination}
      >
        <DataTable<Order> data={tableInvoices} columns={tableColumns} />
      </TableView> */}
    </section>
  );
}
