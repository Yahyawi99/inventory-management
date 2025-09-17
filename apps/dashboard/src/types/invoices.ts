import { OrderType } from "./orders";

export interface ActiveFilters {
  status?: "All" | "Paid" | "Pending" | "Overdue" | "Void";
  search?: string;
  orderType?: "All" | OrderType;
}
