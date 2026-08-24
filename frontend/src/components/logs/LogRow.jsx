import React from 'react';
import { SeverityBadge } from '../anomalies/SeverityBadge';
import { AnomalyScore } from './AnomalyScore';
import { formatTimestamp, getHttpStatusStyle } from '../../utils/formatters';
import { Sparkles, Terminal } from 'lucide-react';

export function LogRow({ log, isSelected = false, onSelect }) {
  const statusStyle = getHttpStatusStyle(log.status);

  // Row background styles based on severity & anomaly flag
  const getRowStyle = () => {
    if (isSelected) {
      return 'bg-sky-500/10 border-l-2 border-l-sky-400';
    }

    if (!log.isAnomaly) {
      return 'hover:bg-slate-800/40 border-l-2 border-l-transparent text-slate-300';
    }

    const sev = (log.severity || '').toUpperCase();
    if (sev === 'CRITICAL') {
      return 'bg-rose-950/20 hover:bg-rose-950/35 border-l-2 border-l-rose-500';
    }
    if (sev === 'HIGH') {
      return 'bg-orange-950/20 hover:bg-orange-950/35 border-l-2 border-l-orange-500';
    }
    if (sev === 'MEDIUM' || sev === 'WARNING') {
      return 'bg-amber-950/15 hover:bg-amber-950/30 border-l-2 border-l-amber-400';
    }
    return 'bg-sky-950/10 hover:bg-sky-950/25 border-l-2 border-l-sky-400';
  };

  return (
    <tr
      onClick={() => onSelect(log)}
      className={`group cursor-pointer transition-colors duration-150 border-b border-slate-800/60 text-xs font-mono select-none ${getRowStyle()}`}
    >
      {/* Severity Badge */}
      <td className="px-3.5 py-2.5 whitespace-nowrap">
        <SeverityBadge severity={log.severity} size="sm" />
      </td>

      {/* Timestamp */}
      <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-400 group-hover:text-slate-300">
        <span title={log.timestamp}>{formatTimestamp(log.timestamp, 'time-ms')}</span>
      </td>

      {/* Source IP / Host */}
      <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-300 font-mono">
        <span className="bg-slate-800/50 px-1.5 py-0.5 rounded text-[11px] text-slate-300 border border-slate-750/30">
          {log.source || '—'}
        </span>
      </td>

      {/* Event / HTTP Method + Path */}
      <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-200">
        <span className="truncate max-w-[220px] inline-block font-mono" title={log.event}>
          {log.event}
        </span>
      </td>

      {/* Status Code */}
      <td className="px-3.5 py-2.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
      </td>

      {/* Message */}
      <td className="px-3.5 py-2.5 max-w-md font-sans">
        <div className="flex items-center gap-2">
          {log.isAnomaly && (
            <span
              className="text-amber-400 shrink-0"
              title="Flagged by Detection Engine"
            >
              <Terminal className="w-3.5 h-3.5" />
            </span>
          )}
          <span
            className={`truncate max-w-[320px] sm:max-w-md ${
              log.isAnomaly ? 'text-slate-200 font-medium' : 'text-slate-400'
            }`}
            title={log.message}
          >
            {log.message}
          </span>
        </div>
      </td>

      {/* Anomaly Score */}
      <td className="px-3.5 py-2.5 whitespace-nowrap text-right pr-4">
        <AnomalyScore score={log.anomalyScore} isAnomaly={log.isAnomaly} size="sm" />
      </td>
    </tr>
  );
}
