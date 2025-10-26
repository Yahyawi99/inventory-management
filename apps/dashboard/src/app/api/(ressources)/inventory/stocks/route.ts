import { NextRequest, NextResponse } from "next/server";
import { StockRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SubmitData } from "@/types/stocks";
import { deleteData } from "@/types/shared";

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

export async function POST(req: NextRequest) {
  const body: SubmitData = await req.json();

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
    const response = await StockRepository.create(orgId, body);

    return NextResponse.json(
      {
        message: "success",
        stock: response,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  const body: deleteData = await req.json();

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
    await StockRepository.delete(orgId, body.recordId);

    return NextResponse.json(
      { message: "Stock deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("StockToStockItem"))
      return NextResponse.json(
        {
          error: "Cannot delete Stock: it still has associated stock items.",
        },
        { status: 500 }
      );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
