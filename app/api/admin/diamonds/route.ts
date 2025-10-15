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

    // Build where clause for Mothers Aura diamonds
    const mothersauraWhere: any = {};

    // For employees, only show inventory they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      mothersauraWhere.createdById = session.user.id;
    }

    // Build where clause for both sources
    const commonWhere: any = {};

    // Search
    if (search) {
      commonWhere.OR = [
        { stockId: { contains: search, mode: "insensitive" } },
        { certificateNo: { contains: search, mode: "insensitive" } },
      ];
    }

    // Status filter
    if (status) {
      commonWhere.status = status;
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

    // Shape filter
    if (shapes.length > 0) {
      commonWhere.shape = { in: shapes };
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

    // Build where clause for Cranberri diamonds (using size instead of carat)
    const cranberriWhere: any = {};
    if (search) {
      cranberriWhere.OR = [
        { stockId: { contains: search, mode: "insensitive" } },
        { certificateNo: { contains: search, mode: "insensitive" } },
      ];
    }
    if (minCarat || maxCarat) {
      cranberriWhere.size = {
        ...(minCarat && { gte: parseFloat(minCarat) }),
        ...(maxCarat && { lte: parseFloat(maxCarat) }),
      };
    }
    if (minPrice || maxPrice) {
      cranberriWhere.pricePerCarat = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }
    if (colors.length > 0) {
      cranberriWhere.color = { in: colors };
    }
    if (clarities.length > 0) {
      cranberriWhere.clarity = { in: clarities };
    }
    if (shapes.length > 0) {
      cranberriWhere.shape = { in: shapes };
    }
    if (cuts.length > 0) {
      cranberriWhere.cut = { in: cuts };
    }
    if (labs.length > 0) {
      cranberriWhere.lab = { in: labs };
    }
    if (polishes.length > 0) {
      cranberriWhere.polish = { in: polishes };
    }
    if (symmetries.length > 0) {
      cranberriWhere.sym = { in: symmetries };
    }

    // Fetch diamonds from all three sources
    const [mothersauraDiamonds, kyrahDiamonds, cranberriDiamonds] = await Promise.all([
      // Fetch Mothers Aura diamonds
      db.inventory.findMany({
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
      }),

      // Fetch Kyrah diamonds
      db.kyrahDiamond.findMany({
        where: commonWhere,
      }),

      // Fetch Cranberri diamonds
      db.cranberriDiamond.findMany({
        where: cranberriWhere,
      }),
    ]);

    // Transform Mothers Aura diamonds
    const mothersauraTransformed = mothersauraDiamonds.map(d => ({
      ...d,
      source: 'mothersaura' as const,
    }));

    // Transform Kyrah diamonds
    const kyrahTransformed = kyrahDiamonds.map(d => ({
      ...d,
      source: 'kyrah' as const,
    }));

    // Transform Cranberri diamonds
    const cranberriTransformed = cranberriDiamonds.map(d => ({
      ...d,
      source: 'cranberri' as const,
    }));

    // Combine and return all diamonds
    return NextResponse.json([...mothersauraTransformed, ...kyrahTransformed, ...cranberriTransformed]);
  } catch (error) {
    console.error("Error fetching diamonds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
