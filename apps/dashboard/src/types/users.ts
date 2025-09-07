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
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: "member" | "admin" | "owner";
  status: InvitationStatus;
  inviterId: string;
  expiresAt: Date;
  organizationName: string;
  organizationSlug: string;
  inviterEmail: string;
}
