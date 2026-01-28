import { ProfileHeader } from './ProfileHeader';
import { PublicLinksList } from './PublicLinksList';
import Link from 'next/link';

interface User {
  name: string;
  avatar?: string | null;
  bio?: string | null;
  themeColor?: string | null;
}

interface UserLink {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
}

interface MobilePreviewContainerProps {
  user: User;
  links: UserLink[];
}

export function MobilePreviewContainer({ user, links }: MobilePreviewContainerProps) {
  return (
    <div className="w-74 h-140 overflow-y-auto bg-linear-to-br from-background to-gray-100 rounded-4xl shadow-2xl border-2 border-slate-300">
      <div className="max-w-md mx-auto py-8 px-4">
        <ProfileHeader
          name={user.name}
          avatar={user.avatar}
          bio={user.bio}
          themeColor={user.themeColor}
        />
        <PublicLinksList links={links} themeColor={user.themeColor} />

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Create your own link-in-bio
          </Link>
        </div>
      </div>
    </div>
  );
}
