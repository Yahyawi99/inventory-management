import { Stock, SubmitData } from "@/types/stocks";
import { FetchFormConfigData } from "@/utils/orders";
import { getStockStatusDisplay } from "@/utils/stocks";
import { Button, Input, RecordActions } from "app-core/src/components";
import {
  Column,
  FilterDrawerData,
  FormConfig,
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
export function getTableColumns(
  formConfig: FormConfig<SubmitData>
): Column<Stock>[] {
  return [
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
      render: (stock: Stock) => (
        <RecordActions<SubmitData> record={stock} formConfig={formConfig} />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
}

// --- STOCK LOCATION FORM CONFIG ---
export async function getStockLocationFormConfig(
  organizationId: string
): Promise<FormConfig<SubmitData>> {
  const data = await FetchFormConfigData(organizationId);

  const { products } = data;

  const productOptions = products.map((product) => ({
    id: product.id,
    name: product.name,
  }));

  return {
    title: "Add New Stock Location",
    description:
      "Create a new storage location and initialize inventory quantities for products.",
    entityName: "Stock Location",
    fields: [
      {
        name: "name",
        label: "Location Name",
        type: "text",
        required: true,
        placeholder: "Warehouse Aisle 5, Bin B",
        gridArea: "1/2",
      },
      {
        name: "locationDetail",
        label: "Physical Address/Details",
        type: "text",
        required: false,
        placeholder: "Third floor, North section",
        gridArea: "1/2",
      },
      {
        name: "stockItems",
        label: "Stock Items",
        type: "repeater",
        required: true,
        gridArea: "1",
        minItems: 1,
        defaultValue: [{}],
        fields: [
          {
            name: "productId",
            label: "Product",
            type: "select",
            required: true,
            options: productOptions,
            gridArea: "1/2",
          },
          {
            name: "quantity",
            label: "Initial Quantity",
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
      data: SubmitData
    ): Promise<{ ok: boolean; message: string }> => {
      if (!data.name) {
        return {
          ok: false,
          message: "Please fill out all required fields!",
        };
      }
      if (!data.stockItems || data.stockItems.length === 0) {
        return {
          ok: false,
          message: "Stock location must have at least one stock item",
        };
      }

      const invalidItems = data.stockItems.filter(
        (item) => !item.productId || Number(item.quantity) < 0
      );

      if (invalidItems.length > 0) {
        return {
          ok: false,
          message: "All stock items must have a product and valid quantity",
        };
      }

      const productIds = data.stockItems.map((item) => item.productId);
      const duplicates = productIds.filter(
        (id, index) => productIds.indexOf(id) !== index
      );

      if (duplicates.length > 0) {
        return {
          ok: false,
          message: "Cannot add the same product multiple times to one location",
        };
      }

      const stockLocationData = {
        name: data.name,
        location: data.location || null,
        organizationId: organizationId,
        stockItems: data.stockItems.map((item: any) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
        })),
      };

      try {
        const response = await fetch("/api/inventory/stocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockLocationData),
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
          message: `Stock location "${data.name}" created.`,
        };
      } catch (error) {
        console.error("Error creating stock location:", error);
        return {
          ok: false,
          message: "Failed to create stock location. Please try again.",
        };
      }
    },
    onDelete: async (
      recordId: string
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId) {
        return {
          ok: false,
          message: "Stock id are required!",
        };
      }

      try {
        const response = await fetch("/api/inventory/stocks", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recordId }),
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
          message: "Stock deleted successfully.",
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
