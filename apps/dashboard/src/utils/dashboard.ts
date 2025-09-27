// Expenses Metrics

import { Invoice } from "@/types/invoices";
import { FinancialDashboardMetrics } from "app-core/src/types";
import { getDateRangesForComparison } from "./dateHelpers";
import { InvoiceStatus } from "@database/generated/prisma";
import { calculatePercentageChange } from "./shared";

// ===================
// 1. Filter Invoices by Period
const filterByDate = (
  invoice: Invoice,
  period: { startDate: Date; endDate: Date }
) => {
  const invoiceDate = new Date(invoice.invoiceDate.$date);
  return invoiceDate >= period.startDate && invoiceDate <= period.endDate;
};

// ===================
// Calculate Totals
const calculateTotals = (invoices: Invoice[]) => {
  const statusTotals = {
    [InvoiceStatus.Paid]: 0,
    [InvoiceStatus.Pending]: 0,
    [InvoiceStatus.Overdue]: 0,
    [InvoiceStatus.Void]: 0,
  };

  invoices.forEach((inv) => {
    statusTotals[inv.status] += inv.totalAmount;
  });

  const totalSalesRevenue = statusTotals[InvoiceStatus.Paid];
  const outstandingReceivables =
    statusTotals[InvoiceStatus.Pending] + statusTotals[InvoiceStatus.Overdue];
  const revenueLossFromVoids = statusTotals[InvoiceStatus.Void];
  const grossSalesTotal =
    totalSalesRevenue + outstandingReceivables + revenueLossFromVoids;

  return {
    totalSalesRevenue,
    outstandingReceivables,
    revenueLossFromVoids,
    grossSalesTotal,
  };
};

// ===================
// Metrics calculation
export const calculateExpensesFinancialMetrics = (
  allInvoices: Invoice[]
): FinancialDashboardMetrics => {
  const { current: currentPeriod, previous: previousPeriod } =
    getDateRangesForComparison();

  const currentPeriodInvoices = allInvoices.filter((inv) =>
    filterByDate(inv, currentPeriod)
  );
  const previousPeriodInvoices = allInvoices.filter((inv) =>
    filterByDate(inv, previousPeriod)
  );

  //  Calculate Values for Current and Previous Periods
  const current = calculateTotals(currentPeriodInvoices);
  const previous = calculateTotals(previousPeriodInvoices);

  // Calculate Final Metrics and Changes
  return {
    totalSalesRevenue: {
      value: current.totalSalesRevenue,
      change: calculatePercentageChange(
        current.totalSalesRevenue,
        previous.totalSalesRevenue
      ),
    },
    outstandingReceivables: {
      value: current.outstandingReceivables,
      change: calculatePercentageChange(
        current.outstandingReceivables,
        previous.outstandingReceivables
      ),
    },
    revenueLossFromVoids: {
      value: current.revenueLossFromVoids,
      change: calculatePercentageChange(
        current.revenueLossFromVoids,
        previous.revenueLossFromVoids
      ),
    },
    grossSalesTotal: {
      value: current.grossSalesTotal,
      change: calculatePercentageChange(
        current.grossSalesTotal,
        previous.grossSalesTotal
      ),
    },
  };
};
