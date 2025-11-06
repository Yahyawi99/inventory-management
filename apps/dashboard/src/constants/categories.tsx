import { Category, SubmitData } from "@/types/categories";
import { getCategoryStockStatusDisplay } from "@/utils/categories";
import { Input, RecordActions } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  FormConfig,
  SortableField,
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
  { title: "Name", field: "name", direction: "desc" },
  { title: "Date", field: "createdAt", direction: "desc" },
  { title: "Total Stock", field: "stock", direction: "desc" },
];

export const categoryCategoryFilters = {
  field: "status",
  values: ["All", "In Stock", "Low Stock", "Out of Stock"],
};

// Table Data
export const tableColumns: Column<Category>[] = [
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
        category.totalStockQuantity
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
        record={category}
        formConfig={CategoryFormConfig}
      />
    ),
    headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center px-4 py-3",
  },
];

// --- STOCK CATEGORY FORM CONFIG ---
export const CategoryFormConfig: FormConfig<SubmitData> = {
  title: "Add New Category",
  description:
    "Create a new category for organizing stock and inventory items.",
  entityName: "Category",
  fields: [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      placeholder: "Electronics",
      gridArea: "1",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "A brief description of the items this category will hold.",
      gridArea: "1",
      rows: 4,
    },
  ],
  onSubmit: async (
    data: SubmitData
  ): Promise<{ ok: boolean; message: string }> => {
    if (!data.name) {
      return { ok: false, message: "Category name is required!" };
    }

    try {
      const response = await fetch("/api/inventory/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
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
        message: "Category created successfully.",
      };
    } catch (error) {
      console.log("Failed to create Category");
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to create Category",
      };
    }
  },
  onUpdate: async (
    id: string,
    data: SubmitData
  ): Promise<{ ok: boolean; message: string }> => {
    if (!data.name) {
      return { ok: false, message: "Category name is required!" };
    }

    if (!id) {
      return { ok: false, message: "Category id is required!" };
    }

    try {
      const response = await fetch(`/api/inventory/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
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
        message: "Category updated successfully.",
      };
    } catch (error) {
      console.log("Failed to update Category");
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to update Category",
      };
    }
  },
  onDelete: async (
    recordId: string
  ): Promise<{ ok: boolean; message: string }> => {
    if (!recordId) {
      return {
        ok: false,
        message: "Category id are required!",
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
        message: "Category deleted successfully.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Failed to delete record!",
      };
    }
  },
};
