import {
  getDateRangesForComparison,
  isDateWithinRange,
} from "@/utils/dateHelpers";
import { calculatePercentageChange } from "./shared";
import {
  ActiveFilters,
  Invoice,
  InvoiceSummaryMetrics,
  Metrics,
} from "@/types/invoices";
import { Pagination, SortConfig, StatusDisplay } from "app-core/src/types";
import { InvoiceStatus } from "@database/generated/prisma";

// generate Metrics data
const accumulateMetrics = (metrics: Metrics, invoice: Invoice) => {
  metrics.totalInvoices++;
  metrics.totalRevenue += invoice.totalAmount;

  if (invoice.status === "Paid") {
    metrics.totalPaidInvoices++;
  }
  if (invoice.status === "Overdue") {
    metrics.totalOverdueInvoices++;
  }
};

export const getInvoiceSummaryMetrics = (
  invoices: Invoice[]
): InvoiceSummaryMetrics => {
  const { current: currentPeriodRange, previous: previousPeriodRange } =
    getDateRangesForComparison();

  const currentPeriodMetrics: Metrics = {
    totalInvoices: 0,
    totalPaidInvoices: 0,
    totalOverdueInvoices: 0,
    totalRevenue: 0,
  };

  const previousPeriodMetrics: Metrics = {
    totalInvoices: 0,
    totalPaidInvoices: 0,
    totalOverdueInvoices: 0,
    totalRevenue: 0,
  };

  invoices.forEach((invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate.$date);

    if (
      isDateWithinRange(
        invoiceDate,
        currentPeriodRange.startDate,
        currentPeriodRange.endDate
      )
    ) {
      accumulateMetrics(currentPeriodMetrics, invoice);
    } else if (
      isDateWithinRange(
        invoiceDate,
        previousPeriodRange.startDate,
        previousPeriodRange.endDate
      )
    ) {
      accumulateMetrics(previousPeriodMetrics, invoice);
    }
  });

  return {
    totalInvoices: currentPeriodMetrics.totalInvoices,
    totalPaidInvoices: currentPeriodMetrics.totalPaidInvoices,
    totalOverdueInvoices: currentPeriodMetrics.totalOverdueInvoices,
    totalRevenue: currentPeriodMetrics.totalRevenue,

    totalInvoicesChange: calculatePercentageChange(
      currentPeriodMetrics.totalInvoices,
      previousPeriodMetrics.totalInvoices
    ),
    totalPaidInvoicesChange: calculatePercentageChange(
      currentPeriodMetrics.totalPaidInvoices,
      previousPeriodMetrics.totalPaidInvoices
    ),
    totalOverdueInvoicesChange: calculatePercentageChange(
      currentPeriodMetrics.totalOverdueInvoices,
      previousPeriodMetrics.totalOverdueInvoices
    ),
    totalRevenueChange: calculatePercentageChange(
      currentPeriodMetrics.totalRevenue,
      previousPeriodMetrics.totalRevenue
    ),
  };
};

// generate api URL for table orders data fetching
export const buildInvoicesApiUrl = (
  base: string,
  activeFilters: ActiveFilters,
  activeOrderBy: SortConfig,
  pagination: Pagination
): string => {
  const queryParams = new URLSearchParams();

  if (activeFilters.status && activeFilters.status !== "All") {
    queryParams.append("status", activeFilters.status);
  }

  if (activeFilters.search) {
    queryParams.append("search", activeFilters.search);
  }

  if (activeFilters.orderType && activeFilters.orderType !== "All") {
    queryParams.append("orderType", activeFilters.orderType);
  }

  if (activeOrderBy) {
    queryParams.append("orderBy", JSON.stringify(activeOrderBy));
  }

  if (pagination) {
    queryParams.append("page", pagination.page + "");
  }

  const queryString = queryParams.toString();
  return `${base}${queryString ? `?${queryString}` : ""}`;
};

// status styles for the invoice table
export const getInvoiceStatusDisplay = (
  status: InvoiceStatus
): StatusDisplay => {
  switch (status) {
    case InvoiceStatus.Pending:
      return { text: "Pending", colorClass: "bg-yellow-100 text-yellow-800" };
    case InvoiceStatus.Overdue:
      return { text: "Overdue", colorClass: "bg-purple-100 text-purple-800" };
    case InvoiceStatus.Paid:
      return { text: "Paid", colorClass: "bg-green-100 text-green-800" };
    case InvoiceStatus.Void:
      return { text: "Void", colorClass: "bg-red-100 text-red-800" };
    default:
      return { text: "Unknown", colorClass: "bg-gray-200 text-gray-700" };
  }
};
