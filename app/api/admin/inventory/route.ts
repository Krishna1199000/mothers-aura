import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
const db = prisma as any;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const minCarat = searchParams.get("minCarat");
    const maxCarat = searchParams.get("maxCarat");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const colors = searchParams.getAll("color");
    const clarities = searchParams.getAll("clarity");
    const shapes = searchParams.getAll("shape");
    const cuts = searchParams.getAll("cut");
    const labs = searchParams.getAll("lab");
    const polishes = searchParams.getAll("polish");
    const symmetries = searchParams.getAll("symmetry");
    const sortBy = searchParams.get("sortBy");
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    // Build where clause
    const where: any = {};

    // For employees, only show inventory they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      where.createdById = session.user.id;
    }

    // Search
    if (search) {
      where.OR = [
        { stockId: { contains: search, mode: "insensitive" } },
        { heldByCompany: { contains: search, mode: "insensitive" } },
        { certificateNo: { contains: search, mode: "insensitive" } },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Carat range filter
    if (minCarat || maxCarat) {
      where.carat = {
        ...(minCarat && { gte: parseFloat(minCarat) }),
        ...(maxCarat && { lte: parseFloat(maxCarat) }),
      };
    }

    // Color filter
    if (colors.length > 0) {
      where.color = { in: colors };
    }

    // Clarity filter
    if (clarities.length > 0) {
      where.clarity = { in: clarities };
    }

    // Shape filter
    if (shapes.length > 0) {
      where.shape = { in: shapes };
    }

    // Cut filter
    if (cuts.length > 0) {
      where.cut = { in: cuts };
    }

    // Lab filter
    if (labs.length > 0) {
      where.lab = { in: labs };
    }

    // Polish filter
    if (polishes.length > 0) {
      where.polish = { in: polishes };
    }

    // Symmetry filter
    if (symmetries.length > 0) {
      where.symmetry = { in: symmetries };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.pricePerCarat = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }

    // Fetch inventory with related data
    const inventory = await db.inventory.findMany({
      where,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: sortBy ? {
        [sortBy]: order,
      } : {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
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

    // Check if stockId is unique
    const existing = await db.inventory.findUnique({
      where: { stockId: data.stockId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Stock ID already exists" },
        { status: 400 }
      );
    }

    // Create inventory item
    const inventory = await db.inventory.create({
      data: {
        stockId: data.stockId,
        heldByCompany: data.heldByCompany,
        status: data.status || "AVAILABLE",
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
        createdById: session.user.id,
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

    return NextResponse.json({
      message: "Inventory item created successfully",
      inventory,
    });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
