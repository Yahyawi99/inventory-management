import { createAuthClient } from "better-auth/client";
import {
  organizationClient,
  emailOTPClient,
  adminClient,
} from "better-auth/client/plugins";
import {
  ac,
  owner,
  admin,
  member,
  manager,
  analyst,
  contributor,
  employee,
  intern,
} from "@/lib/premission";
import { PrismaClient } from "@database/generated/prisma";

const prisma = new PrismaClient();

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member,
        manager,
        analyst,
        contributor,
        employee,
        intern,
      },
    }),

    emailOTPClient(),

    adminClient(),
  ],
});
