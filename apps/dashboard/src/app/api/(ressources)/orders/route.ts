import { NextRequest, NextResponse } from "next/server";
import { OrderRepository } from "@services/repositories";

export async function GET(req: NextRequest, res: NextResponse) {
  const userId = req.headers.get("x-user-id");
  const companyId = req.headers.get("x-company-id") as string;

  console.log("✅ " + companyId);

  // const {} =  req.body

  try {
    const orders = await OrderRepository.findMany(companyId);

    return NextResponse.json({ message: "ok", orders }, { status: 200 });
  } catch (error) {
    console.log("Error while fetching comapny orders ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
