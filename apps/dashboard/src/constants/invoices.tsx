import { getOrders } from "@/lib/actions/getOrders";
import { Invoice, SubmitData } from "@/types/invoices";
import { getInvoiceStatusDisplay } from "@/utils/invoices";
import { getTotalOrderLineQuantity } from "@/utils/shared";
import { InvoiceStatus, OrderType } from "@database/generated/prisma";
import { Button, Input, RecordActions } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  FormConfig,
  HeaderData,
  SortableField,
  Translator,
} from "app-core/src/types";

export const getInvoiceFilterDrawerData = (t: Translator): FilterDrawerData => {
  return {
    header: {
      title: t("filter_drawer.title"),
      desc: t("filter_drawer.subtitle"),
    },
    filterOptions: {
      status: {
        name: t("filter_drawer.fields.field-1.title"),
        options: [
          {
            label: t("filter_drawer.fields.field-1.options.label-1"),
            value: "All",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-2"),
            value: InvoiceStatus.Pending,
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-3"),
            value: InvoiceStatus.Paid,
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-4"),
            value: InvoiceStatus.Overdue,
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-5"),
            value: InvoiceStatus.Void,
          },
        ],
      },

      orderType: {
        name: t("filter_drawer.fields.field-2.title"),
        options: [
          {
            label: t("filter_drawer.fields.field-2.options.label-1"),
            value: "All",
          },
          {
            label: t("filter_drawer.fields.field-2.options.label-2"),
            value: OrderType.SALES,
          },
          {
            label: t("filter_drawer.fields.field-2.options.label-3"),
            value: OrderType.PURCHASE,
          },
        ],
      },
    },
  };
};

export const InvoiceSortableFields: SortableField[] = [
  {
    title: "sortable_fields.field-1",
    field: "invoiceNumber",
    direction: "desc",
  },
  { title: "sortable_fields.field-2", field: "invoiceDate", direction: "desc" },
  { title: "sortable_fields.field-3", field: "totalAmount", direction: "desc" },
  {
    title: "sortable_fields.field-4",
    field: "totalItemsQuantity",
    direction: "desc",
  },
];

export const InvoiceStatusFilters = {
  field: "status",
  values: ["All", "Paid", "Pending", "Overdue", "Void"],
};

export const headerData: HeaderData = {
  title: "Invoices",
  buttonTxt: "Create Invoice",
};

// =======
// Table
export function getTableColumns(
  t: Translator,
  formConfig: FormConfig<SubmitData>,
): Column<Invoice>[] {
  return [
    {
      key: "invoiceNumber",
      header: t("table.column-1"),
      render: (invoice) => (
        <span className="font-medium text-xs text-foreground">
          {invoice.invoiceNumber || "N/A"}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-xs text-gray-900",
    },
    {
      key: "invoiceDate",
      header: t("table.column-2"),
      render: (invoice) => (
        <span>
          {new Date(invoice.invoiceDate.$date).toLocaleDateString(undefined, {
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
      header: t("table.column-3"),
      render: (invoice) => (
        <span className="font-medium text-muted-foreground">
          {new Date(invoice.dueDate.$date).toLocaleDateString(undefined, {
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
      header: t("table.column-4"),
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
      header: t("table.column-5"),
      render: (invoice) => {
        const type = invoice.order.orderType;
        return (
          <p className="text-xs bg-border border border-muted-foreground w-[80px] font-semibold rounded-full capitalize py-1 mx-auto">
            {type.toLowerCase()}
          </p>
        );
      },
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "items",
      header: t("table.column-6"),
      render: (invoice) => (
        <span>{getTotalOrderLineQuantity(invoice.order.orderLines)}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "totalAmount",
      header: t("table.column-7"),
      render: (invoice) => (
        <span className="font-medium text-foreground">
          ${invoice.totalAmount.toFixed(2)}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-gray-900",
    },
    {
      key: "actions",
      header: t("table.column-8"),
      render: (invoice) => (
        <RecordActions<SubmitData>
          page="invoices_page"
          record={invoice}
          formConfig={formConfig}
        />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
}

// =======
// Form config
export async function getInvoiceFormConfig(
  t: Translator,
  organizationId: string,
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
    title: t("record_form.title_add"),
    description: t("record_form.description_add"),
    entityName: "Invoice",
    fields: [
      {
        name: "orderId",
        label: t("record_form.fields.order"),
        type: "select",
        required: true,
        options: orderOptions,
        gridArea: "1/2",
        placeholder: t("record_form.placeholders.order"),
      },
      {
        name: "invoiceNumber",
        label: t("record_form.fields.invoice_number"),
        type: "text",
        required: true,
        placeholder: t("record_form.placeholders.invoice_number"),
        gridArea: "1",
      },
      {
        name: "invoiceDate",
        label: t("record_form.fields.invoice_date"),
        type: "date",
        required: true,
        defaultValue: new Date().toISOString().split("T")[0],
        gridArea: "1/2",
      },
      {
        name: "dueDate",
        label: t("record_form.fields.due_date"),
        type: "date",
        required: true,
        gridArea: "1/2",
        placeholder: t("record_form.placeholders.due_date"),
      },
      {
        name: "totalAmount",
        label: t("record_form.fields.total_amount"),
        type: "number",
        required: true,
        placeholder: "0.00",
        step: 0.01,
        min: 0,
        gridArea: "1/2",
      },
      {
        name: "status",
        label: t("record_form.fields.status"),
        type: "select",
        required: true,
        defaultValue: "PENDING",
        options: [
          {
            id: InvoiceStatus.Pending,
            name: t("record_form.status_options.pending"),
          },
          {
            id: InvoiceStatus.Paid,
            name: t("record_form.status_options.paid"),
          },
          {
            id: InvoiceStatus.Overdue,
            name: t("record_form.status_options.overdue"),
          },
          {
            id: InvoiceStatus.Void,
            name: t("record_form.status_options.cancelled"),
          },
        ],
        gridArea: "1/2",
      },
    ],
    onSubmit: async (
      data: SubmitData,
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
          message: t("record_form.messages.required_error"),
        };
      }

      if (new Date(invoiceDate.$date) > new Date(dueDate.$date)) {
        return {
          ok: false,
          message: t("record_form.messages.date_error"),
        };
      }

      if (totalAmount <= 0) {
        return {
          ok: false,
          message: t("record_form.messages.amount_error"),
        };
      }

      try {
        const response = await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            invoiceDate: new Date(invoiceDate.$date),
            dueDate: new Date(dueDate.$date),
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return {
            ok: false,
            message: error || t("record_form.messages.create_error"),
          };
        }

        return {
          ok: true,
          message: t("record_form.messages.create_success", {
            num: invoiceNumber,
          }),
        };
      } catch (error) {
        return {
          ok: false,
          message: t("record_form.messages.create_error"),
        };
      }
    },
    onUpdate: async (
      id: string,
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      const {
        invoiceNumber,
        invoiceDate,
        dueDate,
        totalAmount,
        status,
        orderId,
      } = data;

      if (!id)
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };
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
          message: t("record_form.messages.required_error"),
        };
      }

      if (new Date(invoiceDate.$date) > new Date(dueDate.$date)) {
        return {
          ok: false,
          message: t("record_form.messages.date_error"),
        };
      }

      try {
        const response = await fetch(`/api/invoices/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            invoiceDate: new Date(invoiceDate.$date),
            dueDate: new Date(dueDate.$date),
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return {
            ok: false,
            message: error || t("record_form.messages.generic_error"),
          };
        }

        return {
          ok: true,
          message: t("record_form.messages.update_success", {
            num: invoiceNumber,
          }),
        };
      } catch (error) {
        return {
          ok: false,
          message: t("record_form.messages.generic_error"),
        };
      }
    },
    onDelete: async (
      recordId: string,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId)
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };

      try {
        const response = await fetch("/api/invoices", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recordId }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return {
            ok: false,
            message: error || t("record_form.messages.delete_error"),
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
}
