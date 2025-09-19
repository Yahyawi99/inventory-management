export interface Category {
  _id: string;
  name: string;
  description: string | null;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
  organizationId: string;
  productCount: number;
  totalStockQuantity: number;
}
