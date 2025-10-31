import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { InvoiceRepository } from "@services/repositories";

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
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
    const res = await InvoiceRepository.update(orgId, id, body);

    return NextResponse.json(
      {
        message: "success",
        category: res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error while updating an invoice ",
      error instanceof Error && error.message
    );

    if (error instanceof Error && error.message.includes("Invoice_orderId_key"))
      return NextResponse.json(
        { error: "An invoice for this order already exist!" },
        { status: 500 }
      );

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
