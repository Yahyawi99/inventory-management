import { InvoiceStatus, OrderLine } from "@database/generated/prisma";
import { OrderType } from "./orders";

export interface Invoice {
  _id: string;
  status: InvoiceStatus;
  totalAmount: number;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  organizationId: string;
  userId: string;
  invoiceNumber: string;
  invoiceDate: { $date: Date };
  dueDate: { $date: Date };
  order: { orderNumber: string; orderType: OrderType; orderLines: OrderLine[] };
}

export interface Metrics {
  totalInvoices: number;
  totalPaidInvoices: number;
  totalOverdueInvoices: number;
  totalRevenue: number;
}

export interface InvoiceSummaryMetrics extends Metrics {
  totalInvoicesChange: number;
  totalPaidInvoicesChange: number;
  totalOverdueInvoicesChange: number;
  totalRevenueChange: number;
}

export interface ActiveFilters {
  status?: "All" | "Paid" | "Pending" | "Overdue" | "Void";
  search?: string;
  orderType?: "All" | OrderType;
}

export interface SubmitData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: string;
  status: InvoiceStatus;
  orderId: string;
}
