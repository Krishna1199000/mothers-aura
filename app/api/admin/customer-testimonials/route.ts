import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const testimonials = await prisma.customerTestimonial.findMany({ 
      orderBy: { createdAt: 'desc' },
      take: 3 
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, review, imageUrl, rating } = await req.json();
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    if (!review || typeof review !== 'string' || !review.trim()) {
      return NextResponse.json({ error: 'Review is required' }, { status: 400 });
    }

    // Check if we already have 3 testimonials
    const count = await prisma.customerTestimonial.count();
    if (count >= 3) {
      return NextResponse.json({ error: 'Maximum of 3 testimonials allowed' }, { status: 400 });
    }

    const testimonial = await prisma.customerTestimonial.create({
      data: {
        name: name.trim(),
        review: review.trim(),
        imageUrl: imageUrl?.trim() || null,
        rating: typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : 5,
      },
    });
    
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

