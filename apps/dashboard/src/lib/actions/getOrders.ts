"use server";

import prisma from "@database/index";

export async function getOrders(orgId: string) {
  if (!orgId) {
    throw new Error("Organization id is required");
  }

  const orders = await prisma.order.findMany({
    where: { organizationId: orgId },
  });

  return orders;
}
