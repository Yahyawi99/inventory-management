import Prisma from "database";
import { Organization } from "database/generated/prisma/client";

export const organizationRepository = {
  async findById(orgId: string): Promise<Organization | null> {
    try {
      const res = await Prisma.organization.findUnique({
        where: {
          id: orgId,
        },
      });

      return res;
    } catch (e) {
      console.log("Error while fetching order " + orgId);
      return null;
    }
  },
};
