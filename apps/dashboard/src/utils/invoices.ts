import { InvoiceStatus } from "@database/generated/prisma";

// Define the types based on the provided schema.
interface Invoice {
  id: string;
  invoiceDate: Date;
  totalAmount: number;
  status: InvoiceStatus;
}

interface Metrics {
  totalInvoices: number;
  totalPaidInvoices: number;
  totalOverdueInvoices: number;
  totalRevenue: number;
}

interface InvoiceSummaryMetrics extends Metrics {
  totalInvoicesChange: number;
  totalPaidInvoicesChange: number;
  totalOverdueInvoicesChange: number;
  totalRevenueChange: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Calculates the percentage change between a current and a previous value.
 * Handles division by zero gracefully.
 * @param currentValue The new value.
 * @param previousValue The old value.
 * @returns The percentage change.
 */
const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Accumulates metrics based on a single invoice.
 * @param metrics The metrics object to be updated.
 * @param invoice The invoice to process.
 */
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

/**
 * Gets date ranges for a simple "current period vs. previous period" comparison.
 * This example uses the last 30 days versus the 30 days before that.
 * @returns An object containing the current and previous date ranges.
 */
const getDateRangesForComparison = (): {
  current: DateRange;
  previous: DateRange;
} => {
  const now = new Date();
  const currentPeriodEnd = new Date(now);
  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(now.getDate() - 30);

  const previousPeriodEnd = new Date(currentPeriodStart);
  previousPeriodEnd.setDate(currentPeriodStart.getDate() - 1);
  const previousPeriodStart = new Date(previousPeriodEnd);
  previousPeriodStart.setDate(previousPeriodEnd.getDate() - 30);

  return {
    current: { startDate: currentPeriodStart, endDate: currentPeriodEnd },
    previous: { startDate: previousPeriodStart, endDate: previousPeriodEnd },
  };
};

/**
 * Checks if a given date falls within a specified date range.
 * @param date The date to check.
 * @param startDate The start date of the range.
 * @param endDate The end date of the range.
 * @returns True if the date is within the range, otherwise false.
 */
const isDateWithinRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Calculates a summary of key metrics for a list of invoices, comparing the current period to the previous one.
 * @param invoices An array of invoice objects.
 * @returns An object containing current period metrics and their percentage change from the previous period.
 */
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
