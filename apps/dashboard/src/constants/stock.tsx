import { Stock } from "@/types/stocks";
import { getStockStatusDisplay } from "@/utils/stocks";
import { Button, Input } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  HeaderData,
  SortableField,
} from "app-core/src/types";

export const headerData: HeaderData = {
  title: "Stock",
  buttonTxt: "Create Stock",
};

export const stockSortableFields: SortableField[] = [
  { title: "Name", field: "name", direction: "desc" },
  { title: "Date", field: "createdAt", direction: "desc" },
  { title: "Value", field: "value", direction: "desc" },
  { title: "Quantity", field: "quantity", direction: "desc" },
];

export const stockStatusFilters = {
  field: "status",
  values: ["All", "Available", "Low", "Empty"],
};

export const stockFilterDrawerData: FilterDrawerData = {
  header: {
    title: "Filter Stocks",
    desc: "Refine your Stock list",
  },
  filterOptions: {
    status: {
      name: "Stock's Status",
      options: [
        { label: "All", value: "All" },
        { label: "Available", value: "available" },
        { label: "Low", value: "low" },
        { label: "Empty", value: "empty" },
      ],
    },
  },
};

// --- Product-Specific Table Columns ---
export const tableColumns: Column<Stock>[] = [
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
    header: "Name",
    render: (stock) => (
      <span className="font-medium text-gray-900">{stock.name}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "location",
    header: "Location",
    render: (stock) => (
      <span className="text-gray-700">
        {stock.location ? stock.location : "N/A"}
      </span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "value",
    header: "Total Value",
    render: (stock) => (
      <span className="text-gray-700">${stock.totalValue.toFixed(2)}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center text-gray-700",
  },
  {
    key: "quantity",
    header: "Total Quantity",
    render: (stock) => (
      <span className="font-medium text-gray-900">{stock.totalQuantity}</span>
    ),
    headClass: "px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center font-medium text-gray-900",
  },
  {
    key: "stockStatus", // Custom key for derived status
    header: "Status",
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
    header: "Action",
    render: (
      stock // Pass product to render if actions need product.id
    ) => (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-500 hover:text-green-700"
          onClick={() => console.log("Edit product:", stock._id)} // Example action
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
          onClick={() => console.log("Delete product:", stock._id)} // Example action
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
