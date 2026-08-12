import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rows?: number;
}

export function Skeleton({ className, rows = 1, ...props }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-4 w-full animate-pulse rounded-md bg-slate-200"
          style={{ width: index === 0 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
}
