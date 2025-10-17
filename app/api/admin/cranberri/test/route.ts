import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchCranberriDiamonds } from "@/lib/api/cranberri-diamonds";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Attempt to fetch a small amount of data to test API connectivity
    const testDiamonds = await fetchCranberriDiamonds();

    return NextResponse.json({
      success: true,
      message: `Successfully connected to Cranberri API. Found ${testDiamonds.length} diamonds.`,
      details: {
        firstDiamond: testDiamonds.length > 0 ? testDiamonds[0] : null,
        totalFound: testDiamonds.length,
      },
    });
  } catch (error: any) {
    console.error("Cranberri API Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to connect to Cranberri API: ${error.message}`,
        details: {
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      },
      { status: 500 }
    );
  }
}







