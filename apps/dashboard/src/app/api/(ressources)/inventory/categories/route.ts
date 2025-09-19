import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { categoryRepository } from "@services/repositories";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page =
    Number(searchParams.get("page")) <= 0
      ? 1
      : Number(searchParams.get("page"));
  const pageSize = 10;

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

  // filters

  try {
    const res = await categoryRepository.findMany(orgId, { page, pageSize });

    return NextResponse.json(
      {
        message: "success",
        categories: res?.categories,
        totalPages: res?.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching categories ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
