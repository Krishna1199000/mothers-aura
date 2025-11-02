import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { timestamp } = await request.json();
    
    if (!timestamp) {
      return NextResponse.json(
        { error: "Timestamp is required" },
        { status: 400 }
      );
    }

    // Cloudinary credentials
    const apiSecret = 'rqRlmI2iXKOZUjF3tHYM5Svor3o';
    
    // Create signature
    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}






















