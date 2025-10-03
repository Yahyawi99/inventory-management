export interface OverviewMetric {
  total: number;
  change: number;
}

export interface OrganizationOverview {
  teamMembers: OverviewMetric;
  products: OverviewMetric;
  activeOrders: OverviewMetric;
  suppliers: OverviewMetric;
  stockLocations: OverviewMetric;
  customers: OverviewMetric;
}

export interface FormattedStat {
  label: string;
  value: string;
  icon: any;
  color: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
}

export interface Organization {
  address: string | null;
  metadata: string | null;
  id: string;
  name: string;
  email: string | null;
  slug: string | null;
  phone: string | null;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date;
}
