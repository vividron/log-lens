import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { TableSkeleton } from '../common/Skeleton';
import { SeverityBadge } from '../anomalies/SeverityBadge';
import { formatTimestamp } from '../../utils/formatters';

export function LogTable({ logs, loading, error, page, totalPages, total, limit, onPageChange, onLimitChange, selectedLogId, onSelectLog, onRetry, onClearFilters }) {
  if (loading) return <div className="rounded-xl border border-slate-800 bg-[#111726]"><TableSkeleton /></div>;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!logs.length) return <EmptyState type="search" actionLabel="Clear filters" onAction={onClearFilters} />;
  return <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#111726]">
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-800 bg-slate-950/30 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Timestamp</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-800/70">{logs.map((log, index) => <tr key={log.id || log._id || index} onClick={() => onSelectLog(log)} className={`cursor-pointer hover:bg-slate-800/40 ${selectedLogId === (log.id || log._id) ? 'bg-sky-950/20' : ''}`}><td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">{formatTimestamp(log.timestamp)}</td><td className="px-4 py-3"><SeverityBadge severity={log.severity || log.level} size="sm" /></td><td className="px-4 py-3 text-slate-300">{log.source || log.service || '—'}</td><td className="max-w-md truncate px-4 py-3 text-slate-300">{log.message || log.rawMessage || '—'}</td><td className="px-4 py-3 font-mono text-xs text-slate-400">{log.status || log.statusCode || '—'}</td></tr>)}</tbody></table></div>
    <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3"><span className="text-xs text-slate-500">{total} total</span><div className="flex items-center gap-2"><select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs"><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select><Button size="sm" variant="ghost" icon={ChevronLeft} aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} /><span className="text-xs text-slate-400">{page} / {totalPages}</span><Button size="sm" variant="ghost" icon={ChevronRight} aria-label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} /></div></div>
  </section>;
}
