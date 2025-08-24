import { NextRequest, NextResponse } from "next/server";
import { OrderRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CustomerType, OrderStatus, OrderType } from "@/types/orders";

interface Filters {
  status?: OrderStatus[];
  search?: string;
  customerType?: CustomerType;
  orderType?: OrderType;
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.getAll("status");
  const search = searchParams.get("search");
  const customerType = searchParams.get("customerType");
  const orderType = searchParams.get("orderType");
  const orderBy = JSON.parse(searchParams.get("orderBy") as string);

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

  // Order By
  console.log(orderBy);

  try {
    const orders = await OrderRepository.findMany(orgId, userId, filters);

    return NextResponse.json({ message: "success", orders }, { status: 200 });
  } catch (error) {
    console.log("Error while fetching organization's orders ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
