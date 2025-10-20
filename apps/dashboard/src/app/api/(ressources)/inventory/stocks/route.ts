import { NextRequest, NextResponse } from "next/server";
import { StockRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type StockStatus = "Available" | "Low" | "Empty";
interface Filters {
  status?: StockStatus;
  search?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const search = searchParams.get("search");
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
    filters.status = status as StockStatus;
  }
  if (search) {
    filters.search = search;
  }

  try {
    const response = await StockRepository.findMany(orgId, filters, orderBy, {
      page,
      pageSize,
    });

    return NextResponse.json(
      {
        message: "success",
        stocks: response?.stocks,
        totalPages: response?.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching organization's stocks ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
