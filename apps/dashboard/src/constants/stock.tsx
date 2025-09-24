import { HeaderData, SortableField } from "app-core/src/types";

export const headerData: HeaderData = {
  title: "Stock",
  buttonTxt: "Create Stock",
};

export const stockSortableFields: SortableField[] = [
  { title: "Name", field: "name", direction: "desc" },
  { title: "Date", field: "createdAt", direction: "desc" },
  { title: "Amount", field: "totalAmount", direction: "desc" },
  { title: "quantity", field: "totalQuantity", direction: "desc" },
];
