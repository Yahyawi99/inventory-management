import { InvitationStatus } from "better-auth/plugins";

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

export interface UserSettings {
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
}

export interface Invitation {
  id: string;
  role: UserRoles;
  email: string;
  status: InvitationStatus;
  inviter: {
    id: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export type UserRoles =
  | "owner"
  | "admin"
  | "member"
  | "manager"
  | "analyst"
  | "contributor"
  | "employee"
  | "intern";

export interface Activity {
  action: string;
  time: Date;
  type: string;
  entity: string;
}

export interface Session {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined;
  };
}
