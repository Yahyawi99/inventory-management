import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { UserRepository } from "@services/repositories";

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

  try {
    const res = await UserRepository.findMany(orgId, { page, pageSize });

    return NextResponse.json(
      {
        message: "success",
        users: res?.users,
        totalPages: res?.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching users ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Find user by email
export async function POST(req: NextRequest) {
  console.log("✅ API route hit");

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

  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const response = await UserRepository.findByEmail(email);
    return NextResponse.json(
      {
        message: "success",
        user: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching user", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
