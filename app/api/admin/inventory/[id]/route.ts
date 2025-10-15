import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const inventory = await db.inventory.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Employees can only view their own inventory
    if (
      (session.user as any)?.role === "EMPLOYEE" &&
      inventory.createdById !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update inventory
    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Basic validation
    if (!data.stockId || !data.shape || !data.carat || !data.color || !data.clarity || !data.polish || !data.symmetry || !data.lab || !data.pricePerCarat) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { id } = await params;
    
    // Check if stockId is unique (excluding current item)
    const existing = await db.inventory.findFirst({
      where: {
        stockId: data.stockId,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Stock ID already exists" },
        { status: 400 }
      );
    }

    const inventory = await db.inventory.update({
      where: { id },
      data: {
        stockId: data.stockId,
        heldByCompany: data.heldByCompany,
        status: data.status,
        shape: data.shape,
        carat: parseFloat(data.carat),
        color: data.color,
        clarity: data.clarity,
        cut: data.cut,
        polish: data.polish,
        symmetry: data.symmetry,
        certificateNo: data.certificateNo,
        lab: data.lab,
        pricePerCarat: parseFloat(data.pricePerCarat),
        amount: parseFloat(data.amount),
        discountPercent: parseFloat(data.discountPercent) || 5.0,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        certificateUrl: data.certificateUrl,
        measurement: data.measurement,
        location: data.location,
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete inventory
    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await db.inventory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
