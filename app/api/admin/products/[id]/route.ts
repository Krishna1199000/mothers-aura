import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
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

    if (!name || !price || !shape || !carat || !color || !clarity) {
      return new NextResponse("Name, price, shape, carat, color, and clarity are required", {
        status: 400,
      });
    }

    if (!images || images.length === 0) {
      return new NextResponse("At least one image is required", {
        status: 400,
      });
    }

    const { id } = await params;
    
    // Check if another product with same name exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (existingProduct) {
      return new NextResponse("Product with this name already exists", {
        status: 400,
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
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
    console.error("[PRODUCT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { id } = await params;
    const product = await prisma.product.delete({
      where: { id },
    });
    // Revalidate relevant pages
    try {
      revalidatePath("/");
      revalidatePath("/products");
      if ((product as any)?.slug) {
        revalidatePath(`/product/${(product as any).slug}`);
      }
    } catch {}

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
