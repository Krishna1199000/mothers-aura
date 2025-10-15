import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Update chat request status
    await db.chatRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Chat request rejected',
    });
  } catch (error) {
    console.error('Error rejecting chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


