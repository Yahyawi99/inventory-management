import { NextRequest, NextResponse } from "next/server";
import { ChartsRepository } from "@services/repositories";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type: chartType } = await params;

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const orgId = data?.session?.activeOrganizationId as string;

  if (!orgId) {
    return NextResponse.json(
      { error: "Organization id are required, check your session!" },
      { status: 401 }
    );
  }
  try {
    let response: any = null;
    switch (chartType) {
      case "sales":
        response = await ChartsRepository.SalesChart(orgId);
        break;

      case "aov":
        response = await ChartsRepository.AOVChart(orgId);
        break;

      case "topProducts":
        response = await ChartsRepository.topProductsChart(orgId);
        break;

      case "inventory":
        response = await ChartsRepository.inventoryChart(orgId);
        break;

      default:
        response = null;
        break;
    }

    return NextResponse.json(
      { message: "ok", chartData: response },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching sales chart data ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
