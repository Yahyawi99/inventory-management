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
