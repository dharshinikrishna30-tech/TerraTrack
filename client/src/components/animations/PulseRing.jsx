import React from 'react';

export const PulseRing = ({ color = 'emerald', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const ringMap = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    sky: 'bg-sky-400',
  };

  return (
    <span className="relative flex items-center justify-center">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ringMap[color]}`}
      />
      <span className={`relative inline-flex rounded-full ${sizeMap[size]} ${ringMap[color]}`} />
    </span>
  );
};
