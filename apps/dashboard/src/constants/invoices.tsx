import {
  FilterDrawerData,
  HeaderData,
  SortableField,
} from "app-core/src/types";

export const InvoiceFilterDrawerData: FilterDrawerData = {
  header: {
    title: "Filter Invoices",
    desc: "Refine your Invoice list",
  },
  filterOptions: {
    status: {
      name: "Invoice Status",
      options: [
        { label: "All Invoices", value: "All" },
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
