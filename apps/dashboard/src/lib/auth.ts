import { betterAuth } from "better-auth";
import { organization, emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@database/generated/prisma/client";
import { emailService } from "./email";
import { Role } from "@database/generated/prisma/client";

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
        const invitationLink = `${process.env.BETTER_AUTH_URL}/accept-invitation?id=${invitation.id}`;

        // Send email (replace with your email service)
        await emailService.sendInvite(email, invitationLink, inviterName);
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
  ],

  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
});
