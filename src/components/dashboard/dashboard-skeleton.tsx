import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {/* Profile Section Skeleton */}
        <div className="flex items-start gap-4 mb-8">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Add Button Skeleton */}
        <Skeleton className="w-full h-12 rounded-full mb-4" />

        {/* Links Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-20 rounded-lg" />
          ))}
        </div>
      </main>
    </div>
  );
}

export function LinksPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {/* Profile Section Skeleton */}
        <div className="flex items-start gap-4 mb-8">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Links Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-20 rounded-lg" />
          ))}
        </div>
      </main>

      {/* Floating Button Skeleton */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2">
        <Skeleton className="w-32 h-12 rounded-full" />
      </div>
    </div>
  );
}
