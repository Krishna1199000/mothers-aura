import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, review, imageUrl, rating } = await req.json();
    
    const updateData: any = {};
    if (name !== undefined && typeof name === 'string' && name.trim()) {
      updateData.name = name.trim();
    }
    if (review !== undefined && typeof review === 'string' && review.trim()) {
      updateData.review = review.trim();
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl?.trim() || null;
    }
    if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
      updateData.rating = rating;
    }

    const updated = await prisma.customerTestimonial.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.customerTestimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}

