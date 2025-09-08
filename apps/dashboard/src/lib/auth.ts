import { betterAuth } from "better-auth";
import {
  organization,
  emailOTP,
  admin as adminPlugin,
} from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@database/generated/prisma/client";
import { emailService } from "./email";
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
const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "WareFlow",

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  plugins: [
    organization({
      invitationExpiresIn: 60 * 60 * 48,
      cancelPendingInvitationsOnReInvite: true,
      sendInvitationEmail: async (data) => {
        const { email, invitation, inviter } = data;
        const user = await prisma.user.findUnique({
          where: { id: inviter.userId },
        });
        const inviterName = user?.name || "";
        const invitationLink = `${process.env.BETTER_AUTH_URL}/auth/accept-invitation?id=${invitation.id}&email=${email}`;

        // Send email (replace with your email service)
        await emailService.sendInvite(email, invitationLink, inviterName);
      },
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

    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findUnique({ where: { email } });
        const userName = user?.name || "";

        if ((type = "email-verification")) {
          await emailService.sendOTP(email, userName, otp);
        }
      },
      otpLength: 6,
      expiresIn: 60 * 10,
    }),

    adminPlugin(),
  ],

  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
});
