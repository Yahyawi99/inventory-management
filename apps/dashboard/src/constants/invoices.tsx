import { Invoice } from "@/types/invoices";
import { getInvoiceStatusDisplay } from "@/utils/invoices";
import { getTotalOrderLineQuantity } from "@/utils/shared";
import { OrderType } from "@database/generated/prisma";
import { Button, Input } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  HeaderData,
  SortableField,
} from "app-core/src/types";

// =======
export const tableColumns: Column<Invoice>[] = [
  {
    key: "checkbox",
    header: (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    render: (order) => (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    headClass: "w-[50px] px-4 py-3",
    cellClass: "text-center px-4 py-3",
  },
  {
    key: "invoiceNumber",
    header: "Invoice",
    render: (invoice) => (
      <span className="font-medium text-xs text-gray-900">
        {invoice.invoiceNumber || "N/A"}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-xs text-gray-900",
  },
  {
    key: "invoiceDate",
    header: "Date",
    render: (invoice) => (
      <span>
        {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "dueDate",
    header: "Due Date",
    render: (invoice) => (
      <span className="font-medium text-gray-800">
        {new Date(invoice.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },

  {
    key: "status",
    header: "Status",
    render: (invoice) => {
      const statusDisplay = getInvoiceStatusDisplay(invoice.status);
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.colorClass}`}
        >
          {statusDisplay.text}
        </span>
      );
    },
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center",
  },
  {
    key: "orderType",
    header: "Transaction Type",
    render: (invoice) => {
      const type = invoice.order.orderType;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
            type === OrderType.SALES
              ? "bg-lime-100 text-lime-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {type.toLowerCase()}
        </span>
      );
    },
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "w-fit text-center text-gray-700",
  },
  {
    key: "items",
    header: "Items",
    render: (invoice) => (
      <span>{getTotalOrderLineQuantity(invoice.order.orderLines)}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "totalAmount",
    header: "Total",
    render: (invoice) => (
      <span className="font-medium text-gray-900">
        ${invoice.totalAmount.toFixed(2)}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "actions",
    header: "Action",
    render: () => (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-500 hover:text-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-edit"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </Button>
      </div>
    ),
    headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center px-4 py-3",
  },
];

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
        { label: "Paid", value: "Paid" },
        { label: "Overdue", value: "OverDue" },
        { label: "Cancelled", value: "Void" },
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
