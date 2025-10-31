import { auth } from "@/lib/auth";
import { UserRepository } from "@services/repositories";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: memberId } = await params;

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const orgId = data?.session?.activeOrganizationId as string;

  if (!orgId) {
    return NextResponse.json(
      { error: "Organization id is required, check your session!" },
      { status: 401 }
    );
  }

  try {
    await UserRepository.delete(orgId, memberId);

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting users ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
