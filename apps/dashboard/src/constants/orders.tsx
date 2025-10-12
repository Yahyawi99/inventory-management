import { Input, Button } from "app-core/src/components";
import {
  FilterDrawerData,
  SortableField,
  Column,
  HeaderData,
  FormConfig,
} from "app-core/src/types";
import { Order, OrderStatus, OrderType, SubmitData } from "@/types/orders";
import { getOrderStatusDisplay } from "@/utils/orders";
import { getTotalOrderLineQuantity } from "@/utils/shared";

export const OrderFilterDrawerData: FilterDrawerData = {
  header: {
    title: "Filter Orders",
    desc: "Refine your Order list",
  },
  filterOptions: {
    status: {
      name: "Order Status",
      options: [
        { label: "All Status", value: "All" },
        { label: "Pending", value: OrderStatus.Pending },
        { label: "Processing", value: OrderStatus.Processing },
        { label: "Fulfilled (Shipped/Delivered)", value: "Fulfilled" },
        { label: "Cancelled", value: OrderStatus.Cancelled },
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
        { label: "Sales", value: OrderType.SALES },
        { label: "Purchase", value: OrderType.PURCHASE },
      ],
    },
  },
};

export const OrderSortableFields: SortableField[] = [
  { title: "Order Number", field: "orderNumber", direction: "desc" },
  { title: "Order Date", field: "orderDate", direction: "desc" },
  { title: "Total Amount", field: "totalAmount", direction: "desc" },
  { title: "Items Quantity", field: "totalItemsQuantity", direction: "desc" },
];

export const orderStatusFilters = {
  field: "status",
  values: ["All", "Pending", "Processing", "Fulfilled", "Cancelled"],
};

export const tableColumns: Column<Order>[] = [
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
    key: "orderNumber",
    header: "Order",
    render: (order) => (
      <span className="font-medium text-xs text-gray-900">
        {order.orderNumber || "N/A"}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-xs text-gray-900",
  },
  {
    key: "orderDate",
    header: "Date",
    render: (order) => (
      <span>
        {new Date(order.orderDate).toLocaleDateString("en-US", {
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
    key: "customer",
    header: "Customer",
    render: (order) => <span>{order.customer?.name || "N/A"}</span>,
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "supplier",
    header: "Supplier",
    render: (order) => <p>{order.supplier?.name || "N/A"}</p>,
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "w-fit text-center text-gray-700",
  },
  {
    key: "status",
    header: "Status",
    render: (order) => {
      const statusDisplay = getOrderStatusDisplay(order.status);
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
    key: "items",
    header: "Items",
    render: (order) => (
      <span>{getTotalOrderLineQuantity(order.orderLines)}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "totalAmount",
    header: "Total",
    render: (order) => (
      <span className="font-medium text-gray-900">
        ${order.totalAmount.toFixed(2)}
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

export const headerData: HeaderData = {
  title: "Orders",
  buttonTxt: "Create Order",
};

// --- ORDER FORM CONFIG ---
export async function getOrderFormConfig(): Promise<FormConfig<SubmitData>> {
  const customers = [];
  const suppliers = [];
  return {
    title: "Create New Order",
    description:
      "Select the order type and fill in the details for the new transaction.",
    entityName: "Order",
    fields: [
      {
        name: "orderType",
        label: "Order Type",
        type: "select",
        required: true,
        options: [
          { id: "PURCHASE", name: "Purchase Order" },
          { id: "SALES", name: "Sales Order" },
        ],
        gridArea: "1/2",
      },
      {
        name: "customerId",
        label: "Customer",
        type: "select",
        required: false,
        options: [
          { id: "c-001", name: "Acme Corp" },
          { id: "c-002", name: "Beta Retail" },
          { id: "c-003", name: "Cali Distributors" },
        ],
        gridArea: "1/2",
        dependsOn: {
          field: "orderType",
          value: "SALES",
        },
      },
      {
        name: "supplierId",
        label: "Supplier",
        type: "select",
        required: false,
        options: [
          { id: "s-001", name: "Global Suppliers Inc" },
          { id: "s-002", name: "Premium Wholesalers" },
          { id: "s-003", name: "Quality Materials Ltd" },
        ],
        gridArea: "1/2",
        dependsOn: {
          field: "orderType",
          value: "PURCHASE",
        },
      },
      {
        name: "orderDate",
        label: "Order Date",
        type: "date",
        required: true,
        defaultValue: new Date().toISOString().split("T")[0],
        gridArea: "1/2",
      },
      {
        name: "orderNumber",
        label: "Order Number",
        type: "text",
        required: true,
        placeholder: "PO-2024-001",
        gridArea: "1/2",
      },
      {
        name: "status",
        label: "Order Status",
        type: "select",
        required: true,
        defaultValue: "PENDING",
        options: [
          { id: "PENDING", name: "Pending" },
          { id: "CONFIRMED", name: "Confirmed" },
          { id: "PROCESSING", name: "Processing" },
          { id: "SHIPPED", name: "Shipped" },
          { id: "DELIVERED", name: "Delivered" },
          { id: "CANCELLED", name: "Cancelled" },
        ],
        gridArea: "1/2",
      },
      {
        name: "totalAmount",
        label: "Total Amount",
        type: "number",
        required: true,
        placeholder: "0.00",
        gridArea: "1/2",
      },
      {
        name: "notes",
        label: "Internal Notes",
        type: "textarea",
        required: false,
        placeholder: "Any special instructions or delivery details.",
        gridArea: "1",
        rows: 3,
      },
    ],
    onSubmit: async (
      data: SubmitData
    ): Promise<{ ok: boolean; message: string }> => {
      // Transform data to match Order schema
      // const orderData = {
      //   orderNumber: data.orderNumber,
      //   orderDate: new Date(data.orderDate),
      //   status: data.status,
      //   totalAmount: parseFloat(data.totalAmount),
      //   orderType: data.orderType,
      //   organizationId: data.organizationId, // Should be passed from context
      //   userId: data.userId, // Should be passed from context
      //   customerId: data.orderType === "SALES" ? data.customerId : null,
      //   supplierId: data.orderType === "PURCHASE" ? data.supplierId : null,
      // };

      // console.log("Submitting order:", orderData);
      return { ok: true, message: "string" };
      // await createOrder(orderData);
    },
  };
}

// --- SALES ORDER FORM CONFIG ---
export const salesOrderFormConfig: FormConfig<SubmitData> = {
  title: "Create New Order",
  description:
    "Select the order type and fill in the details for the new transaction.",
  entityName: "Order",
  fields: [
    {
      name: "type",
      label: "Order Type",
      type: "text",
      required: true,
      readOnly: true,
      defaultValue: "SALES",
      gridArea: "1/2",
    },
    {
      name: "partnerId",
      label: "Customer/Supplier",
      type: "select",
      required: true,
      options: [
        { id: "p-001", name: "Acme Corp" },
        { id: "p-002", name: "Beta Suppliers" },
        { id: "p-003", name: "Cali Retail" },
      ],
      gridArea: "1/2",
    },
    {
      name: "orderDate",
      label: "Order Date",
      type: "text", // Using text for date input simulation
      required: true,
      placeholder: "YYYY-MM-DD",
      gridArea: "1/2",
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "text", // Using text for date input simulation
      required: false,
      placeholder: "YYYY-MM-DD",
      gridArea: "1/2",
    },
    {
      name: "reference",
      label: "Reference Number",
      type: "text",
      required: false,
      placeholder: "PO-4567-B",
      gridArea: "1",
    },
    {
      name: "notes",
      label: "Internal Notes",
      type: "textarea",
      required: false,
      placeholder: "Any special instructions or delivery details.",
      gridArea: "1",
      rows: 3,
    },
  ],
  onSubmit: async (
    data: SubmitData
  ): Promise<{ ok: boolean; message: string }> => {
    // Your API call here
    return { ok: true, message: "" };
    // await createOrder(data);
  },
};

// --- PURCHASE ORDER FORM CONFIG ---
export const purchaseOrderFormConfig: FormConfig<SubmitData> = {
  title: "Create New Order",
  description:
    "Select the order type and fill in the details for the new transaction.",
  entityName: "Order",
  fields: [
    {
      name: "type",
      label: "Order Type",
      type: "select",
      required: true,
      options: [
        { id: "sale", name: "Sale Order (Customer)" },
        { id: "purchase", name: "Purchase Order (Supplier)" },
      ],
      gridArea: "1/2",
    },
    {
      name: "partnerId",
      label: "Customer/Supplier",
      type: "select",
      required: true,
      options: [
        { id: "p-001", name: "Acme Corp" },
        { id: "p-002", name: "Beta Suppliers" },
        { id: "p-003", name: "Cali Retail" },
      ],
      gridArea: "1/2",
    },
    {
      name: "orderDate",
      label: "Order Date",
      type: "text", // Using text for date input simulation
      required: true,
      placeholder: "YYYY-MM-DD",
      gridArea: "1/2",
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "text", // Using text for date input simulation
      required: false,
      placeholder: "YYYY-MM-DD",
      gridArea: "1/2",
    },
    {
      name: "reference",
      label: "Reference Number",
      type: "text",
      required: false,
      placeholder: "PO-4567-B",
      gridArea: "1",
    },
    {
      name: "notes",
      label: "Internal Notes",
      type: "textarea",
      required: false,
      placeholder: "Any special instructions or delivery details.",
      gridArea: "1",
      rows: 3,
    },
  ],
  onSubmit: async (
    data: SubmitData
  ): Promise<{ ok: boolean; message: string }> => {
    // Your API call here
    return { ok: true, message: "" };
    // await createOrder(data);
  },
};
