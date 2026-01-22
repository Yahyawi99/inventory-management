import { useTranslations } from "next-intl";

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

// creation Form
interface FormFieldBase {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  gridArea?: string;
  defaultValue?: any;
  dependsOn?: { field: string; value: string | boolean | number };
}

interface TextFieldConfig extends FormFieldBase {
  type: "text" | "email" | "password";
  readOnly?: boolean;
}

interface NumberFieldConfig extends FormFieldBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface TextareaFieldConfig extends FormFieldBase {
  type: "textarea";
  rows?: number;
}

interface SelectFieldConfig extends FormFieldBase {
  type: "select";
  options: Array<{ id: string; name: string }> | null;
}

interface CheckboxFieldConfig extends FormFieldBase {
  type: "checkbox";
}

interface RepeaterFieldConfig extends FormFieldBase {
  type: "repeater";
  minItems: number;
  fields: FormField[];
}

interface DateFieldConfig extends FormFieldBase {
  type: "date";
}

export type FormField =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | DateFieldConfig
  | RepeaterFieldConfig;

export interface FormConfig<T> {
  title: string;
  description: string;
  entityName: string;
  fields: FormField[];
  onSubmit?: (data: T) => Promise<{ ok: boolean; message: string }>;
  onUpdate: (id: string, data: T) => Promise<{ ok: boolean; message: string }>;
  onDelete: (id: string) => Promise<{ ok: boolean; message: string }>;
}

export type Translator = ReturnType<typeof useTranslations>;
