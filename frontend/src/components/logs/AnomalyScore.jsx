import React from 'react';

export function AnomalyScore({ score = 0, isAnomaly = false, size = 'md', showBar = false }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const color = value >= 80 ? 'text-rose-400' : value >= 50 ? 'text-amber-400' : 'text-sky-400';
  const width = size === 'sm' ? 'w-10' : 'w-14';
  return <span className="inline-flex items-center gap-1.5 font-mono text-xs"><strong className={color}>{value}</strong>{showBar && <span className={`${width} h-1.5 overflow-hidden rounded-full bg-slate-700`}><span className={`block h-full ${isAnomaly ? 'bg-rose-500' : 'bg-sky-500'}`} style={{ width: `${value}%` }} /></span>}</span>;
}
