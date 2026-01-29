'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLinkCardDetailed } from '@/components/dashboard/SortableLinkCardDetailed';
import { LinkForm } from '@/components/dashboard/link-form';
import { LinksPageSkeleton } from '@/components/dashboard/dashboard-skeleton';
import Image from 'next/image';
import { Link } from '@/types/dashboard';
import { UserWithTimestamps } from '@/lib/api/types';
import { LinkWithTimestamps } from '@/lib/api/types';
import { linksService } from '@/services/links.service';
import { profileService } from '@/services/profile.service';
import { useApiQuery, useApi } from '@/hooks';
import type { CreateLinkInput, UpdateLinkInput } from '@/lib/api/types';
import type { DragEndEvent } from '@dnd-kit/core';

export default function LinksPage() {
  const { status } = useSession();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Fetch links and profile using useApiQuery
  const { data: links = [], loading: linksLoading, refetch: refetchLinks } = useApiQuery<LinkWithTimestamps[]>(
    () => linksService.getLinks(),
    [status]
  );

  const { data: user = null, loading: userLoading } = useApiQuery<UserWithTimestamps>(
    () => profileService.getProfile(),
    [status]
  );

  // Mutation hooks
  const { execute: createLinkMutation, loading: creating } = useApi();
  const { execute: updateLinkMutation, loading: updating } = useApi();
  const { execute: toggleLinkMutation } = useApi();
  const { execute: deleteLinkMutation } = useApi();
  const { execute: reorderLinksMutation } = useApi();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Refresh preview when user or links data changes
  // Only send data if we have both user and links AND slug is available
  useEffect(() => {
    if (user && links && user.slug) {
      const previewData = {
        user: {
          name: user.name || 'User',
          avatar: user.avatar || null,
          bio: user.bio || null,
          themeColor: user.themeColor || null,
        },
        links: links || [],
      };
      window.dispatchEvent(new CustomEvent('preview-data-update', { detail: previewData }));
    }
    // Only run when user or links actually change
  }, [user, links]);

  function refreshPreview() {
    // Send preview data directly to avoid refetching
    if (!user || !links || !user.slug) return;

    const previewData = {
      user: {
        name: user.name || 'User',
        avatar: user.avatar || null,
        bio: user.bio || null,
        themeColor: user.themeColor || null,
      },
      links: links || [],
    };
    window.dispatchEvent(new CustomEvent('preview-data-update', { detail: previewData }));
  }

  async function handleCreateLink(data: { title: string; url: string }) {
    const linkData: CreateLinkInput = { ...data, active: true, order: links?.length || 0 };
    await createLinkMutation(
      () => linksService.createLink(linkData),
      { successMessage: 'Link created successfully' }
    );
    refetchLinks();
    setIsFormOpen(false);
    refreshPreview();
  }

  async function handleUpdateLink(data: { title: string; url: string }) {
    if (!editingLink) return;

    const linkData: UpdateLinkInput = data;
    await updateLinkMutation(
      () => linksService.updateLink(editingLink.id, linkData),
      { successMessage: 'Link updated successfully' }
    );
    refetchLinks();
    setIsFormOpen(false);
    setEditingLink(null);
    refreshPreview();
  }

  async function handleToggleLink(id: string) {
    await toggleLinkMutation(() => linksService.toggleLink(id));
    refetchLinks();
    refreshPreview();
  }

  async function handleDeleteLink(id: string) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    await deleteLinkMutation(
      () => linksService.deleteLink(id),
      { successMessage: 'Link deleted successfully' }
    );
    refetchLinks();
    refreshPreview();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && links) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
        ...link,
        order: index,
      }));

      try {
        await reorderLinksMutation(() =>
          linksService.reorderLinks({
            links: newLinks.map((link) => ({ id: link.id, order: link.order })),
          })
        );
        refetchLinks();
        refreshPreview();
      } catch {
        // Error will be handled by useApi hook
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

  const loading = linksLoading || userLoading;

  if (loading) {
    return <LinksPageSkeleton />;
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
              width={80}
              height={80}
              className="rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#8129D9] to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'R'}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-gray-500 text-sm">linktr.ee/{user?.slug || 'username'}</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {!links || links.length === 0 ? (
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

      {/* Floating Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl border px-2 py-2 flex items-center gap-1 min-w-[320px] justify-around z-40">
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
        isLoading={creating || updating}
      />
    </div>
  );
}
