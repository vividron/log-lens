import React from 'react';
import { LogRow } from './LogRow';
import { TableSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../common/Button';

export function LogTable({
  logs = [],
  loading = false,
  error = null,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 25,
  onPageChange,
  onLimitChange,
  selectedLogId = null,
  onSelectLog,
  onRetry,
  onClearFilters,
}) {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} className="my-4" />;
  }

  return (
    <div className="bg-[#111726] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Scrollable Container */}
      <div className="overflow-x-auto min-h-[380px]">
        {loading ? (
          <TableSkeleton rows={8} />
        ) : logs.length === 0 ? (
          <div className="py-12 px-4">
            <EmptyState
              type="search"
              title="No logs match your filter criteria"
              description="Try adjusting your search terms, severity levels, or anomaly filters to expand results."
              actionLabel="Clear all filters"
              onAction={onClearFilters}
            />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            {/* Sticky Header */}
            <thead>
              <tr className="border-b border-slate-800 bg-[#0E1420]/90 sticky top-0 z-10 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="px-3.5 py-3 w-28">Severity</th>
                <th className="px-3.5 py-3 w-32">Timestamp</th>
                <th className="px-3.5 py-3 w-32">Source</th>
                <th className="px-3.5 py-3 w-56">Event</th>
                <th className="px-3.5 py-3 w-20">Status</th>
                <th className="px-3.5 py-3 min-w-[280px]">Message</th>
                <th className="px-3.5 py-3 w-24 text-right pr-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {logs.map((log) => (
                <LogRow
                  key={log.id}
                  log={log}
                  isSelected={selectedLogId === log.id}
                  onSelect={onSelectLog}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && logs.length > 0 && (
        <div className="border-t border-slate-800/80 px-4 py-3 bg-[#0E1420]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Page <strong className="text-slate-200">{page}</strong> of{' '}
              <strong className="text-slate-200">{totalPages}</strong> ({total.toLocaleString()} total)
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-slate-500 text-[11px]">Rows:</span>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(1)}
              aria-label="First page"
              className="p-1.5 h-8 w-8"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
              className="p-1.5 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Page indicator pills */}
            <span className="px-2.5 py-1 text-slate-200 font-mono font-medium">
              {page}
            </span>

            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
              className="p-1.5 h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(totalPages)}
              aria-label="Last page"
              className="p-1.5 h-8 w-8"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
