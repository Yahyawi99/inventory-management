import { betterAuth } from "better-auth";
import { organization, emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@database/generated/prisma/client";
import { emailService } from "./email";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "WareFlow",

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  plugins: [
    organization(),
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
