"use server";

import prisma from "@database/index";

export async function getCustomersAndSuppliers(orgId: string) {
  if (!orgId) {
    throw new Error("Organization id is required");
  }

  const customers = await prisma.customer.findMany({
    where: { organizationId: orgId },
  });

  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: orgId },
  });

  return {
    customers,
    suppliers,
  };
}
