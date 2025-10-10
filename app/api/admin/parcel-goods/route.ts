import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin only
    if ((session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const parcelGoods = await prisma.parcelGoods.findMany({
      orderBy: {
        sieveSize: 'asc'
      }
    });

    return NextResponse.json(parcelGoods);
  } catch (error) {
    console.error("Error fetching parcel goods:", error);
    return NextResponse.json(
      { error: "Failed to fetch parcel goods" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const { sieveSize, price } = await request.json();

    // Validate input
    if (sieveSize === undefined || sieveSize === null || price === undefined || price === null || price === "") {
      return NextResponse.json(
        { error: "Sieve size and price are required" },
        { status: 400 }
      );
    }

    // Check if sieve size already exists
    const existing = await prisma.parcelGoods.findFirst({
      where: { sieveSize: parseFloat(sieveSize) }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Sieve size already exists" },
        { status: 400 }
      );
    }

    const parcelGood = await prisma.parcelGoods.create({
      data: {
        sieveSize: parseFloat(sieveSize),
        price: parseFloat(price),
        createdById: (session.user as any)?.id,
      }
    });

    return NextResponse.json(parcelGood);
  } catch (error) {
    console.error("Error creating parcel good:", error);
    return NextResponse.json(
      { error: "Failed to create parcel good" },
      { status: 500 }
    );
  }
}
