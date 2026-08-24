import React from 'react';
import { SeverityBadge } from './SeverityBadge';
import { AnomalyScore } from '../logs/AnomalyScore';
import { formatTimestamp, getHttpStatusStyle } from '../../utils/formatters';
import { ShieldAlert, ArrowUpRight, Sparkles } from 'lucide-react';

export function AnomalyList({
  anomalies = [],
  loading = false,
  onSelectAnomaly,
  limit,
}) {
  const displayed = limit ? anomalies.slice(0, limit) : anomalies;

  if (!loading && displayed.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No active anomalies found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/60">
      {displayed.map((item) => {
        const primaryReason =
          item.detectionReasons && item.detectionReasons.length > 0
            ? item.detectionReasons[0].reason
            : 'Statistical anomaly threshold exceeded';

        const statusStyle = getHttpStatusStyle(item.status);

        return (
          <div
            key={item.id}
            onClick={() => onSelectAnomaly(item)}
            className="group p-3.5 sm:p-4 hover:bg-slate-800/40 cursor-pointer transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
          >
            {/* Left side: Severity, Timestamp, Source, Event */}
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="shrink-0 mt-0.5 sm:mt-0">
                <SeverityBadge severity={item.severity} size="sm" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">
                    {formatTimestamp(item.timestamp, 'time-ms')}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-300 border border-slate-700/60">
                    {item.source}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-xs">
                    {item.event}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[11px] border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* Primary Reason */}
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 truncate max-w-xl">
                  <span className="text-rose-400 shrink-0 font-mono">Reason:</span>
                  <span className="text-slate-300 truncate font-sans">{primaryReason}</span>
                </p>
              </div>
            </div>

            {/* Right side: Anomaly Score & Detail Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Score:</span>
                <AnomalyScore score={item.anomalyScore} isAnomaly={true} size="md" />
              </div>

              <div className="flex items-center gap-1 text-slate-400 group-hover:text-sky-300 transition-colors text-xs font-medium">
                <span className="hidden sm:inline">Inspect</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
