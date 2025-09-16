import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "WareFlow",
          },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json(
      {
        message: "success",
        URL: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while uploading user avatar ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
