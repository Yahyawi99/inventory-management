// app/actions/invitation-actions.ts (or lib/actions/invitation.ts)
"use server";

import { Invitation } from "@/types/users";
import prisma from "@database/index";

export async function getInvitation(invitationId: string) {
  try {
    const result = await prisma.invitation.findUnique({
      where: { id: invitationId, status: "pending" },
      include: {
        user: true,
        organization: true,
      },
    });

    const data = {
      id: result?.id,
      role: result?.role,
      email: result?.email,
      status: result?.status,
      inviter: {
        id: result?.user.id,
        name: result?.user.name,
      },
      organization: {
        id: result?.organizationId,
        name: result?.organization.name,
        slug: result?.organization.slug,
      },
    } as Invitation;

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invitation not found or expired",
    };
  }
}
