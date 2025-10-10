import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { price } = await request.json();

    if (!price) {
      return NextResponse.json(
        { error: "Price is required" },
        { status: 400 }
      );
    }

    const parcelGood = await prisma.parcelGoods.update({
      where: { id },
      data: { price: parseFloat(price) }
    });

    return NextResponse.json(parcelGood);
  } catch (error) {
    console.error("Error updating parcel good:", error);
    return NextResponse.json(
      { error: "Failed to update parcel good" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.parcelGoods.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting parcel good:", error);
    return NextResponse.json(
      { error: "Failed to delete parcel good" },
      { status: 500 }
    );
  }
}
