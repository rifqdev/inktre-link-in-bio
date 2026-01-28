'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkCardDetailed } from './LinkCardDetailed';
import { Link } from '@/types/dashboard';

interface SortableLinkCardDetailedProps {
  link: Link;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableLinkCardDetailed({ link, onToggle, onEdit, onDelete }: SortableLinkCardDetailedProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

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
      <LinkCardDetailed
        link={link}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  );
}
