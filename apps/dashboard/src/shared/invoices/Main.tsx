"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ActiveFilters,
  Invoice,
  InvoiceSummaryMetrics,
} from "@/types/invoices";
import {
  getInvoiceSummaryMetrics,
  buildInvoicesApiUrl,
} from "@/utils/invoices";
import { exportOrdersAsJson } from "@/utils/shared";
import {
  InvoiceFilterDrawerData,
  InvoiceSortableFields,
  InvoiceStatusFilters,
  tableColumns,
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

  const [summaryInvoices, setSummaryInvoices] = useState<Invoice[]>([]);
  const [isFetchingSummaryInvoices, setIsFetchingSummaryInvoices] =
    useState(true);
  const [cardMetrics, setCardMetrics] = useState<MetricsData[]>([]);

  const [tableInvoices, setTableInvoices] = useState<Invoice[]>([]);
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
        const response = await fetch("/api/invoices");

        if (!response.ok) {
          throw new Error(
            response.statusText || "Failed to fetch invoices from API."
          );
        }

        const { invoices }: { invoices: Invoice[] } = await response.json();

        console.log(invoices);

        setSummaryInvoices(invoices);
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
      const apiUrl = buildInvoicesApiUrl(
        "/api/invoices",
        activeFilters,
        activeOrderBy,
        pagination
      );

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          response.statusText || "Failed to fetch invoices from API."
        );
      }

      const {
        invoices,
        totalPages,
      }: { invoices: Invoice[]; totalPages: number } = await response.json();

      setTableInvoices(invoices);
      setPagination({ ...pagination, totalPages });
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
    return getInvoiceSummaryMetrics(summaryInvoices);
  }, [summaryInvoices]);

  useEffect(() => {
    setCardMetrics([
      {
        title: "Total Invoices",
        value: metricsData.totalInvoices,
        change: metricsData.totalInvoicesChange,
      },
      {
        title: "Paid Invoices",
        value: metricsData.totalPaidInvoices,
        change: metricsData.totalPaidInvoicesChange,
      },
      {
        title: "Overdue Invoices",
        value: metricsData.totalOverdueInvoices,
        change: metricsData.totalOverdueInvoicesChange,
      },
      {
        title: "Total Revenue",
        value: "$" + metricsData.totalRevenue.toFixed(2),
        change: metricsData.totalRevenueChange,
      },
    ]);
  }, [summaryInvoices]);

  // export data
  const exportData = () => {
    exportOrdersAsJson<InvoiceSummaryMetrics>(
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

      <SummaryCards data={cardMetrics} isLoading={isFetchingSummaryInvoices} />

      <DataControls
        activeFilters={activeFilters}
        activeOrderBy={activeOrderBy}
        setActiveFilters={setActiveFilters}
        setActiveOrderBy={setActiveOrderBy}
        setPagination={setPagination}
        DrawerData={InvoiceFilterDrawerData}
        sortableFields={InvoiceSortableFields}
        filterOptions={InvoiceStatusFilters}
      />

      <TableView
        data={tableInvoices}
        isFetchingData={isFetchingTableInvoices}
        currentPage={pagination.page}
        totalPages={pagination?.totalPages ? pagination.totalPages : 0}
        setPagination={setPagination}
      >
        <DataTable<Invoice> data={tableInvoices} columns={tableColumns} />
      </TableView>
    </section>
  );
}
