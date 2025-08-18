import { NextRequest, NextResponse } from "next/server";
import { OrderRepository } from "@services/repositories";

export async function GET(req: NextRequest, res: NextResponse) {
  const userId = req.headers.get("x-userId");
  const orgId = req.headers.get("x-orgId");

  // const {} =  req.body

  // try {
  //   const orders = await OrderRepository.findMany(companyId);

  //   return NextResponse.json({ message: "ok", orders }, { status: 200 });
  // } catch (error) {
  //   console.log("Error while fetching comapny orders ", error);
  //   return NextResponse.json(
  //     { error: "Internal Server Error" },
  //     { status: 500 }
  //   );
  // }
}
