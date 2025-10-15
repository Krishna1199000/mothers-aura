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

    // Get the chat request
    const chatRequest = await db.chatRequest.findUnique({
      where: { id },
    });

    if (!chatRequest) {
      return NextResponse.json(
        { error: 'Chat request not found' },
        { status: 404 }
      );
    }

    // Create a new chat
    const chat = await db.chat.create({
      data: {
        adminId: session.user.id,
        customerName: chatRequest.name,
        customerEmail: chatRequest.email,
        status: 'ACTIVE',
      },
      include: {
        messages: true,
      },
    });

    // Create initial message from the request
    await db.message.create({
      data: {
        chatId: chat.id,
        content: chatRequest.message,
        senderType: 'CUSTOMER',
        senderId: null,
      },
    });

    // Update chat request status
    await db.chatRequest.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        adminId: session.user.id,
        chatId: chat.id,
      },
    });

    return NextResponse.json({
      success: true,
      chat,
      message: 'Chat request accepted',
    });
  } catch (error) {
    console.error('Error accepting chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


