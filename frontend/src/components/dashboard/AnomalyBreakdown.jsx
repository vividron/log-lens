import React from 'react';
import { SeverityBadge } from '../anomalies/SeverityBadge';
import { ShieldAlert, Network, ArrowRight, ExternalLink } from 'lucide-react';

export function AnomalyBreakdown({
  breakdown = { critical: 18, high: 46, medium: 39, low: 23 },
  topSources = [],
  onSelectSource,
  onSelectSeverity,
}) {
  const totalAnomalies =
    (breakdown.critical || 0) +
    (breakdown.high || 0) +
    (breakdown.medium || 0) +
    (breakdown.low || 0) || 1;

  const severityItems = [
    { key: 'CRITICAL', label: 'Critical', count: breakdown.critical || 0, color: 'bg-rose-500', textColor: 'text-rose-400' },
    { key: 'HIGH', label: 'High', count: breakdown.high || 0, color: 'bg-orange-500', textColor: 'text-orange-400' },
    { key: 'MEDIUM', label: 'Medium', count: breakdown.medium || 0, color: 'bg-amber-400', textColor: 'text-amber-400' },
    { key: 'LOW', label: 'Low', count: breakdown.low || 0, color: 'bg-sky-400', textColor: 'text-sky-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Anomaly Severity Breakdown */}
      <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-100">Anomaly Severity Breakdown</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {totalAnomalies} Flagged
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Distribution of active anomaly events by calculated risk severity.
          </p>

          {/* Multi-segmented distribution progress bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex mb-4">
            {severityItems.map((item) => {
              const pct = (item.count / totalAnomalies) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={item.key}
                  className={`${item.color} transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                  title={`${item.label}: ${item.count} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Severity Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {severityItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectSeverity && onSelectSeverity(item.key)}
                className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 p-2.5 rounded-lg text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <SeverityBadge severity={item.key} size="sm" />
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-base font-bold font-mono ${item.textColor}`}>
                    {item.count}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {((item.count / totalAnomalies) * 100).toFixed(0)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top Anomaly Sources */}
      <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-slate-100">Top Anomaly Sources</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Click to filter
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Host IPs exhibiting the highest frequency of anomalous logs.
          </p>

          {/* List of Top Sources */}
          <div className="divide-y divide-slate-800/60">
            {topSources.slice(0, 4).map((sourceItem) => (
              <button
                key={sourceItem.source}
                type="button"
                onClick={() => onSelectSource && onSelectSource(sourceItem.source)}
                className="w-full flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-slate-800/60 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors">
                    {sourceItem.source}
                  </span>
                  {sourceItem.country && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded border border-slate-700/60">
                      {sourceItem.country}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    {sourceItem.count} anomalies
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
