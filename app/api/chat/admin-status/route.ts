import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/prisma';

export async function GET() {
  try {
    // Get any available admin
    const admin = await db.user.findFirst({
      where: {
        role: 'ADMIN',
        adminStatus: 'AVAILABLE',
      },
    });

    return NextResponse.json({
      status: admin ? 'AVAILABLE' : 'OFFLINE',
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    // Update admin status
    await db.user.update({
      where: { id: session.user.id },
      data: { adminStatus: status },
    });

    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error updating admin status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





















