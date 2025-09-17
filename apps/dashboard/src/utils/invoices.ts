import { InvoiceStatus } from "@database/generated/prisma";
import {
  getDateRangesForComparison,
  isDateWithinRange,
} from "@/utils/dateHelpers";
import { calculatePercentageChange } from "./shared";
import { Invoice, InvoiceSummaryMetrics, Metrics } from "@/types/invoices";

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
    const invoiceDate = new Date(invoice.invoiceDate);

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
