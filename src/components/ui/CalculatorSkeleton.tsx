
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CalculatorSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-10 bg-gray-200 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-96 ml-6" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-6 bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-100 p-6">
        {/* Input group 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Input group 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-24" />
        </div>
      </div>
    </div>
  );
};

export default CalculatorSkeleton;
