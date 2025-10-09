import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { categoryRepository } from "@services/repositories";
import { ProductStatus } from "@/types/products";

interface Filters {
  status?: ProductStatus;
  search?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const orderBy = JSON.parse(searchParams.get("orderBy") as string);

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

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(body);

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
    const res = null; //await categoryRepository.create(orgId);

    return NextResponse.json(
      {
        message: "success",
        category: res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while creating category ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
