import Prisma from "database";
import { User } from "database/generated/prisma/client";

// interface Filters {
//   category?: string;
//   search?: string;
// }

// interface SortConfig {
//   field: string;
//   direction: "desc" | "asc";
// }

export const UserRepository = {
  // async findMany(orgId: string): Promise<Category[] | null> {
  //   const whereClause: P.CategoryWhereInput = {
  //     organizationId: orgId,
  //   };

  //   try {
  //     const res = await Prisma.category.findMany({
  //       where: whereClause,
  //     });

  //     return res;
  //   } catch (e) {
  //     console.log("Error while fetching categories: ", e);
  //     return null;
  //   }
  // },

  async findUnique(userId: string, orgId: string) {
    try {
      const res = await Prisma.member.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId: orgId,
          },
        },
        include: {
          user: true,
          organization: true,
        },
      });

      if (!res) {
        return null;
      }

      const { user, organization } = res;

      return {
        id: res.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        currentOrganization: {
          name: organization.name,
          phone: organization.phone,
          address: organization.address,
        },
        memberRole: res.role,
        memberSince: res.createdAt,
      };
    } catch (e) {
      console.log("Error while fetching user " + userId);
      console.log(e);
    }
  },
};
