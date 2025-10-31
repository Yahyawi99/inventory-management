import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { categoryRepository } from "@services/repositories";
import { ProductStatus } from "@/types/products";
import { SubmitData } from "@/types/categories";
import { deleteData } from "@/types/shared";

interface Filters {
  status?: ProductStatus;
  search?: string;
}

// GET
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const orderBy = JSON.parse(searchParams.get("orderBy") as string);

  const page =
    Number(searchParams.get("page")) <= 0
      ? 1
      : Number(searchParams.get("page"));
  const pageSize = Number(searchParams.get("pageSize")) || 10;

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

  // Filters
  const filters: Filters = {};

  if (search) {
    filters.search = search;
  }

  if (status && status !== "All") {
    filters.status = status as ProductStatus;
  }

  try {
    const res = await categoryRepository.findMany(orgId, filters, orderBy, {
      page,
      pageSize,
    });

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

// POST
export async function POST(req: NextRequest) {
  const body: SubmitData = await req.json();

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
    const res = await categoryRepository.create(
      orgId,
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
      "Error while creating category ",
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
