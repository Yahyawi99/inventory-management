type CustomerType = "B2B" | "B2C";

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
};

export type Company = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  name: string;
  description: string | null;
};

export type Address = {
  street: string;
  city: string;
  postalCode: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  customerType: CustomerType;
  billingAddress: { street: string; city: string; postalCode: string };
  shippingAddress: Address;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  paymentTerms: string;
  notes: string | null;
  tags: string[];
  address: { street: string; city: string; postalCode: string };
};

export type Stock = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  name: string;
  location: string | null;
};

export type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  barcode: string | null;
  categoryId: string;
};
