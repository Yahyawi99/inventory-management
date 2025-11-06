import { Product, SubmitData } from "@/types/products";
import {
  buildCategoriesOptions,
  getProductStockStatusDisplay,
  getTotalProductStockQuantity,
} from "@/utils/products";
import { Input, Button, RecordActions } from "app-core/src/components";
import {
  Column,
  SortableField,
  FilterDrawerData,
  FormConfig,
} from "app-core/src/types";

export async function getProductFilterDrawerData(): Promise<FilterDrawerData> {
  const categoryOptions = await buildCategoriesOptions();

  return {
    header: {
      title: "Filter Products",
      desc: "Refine your Product list",
    },
    filterOptions: {
      status: {
        name: "Product's Stock Status",
        options: [
          { label: "All Products", value: "All" },
          { label: "In Stock Products", value: "In Stock" },
          { label: "Low Stock Products", value: "Low Stock" },
          { label: "Out of Stock Products", value: "Out of Stock" },
        ],
      },
      category: {
        name: "Product Category",
        options: categoryOptions,
      },
    },
  };
}

export const productSortableFields: SortableField[] = [
  { title: "Name", field: "name", direction: "desc" },
  { title: "Date", field: "createdAt", direction: "desc" },
  { title: "Price", field: "price", direction: "desc" },
  { title: "Total Stock", field: "stock", direction: "desc" },
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

export async function getProductFormConfig(): Promise<FormConfig<SubmitData>> {
  const categoryOptions = await buildCategoriesOptions();
  const formattedCategories = categoryOptions
    .filter((ele) => ele.id)
    .map((element, i) => {
      return { id: element.id, name: element.value };
    }) as { id: string; name: string }[];

  return {
    title: "Add New Product",
    description: "Fill in the details for the new product.",
    entityName: "Product",
    fields: [
      {
        name: "name",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Wireless Headset X20",
        gridArea: "1",
      },
      {
        name: "sku",
        label: "SKU",
        type: "text",
        required: true,
        placeholder: "WHX20-BLK",
        gridArea: "1/2",
      },
      {
        name: "price",
        label: "Price ($)",
        type: "number",
        required: true,
        placeholder: "199.99",
        gridArea: "1/2",
        step: 0.01,
      },
      {
        name: "barcode",
        label: "Barcode (EAN)",
        type: "text",
        required: false,
        placeholder: "123456789012",
        gridArea: "1/2",
      },
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        required: true,
        options: formattedCategories,
        gridArea: "1/2",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        placeholder: "Detailed product description...",
        gridArea: "1",
        rows: 4,
      },
    ],
    onSubmit: async (
      data: SubmitData
    ): Promise<{ ok: boolean; message: string }> => {
      const { name, description, sku, barcode, price, categoryId } = data;

      if (!name || !sku || !price || !price || !categoryId) {
        return {
          ok: false,
          message: "Please fill out all the required fields!",
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
          message: "Product created successfully.",
        };
      } catch (error) {
        console.log("Failed to create Product");
        return {
          ok: false,
          message:
            error instanceof Error ? error.message : "Failed to create Product",
        };
      }
    },
    onUpdate: async (
      id: string,
      data: SubmitData
    ): Promise<{ ok: boolean; message: string }> => {
      const { name, description, sku, barcode, price, categoryId } = data;

      if (!name || !sku || !price || !price || !categoryId) {
        return {
          ok: false,
          message: "Please fill out all the required fields!",
        };
      }

      if (!id) {
        return { ok: false, message: "Product id is required!" };
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

        return {
          ok: true,
          message: "Product updated successfully.",
        };
      } catch (error) {
        console.log("Failed to update Product");
        return {
          ok: false,
          message:
            error instanceof Error ? error.message : "Failed to update Product",
        };
      }
    },
    onDelete: async (
      recordId: string
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId) {
        return {
          ok: false,
          message: "Product id are required!",
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

        return {
          ok: true,
          message: "Product deleted successfully.",
        };
      } catch (error) {
        return {
          ok: false,
          message: "Failed to delete record!",
        };
      }
    },
  };
}

// /=========================================

// --- Product-Specific Table Columns ---
export function getTableColumns(
  formConfig: FormConfig<SubmitData>
): Column<Product>[] {
  return [
    {
      key: "name",
      header: "Product Name",
      render: (product) => (
        <span className="font-medium text-foreground">{product.name}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center font-medium text-gray-900",
    },
    {
      key: "sku",
      header: "SKU",
      render: (product) => (
        <span className="text-muted-foreground">{product.sku}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center text-gray-700",
    },
    {
      key: "category",
      header: "Category",
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
      header: "Price",
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
      header: "Stock Status",
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
      header: "Total Stock",
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
      header: "Action",
      render: (product: Product) => (
        <RecordActions<SubmitData> record={product} formConfig={formConfig} />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
}
