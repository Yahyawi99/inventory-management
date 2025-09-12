import { auth } from "@/lib/auth";
import { UserRepository } from "@services/repositories";
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
    const response = await UserRepository.getStats(orgId, userId);

    return NextResponse.json(
      {
        message: "success",
        stats: response,
      },
      { status: 200, statusText: "success" }
    );
  } catch (error) {
    console.log("Error while fetching user's stats ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, statusText: "error" }
    );
  }
}
