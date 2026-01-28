import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.customerTestimonial.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        review: true,
        imageUrl: true,
        rating: true,
        createdAt: true,
      },
    });
    return NextResponse.json(testimonials);
  } catch (e) {
    console.error("Error fetching testimonials:", e);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
