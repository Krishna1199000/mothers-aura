import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { content, chatId } = await request.json();

    if (!content || !chatId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify chat exists and is active
    const chat = await db.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Chat not found or inactive' },
        { status: 404 }
      );
    }

    // Create the message
    const message = await db.message.create({
      data: {
        content,
        senderType: 'CUSTOMER',
        chatId,
        senderId: null,
      },
    });

    // Update chat's lastMessageAt
    await db.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating customer message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}







