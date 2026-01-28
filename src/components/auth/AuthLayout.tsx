import { ReactNode, FormEventHandler } from 'react';
import AuthBanner from './AuthBanner';
import AuthLogo from './AuthLogo';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row items-center">
      {/* Left Side: Form */}
      <div className="w-full md:w-1/2 flex flex-col px-8 py-12 md:px-24 md:py-16">
        {children}
      </div>

      {/* Right Side: Visual Banner */}
      <AuthBanner />
    </div>
  );
}

interface AuthFormProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerLink?: {
    text: string;
    href: string;
    label: string;
  };
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export function AuthForm({ children, title, subtitle, footerLink, onSubmit }: AuthFormProps) {
  return (
    <>
      {/* Logo */}
      <div className="mb-6">
        <AuthLogo />
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full mx-auto md:mx-0">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          {subtitle}
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          {children}
        </form>

        {/* Footer */}
        {footerLink && (
          <div className="mt-6 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              {footerLink.text}{' '}
              <a href={footerLink.href} className="text-purple-700 font-bold hover:underline">
                {footerLink.label}
              </a>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
