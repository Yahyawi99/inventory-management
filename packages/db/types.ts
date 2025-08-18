type CustomerType = "B2B" | "B2C";

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  password?: string | null;
  emailVerified: boolean;
  image: string | null;
  twoFactorEnabled: boolean | null;
};

export type Organization = {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  metadata: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  street: string;
  city: string;
  postalCode: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  customerType: CustomerType;
  billingAddress: Address;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  paymentTerms: string;
  notes: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
};

export type Stock = {
  id: string;
  name: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  barcode: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  categoryId: string;
};
