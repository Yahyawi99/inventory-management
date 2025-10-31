import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { OrderRepository } from "@services/repositories";
import { SubmitData } from "@/types/orders";

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: SubmitData = await req.json();
  const { id } = params;

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
    const res = await OrderRepository.update(orgId, id, body);

    return NextResponse.json(
      {
        message: "success",
        category: res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error while updating an order ",
      error instanceof Error && error.message
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
