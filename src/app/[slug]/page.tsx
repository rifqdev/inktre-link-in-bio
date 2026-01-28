import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LinkButton } from '@/components/link-button';
import { ShareButton } from '@/components/profile/ShareButton';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const user = await prisma.user.findUnique({
    where: { slug },
    select: { name: true, bio: true },
  });

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.name} - Links`,
    description: user.bio || `Check out ${user.name}'s links`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const user = await prisma.user.findUnique({
    where: { slug },
    include: {
      links: {
        where: { active: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          url: true,
          icon: true,
          order: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-10 px-4 bg-[#A5A8AA]">
      <div className="max-w-145 w-full bg-white rounded-t-[48px] overflow-hidden relative shadow-xl flex flex-col items-center p-8 min-h-screen">
        {/* Share Button Header */}
        <div className="w-full flex justify-end mb-8">
          <ShareButton slug={slug} />
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-linear-to-br from-[#8129D9] to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h1>
          {user.bio && (
            <p className="text-center text-gray-700 text-sm font-medium">{user.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {user.links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No links yet</p>
            </div>
          ) : (
            user.links.map((link) => (
              <LinkButton
                key={link.id}
                id={link.id}
                title={link.title}
                url={link.url}
                themeColor={user.themeColor || '#8129D9'}
                icon={link.title}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Create your own link-in-bio
          </Link>
        </div>
      </div>
    </div>
  );
}
