import { StockItem, Product } from "@/types/products";
import { Input, Button } from "app-core/src/components";
import { Column } from "app-core/src/types";

import { SortableField, FilterDrawerData } from "app-core/src/types";

export const productFilterDrawerData: FilterDrawerData = {
  header: {
    title: "Filter Products",
    desc: "Refine your Product list",
  },
  filterOptions: {
    category: {
      name: "Product Category",
      options: [
        { label: "All Products", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Processing", value: "Processing" },
        { label: "Fulfilled (Shipped/Delivered)", value: "Fulfilled" },
        { label: "Cancelled", value: "Cancelled" },
      ],
    },
  },
};

export const productSortableFields: SortableField[] = [
  { title: "Product Category", field: "category", direction: "desc" },
  { title: "Product Date", field: "createdAt", direction: "desc" },
  { title: "Product Price", field: "price", direction: "desc" },
  { title: "Product Sales Revenue", field: "revenue", direction: "desc" },
];

export const productCategoryFilters = {
  field: "category",
  values: ["All", "Pending", "Processing", "Fulfilled", "Cancelled"],
};

// /=========================================

const getProductStockStatusDisplay = (stockItems: StockItem[]) => {
  const totalQuantity = stockItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  if (totalQuantity > 50) {
    return { text: "In Stock", colorClass: "bg-green-100 text-green-800" };
  } else if (totalQuantity > 0) {
    return { text: "Low Stock", colorClass: "bg-yellow-100 text-yellow-800" };
  }
  return { text: "Out of Stock", colorClass: "bg-red-100 text-red-800" };
};

const getTotalProductStockQuantity = (stockItems: StockItem[]) => {
  return stockItems.reduce((sum, item) => sum + item.quantity, 0);
};

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
        {product.category.length > 0 ? product.category[0].name : "N/A"}
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
          onClick={() => console.log("Edit product:", product.id)} // Example action
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
          onClick={() => console.log("Delete product:", product.id)} // Example action
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
