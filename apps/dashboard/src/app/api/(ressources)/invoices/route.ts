import { NextRequest, NextResponse } from "next/server";
import { InvoiceRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderType } from "@/types/orders";
import { InvoiceStatus } from "@database/generated/prisma";
import { deleteData } from "@/types/shared";

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
        invoices: response?.invoices,
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

// POST
export async function POST(req: NextRequest) {
  const body = await req.json();

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
    const response = await InvoiceRepository.create(orgId, userId, body);

    return NextResponse.json(
      {
        message: "success",
        invoice: response,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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

// DELETE
export async function DELETE(req: NextRequest) {
  const body: deleteData = await req.json();

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const orgId = data?.session?.activeOrganizationId as string;
  const userId = data?.session?.userId as string;

  if (!orgId) {
    return NextResponse.json(
      { error: "Organization and user id is required, check your session!" },
      { status: 401 }
    );
  }

  try {
    await InvoiceRepository.delete(orgId, userId, body.recordId);

    return NextResponse.json(
      { message: "Invoice deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
