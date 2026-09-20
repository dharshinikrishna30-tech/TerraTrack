import React from 'react';

export const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count });

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#0e1c17] border border-emerald-500/10 animate-pulse space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-4 bg-emerald-500/10 rounded w-24" />
              <div className="h-8 w-8 bg-emerald-500/10 rounded-xl" />
            </div>
            <div className="h-8 bg-emerald-500/15 rounded w-32" />
            <div className="h-3 bg-emerald-500/10 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`p-6 rounded-2xl bg-[#0e1c17] border border-emerald-500/10 animate-pulse ${className}`}>
        <div className="h-5 bg-emerald-500/10 rounded w-48 mb-6" />
        <div className="h-64 bg-emerald-500/5 rounded-xl flex items-end justify-between p-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-emerald-500/15 rounded-t w-full"
              style={{ height: `${20 + Math.sin(i) * 60 + 20}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="p-6 rounded-2xl bg-[#0e1c17] border border-emerald-500/10 animate-pulse space-y-3">
        <div className="h-5 bg-emerald-500/10 rounded w-36 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-emerald-500/5 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl bg-[#0e1c17] border border-emerald-500/10 animate-pulse space-y-3 ${className}`}>
      <div className="h-4 bg-emerald-500/10 rounded w-3/4" />
      <div className="h-6 bg-emerald-500/15 rounded w-1/2" />
    </div>
  );
};
