export interface Stock {
  _id: string;
  name: string;
  location: string | null;
  totalValue: number;
  totalQuantity: number;
  createdAt: { $date: Date };
  updatedAt: { $date: Date };
}
