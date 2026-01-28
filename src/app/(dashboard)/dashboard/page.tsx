'use client';

import { useState, useEffect } from 'react';
import { Plus, Lightbulb } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLinkCard } from '@/components/dashboard/sortable-link-card';
import { LinkForm } from '@/components/dashboard/link-form';
import { ProfileEditModal } from '@/components/dashboard/profile-edit-modal';
import { AvatarEditModal } from '@/components/dashboard/avatar-edit-modal';
import { MobileDashboardHeader } from '@/components/dashboard/MobileDashboardHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MiniPreview } from '@/components/dashboard/MiniPreview';
import Image from 'next/image';
import { Link, User } from '@/types/dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchLinks();
      fetchUser();
    }
  }, [status, router]);

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
        setPreviewRefreshKey(prev => prev + 1);
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
        setPreviewRefreshKey(prev => prev + 1);
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
        setPreviewRefreshKey(prev => prev + 1);
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
        setPreviewRefreshKey(prev => prev + 1);
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

        setPreviewRefreshKey(prev => prev + 1);
        window.dispatchEvent(new CustomEvent('preview-update'));
      } catch (error) {
        console.error('Error reordering links:', error);
        setLinks(links);
      }
    }
  }

  async function handleUpdateProfile(data: { name: string; bio?: string }) {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchUser();
        setPreviewRefreshKey(prev => prev + 1);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async function handleUpdateAvatar(avatarUrl: string) {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarUrl || undefined }),
      });

      if (response.ok) {
        await fetchUser();
        setPreviewRefreshKey(prev => prev + 1);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update avatar');
      }
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      throw error;
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
    <>
      {/* Mobile View */}
      <div className="min-h-screen lg:pb-0 lg:hidden">
        {/* Mobile Header */}
        <MobileDashboardHeader user={user || { name: session?.user?.name || 'User', id: '', email: '', slug: '' }} />

        {/* Main Content */}
        <main className="px-4 mt-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.name || session?.user?.name || 'User'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            linktr.ee/{user?.slug || 'username'}
          </p>

          {/* Grid Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto sm:max-w-none sm:mx-0 w-full mt-3">
            {/* Links Card */}
            <DashboardCard
              onClick={() => router.push('/dashboard/links')}
              icon={<Lightbulb size={10} className="text-yellow-500" />}
            >
              <MiniPreview user={user || { name: session?.user?.name || 'User', id: '', email: '', slug: '' }} links={links} />
              <div className="flex justify-start items-center mt-2 px-1">
                <span className="font-bold text-gray-800">Links</span>
              </div>
            </DashboardCard>
          </div>
        </main>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block w-full max-w-2xl space-y-6">
        {/* Profil Singkat */}
        <div className="flex flex-row space-x-3 items-center justify-between border-b border-solid border-[#E0E2D9] mx-[-1em] px-4 pb-6 md:border-none md:mx-0 md:px-0 md:pb-0">
          <div
            className="relative min-w-16 max-w-16 rounded-full overflow-visible flex cursor-pointer"
            onClick={() => user && setIsAvatarModalOpen(true)}
          >
            <span className="sr-only">Edit Avatar</span>
            <span className="w-full" aria-hidden="true">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile Avatar"
                  width={64}
                  height={64}
                  className="rounded-full aspect-square object-cover border border-solid border-gray-200 cursor-pointer hover:brightness-90 transition-all"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#8129D9] to-purple-600 flex items-center justify-center text-white text-2xl font-bold border border-solid border-gray-200 cursor-pointer hover:brightness-90 transition-all">
                  {user?.name?.charAt(0).toUpperCase() || 'R'}
                </div>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-4 grow min-w-0">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => user && setIsProfileModalOpen(true)}
                    className="text-black! leading-heading! cursor-pointer text-ellipsis break-normal whitespace-nowrap inline-block! overflow-hidden font-medium! max-w-fit text-body-base focus-visible:outline focus-visible:outline-black focus-visible:outline-offset-2 hover:underline bg-transparent border-0 p-0"
                  >
                    {user?.name || 'rifqi'}
                  </button>
                </div>
                <button
                  onClick={() => user && setIsProfileModalOpen(true)}
                  className="text-left text-gray-600 text-sm hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  {user?.bio || 'Add a bio...'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Add Utama */}
        <button
          onClick={openCreateModal}
          className="w-full bg-[#8129D9] hover:bg-primary-hover text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.98]"
        >
          <Plus size={24} /> Add Link
        </button>

        {/* Link Cards */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No links yet. Add your first link above!</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                {links.map((link) => (
                  <SortableLinkCard
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
      </div>

      {/* Modals */}
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

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSubmit={handleUpdateProfile}
        initialData={{ name: user?.name || '', bio: user?.bio }}
      />

      <AvatarEditModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSubmit={handleUpdateAvatar}
        currentAvatar={user?.avatar}
        currentName={user?.name || 'User'}
      />
    </>
  );
}
