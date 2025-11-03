import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  try {
    // Check if any admin is available
    const availableAdmins = await db.user.findMany({
      where: {
        role: 'ADMIN',
        adminStatus: 'AVAILABLE',
      },
    });

    const status = availableAdmins.length > 0 ? 'AVAILABLE' : 'OFFLINE';

    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ status: 'OFFLINE' });
  }
}