import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/click - Track a click on a link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { linkId } = body;

    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 });
    }

    // Create click record
    await prisma.click.create({
      data: { linkId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
