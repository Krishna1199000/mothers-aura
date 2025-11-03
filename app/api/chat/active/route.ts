import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  try {
    // Get active chats (limited info for security)
    const chats = await db.chat.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        customerEmail: true,
        status: true,
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error fetching active chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}