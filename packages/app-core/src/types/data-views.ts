export interface HeaderData {
  title: string;
  buttonTxt: string;
}

export type Data<T = Record<string, any>> = T & {
  id?: string;
  _id?: string;
  organizationId?: string;
  createdAt: Date | string | { $date: Date };
  updatedAt?: Date | string | { $date: Date };
};

export interface Column<T extends Data> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.JSX.Element;
  headClass: string;
  cellClass: string;
}

export type ActiveFilters<T = Record<string, any>> = T & {
  search?: string;
};

export interface FilterOption {
  name: string;
  options:
    | { label: string; value: string }[]
    | Promise<{ label: string; value: string }[]>;
}

export interface FilterDrawerData {
  header: { title: string; desc: string };
  filterOptions: { [key: string]: FilterOption };
}

export interface Pagination {
  page?: number;
  totalPages?: number | null;
  pageSize?: number;
}

export interface MetricsData {
  title: string;
  value: number | string;
  change?: number;
}

export type SummaryCardsRawMetrics<T = Record<string, number>> = T;

export interface SortConfig {
  field: string;
  direction: "desc" | "asc";
}

export interface SortableField {
  title: string;
  field: string;
  direction: "desc" | "asc";
}

export interface StatusDisplay {
  text: string;
  colorClass: string;
}

export interface FinancialMetricsResult {
  value: number;
  change: number;
}

export interface FinancialDashboardMetrics {
  [metricName: string]: FinancialMetricsResult;
}

export interface DashboardMetric {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  dataKey: keyof FinancialDashboardMetrics;
}
