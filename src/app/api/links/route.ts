import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createLinkSchema } from '@/lib/validations';
import { getPlatformById, getPlatformFromUrl } from '@/lib/social-platforms';

// GET /api/links - Get all user's links
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    // Transform the data to include clicks count
    const linksWithClicks = links.map(link => ({
      ...link,
      clicks: link._count.clicks,
    }));

    return NextResponse.json(linksWithClicks);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/links - Create a new link
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedFields = createLinkSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { title, url, active, order, type: inputType, icon: inputIcon } = validatedFields.data;

    // Validate social URL if type is provided and not 'regular'
    let linkType = inputType;
    let linkIcon = inputIcon;

    if (linkType && linkType !== 'regular') {
      const platform = getPlatformById(linkType);
      if (!platform) {
        return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
      }
      if (!platform.urlPattern.test(url)) {
        return NextResponse.json(
          { error: `Invalid ${platform.name} URL format` },
          { status: 400 }
        );
      }
    }

    // Auto-detect platform from URL if type not provided
    if (!linkType || linkType === 'regular') {
      const detectedPlatform = getPlatformFromUrl(url);
      if (detectedPlatform) {
        linkType = detectedPlatform.id as 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
        linkIcon = detectedPlatform.id;
      }
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        active,
        order,
        type: linkType,
        icon: linkIcon,
        userId: session.user.id,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
