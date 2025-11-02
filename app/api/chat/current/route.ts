import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  try {
    // This endpoint is for customers to check if they have an existing chat
    // In a real implementation, you might want to track this by session or IP
    // For now, we'll return null as customers don't have persistent sessions
    
    return NextResponse.json({ chat: null });
  } catch (error) {
    console.error('Error fetching current chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}






















