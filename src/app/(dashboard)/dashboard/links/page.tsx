'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLinkCardDetailed } from '@/components/dashboard/SortableLinkCardDetailed';
import { LinkForm } from '@/components/dashboard/link-form';
import Image from 'next/image';
import { Link, User } from '@/types/dashboard';

export default function LinksPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [links, setLinks] = useState<Link[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLinks();
    fetchUser();
  }, []);

  async function fetchLinks() {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async function handleCreateLink(data: { title: string; url: string }) {
    setSubmitting(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, order: links.length }),
      });

      if (response.ok) {
        await fetchLinks();
        setIsFormOpen(false);
        window.dispatchEvent(new CustomEvent('preview-update'));
      }
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateLink(data: { title: string; url: string }) {
    if (!editingLink) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchLinks();
        setIsFormOpen(false);
        setEditingLink(null);
        window.dispatchEvent(new CustomEvent('preview-update'));
      }
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleLink(id: string) {
    try {
      const response = await fetch(`/api/links/${id}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        await fetchLinks();
        window.dispatchEvent(new CustomEvent('preview-update'));
      }
    } catch (error) {
      console.error('Error toggling link:', error);
    }
  }

  async function handleDeleteLink(id: string) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLinks();
        window.dispatchEvent(new CustomEvent('preview-update'));
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
        ...link,
        order: index,
      }));

      setLinks(newLinks);

      try {
        const response = await fetch('/api/links/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            links: newLinks.map((link) => ({ id: link.id, order: link.order })),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to reorder links');
        }

        window.dispatchEvent(new CustomEvent('preview-update'));
      } catch (error) {
        console.error('Error reordering links:', error);
        setLinks(links);
      }
    }
  }

  function openEditModal(link: Link) {
    setEditingLink(link);
    setIsFormOpen(true);
  }

  function openCreateModal() {
    setEditingLink(null);
    setIsFormOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-8">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-900 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{user?.name || session?.user?.name}</h2>
            <p className="text-gray-600 text-sm">
              {user?.bio || 'Add a bio...'}
            </p>
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No links yet. Add your first link!</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                {links.map((link) => (
                  <SortableLinkCardDetailed
                    key={link.id}
                    link={link}
                    onToggle={() => handleToggleLink(link.id)}
                    onEdit={() => openEditModal(link)}
                    onDelete={() => handleDeleteLink(link.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl border px-2 py-2 flex items-center gap-1 min-w-[320px] justify-around z-40">
        <button
          onClick={openCreateModal}
          className="flex flex-col items-center gap-1 px-4 py-1 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Plus size={20} />
          <span className="text-[10px] font-bold">Add</span>
        </button>
      </div>

      {/* Link Form Modal */}
      <LinkForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLink(null);
        }}
        onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
        initialData={editingLink || undefined}
        isLoading={submitting}
      />
    </div>
  );
}
