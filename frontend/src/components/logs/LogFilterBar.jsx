import React, { useState } from 'react';
import { Search, X, Filter, SlidersHorizontal, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export function LogFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  totalCount,
  visibleCount,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.severity !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.anomalyFilter !== 'ALL' ||
    filters.source
  );

  return (
    <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-3 shadow-sm">
      {/* Top row: Search input & quick anomaly tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by IP, endpoint (/api/payment), event, message, or service..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-900/90 border border-slate-750 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 font-mono transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Anomaly Mode Toggle Buttons */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onFilterChange('anomalyFilter', 'ALL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filters.anomalyFilter === 'ALL'
                ? 'bg-slate-750 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('anomalyFilter', 'ANOMALIES_ONLY')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filters.anomalyFilter === 'ANOMALIES_ONLY'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Anomalies Only</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('anomalyFilter', 'NORMAL_ONLY')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filters.anomalyFilter === 'NORMAL_ONLY'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Normal Only</span>
          </button>
        </div>

        {/* Filter expander toggle for mobile/advanced */}
        <Button
          variant="outline"
          size="sm"
          icon={SlidersHorizontal}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="shrink-0 text-xs sm:hidden"
        >
          Filters
        </Button>
      </div>

      {/* Second row: Dropdowns for Severity, HTTP Status, and Source IP */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 ${showAdvanced ? 'block' : 'hidden sm:grid'}`}>
        {/* Severity Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
            Severity
          </label>
          <select
            value={filters.severity || 'ALL'}
            onChange={(e) => onFilterChange('severity', e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium / Warn</option>
            <option value="LOW">🔵 Low / Info</option>
            <option value="NORMAL">⚪ Normal</option>
          </select>
        </div>

        {/* HTTP Status Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
            HTTP Status
          </label>
          <select
            value={filters.status || 'ALL'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Status Codes</option>
            <option value="5xx">5xx (Server Errors)</option>
            <option value="4xx">4xx (Client Errors)</option>
            <option value="3xx">3xx (Redirects)</option>
            <option value="2xx">2xx (Success)</option>
            <option value="500">500 Internal Error</option>
            <option value="504">504 Gateway Timeout</option>
            <option value="429">429 Rate Limit</option>
            <option value="401">401 Unauthorized</option>
          </select>
        </div>

        {/* Source / IP Filter Input */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
            Source / Host IP
          </label>
          <input
            type="text"
            placeholder="e.g. 10.0.0.55"
            value={filters.source || ''}
            onChange={(e) => onFilterChange('source', e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono placeholder-slate-600"
          />
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex flex-col justify-end">
          <div className="flex items-center justify-between gap-2 h-[34px]">
            <span className="text-xs text-slate-400 truncate">
              Showing <strong className="text-slate-200">{visibleCount}</strong> of <strong className="text-slate-200">{totalCount}</strong>
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <X className="w-3 h-3" />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
