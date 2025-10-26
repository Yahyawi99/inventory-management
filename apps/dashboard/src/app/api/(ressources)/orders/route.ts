import { NextRequest, NextResponse } from "next/server";
import { OrderRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  CustomerType,
  OrderStatus,
  OrderType,
  SubmitData,
} from "@/types/orders";
import { deleteData } from "@/types/shared";

interface Filters {
  status?: OrderStatus[];
  search?: string;
  customerType?: CustomerType;
  orderType?: OrderType;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.getAll("status");
  const search = searchParams.get("search");
  const customerType = searchParams.get("customerType");
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
    filters.status = status as OrderStatus[];
  }
  if (search) {
    filters.search = search;
  }
  if (customerType && customerType != "All") {
    filters.customerType = customerType as CustomerType;
  }
  if (orderType && orderType != "All") {
    filters.orderType = orderType as OrderType;
  }

  try {
    const response = await OrderRepository.findMany(
      orgId,
      userId,
      filters,
      orderBy,
      { page, pageSize }
    );

    return NextResponse.json(
      {
        message: "success",
        orders: response?.orders,
        totalPages: response?.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching organization's orders ", error);
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
  const userId = data?.session?.userId as string;

  if (!userId || !orgId) {
    return NextResponse.json(
      { error: "User and Organization id are required, check your session!" },
      { status: 401 }
    );
  }

  try {
    const response = await OrderRepository.create(orgId, userId, body);

    return NextResponse.json(
      {
        message: "success",
        order: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to create an Order: ", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
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
    await OrderRepository.delete(orgId, userId, body.recordId);

    return NextResponse.json(
      { message: "Order deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("OrderToOrderLine"))
      return NextResponse.json(
        { error: "Cannot delete Order: it still has related order items." },
        { status: 500 }
      );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
