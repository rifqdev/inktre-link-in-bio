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
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import Image from 'next/image';
import { Link } from '@/types/dashboard';
import { UserWithTimestamps } from '@/lib/api/types';
import { LinkWithTimestamps } from '@/lib/api/types';
import { linksService } from '@/services/links.service';
import { profileService } from '@/services/profile.service';
import { useApiQuery, useApi } from '@/hooks';
import type { CreateLinkInput, UpdateLinkInput } from '@/lib/api/types';
import type { DragEndEvent } from '@dnd-kit/core';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Fetch links and profile using useApiQuery
  const { data: links = [], loading: linksLoading, refetch: refetchLinks } = useApiQuery<LinkWithTimestamps[]>(
    () => linksService.getLinks(),
    [status]
  );

  const { data: user = null, loading: userLoading, refetch: refetchProfile } = useApiQuery<UserWithTimestamps>(
    () => profileService.getProfile(),
    [status]
  );

  // Mutation hooks
  const { execute: createLinkMutation, loading: creating } = useApi();
  const { execute: updateLinkMutation, loading: updating } = useApi();
  const { execute: toggleLinkMutation } = useApi();
  const { execute: deleteLinkMutation } = useApi();
  const { execute: reorderLinksMutation } = useApi();
  const { execute: updateProfileMutation } = useApi();
  const { execute: updateAvatarMutation } = useApi();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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
        // Optimistically update UI
        refetchLinks();
        refreshPreview();
      } catch {
        // Error will be handled by useApi hook
      }
    }
  }

  async function handleUpdateProfile(data: { name: string; bio?: string }) {
    await updateProfileMutation(
      () => profileService.updateProfile(data),
      { successMessage: 'Profile updated successfully' }
    );
    refetchProfile();
    refreshPreview();
  }

  async function handleUpdateAvatar(avatarUrl: string) {
    await updateAvatarMutation(
      () => profileService.updateProfile({ avatar: avatarUrl || undefined }),
      { successMessage: 'Avatar updated successfully' }
    );
    refetchProfile();
    refreshPreview();
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
    return <DashboardSkeleton />;
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
              <MiniPreview user={user || { name: session?.user?.name || 'User', id: '', email: '', slug: '' }} links={links || []} />
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
          {!links || links.length === 0 ? (
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
        isLoading={creating || updating}
      />

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSubmit={handleUpdateProfile}
        initialData={{ name: user?.name || '', bio: user?.bio ?? undefined }}
      />

      <AvatarEditModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSubmit={handleUpdateAvatar}
        currentAvatar={user?.avatar ?? undefined}
        currentName={user?.name || 'User'}
      />
    </>
  );
}
