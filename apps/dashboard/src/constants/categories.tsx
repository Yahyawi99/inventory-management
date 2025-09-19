import { Category } from "@/types/categories";
import { getProductStockStatusDisplay } from "@/utils/categories";
import { Button, Input } from "app-core/src/components";
import { Column, FilterDrawerData, SortableField } from "app-core/src/types";

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
    key: "checkbox",
    header: (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    render: () => (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    headClass: "w-[50px] px-4 py-3",
    cellClass: "text-center px-4 py-3",
  },
  {
    key: "name",
    header: "Category Name",
    render: (category) => (
      <span className="font-medium text-gray-900">{category.name}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "createdAt",
    header: "Created On",
    render: (category) => (
      <span className="text-gray-700">
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
      <span className="text-gray-700">{category.productCount}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },

  {
    key: "totalStock",
    header: "Total Stock",
    render: (category) => (
      <span className="text-gray-700">{category.totalStockQuantity}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "stockStatus",
    header: "Stock Status",
    render: (category) => {
      const statusDisplay = getProductStockStatusDisplay(
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
      <div className="flex items-center space-x-2 justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-500 hover:text-green-700"
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
