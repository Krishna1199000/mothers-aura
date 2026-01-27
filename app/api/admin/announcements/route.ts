import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.siteAnnouncement.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Admin announcements GET failed:", error);
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, buttonText, buttonUrl, isActive } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const created = await prisma.siteAnnouncement.create({
      data: {
        text,
        buttonText: buttonText || null,
        buttonUrl: buttonUrl || null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Admin announcements POST failed:", error);
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}


