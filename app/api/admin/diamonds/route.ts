import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const statuses = searchParams.getAll("status");
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

    // Build where clause for Mothers Aura diamonds
    const mothersauraWhere: any = {};

    // For employees, only show inventory they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      mothersauraWhere.createdById = session.user.id;
    }

    // Build where clause for both sources
    const commonWhere: any = {};
    const andConditions: any[] = [];

    // Search
    if (search) {
      andConditions.push({
        OR: [
          { stockId: { contains: search, mode: "insensitive" } },
          { certificateNo: { contains: search, mode: "insensitive" } },
        ]
      });
    }

    // Shape filter (case-insensitive)
    if (shapes.length > 0) {
      // Use case-insensitive matching for shapes - match any of the selected shapes
      andConditions.push({
        OR: shapes.map(shape => ({
          shape: { 
            equals: shape, 
            mode: "insensitive" 
          }
        }))
      });
    }

    // Combine AND conditions if we have any
    if (andConditions.length > 0) {
      if (andConditions.length === 1) {
        Object.assign(commonWhere, andConditions[0]);
      } else {
        commonWhere.AND = andConditions;
      }
    }

    // Status filter
    if (statuses.length > 0) {
      commonWhere.status = { in: statuses };
    }

    // Carat range filter
    if (minCarat || maxCarat) {
      commonWhere.carat = {
        ...(minCarat && { gte: parseFloat(minCarat) }),
        ...(maxCarat && { lte: parseFloat(maxCarat) }),
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      commonWhere.pricePerCarat = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }

    // Color filter
    if (colors.length > 0) {
      commonWhere.color = { in: colors };
    }

    // Clarity filter
    if (clarities.length > 0) {
      commonWhere.clarity = { in: clarities };
    }

    // Cut filter
    if (cuts.length > 0) {
      commonWhere.cut = { in: cuts };
    }

    // Lab filter
    if (labs.length > 0) {
      commonWhere.lab = { in: labs };
    }

    // Polish filter
    if (polishes.length > 0) {
      commonWhere.polish = { in: polishes };
    }

    // Symmetry filter
    if (symmetries.length > 0) {
      commonWhere.symmetry = { in: symmetries };
    }

    // Fetch only Mothers Aura inventory diamonds
    const mothersauraDiamonds = await db.inventory.findMany({
        where: {
          ...mothersauraWhere,
          ...commonWhere,
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

    // Transform Mothers Aura diamonds for UI compatibility
    const mothersauraTransformed = mothersauraDiamonds.map((d: any) => ({
      id: d.id,
      stockId: d.stockId,
      shape: d.shape,
      carat: d.carat,
      color: d.color,
      clarity: d.clarity,
      cut: d.cut,
      polish: d.polish,
      symmetry: d.symmetry,
      lab: d.lab,
      pricePerCarat: d.carat ? (d.askingAmount ?? 0) / d.carat : 0,
      amount: d.askingAmount ?? 0,
      imageUrl: d.imageUrl,
      videoUrl: d.videoUrl,
      certificateUrl: d.certificateUrl,
      source: 'mothersaura' as const,
    }));

    return NextResponse.json(mothersauraTransformed);
  } catch (error) {
    console.error("Error fetching diamonds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
