import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: IconProps) {
  // Convert icon name to PascalCase (e.g., "instagram" -> "Instagram")
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;

  if (!IconComponent) {
    return <LucideIcons.Globe className={className} />;
  }

  return <IconComponent className={className} />;
}
