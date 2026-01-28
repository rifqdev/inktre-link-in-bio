import { LinkButton } from '@/components/link-button';

interface UserLink {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
}

interface PublicLinksListProps {
  links: UserLink[];
  themeColor?: string | null;
}

export function PublicLinksList({ links, themeColor }: PublicLinksListProps) {
  const defaultColor = themeColor || '#8129D9';

  return (
    <div className="space-y-3">
      {links.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">No links yet</p>
        </div>
      ) : (
        links.map((link) => (
          <LinkButton
            key={link.id}
            id={link.id}
            title={link.title}
            url={link.url}
            themeColor={defaultColor}
          />
        ))
      )}
    </div>
  );
}
