import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import slugify from "slugify";

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function GET() {
  try {
    // Allow public access to read products
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only admins can create products
    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      priceUSD,
      priceINR,
      priceEUR,
      priceAUD,
      shape,
      carat,
      color,
      clarity,
      cut,
      polish,
      symmetry,
      certificateNo,
      lab,
      stock,
      images,
    } = body;

    // Validate required fields
    if (!name || !priceUSD || !shape || !carat || !color || !clarity) {
      return new NextResponse("Name, priceUSD, shape, carat, color, and clarity are required", { status: 400 });
    }

    if (!images || images.length === 0) {
      return new NextResponse("At least one image is required", {
        status: 400,
      });
    }

    // Check if product with same name exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingProduct) {
      return new NextResponse("Product with this name already exists", {
        status: 400,
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        priceUSD: parseFloat(priceUSD),
        priceINR: parseFloat(priceINR || "0"),
        priceEUR: parseFloat(priceEUR || "0"),
        priceAUD: parseFloat(priceAUD || "0"),
        price: parseFloat(priceUSD), // for legacy fallback; remove later
        shape,
        carat: parseFloat(carat),
        color,
        clarity,
        cut: cut || undefined,
        polish: polish || undefined,
        symmetry: symmetry || undefined,
        certificateNo: certificateNo || undefined,
        lab: lab || undefined,
        stock: parseInt(stock || "1"),
        images,
      },
    });

    // Revalidate relevant pages
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/product/${slug}`);
    } catch {}

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT and DELETE handlers are in app/api/admin/products/[id]/route.ts
