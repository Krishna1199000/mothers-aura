import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const username = process.env.KYRAH_API_USERNAME;
    const password = process.env.KYRAH_API_PASSWORD;
    
    // Check if credentials are set
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "API credentials not configured",
        details: {
          usernameSet: !!username,
          passwordSet: !!password,
        }
      });
    }

    // Test API call
    const formData = new URLSearchParams();
    formData.append('USERNAME', username);
    formData.append('PASSWORD', password);

    const response = await fetch('https://kyrahapi.azurewebsites.net/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "API test completed",
      details: {
        status: response.status,
        response: data,
        credentials: {
          usernameSet: !!username,
          passwordSet: !!password,
        }
      }
    });

  } catch (error) {
    console.error("Error testing Kyrah API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}














