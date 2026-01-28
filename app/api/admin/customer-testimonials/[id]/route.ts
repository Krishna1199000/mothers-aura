import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, review, imageUrl, rating } = await req.json();

    const parsedRating = rating !== undefined ? Number(rating) : undefined;
    const safeRating =
      parsedRating !== undefined &&
      Number.isFinite(parsedRating) &&
      parsedRating >= 1 &&
      parsedRating <= 5
        ? parsedRating
        : undefined;

    const updated = await prisma.customerTestimonial.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: String(name) } : {}),
        ...(review !== undefined ? { review: String(review) } : {}),
        ...(imageUrl !== undefined
          ? { imageUrl: imageUrl ? String(imageUrl) : null }
          : {}),
        ...(safeRating !== undefined ? { rating: safeRating } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error updating testimonial:", e);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.customerTestimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting testimonial:", e);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

