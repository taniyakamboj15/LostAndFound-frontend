import Spinner from './Spinner';
import { cn } from '@utils/helpers';

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

export const ShimmerCard = ({ className }: { className?: string }) => (
  <div className={cn("bg-white rounded-lg shadow-sm p-6 animate-pulse", className)}>
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export const ShimmerList = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ShimmerCard key={i} />
    ))}
  </div>
);

export const ShimmerTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="p-4 border-b">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ShimmerDetail = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
