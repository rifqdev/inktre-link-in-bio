import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: IconProps) {
  // Convert icon name to PascalCase (e.g., "instagram" -> "Instagram")
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (LucideIcons as any)[iconName];

  if (!IconComponent) {
    return <LucideIcons.Globe className={className} />;
  }

  return <IconComponent className={className} />;
}
