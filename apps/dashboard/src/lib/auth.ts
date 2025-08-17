import { betterAuth } from "better-auth";
import { organization, twoFactor } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@database/generated/prisma/client";
import { emailService } from "./email";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "WareFlow",

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },

  plugins: [
    organization(),
    twoFactor({
      issuer: "WareFlow",
      otpOptions: {
        async sendOTP({ user, otp }) {
          await emailService.sendOTP(user.email, user.name, otp);
        },
      },
    }),
  ],

  events: {
    onUserCreated: async ({ user, context }: any) => {
      await context.twoFactor.enableOtp({ userId: user.id });
    },
  },

  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
});
