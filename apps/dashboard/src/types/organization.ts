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
