export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  twoFactorEnabled: boolean;
  currentOrganization: {
    name: string;
    phone: string;
    address: string;
  };
  memberRole: string;
  memberSince: string;
}
