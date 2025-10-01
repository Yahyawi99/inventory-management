import { auth } from "@/lib/auth";
import { organizationRepository } from "@services/repositories";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const orgId = data?.session?.activeOrganizationId as string;
  const userId = data?.session?.userId as string;

  if (!userId || !orgId) {
    return NextResponse.json(
      { error: "User and Organization id are required, check your session!" },
      { status: 401 }
    );
  }

  try {
    const response = await organizationRepository.getOrgStats(orgId);

    return NextResponse.json(
      { message: "success", stats: response },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Something went wrong while trying to fetch organization stats."
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
