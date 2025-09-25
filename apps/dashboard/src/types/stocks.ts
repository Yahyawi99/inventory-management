export interface Stock {
  id: string;
  name: string;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  organizationId: string;
  location: string | null;
}
