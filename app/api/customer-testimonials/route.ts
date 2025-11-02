import { NextResponse } from 'next/server';
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
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to load testimonials' }, { status: 500 });
  }
}

