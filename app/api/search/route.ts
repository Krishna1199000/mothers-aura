import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build the where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    // Fetch products from UI inventory
    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform products for consistent response format
    const results = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      shape: product.shape,
      carat: product.carat,
      color: product.color,
      clarity: product.clarity,
      type: "ui-inventory",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}