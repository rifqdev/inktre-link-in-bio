import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reorderLinksSchema } from '@/lib/validations';

// POST /api/links/reorder - Reorder links
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedFields = reorderLinksSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { links } = validatedFields.data;

    // Update each link's order in a transaction
    await prisma.$transaction(
      links.map((link) =>
        prisma.link.updateMany({
          where: {
            id: link.id,
            userId: session.user!.id,
          },
          data: {
            order: link.order,
          },
        })
      )
    );

    return NextResponse.json({ message: 'Links reordered successfully' });
  } catch (error) {
    console.error('Error reordering links:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
