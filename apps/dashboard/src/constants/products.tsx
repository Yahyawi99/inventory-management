import { Product, SubmitData } from "@/types/products";
import {
  buildCategoriesOptions,
  getProductStockStatusDisplay,
  getTotalProductStockQuantity,
} from "@/utils/products";
import { RecordActions } from "app-core/src/components";
import {
  Column,
  SortableField,
  FilterDrawerData,
  FormConfig,
  Translator,
} from "app-core/src/types";

export async function getProductFilterDrawerData(
  t: Translator,
): Promise<FilterDrawerData> {
  const categoryOptions = await buildCategoriesOptions(t);

  return {
    header: {
      title: "Filter Products",
      desc: "Refine your Product list",
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
            value: "In Stock",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-3"),
            value: "Low Stock",
          },
          {
            label: t("filter_drawer.fields.field-1.options.label-4"),
            value: "Out of Stock",
          },
        ],
      },
      category: {
        name: t("filter_drawer.fields.field-2.title"),
        options: categoryOptions,
      },
    },
  };
}

export const productSortableFields: SortableField[] = [
  { title: "sortable_fields.field-1", field: "name", direction: "desc" },
  { title: "sortable_fields.field-2", field: "createdAt", direction: "desc" },
  { title: "sortable_fields.field-3", field: "price", direction: "desc" },
  { title: "sortable_fields.field-4", field: "stock", direction: "desc" },
];

export const productCategoryFilters = {
  field: "status",
  values: ["All", "In Stock", "Low Stock", "Out of Stock"],
};

export const headerData = {
  title: "Products",
  buttonTxt: "Create Product",
};

// ===================
// Creation Form

export async function getProductFormConfig(
  t: Translator,
): Promise<FormConfig<SubmitData>> {
  const categoryOptions = await buildCategoriesOptions(t);
  const formattedCategories = categoryOptions
    .filter((ele) => ele.id)
    .map((element, i) => {
      return { id: element.id, name: element.value };
    }) as { id: string; name: string }[];

  return {
    title: t("product_form.title_add"),
    description: t("product_form.description"),
    entityName: "Product",
    fields: [
      {
        name: "name",
        label: t("product_form.fields.name"),
        type: "text",
        required: true,
        placeholder: t("product_form.placeholders.name"),
        gridArea: "1",
      },
      {
        name: "sku",
        label: t("product_form.fields.sku"),
        type: "text",
        required: true,
        placeholder: t("product_form.placeholders.sku"),
        gridArea: "1/2",
      },
      {
        name: "price",
        label: t("product_form.fields.price"),
        type: "number",
        required: true,
        placeholder: t("product_form.placeholders.price"),
        gridArea: "1/2",
        step: 0.01,
      },
      {
        name: "barcode",
        label: t("product_form.fields.barcode"),
        type: "text",
        required: false,
        placeholder: t("product_form.placeholders.barcode"),
        gridArea: "1/2",
      },
      {
        name: "categoryId",
        label: t("product_form.fields.category"),
        type: "select",
        required: true,
        options: formattedCategories,
        gridArea: "1/2",
      },
      {
        name: "description",
        label: t("product_form.fields.product_description"),
        type: "textarea",
        required: false,
        placeholder: t("product_form.placeholders.product_description"),
        gridArea: "1",
        rows: 4,
      },
    ],
    onSubmit: async (
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      const { name, description, sku, barcode, price, categoryId } = data;

      if (!name || !sku || !price || !price || !categoryId) {
        return {
          ok: false,
          message: t("product_form.messages.required_error"),
        };
      }

      try {
        const response = await fetch("/api/inventory/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: description ? description : "",
            sku,
            barcode: barcode ? barcode : "",
            price,
            categoryId,
          }),
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
          message: t("product_form.messages.create_success"),
        };
      } catch (error) {
        console.log("Failed to create Product");
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : t("product_form.messages.create_error"),
        };
      }
    },
    onUpdate: async (
      id: string,
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      const { name, description, sku, barcode, price, categoryId } = data;

      if (!name || !sku || !price || !price || !categoryId) {
        return {
          ok: false,
          message: t("product_form.messages.required_error"),
        };
      }

      if (!id) {
        return { ok: false, message: t("product_form.messages.id_required") };
      }

      try {
        const response = await fetch(`/api/inventory/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: description ? description : "",
            sku,
            barcode: barcode ? barcode : "",
            price,
            categoryId,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return {
            ok: false,
            message: error,
          };
        }

        return { ok: true, message: t("product_form.messages.update_success") };
      } catch (error) {
        console.log("Failed to update Product");
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : t("product_form.messages.update_error"),
        };
      }
    },
    onDelete: async (
      recordId: string,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId) {
        return {
          ok: false,
          message: t("product_form.messages.id_required"),
        };
      }

      try {
        const response = await fetch(`/api/inventory/products/${recordId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const { error } = await response.json();

          return {
            ok: false,
            message: error,
          };
        }

        return { ok: true, message: t("product_form.messages.delete_success") };
      } catch (error) {
        return {
          ok: false,
          message: t("product_form.messages.delete_error"),
        };
      }
    },
  };
}

// =========================================

// --- Product-Specific Table Columns ---
export function getTableColumns(
  t: Translator,
  formConfig: FormConfig<SubmitData>,
): Column<Product>[] {
  return [
    {
      key: "name",
      header: t("table.column-1"),
      render: (product) => (
        <span className="font-medium text-foreground">{product.name}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-gray-900",
    },
    {
      key: "sku",
      header: t("table.column-2"),
      render: (product) => (
        <span className="text-muted-foreground">{product.sku}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "category",
      header: t("table.column-3"),
      render: (product) => (
        <span className="text-muted-foreground">
          {product.category ? product.category.name : "N/A"}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "price",
      header: t("table.column-4"),
      render: (product) => (
        <span className="font-medium text-foreground">
          ${product.price.toFixed(2)}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-gray-900",
    },
    {
      key: "stockStatus",
      header: t("table.column-5"),
      render: (product) => {
        const statusDisplay = getProductStockStatusDisplay(product.stockItems);
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
      key: "totalStock",
      header: t("table.column-6"),
      render: (product) => (
        <span className="text-muted-foreground">
          {getTotalProductStockQuantity(product.stockItems)}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "actions",
      header: t("table.column-7"),
      render: (product: Product) => (
        <RecordActions<SubmitData>
          page="inventory.products_page.record_delete"
          record={product}
          formConfig={formConfig}
        />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
}
