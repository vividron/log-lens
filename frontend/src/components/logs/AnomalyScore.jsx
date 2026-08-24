import React from 'react';

export function AnomalyScore({ score = 0, isAnomaly = false, size = 'md', showBar = false }) {
  const numericScore = Math.max(0, Math.min(100, Math.round(score || 0)));

  // Determine styling based on score thresholds
  let badgeStyle = 'bg-slate-800/40 text-slate-400 border-slate-750/40';
  let barColor = 'bg-slate-500';

  if (numericScore >= 80) {
    badgeStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-semibold';
    barColor = 'bg-rose-500';
  } else if (numericScore >= 60) {
    badgeStyle = 'bg-orange-500/15 text-orange-300 border-orange-500/40 font-medium';
    barColor = 'bg-orange-500';
  } else if (numericScore >= 35) {
    badgeStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-medium';
    barColor = 'bg-amber-400';
  } else if (numericScore > 0) {
    badgeStyle = 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-normal';
    barColor = 'bg-sky-400';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 min-w-[28px]',
    md: 'text-xs px-2 py-0.5 min-w-[34px]',
    lg: 'text-sm px-2.5 py-1 min-w-[42px]',
  };

  if (!isAnomaly && numericScore === 0) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded font-mono text-slate-500 bg-slate-800/20 border border-slate-800/40 select-none ${sizeClasses[size]}`}
        title="Baseline - Score: 0"
      >
        0
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center rounded font-mono border text-center select-none ${badgeStyle} ${sizeClasses[size]}`}
        title={`Anomaly Score: ${numericScore} / 100`}
      >
        {numericScore}
      </span>
      {showBar && (
        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0 hidden sm:block">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${numericScore}%` }}
          />
        </div>
      )}
    </div>
  );
}
