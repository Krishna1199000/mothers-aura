import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, review, imageUrl, rating } = await req.json();

    if (!name || !review) {
      return NextResponse.json(
        { error: "Name and review are required" },
        { status: 400 }
      );
    }

    const parsedRating = Number(rating ?? 5);
    const safeRating =
      Number.isFinite(parsedRating) && parsedRating >= 1 && parsedRating <= 5
        ? parsedRating
        : 5;

    const created = await prisma.customerTestimonial.create({
      data: {
        name: String(name),
        review: String(review),
        imageUrl: imageUrl ? String(imageUrl) : null,
        rating: safeRating,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("Error creating testimonial:", e);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

