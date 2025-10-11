import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProductStatus, SubmitData } from "@/types/products";

interface Filters {
  status?: ProductStatus;
  search?: string;
  category?: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const category = searchParams.get("category");
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

  if (status && status !== "All") {
    filters.status = status as ProductStatus;
  }

  if (search) {
    filters.search = search;
  }

  if (category && category != "All") {
    filters.category = category;
  }

  try {
    const response = await ProductRepository.findMany(orgId, filters, orderBy, {
      page,
      pageSize,
    });

    return NextResponse.json(
      {
        message: "success",
        products: response?.products,
        totalPages: response?.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching organization's products ", error);
    return NextResponse.json(
      { error: "Internal Server Error :" + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body: SubmitData = await req.json();

  body.price = Number(body.price);

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
    const response = await ProductRepository.Create(orgId, body);

    return NextResponse.json(
      {
        message: "success",
        product: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while creating a new Product", error);

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
