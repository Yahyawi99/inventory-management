"use server";

import prisma from "@database/index";

export async function getFormConfigData(orgId: string) {
  if (!orgId) {
    throw new Error("Organization id is required");
  }

  const customers = await prisma.customer.findMany({
    where: { organizationId: orgId },
  });

  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: orgId },
  });

  const products = await prisma.product.findMany({
    where: { organizationId: orgId },
  });

  return {
    customers,
    suppliers,
    products,
  };
}
