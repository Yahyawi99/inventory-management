import { Product, SubmitData } from "@/types/products";
import {
  buildCategoriesOptions,
  getProductStockStatusDisplay,
  getTotalProductStockQuantity,
} from "@/utils/products";
import { Input, Button } from "app-core/src/components";
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
  };
}

// /=========================================

// --- Product-Specific Table Columns ---
export const tableColumns: Column<Product>[] = [
  {
    key: "checkbox",
    header: (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    render: (product) => (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    headClass: "w-[50px] px-4 py-3",
    cellClass: "text-center px-4 py-3",
  },
  {
    key: "name",
    header: "Product Name",
    render: (product) => (
      <span className="font-medium text-gray-900">{product.name}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "sku",
    header: "SKU",
    render: (product) => <span className="text-gray-700">{product.sku}</span>,
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "category",
    header: "Category",
    render: (product) => (
      <span className="text-gray-700">
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
      <span className="font-medium text-gray-900">
        ${product.price.toFixed(2)}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "stockStatus", // Custom key for derived status
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
    key: "totalStock", // Custom key for total stock quantity
    header: "Total Stock",
    render: (product) => (
      <span className="text-gray-700">
        {getTotalProductStockQuantity(product.stockItems)}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "actions",
    header: "Action",
    render: (
      product // Pass product to render if actions need product.id
    ) => (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-500 hover:text-green-700"
          onClick={() => console.log("Edit product:", product._id)} // Example action
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
          onClick={() => console.log("Delete product:", product._id)} // Example action
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
