import { Category, SubmitData } from "@/types/categories";
import { getCategoryStockStatusDisplay } from "@/utils/categories";
import { RecordActions } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  FormConfig,
  SortableField,
  Translator,
} from "app-core/src/types";

export const headerData = {
  title: "Categories",
  buttonTxt: "Create Category",
};

export const categoriesFilterDrawerData: FilterDrawerData = {
  header: {
    title: "Filter Categories",
    desc: "Refine your Category list",
  },
  filterOptions: {
    status: {
      name: "Category's Stock Status",
      options: [
        { label: "All Categories", value: "All" },
        { label: "In Stock Categories", value: "In Stock" },
        { label: "Low Stock Categories", value: "Low Stock" },
        { label: "Out of Stock Categories", value: "Out of Stock" },
      ],
    },
  },
};

export const categorySortableFields: SortableField[] = [
  { title: "sortable_fields.field-1", field: "name", direction: "desc" },
  { title: "sortable_fields.field-2", field: "createdAt", direction: "desc" },
  { title: "sortable_fields.field-3", field: "stock", direction: "desc" },
];

export const categoryCategoryFilters = {
  field: "status",
  values: ["All", "In Stock", "Low Stock", "Out of Stock"],
};

// Table Data
export const getTableColumns = (t: Translator): Column<Category>[] => [
  {
    key: "name",
    header: "Category Name",
    render: (category) => (
      <span className="font-medium text-foreground">{category.name}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "createdAt",
    header: "Created On",
    render: (category) => (
      <span className="text-muted-foreground">
        {new Date(category.createdAt.$date).toLocaleDateString("en-US", {
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
    key: "productCount",
    header: "Products",
    render: (category) => (
      <span className="text-muted-foreground">{category.productCount}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },

  {
    key: "totalStock",
    header: "Total Stock",
    render: (category) => (
      <span className="text-muted-foreground">
        {category.totalStockQuantity}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "stockStatus",
    header: "Stock Status",
    render: (category) => {
      const statusDisplay = getCategoryStockStatusDisplay(
        category.totalStockQuantity,
      );
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
    header: "Action",
    render: (category) => (
      <RecordActions<SubmitData>
        page="inventory.categories_page"
        record={category}
        formConfig={getCategoryFormConfig(t)}
      />
    ),
    headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center px-4 py-3",
  },
];

// --- STOCK CATEGORY FORM CONFIG ---
export const getCategoryFormConfig = (
  t: Translator,
): FormConfig<SubmitData> => {
  return {
    title: t("record_form.title_add"),
    description: t("record_form.description_add"),
    entityName: "Category",
    fields: [
      {
        name: "name",
        label: t("record_form.fields.name"),
        type: "text",
        required: true,
        placeholder: t("record_form.placeholders.name"),
        gridArea: "1",
      },
      {
        name: "description",
        label: t("record_form.fields.description"),
        type: "textarea",
        required: false,
        placeholder: t("record_form.placeholders.description"),
        gridArea: "1",
        rows: 4,
      },
    ],
    onSubmit: async (
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!data.name) {
        return {
          ok: false,
          message: t("record_form.messages.required_error"),
        };
      }

      try {
        const response = await fetch("/api/inventory/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description || "",
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
          message: t("record_form.messages.create_success"),
        };
      } catch (error) {
        console.log("Failed to create Category");
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : t("record_form.messages.create_error"),
        };
      }
    },
    onUpdate: async (
      id: string,
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!data.name) {
        return {
          ok: false,
          message: t("record_form.messages.required_error"),
        };
      }

      if (!id) {
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };
      }

      try {
        const response = await fetch(`/api/inventory/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description || "",
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
          message: t("record_form.messages.update_success"),
        };
      } catch (error) {
        console.log("Failed to update Category");
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : t("record_form.messages.generic_error"),
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
        const response = await fetch(`/api/inventory/categories/${recordId}`, {
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
