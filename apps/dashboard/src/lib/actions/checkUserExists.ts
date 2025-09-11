"use server";
import prisma from "@database/index";

export async function checkUserExists(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  return {
    exists: !!user,
    user: user || null,
  };
}
