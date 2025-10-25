import { Input, Button, RecordActions } from "app-core/src/components";
import {
  FilterDrawerData,
  SortableField,
  Column,
  HeaderData,
  FormConfig,
} from "app-core/src/types";
import { Order, OrderStatus, OrderType, SubmitData } from "@/types/orders";
import { FetchFormConfigData, getOrderStatusDisplay } from "@/utils/orders";
import { getTotalOrderLineQuantity } from "@/utils/shared";
import { getFormConfigData } from "@/lib/actions/getFormConfigData";
import { Product } from "@/types/products";

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

export function getTableColumns(
  formConfig: FormConfig<SubmitData>
): Column<Order>[] {
  return [
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
      render: (order: Order) => (
        <RecordActions<SubmitData> record={order} formConfig={formConfig} />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
}

export const headerData: HeaderData = {
  title: "Orders",
  buttonTxt: "Create Order",
};

// --- ORDER FORM CONFIG ---
// export async function getOrderFormConfig(
//   organizationId: string
// ): Promise<FormConfig<SubmitData>> {
//   const { customers, suppliers, products } = await FetchFormConfigData(
//     organizationId
//   );

//   return {
//     title: "Create New Order",
//     description:
//       "Select the order type and fill in the details for the new transaction.",
//     entityName: "Order",
//     fields: [
//       {
//         name: "orderType",
//         label: "Order Type",
//         type: "select",
//         required: true,
//         options: [
//           { id: "PURCHASE", name: "Purchase Order" },
//           { id: "SALES", name: "Sales Order" },
//         ],
//         gridArea: "1/2",
//       },
//       {
//         name: "customerId",
//         label: "Customer",
//         type: "select",
//         required: false,
//         options: customers,
//         gridArea: "1/2",
//         dependsOn: {
//           field: "orderType",
//           value: "SALES",
//         },
//       },
//       {
//         name: "supplierId",
//         label: "Supplier",
//         type: "select",
//         required: false,
//         options: suppliers,
//         gridArea: "1/2",
//         dependsOn: {
//           field: "orderType",
//           value: "PURCHASE",
//         },
//       },
//       {
//         name: "orderDate",
//         label: "Order Date",
//         type: "date",
//         required: true,
//         defaultValue: new Date().toISOString().split("T")[0],
//         gridArea: "1/2",
//       },
//       {
//         name: "orderNumber",
//         label: "Order Number",
//         type: "text",
//         required: true,
//         placeholder: "PO-2024-001",
//         gridArea: "1",
//       },
//       {
//         name: "status",
//         label: "Order Status",
//         type: "select",
//         required: true,
//         defaultValue: OrderStatus.Pending,
//         options: [
//           { id: OrderStatus.Pending, name: "Pending" },
//           { id: OrderStatus.Delivered, name: "Delivered" },
//           { id: OrderStatus.Processing, name: "Processing" },
//           { id: OrderStatus.Shipped, name: "Shipped" },
//           { id: OrderStatus.Cancelled, name: "Cancelled" },
//         ],
//         gridArea: "1/2",
//       },
//       {
//         name: "orderLines",
//         label: "Order Lines",
//         type: "repeater",
//         required: true,
//         gridArea: "1",
//         minItems: 1,
//         defaultValue: [{}],
//         fields: [
//           {
//             name: "productId",
//             label: "Product",
//             type: "select",
//             required: true,
//             defaultValue: "",
//             options: products,
//             gridArea: "1/3",
//           },
//           {
//             name: "quantity",
//             label: "Quantity",
//             type: "number",
//             required: true,
//             defaultValue: 1,
//             min: 1,
//             gridArea: "1/3",
//           },
//           {
//             name: "unitPrice",
//             label: "Unit Price",
//             type: "number",
//             required: true,
//             defaultValue: 0,
//             min: 0,
//             step: 0.01,
//             gridArea: "1/3",
//           },
//         ],
//       },
//     ],
//     onSubmit: async (
//       data: SubmitData
//     ): Promise<{ ok: boolean; message: string }> => {
//       const {
//         orderType,
//         customerId,
//         supplierId,
//         orderDate,
//         orderNumber,
//         status,
//         orderLines,
//       } = data;

//       const totalAmount = orderLines
//         .reduce(
//           (
//             sum: number,
//             ol: {
//               productId: string;
//               quantity: number;
//               unitPrice: number;
//             }
//           ) => {
//             const quantity = ol.quantity || 0;
//             const unitPrice = ol.unitPrice || 0;
//             return sum + quantity * unitPrice;
//           },
//           0
//         )
//         .toFixed(2);

//       if (!orderType || !orderDate || !orderNumber || !status) {
//         return { ok: false, message: "Please fill in the required fields!" };
//       }

//       if (!orderLines.length) {
//         return { ok: false, message: "You must have at least one orderLine!" };
//       } else {
//         const invalidLines = orderLines.filter(
//           (line) => !line.productId || !line.quantity || !line.unitPrice
//         );

//         if (invalidLines.length > 0) {
//           return {
//             ok: false,
//             message:
//               "All order lines must have a product, valid quantity, and price",
//           };
//         }
//       }

//       if (!customerId && !supplierId) {
//         return {
//           ok: false,
//           message: "Please provide either customerId or supplierId",
//         };
//       }

//       try {
//         const response = await fetch("/api/orders", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...data,
//             orderDate: new Date(data.orderDate),
//             totalAmount,
//           }),
//         });

//         if (!response.ok) {
//           const { error } = await response.json();
//           return {
//             ok: false,
//             message: error.message,
//           };
//         }

//         return {
//           ok: true,
//           message: "Order created Successfully",
//         };
//       } catch (error) {
//         return {
//           ok: false,
//           message:
//             error instanceof Error
//               ? error.message
//               : "Failed to create an Order!",
//         };
//       }
//     },
//   };
// }
// --- SALES ORDER FORM CONFIG ---
export async function getOrderFormConfig(
  organizationId: string,
  orderType: OrderType | null
): Promise<FormConfig<SubmitData>> {
  const { customers, suppliers, products } = await FetchFormConfigData(
    organizationId
  );

  const orderOptions = !orderType
    ? [
        { id: "PURCHASE", name: "Purchase Order" },
        { id: "SALES", name: "Sales Order" },
      ]
    : null;

  return {
    title: "Create New Order",
    description:
      "Select the order type and fill in the details for the new transaction.",
    entityName: "Order",
    fields: [
      {
        name: "type",
        label: "Order Type",
        type: orderType ? "text" : "select",
        required: true,
        readOnly: orderType === "PURCHASE" || orderType === "SALES",
        defaultValue: orderType ? orderType : "",
        options: orderOptions,
        gridArea: "1/2",
      },
      {
        name: "customerId",
        label: "Customer",
        type: "select",
        required: false,
        options: customers,
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
        options: suppliers,
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
        gridArea: "1",
      },
      {
        name: "status",
        label: "Order Status",
        type: "select",
        required: true,
        defaultValue: OrderStatus.Pending,
        options: [
          { id: OrderStatus.Pending, name: "Pending" },
          { id: OrderStatus.Delivered, name: "Delivered" },
          { id: OrderStatus.Processing, name: "Processing" },
          { id: OrderStatus.Shipped, name: "Shipped" },
          { id: OrderStatus.Cancelled, name: "Cancelled" },
        ],
        gridArea: "1/2",
      },
      {
        name: "orderLines",
        label: "Order Lines",
        type: "repeater",
        required: true,
        gridArea: "1",
        minItems: 1,
        defaultValue: [{}],
        fields: [
          {
            name: "productId",
            label: "Product",
            type: "select",
            required: true,
            defaultValue: "",
            options: products,
            gridArea: "1/3",
          },
          {
            name: "quantity",
            label: "Quantity",
            type: "number",
            required: true,
            defaultValue: 1,
            min: 1,
            gridArea: "1/3",
          },
          {
            name: "unitPrice",
            label: "Unit Price",
            type: "number",
            required: true,
            defaultValue: 0,
            min: 0,
            step: 0.01,
            gridArea: "1/3",
          },
        ],
      },
    ],
    onSubmit: async (
      data: SubmitData
    ): Promise<{ ok: boolean; message: string }> => {
      const {
        orderType,
        customerId,
        supplierId,
        orderDate,
        orderNumber,
        status,
        orderLines,
      } = data;

      const totalAmount = orderLines
        .reduce(
          (
            sum: number,
            ol: {
              productId: string;
              quantity: number;
              unitPrice: number;
            }
          ) => {
            const quantity = ol.quantity || 0;
            const unitPrice = ol.unitPrice || 0;
            return sum + quantity * unitPrice;
          },
          0
        )
        .toFixed(2);

      if (!orderType || !orderDate || !orderNumber || !status) {
        return { ok: false, message: "Please fill in the required fields!" };
      }

      if (!orderLines.length) {
        return { ok: false, message: "You must have at least one orderLine!" };
      } else {
        const invalidLines = orderLines.filter(
          (line) => !line.productId || !line.quantity || !line.unitPrice
        );

        if (invalidLines.length > 0) {
          return {
            ok: false,
            message:
              "All order lines must have a product, valid quantity, and price",
          };
        }
      }

      if (!customerId && !supplierId) {
        return {
          ok: false,
          message: "Please provide either customerId or supplierId",
        };
      }

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            orderDate: new Date(data.orderDate),
            totalAmount,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return {
            ok: false,
            message: error.message,
          };
        }

        return {
          ok: true,
          message: "Order created Successfully",
        };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to create an Order!",
        };
      }
    },
    onDelete: async (
      recordId: string
    ): Promise<{ ok: boolean; message: string }> => {
      return { ok: true, message: "string" };
    },
  };
}
