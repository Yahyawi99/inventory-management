// // Example: Request to OpenAI
// const response = await openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages: [
//     {
//       role: "system",
//       content: `Translate the following error message to ${targetLanguage}. Return ONLY the translated text.`,
//     },
//     { role: "user", content: errorMessage },
//   ],
// });

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const orgId = data?.session?.activeOrganizationId as string;
  const userId = data?.session?.userId as string;

  if (!userId || !orgId) {
    return NextResponse.json(
      { error: "User and Organization id are required, check your session!" },
      { status: 401 },
    );
  }
}
