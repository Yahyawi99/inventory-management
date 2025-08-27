export type Data<T = Record<string, any>> = T & {
  id: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};

export type ActiveFilters<T = Record<string, any>> = T & {
  search?: string;
};

export interface FilterOption {
  name: string;
  options: { label: string; value: string }[];
}

export interface FilterDrawerData {
  header: { title: string; desc: string };
  filterOptions: { [key: string]: FilterOption };
}

export interface Pagination {
  page: number;
  totalPages: number | null;
}

export interface MetricsData {
  title: string;
  value: number;
  change: number;
}

export interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export interface SortableField {
  title: string;
  field: string;
  direction: "desc" | "asc";
}
