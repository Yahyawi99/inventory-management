import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { ProductRepository } from "@services/repositories";
import { SubmitData } from "@/types/products";

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
    const res = await ProductRepository.update(orgId, id, body);

    return NextResponse.json(
      {
        message: "success",
        category: res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating a Product", error);

    if (
      error instanceof Error &&
      error.message.includes("Product_organizationId_sku_key")
    )
      return NextResponse.json(
        { error: "Product SKU already exist!" },
        { status: 500 }
      );
    else if (
      error instanceof Error &&
      error.message.includes("Product_organizationId_barcode_key")
    )
      return NextResponse.json(
        { error: "Product BARCODE already exist!" },
        { status: 500 }
      );
    else
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
  }
}
