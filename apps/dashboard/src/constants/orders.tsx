import { RecordActions } from "app-core/src/components";
import {
  FilterDrawerData,
  SortableField,
  Column,
  HeaderData,
  FormConfig,
  Translator,
} from "app-core/src/types";
import { Order, OrderStatus, OrderType, SubmitData } from "@/types/orders";
import { FetchFormConfigData, getOrderStatusDisplay } from "@/utils/orders";
import { getTotalOrderLineQuantity } from "@/utils/shared";

export const headerData: HeaderData = {
  title: "Orders",
  buttonTxt: "Create Order",
};

export const getOrderFilterDrawerData = (t: Translator): FilterDrawerData => {
  return {
    header: {
      title: "Filter Orders",
      desc: "Refine your Order list",
    },
    filterOptions: {
      status: {
        name: "Order Status",
        options: [
          {
            label: t("filter_drawer.fields.field-1.options.label-1"),
            value: "All",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-2"),
            value: OrderStatus.Pending,
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-3"),
            value: OrderStatus.Processing,
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-4"),
            value: "Fulfilled",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-5"),
            value: OrderStatus.Cancelled,
          },
        ],
      },

      customerType: {
        name: "Customer Type",
        options: [
          {
            label: t("filter_drawer.fields.field-2.options.label-1"),
            value: "All",
          },
          { label: "B2B", value: "B2B" },
          { label: "B2c", value: "B2C" },
        ],
      },

      orderType: {
        name: "Order Type",
        options: [
          {
            label: t("filter_drawer.fields.field-3.options.label-1"),
            value: "All",
          },
          {
            label: t("filter_drawer.fields.field-3.options.label-2"),
            value: OrderType.SALES,
          },
          {
            label: t("filter_drawer.fields.field-3.options.label-3"),
            value: OrderType.PURCHASE,
          },
        ],
      },
    },
  };
};

export const orderStatusFilters = {
  field: "status",
  values: ["All", "Pending", "Processing", "Fulfilled", "Cancelled"],
};

export function getTableColumns(
  t: Translator,
  formConfig: FormConfig<SubmitData>,
): Column<Order>[] {
  return [
    {
      key: "orderNumber",
      header: t("table.column-1"),
      render: (order) => (
        <span className="font-medium text-xs text-foreground">
          {order.orderNumber || "N/A"}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-xs text-gray-900",
    },
    {
      key: "orderDate",
      header: t("table.column-2"),
      render: (order) => (
        <span>
          {new Date(order.orderDate).toLocaleDateString(undefined, {
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
      header: t("table.column-3"),
      render: (order) => <span>{order.customer?.name || "N/A"}</span>,
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "supplier",
      header: t("table.column-4"),
      render: (order) => <p>{order.supplier?.name || "N/A"}</p>,
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "w-fit text-center text-gray-700",
    },
    {
      key: "status",
      header: t("table.column-5"),
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
      header: t("table.column-6"),
      render: (order) => (
        <span>{getTotalOrderLineQuantity(order.orderLines)}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "totalAmount",
      header: t("table.column-7"),
      render: (order) => (
        <span className="font-medium text-foreground">
          ${order.totalAmount.toFixed(2)}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-gray-900",
    },
    {
      key: "actions",
      header: t("table.column-8"),
      render: (order: Order) => (
        <RecordActions<SubmitData>
          page="orders_page"
          record={order}
          formConfig={formConfig}
        />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
}

// --- ORDER FORM CONFIG ---
export const getOrderFormConfig = async (
  t: Translator,
  organizationId: string,
  orderType: OrderType | null,
): Promise<FormConfig<SubmitData>> => {
  const { customers, suppliers, products } =
    await FetchFormConfigData(organizationId);

  const orderOptions = !orderType
    ? [
        { id: "PURCHASE", name: t("record_form.order_types.purchase") },
        { id: "SALES", name: t("record_form.order_types.sales") },
      ]
    : null;

  return {
    title: t("record_form.title_add"),
    description: t("record_form.description_add"),
    entityName: "Order",
    fields: [
      {
        name: "orderType",
        label: t("record_form.fields.order_type"),
        type: orderType ? "text" : "select",
        required: true,
        readOnly: !!orderType,
        defaultValue: orderType || "",
        options: orderOptions,
        gridArea: "1/2",
      },
      {
        name: "customerId",
        label: t("record_form.fields.customer"),
        type: "select",
        required: false,
        options: customers,
        gridArea: "1/2",
        dependsOn: { field: "orderType", value: "SALES" },
      },
      {
        name: "supplierId",
        label: t("record_form.fields.supplier"),
        type: "select",
        required: false,
        options: suppliers,
        gridArea: "1/2",
        dependsOn: { field: "orderType", value: "PURCHASE" },
      },
      {
        name: "orderDate",
        label: t("record_form.fields.order_date"),
        type: "date",
        required: true,
        defaultValue: new Date().toISOString().split("T")[0],
        gridArea: "1/2",
      },
      {
        name: "orderNumber",
        label: t("record_form.fields.order_number"),
        type: "text",
        required: true,
        placeholder: t("record_form.placeholders.order_number"),
        gridArea: "1",
      },
      {
        name: "status",
        label: t("record_form.fields.status"),
        type: "select",
        required: true,
        defaultValue: OrderStatus.Pending,
        options: [
          {
            id: OrderStatus.Pending,
            name: t("record_form.status_options.pending"),
          },
          {
            id: OrderStatus.Delivered,
            name: t("record_form.status_options.delivered"),
          },
          {
            id: OrderStatus.Processing,
            name: t("record_form.status_options.processing"),
          },
          {
            id: OrderStatus.Shipped,
            name: t("record_form.status_options.shipped"),
          },
          {
            id: OrderStatus.Cancelled,
            name: t("record_form.status_options.cancelled"),
          },
        ],
        gridArea: "1/2",
      },
      {
        name: "orderLines",
        label: t("record_form.fields.order_lines"),
        type: "repeater",
        required: true,
        gridArea: "1",
        minItems: 1,
        defaultValue: [{}],
        fields: [
          {
            name: "productId",
            label: t("record_form.fields.product"),
            type: "select",
            required: true,
            options: products,
            gridArea: "1/3",
          },
          {
            name: "quantity",
            label: t("record_form.fields.quantity"),
            type: "number",
            required: true,
            defaultValue: 1,
            min: 1,
            gridArea: "1/3",
          },
          {
            name: "unitPrice",
            label: t("record_form.fields.unit_price"),
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
    onSubmit: async (data: SubmitData) => {
      if (!data.orderNumber || !data.orderLines?.length) {
        return { ok: false, message: t("record_form.messages.required_error") };
      }
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            orderDate: new Date(data.orderDate),
          }),
        });
        if (!response.ok)
          return { ok: false, message: (await response.json()).error };
        return { ok: true, message: t("record_form.messages.create_success") };
      } catch (e) {
        return { ok: false, message: t("record_form.messages.create_error") };
      }
    },
    onUpdate: async (
      id: string,
      data: SubmitData,
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

      if (!id) {
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };
      }

      const totalAmount = orderLines
        .reduce(
          (
            sum: number,
            ol: {
              productId: string;
              quantity: number;
              unitPrice: number;
            },
          ) => {
            const quantity = ol.quantity || 0;
            const unitPrice = ol.unitPrice || 0;
            return sum + quantity * unitPrice;
          },
          0,
        )
        .toFixed(2);

      if (!orderType || !orderDate || !orderNumber || !status) {
        return { ok: false, message: t("record_form.messages.required_error") };
      }

      if (!orderLines.length) {
        return {
          ok: false,
          message: t("record_form.messages.no_orderLine_error"),
        };
      } else {
        const invalidLines = orderLines.filter(
          (line) => !line.productId || !line.quantity || !line.unitPrice,
        );

        if (invalidLines.length > 0) {
          return {
            ok: false,
            message: t("record_form.messages.orderLine_data_error"),
          };
        }
      }

      if (!customerId && !supplierId) {
        return {
          ok: false,
          message: t("record_form.messages.customer_supplier_error"),
        };
      }

      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: "PUT",
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
          message: t("record_form.messages.update_success"),
        };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : t("record_form.messages.update_error"),
        };
      }
    },
    onDelete: async (
      recordId: string,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId) {
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };
      }

      try {
        const response = await fetch("/api/orders", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recordId }),
        });

        if (!response.ok) {
          const { error } = await response.json();

          return {
            ok: false,
            message: error,
          };
        }

        return {
          ok: true,
          message: t("record_form.messages.delete_success"),
        };
      } catch (error) {
        return {
          ok: false,
          message: t("record_form.messages.delete_error"),
        };
      }
    },
  };
};

export const getOrderSortableFields: SortableField[] = [
  {
    title: "sortable_fields.field-1",
    field: "orderNumber",
    direction: "desc",
  },
  {
    title: "sortable_fields.field-2",
    field: "orderDate",
    direction: "desc",
  },
  {
    title: "sortable_fields.field-3",
    field: "totalAmount",
    direction: "desc",
  },
  {
    title: "sortable_fields.field-4",
    field: "totalItemsQuantity",
    direction: "desc",
  },
];
