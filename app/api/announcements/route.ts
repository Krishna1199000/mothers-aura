import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.siteAnnouncement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json(items);
  } catch (error) {
    // Dev-friendly fallback when DB is down: return empty list (AnnouncementBar already has UI fallback text)
    console.error("Announcements API failed:", error);
    return NextResponse.json([]);
  }
}


