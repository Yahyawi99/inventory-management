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

export interface SubmitData {
  name: string;
  description: string;
}

export interface deleteData {
  recordId: string;
}
