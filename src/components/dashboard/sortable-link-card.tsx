'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkCard } from './link-card';

interface SortableLinkCardProps {
  link: {
    id: string;
    title: string;
    url: string;
    active: boolean;
    clicks?: number;
  };
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableLinkCard({ link, onToggle, onEdit, onDelete }: SortableLinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
      {...attributes}
    >
      <LinkCard
        link={link}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  );
}
