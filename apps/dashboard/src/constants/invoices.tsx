import { HeaderData, SortableField } from "app-core/src/types";

export const InvoiceSortableFields: SortableField[] = [
  { title: "Invoice Number", field: "invoiceNumber", direction: "desc" },
  { title: "Invoice Date", field: "invoiceDate", direction: "desc" },
  { title: "Total Amount", field: "totalAmount", direction: "desc" },
  { title: "Items Quantity", field: "totalItemsQuantity", direction: "desc" },
];

export const InvoiceStatusFilters = {
  field: "status",
  values: ["All", "Paid", "Pending", "Overdue", "Void"],
};

export const headerData: HeaderData = {
  title: "Invoices",
  buttonTxt: "Create Invoice",
};
