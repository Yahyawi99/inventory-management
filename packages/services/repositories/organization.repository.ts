import Prisma from "database";
import { Organization } from "database/generated/prisma/client";

interface NewOrg {
  address: string | null;
  metadata: string | null;
  name: string;
  email: string | null;
  logo: string | null;
  slug: string | null;
  phone: string | null;
}

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
      console.log("Error while fetching organization data " + orgId);
      return null;
    }
  },

  async updateById(orgId: string, data: NewOrg): Promise<Organization | null> {
    try {
      const res = await Prisma.organization.update({
        where: {
          id: orgId,
        },
        data,
      });

      return res;
    } catch (e) {
      console.log("Error while updating organization data " + orgId);
      return null;
    }
  },
};
