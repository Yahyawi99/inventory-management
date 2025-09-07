import { createAuthClient } from "better-auth/client";
import { organizationClient, emailOTPClient } from "better-auth/client/plugins";
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
  ],
});
