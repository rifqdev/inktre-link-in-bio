'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface LinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; url: string }) => Promise<void>;
  initialData?: { title: string; url: string };
  isLoading?: boolean;
}

export function LinkForm({ isOpen, onClose, onSubmit, initialData, isLoading }: LinkFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void onSubmit({ title, url });
  }

  // When modal closes, parent component will unmount/remount this component
  // So we don't need to manually reset state

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Link' : 'Add New Link'}>
      <form
        key={initialData?.title || 'new'}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Website"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="mt-1"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Add'} Link
          </Button>
        </div>
      </form>
    </Modal>
  );
}
