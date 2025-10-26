import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // For now, we'll return a placeholder URL
    // In a real implementation, you would upload to Cloudinary or another service
    const placeholderUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({ url: placeholderUrl });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}









