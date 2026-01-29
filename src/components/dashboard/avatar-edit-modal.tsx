'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AvatarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (avatarUrl: string) => Promise<void>;
  currentAvatar?: string;
  currentName: string;
}

export function AvatarEditModal({
  isOpen,
  onClose,
  onSubmit,
  currentAvatar,
  currentName,
}: AvatarEditModalProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [imageError, setImageError] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAvatarUrl(currentAvatar || '');
      setError('');
      setUrlError('');
      setImageError(false);
    }
  }, [isOpen, currentAvatar]);

  // Validate URL in real-time
  useEffect(() => {
    if (avatarUrl && avatarUrl.trim()) {
      try {
        new URL(avatarUrl);
        setUrlError('');
      } catch {
        setUrlError('Invalid URL format');
      }
    } else {
      setUrlError('');
    }
  }, [avatarUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validate URL if provided
    if (avatarUrl && avatarUrl.trim()) {
      try {
        new URL(avatarUrl);
      } catch {
        setError('Please enter a valid URL');
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(avatarUrl.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setAvatarUrl(currentAvatar || '');
    setError('');
    setUrlError('');
    onClose();
  }

  // Get avatar to display (current or new preview)
  const isNewAvatarValid = avatarUrl && !urlError && avatarUrl.trim() !== '';
  const isCurrentAvatarValid = currentAvatar && currentAvatar.trim() !== '';
  const displayAvatar = isNewAvatarValid ? avatarUrl : (isCurrentAvatarValid ? currentAvatar : '');
  const showNewAvatar = isNewAvatarValid && avatarUrl !== currentAvatar && !imageError;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Avatar">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            {displayAvatar && displayAvatar.trim() !== '' && !imageError ? (
              <Image
                src={displayAvatar}
                alt={currentName}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8129D9] to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {currentName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Status Badge */}
          {showNewAvatar && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              New avatar preview
            </span>
          )}

          {/* Image Error Message */}
          {imageError && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
              Failed to load image
            </span>
          )}
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <Input
            id="avatar"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full"
          />
          {urlError && (
            <p className="text-red-500 text-xs mt-1">{urlError}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Enter an image URL to update your avatar. Leave empty to use default avatar.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#8129D9] hover:bg-[#6a21b3] text-white"
            disabled={loading || !!urlError}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
