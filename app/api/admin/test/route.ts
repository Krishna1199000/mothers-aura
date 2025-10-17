import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json({
      message: "Test API working",
      user: session.user,
    });
  } catch (error) {
    console.error("[TEST_API]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}





