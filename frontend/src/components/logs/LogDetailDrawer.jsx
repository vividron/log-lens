import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SeverityBadge } from '../anomalies/SeverityBadge';
import { formatTimestamp } from '../../utils/formatters';

export function LogDetailDrawer() {
  const { selectedLog, isDrawerOpen, closeDrawer } = useApp();
  if (!isDrawerOpen || !selectedLog) return null;
  return <div className="fixed inset-0 z-50 bg-slate-950/60" onMouseDown={closeDrawer}><aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-slate-700 bg-[#111726] p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}><div className="mb-6 flex items-start justify-between"><div><p className="text-xs uppercase tracking-widest text-slate-500">Log details</p><h2 className="mt-1 text-lg font-semibold text-slate-100">Event inspection</h2></div><button onClick={closeDrawer} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close details"><X className="h-5 w-5" /></button></div><div className="space-y-4"><div><p className="mb-1 text-xs text-slate-500">Severity</p><SeverityBadge severity={selectedLog.severity || selectedLog.level} /></div><Detail label="Timestamp" value={formatTimestamp(selectedLog.timestamp)} /><Detail label="Source" value={selectedLog.source || selectedLog.service} /><Detail label="Status" value={selectedLog.status || selectedLog.statusCode} /><div><p className="mb-1 text-xs text-slate-500">Message</p><pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300">{selectedLog.message || selectedLog.rawMessage || '—'}</pre></div><div><p className="mb-1 text-xs text-slate-500">Raw event</p><pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-400">{JSON.stringify(selectedLog, null, 2)}</pre></div></div></aside></div>;
}
function Detail({ label, value }) { return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm text-slate-200">{value || '—'}</p></div>; }
