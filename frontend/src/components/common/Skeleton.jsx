import React from 'react';

export function Skeleton({ className = '', variant = 'rect', ...props }) {
  const baseClasses = 'animate-pulse bg-slate-800/80 border border-slate-750/30';
  const variantClasses = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'h-4 rounded',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant] || 'rounded-md'} ${className}`}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <div className="w-full divide-y divide-slate-800/60">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-4 flex-1 rounded" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}
