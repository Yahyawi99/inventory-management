import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProductStatus } from "@/types/products";

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
    const response = await ProductRepository.findMany(
      orgId,
      filters,
      // orderBy,
      { page, pageSize }
    );

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
