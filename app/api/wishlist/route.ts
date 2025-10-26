import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      wishlist,
      count: wishlist.length,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, price, image, category } = body;

    // Validate required fields
    if (!id || !name || !price || !image || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item already exists
    const existingItem = await prisma.wishlistItem.findFirst({
      where: { 
        userId: session.user.id,
        productId: id 
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: id,
        productName: name,
        productPrice: price,
        productImage: image,
        productCategory: category,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
      item: wishlistItem,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clear entire wishlist for the user
    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Wishlist cleared',
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear wishlist' },
      { status: 500 }
    );
  }
}
