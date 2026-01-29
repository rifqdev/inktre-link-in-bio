import Image from 'next/image';

interface ProfileHeaderProps {
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  themeColor?: string | null;
}

export function ProfileHeader({ name, avatar, bio, themeColor }: ProfileHeaderProps) {
  const defaultColor = themeColor || '#8129D9';
  const displayName = name || 'User';

  return (
    <div className="text-center mb-6">
      {avatar ? (
        <Image
          src={avatar}
          alt={displayName}
          width={64}
          height={64}
          className="mx-auto h-16 w-16 rounded-full object-cover border-2 border-white shadow-lg"
        />
      ) : (
        <div
          className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-lg"
          style={{ background: `linear-gradient(to bottom right, ${defaultColor}, #8B5CF6)` }}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <h1 className="mt-3 text-xl font-bold text-gray-900">{displayName}</h1>
      {bio && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{bio}</p>}
    </div>
  );
}
