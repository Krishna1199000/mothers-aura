import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { text, buttonText, buttonUrl, isActive } = await req.json();
    const updated = await prisma.siteAnnouncement.update({
      where: { id },
      data: {
        ...(text !== undefined ? { text } : {}),
        buttonText: buttonText ?? null,
        buttonUrl: buttonUrl ?? null,
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.siteAnnouncement.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}


