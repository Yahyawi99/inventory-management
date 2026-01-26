import { Stock, SubmitData } from "@/types/stocks";
import { FetchFormConfigData } from "@/utils/orders";
import { getStockStatusDisplay } from "@/utils/stocks";
import { RecordActions } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  FormConfig,
  HeaderData,
  SortableField,
  Translator,
} from "app-core/src/types";

export const headerData: HeaderData = {
  title: "Stock",
  buttonTxt: "Create Stock",
};

export const stockSortableFields: SortableField[] = [
  { title: "sortable_fields.field-1", field: "name", direction: "desc" },
  { title: "sortable_fields.field-2", field: "createdAt", direction: "desc" },
  { title: "sortable_fields.field-3", field: "value", direction: "desc" },
  { title: "sortable_fields.field-4", field: "quantity", direction: "desc" },
];

export const stockStatusFilters = {
  field: "status",
  values: ["All", "Available", "Low", "Empty"],
};

export const getStockFilterDrawerData = (t: Translator): FilterDrawerData => {
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
            value: "Available",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-3"),
            value: "Low",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-4"),
            value: "Empty",
          },
        ],
      },
    },
  };
};

// --- STOCK TABLE COLUMNS ---
export const getTableColumns = (
  t: Translator,
  formConfig: FormConfig<SubmitData>,
): Column<Stock>[] => [
  {
    key: "name",
    header: t("table.column-1"),
    render: (stock) => (
      <span className="font-medium text-foreground">{stock.name}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "location",
    header: t("table.column-2"),
    render: (stock) => (
      <span className="text-muted-foreground">
        {stock.location ? stock.location : "N/A"}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "value",
    header: t("table.column-3"),
    render: (stock) => (
      <span className="text-muted-foreground">
        ${stock.totalValue.toFixed(2)}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "quantity",
    header: t("table.column-4"),
    render: (stock) => (
      <span className="font-medium text-foreground">{stock.totalQuantity}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "stockStatus",
    header: t("table.column-5"),
    render: (stock) => {
      const statusDisplay = getStockStatusDisplay(stock.totalQuantity);
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
    key: "actions",
    header: t("table.column-6"),
    render: (stock: Stock) => (
      <RecordActions<SubmitData>
        page="inventory.stocks_page"
        record={stock}
        formConfig={formConfig}
      />
    ),
    headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center px-4 py-3",
  },
];

// --- STOCK LOCATION FORM CONFIG ---
export const getStockLocationFormConfig = async (
  t: Translator,
  organizationId: string,
): Promise<FormConfig<SubmitData>> => {
  const data = await FetchFormConfigData(organizationId);

  const { products } = data;

  const productOptions = products.map((product) => ({
    id: product.id,
    name: product.name,
  }));

  return {
    title: t("record_form.title_add"),
    description: t("record_form.description_add"),
    entityName: "Stock Location",
    fields: [
      {
        name: "name",
        label: t("record_form.fields.name"),
        type: "text",
        required: true,
        placeholder: t("record_form.placeholders.name"),
        gridArea: "1/2",
      },
      {
        name: "locationDetail",
        label: t("record_form.fields.location_detail"),
        type: "text",
        required: false,
        placeholder: t("record_form.placeholders.location_detail"),
        gridArea: "1/2",
      },
      {
        name: "stockItems",
        label: t("record_form.fields.stock_items"),
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
            options: productOptions,
            gridArea: "1/2",
          },
          {
            name: "quantity",
            label: t("record_form.fields.quantity"),
            type: "number",
            required: true,
            defaultValue: 0,
            min: 0,
            step: 1,
            gridArea: "1/2",
          },
        ],
      },
    ],
    onSubmit: async (
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!data.name || !data.stockItems?.length) {
        return { ok: false, message: t("record_form.messages.required_error") };
      }

      const invalidItems = data.stockItems.filter(
        (item) => !item.productId || Number(item.quantity) < 0,
      );

      if (invalidItems.length > 0) {
        return { ok: false, message: t("record_form.messages.generic_error") };
      }

      try {
        const response = await fetch("/api/inventory/stocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            location: data.location || null,
            organizationId,
            stockItems: data.stockItems.map((item: any) => ({
              productId: item.productId,
              quantity: parseInt(item.quantity),
            })),
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return { ok: false, message: error };
        }

        return { ok: true, message: t("record_form.messages.create_success") };
      } catch (error) {
        return { ok: false, message: t("record_form.messages.create_error") };
      }
    },
    onUpdate: async (
      id: string,
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!data.name || !id) {
        return { ok: false, message: t("record_form.messages.required_error") };
      }

      try {
        const response = await fetch(`/api/inventory/stocks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            location: data.location || null,
            organizationId,
            stockItems: data.stockItems.map((item: any) => ({
              productId: item.productId,
              quantity: parseInt(item.quantity),
            })),
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return { ok: false, message: error };
        }

        return { ok: true, message: t("record_form.messages.update_success") };
      } catch (error) {
        return { ok: false, message: t("record_form.messages.generic_error") };
      }
    },
    onDelete: async (
      recordId: string,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId)
        return { ok: false, message: t("record_form.messages.id_required") };

      try {
        const response = await fetch(`/api/inventory/stocks/${recordId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const { error } = await response.json();
          return { ok: false, message: error };
        }

        return { ok: true, message: t("record_form.messages.delete_success") };
      } catch (error) {
        return { ok: false, message: t("record_form.messages.delete_error") };
      }
    },
  };
};
