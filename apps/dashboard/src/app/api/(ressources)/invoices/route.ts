import { NextRequest, NextResponse } from "next/server";
import { InvoiceRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderType } from "@/types/orders";
import { InvoiceStatus } from "@database/generated/prisma";

interface Filters {
  status?: InvoiceStatus[];
  search?: string;
  orderType?: OrderType;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.getAll("status");
  const search = searchParams.get("search");
  const orderType = searchParams.get("orderType");
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

  if (status.length && status.indexOf("All") === -1) {
    filters.status = status as InvoiceStatus[];
  }
  if (search) {
    filters.search = search;
  }
  if (orderType && orderType != "All") {
    filters.orderType = orderType as OrderType;
  }

  try {
    const response = await InvoiceRepository.findMany(
      orgId,
      userId,
      filters,
      orderBy,
      { page, pageSize }
    );

    return NextResponse.json(
      {
        message: "success",
        orders: response?.invoices,
        totalPages: response?.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching organization's invoices ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
