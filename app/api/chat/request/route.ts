import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Create chat request
    const chatRequest = await db.chatRequest.create({
      data: {
        name,
        email,
        message,
        status: 'PENDING',
        source: 'chat_widget',
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    // Get all available admins
    const admins = await db.user.findMany({
      where: {
        role: 'ADMIN',
        adminStatus: 'AVAILABLE',
      },
    });

    // If any admin is available, create a chat automatically
    if (admins.length > 0) {
      const admin = admins[0]; // Assign to first available admin

      const chat = await db.chat.create({
        data: {
          adminId: admin.id,
          customerName: name,
          customerEmail: email,
          status: 'ACTIVE',
        },
      });

      // Create initial message
      await db.message.create({
        data: {
          chatId: chat.id,
          content: message,
          senderType: 'CUSTOMER',
          senderId: null,
        },
      });

      // Update chat request
      await db.chatRequest.update({
        where: { id: chatRequest.id },
        data: {
          status: 'ACCEPTED',
          adminId: admin.id,
          chatId: chat.id,
        },
      });

      return NextResponse.json({
        success: true,
        chat,
        message: 'Chat started with available admin',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Chat request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


