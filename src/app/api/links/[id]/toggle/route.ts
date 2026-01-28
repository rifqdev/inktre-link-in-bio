import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/links/[id]/toggle - Toggle link active status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if link exists and belongs to user
    const existingLink = await prisma.link.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Toggle active status
    const updatedLink = await prisma.link.update({
      where: { id: id },
      data: { active: !existingLink.active },
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error('Error toggling link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
