import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { categoryRepository } from "@services/repositories";
import { SubmitData } from "@/types/categories";

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
    const res = await categoryRepository.update(
      orgId,
      id,
      body.name,
      body.description
    );

    return NextResponse.json(
      {
        message: "success",
        category: res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error while updating category ",
      error instanceof Error && error.message
    );

    if (
      error instanceof Error &&
      error.message.includes("Category_organizationId_name_key")
    )
      return NextResponse.json(
        { error: "Category name already exist!" },
        { status: 500 }
      );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
    await categoryRepository.delete(orgId, id);

    return NextResponse.json(
      { message: "Category deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("CategoryToProduct"))
      return NextResponse.json(
        { error: "Cannot delete category: it still has related products." },
        { status: 500 }
      );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
