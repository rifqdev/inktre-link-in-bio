'use client';
import {
  Trash2,
  BarChart2,
  GripVertical,
  Pencil,
} from 'lucide-react';
import { Link } from '@/types/dashboard';

interface LinkCardDetailedProps {
  link: Link;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function LinkCardDetailed({ link, onToggle, onEdit, onDelete, dragHandleProps }: LinkCardDetailedProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-start gap-4">
        <div
          className="flex items-center justify-center pt-2 cursor-grab text-gray-300"
          {...dragHandleProps}
        >
          <GripVertical size={20} />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px]">{link.title}</span>
            <Pencil size={14} className="text-gray-400 cursor-pointer" onClick={onEdit} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm underline cursor-pointer truncate max-w-[200px]">
              {link.url}
            </span>
            <Pencil size={14} className="text-gray-400 cursor-pointer" onClick={onEdit} />
          </div>

          <div className="flex items-center gap-4 pt-4 text-gray-400">
            <div className="flex items-center gap-1 text-xs font-medium cursor-default">
              <BarChart2 size={18} /> {link.clicks || 0} clicks
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between h-full space-y-6">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={link.active} onChange={onToggle} />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          <Trash2
            size={18}
            className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
