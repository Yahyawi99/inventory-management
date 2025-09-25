import {
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
  { title: "Total Value", field: "totalValue", direction: "desc" },
  { title: "quantity", field: "totalQuantity", direction: "desc" },
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
