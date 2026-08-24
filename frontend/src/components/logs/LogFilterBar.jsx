import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../common/Button';

export function LogFilterBar({ filters, onFilterChange, onClearFilters, totalCount, visibleCount }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-[#111726] p-4 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input value={filters.search || ''} onChange={(e) => onFilterChange('search', e.target.value)} placeholder="Search logs..." className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-sky-500" />
        </label>
        <select value={filters.severity || 'ALL'} onChange={(e) => onFilterChange('severity', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
          <option value="ALL">All severities</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option><option value="NORMAL">Normal</option>
        </select>
        <select value={filters.anomalyFilter || 'ALL'} onChange={(e) => onFilterChange('anomalyFilter', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
          <option value="ALL">All logs</option><option value="ANOMALIES_ONLY">Anomalies only</option><option value="NORMAL_ONLY">Normal only</option>
        </select>
        <Button variant="ghost" size="sm" icon={X} onClick={onClearFilters}>Clear</Button>
      </div>
      <p className="text-xs text-slate-500">Showing {visibleCount} of {totalCount} logs</p>
    </section>
  );
}
