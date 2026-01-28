'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; bio?: string }) => Promise<void>;
  initialData: { name: string; bio?: string };
}

export function ProfileEditModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProfileEditModalProps) {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setBio(initialData.bio || '');
      setError('');
    }
  }, [isOpen, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validate name
    if (!name || name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Validate bio length
    if (bio.length > 500) {
      setError('Bio must be at most 500 characters');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), bio: bio.trim() || undefined });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setName(initialData.name);
    setBio(initialData.bio || '');
    setError('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full"
            minLength={2}
            required
          />
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8129D9] focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${bio.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
              {bio.length}/500
            </span>
          </div>
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
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
