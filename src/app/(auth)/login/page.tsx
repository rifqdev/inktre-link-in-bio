'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AuthLayout, { AuthForm } from '@/components/auth/AuthLayout';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to your inktre account"
        footerLink={{
          text: "Don't have an account?",
          href: "/register",
          label: "Sign up"
        }}
        onSubmit={onSubmit}
      >
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Registration successful! Please sign in.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Input Email/Username */}
        <div>
          <input
            type="text"
            name="email"
            placeholder="Email or username"
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
            className="w-full p-4 bg-gray-100 rounded-lg border-transparent focus:border-black focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </AuthForm>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
