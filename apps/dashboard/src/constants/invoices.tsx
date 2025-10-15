import { getOrders } from "@/lib/actions/getOrders";
import { Invoice, SubmitData } from "@/types/invoices";
import { getInvoiceStatusDisplay } from "@/utils/invoices";
import { getTotalOrderLineQuantity } from "@/utils/shared";
import { InvoiceStatus, OrderType } from "@database/generated/prisma";
import { Button, Input } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  FormConfig,
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
        {new Date(invoice.invoiceDate.$date).toLocaleDateString("en-US", {
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
        {new Date(invoice.dueDate.$date).toLocaleDateString("en-US", {
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
        <p
          className={`text-xs bg-gray-100 w-[80px] font-semibold rounded-full capitalize py-1 mx-auto`}
        >
          {type.toLowerCase()}
        </p>
      );
    },
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center  text-gray-700",
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
        { label: "Pending", value: InvoiceStatus.Pending },
        { label: "Paid", value: InvoiceStatus.Paid },
        { label: "Overdue", value: InvoiceStatus.Overdue },
        { label: "Cancelled", value: InvoiceStatus.Void },
      ],
    },

    orderType: {
      name: "Order Type",
      options: [
        { label: "All Types", value: "All" },
        { label: "Sales", value: OrderType.SALES },
        { label: "Purchase", value: OrderType.PURCHASE },
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

export async function getInvoiceFormConfig(
  organizationId: string
): Promise<FormConfig<SubmitData>> {
  const orders = await getOrders(organizationId);

  const orderOptions = orders.map((order) => ({
    id: order.id,
    name: `${order.orderNumber} - ${
      order.orderType
    } - $${order.totalAmount.toFixed(2)}`,
    totalAmount: order.totalAmount,
  }));

  return {
    title: "Create New Invoice",
    description:
      "Generate an invoice for an existing order with payment terms.",
    entityName: "Invoice",
    fields: [
      {
        name: "orderId",
        label: "Order",
        type: "select",
        required: true,
        options: orderOptions,
        gridArea: "1/2",
        placeholder: "Select an order",
      },
      {
        name: "invoiceNumber",
        label: "Invoice Number",
        type: "text",
        required: true,
        placeholder: "INV-2024-001",
        gridArea: "1",
      },
      {
        name: "invoiceDate",
        label: "Invoice Date",
        type: "date",
        required: true,
        defaultValue: new Date().toISOString().split("T")[0],
        gridArea: "1/2",
      },
      {
        name: "dueDate",
        label: "Due Date",
        type: "date",
        required: true,
        gridArea: "1/2",
        placeholder: "Payment due date",
      },
      {
        name: "totalAmount",
        label: "Total Amount",
        type: "number",
        required: true,
        placeholder: "0.00",
        step: 0.01,
        min: 0,
        gridArea: "1/2",
      },
      {
        name: "status",
        label: "Invoice Status",
        type: "select",
        required: true,
        defaultValue: "PENDING",
        options: [
          { id: InvoiceStatus.Pending, name: "Pending" },
          { id: InvoiceStatus.Paid, name: "Paid" },
          { id: InvoiceStatus.Overdue, name: "Overdue" },
          { id: InvoiceStatus.Void, name: "Cancelled" },
        ],
        gridArea: "1/2",
      },
    ],
    onSubmit: async (
      data: SubmitData
    ): Promise<{ ok: boolean; message: string }> => {
      const {
        invoiceNumber,
        invoiceDate,
        dueDate,
        totalAmount,
        status,
        orderId,
      } = data;

      if (
        !invoiceNumber ||
        !invoiceDate ||
        !dueDate ||
        !totalAmount ||
        !status ||
        !orderId
      ) {
        return {
          ok: false,
          message: "Please fill in all required field!",
        };
      }
      if (new Date(invoiceDate) > new Date(dueDate)) {
        return {
          ok: false,
          message: "Invoice date cannot be after the due date",
        };
      }

      if (parseFloat(totalAmount) <= 0) {
        return {
          ok: false,
          message: "Total amount must be greater than zero",
        };
      }

      const invoiceData = {
        invoiceNumber: invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        totalAmount: parseFloat(totalAmount),
        status: status,
        orderId: orderId,
      };

      try {
        console.log("Submitting invoice:", invoiceData);
        // await createInvoice(invoiceData);
        return {
          ok: true,
          message: `Invoice ${invoiceNumber} created successfully`,
        };
      } catch (error) {
        console.error("Error creating invoice:", error);
        return {
          ok: false,
          message: "Failed to create invoice. Please try again.",
        };
      }
    },
  };
}
