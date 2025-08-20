import { NextRequest, NextResponse } from "next/server";
import { OrderRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
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
    const orders = await OrderRepository.findMany(orgId, userId);

    return NextResponse.json({ message: "success", orders }, { status: 200 });
  } catch (error) {
    console.log("Error while fetching comapny orders ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
