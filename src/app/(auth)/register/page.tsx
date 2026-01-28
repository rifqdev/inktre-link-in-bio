'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout, { AuthForm } from '@/components/auth/AuthLayout';
import { authService } from '@/services/auth.service';
import { useApi } from '@/hooks';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { execute: registerMutation, loading } = useApi();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      slug: formData.get('slug') as string,
    };

    try {
      await registerMutation(
        () => authService.register(data),
        { successMessage: 'Account created successfully!' }
      );
      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        title="Create your account"
        subtitle="Start building your link-in-bio page"
        footerLink={{
          text: "Already have an account?",
          href: "/login",
          label: "Sign in"
        }}
        onSubmit={onSubmit}
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Input Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full p-4 bg-gray-100 rounded-lg border-transparent focus:border-black focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Input Username */}
        <div>
          <input
            type="text"
            name="slug"
            placeholder="Username"
            required
            pattern="[a-z0-9-]+"
            className="w-full p-4 bg-gray-100 rounded-lg border-transparent focus:border-black focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Input Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="w-full p-4 bg-gray-100 rounded-lg border-transparent focus:border-black focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Input Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={8}
            className="w-full p-4 bg-gray-100 rounded-lg border-transparent focus:border-black focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </AuthForm>
    </AuthLayout>
  );
}
