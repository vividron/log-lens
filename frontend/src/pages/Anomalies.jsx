import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SeverityBadge } from '../components/anomalies/SeverityBadge';
import { AnomalyScore } from '../components/logs/AnomalyScore';
import { TableSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { useAnomalies } from '../hooks/useAnomalies';
import { useApp } from '../context/AppContext';
import { useFilter } from '../context/FilterContext';
import { formatTimestamp, getHttpStatusStyle } from '../utils/formatters';
import {
  ShieldAlert,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export function Anomalies() {
  const { onOpenMobileNav } = useOutletContext();
  const { openDrawer } = useApp();
  const { filters } = useFilter();

  const [search, setSearch] = useState(filters.search || '');
  const [severity, setSeverity] = useState(filters.severity || 'ALL');
  const [minScore, setMinScore] = useState(filters.minScore || 0);
  const [source, setSource] = useState(filters.source || '');

  const {
    anomalies,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    setPage,
    refetch,
  } = useAnomalies(
    { search, severity, minScore, source },
    { initialLimit: 20 }
  );

  const clearFilters = () => {
    setSearch('');
    setSeverity('ALL');
    setMinScore(0);
    setSource('');
  };

  const hasFilters = Boolean(search || severity !== 'ALL' || minScore > 0 || source);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Anomalies"
        subtitle="Investigate system deviations, security anomalies, and high-latency events flagged by the engine."
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="p-4 sm:p-8 space-y-4 max-w-7xl w-full mx-auto">
        {/* Anomaly Filter Bar */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anomalies by IP, route, reason, or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-750 text-xs sm:text-sm text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Severity Filter */}
            <div className="w-full sm:w-44">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer font-mono"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">🔴 Critical Only</option>
                <option value="HIGH">🟠 High Only</option>
                <option value="MEDIUM">🟡 Medium Only</option>
                <option value="LOW">🔵 Low Only</option>
              </select>
            </div>

            {/* Minimum Anomaly Score Filter */}
            <div className="w-full sm:w-48 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-750">
              <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                Min Score: <strong className="text-slate-200">{minScore}</strong>
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-750 rounded-lg"
              />
            </div>

            {/* Clear Filters Button */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-slate-200 shrink-0"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Anomaly Feed Container */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
          {error ? (
            <div className="p-6">
              <ErrorState message={error} onRetry={refetch} />
            </div>
          ) : loading ? (
            <div className="p-4">
              <TableSkeleton rows={7} />
            </div>
          ) : anomalies.length === 0 ? (
            <div className="py-12 px-4">
              <EmptyState
                type="search"
                title="No anomalies match the current filters"
                description="No unusual events have been detected matching these parameters. Try lowering the score threshold or clearing search terms."
                actionLabel="Clear all filters"
                onAction={clearFilters}
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {anomalies.map((item) => {
                const statusStyle = getHttpStatusStyle(item.status);
                const primaryReason =
                  item.detectionReasons && item.detectionReasons.length > 0
                    ? item.detectionReasons[0].reason
                    : 'Unusual telemetry behavior exceeding statistical deviation bounds';

                return (
                  <div
                    key={item.id}
                    onClick={() => openDrawer(item)}
                    className="p-4 sm:p-5 hover:bg-slate-800/40 cursor-pointer transition-colors duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none group"
                  >
                    {/* Left: Severity, Score Badge, Timestamp, Source & Endpoint */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <SeverityBadge severity={item.severity} size="md" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-1.5">
                          <span className="text-slate-400">
                            {formatTimestamp(item.timestamp, 'time-ms')}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700/60">
                            {item.source}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-100 font-semibold truncate max-w-sm sm:max-w-md font-mono">
                            {item.event}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] border font-mono ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>

                        {/* Detection Reason Breakdown Pill */}
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-rose-400 font-mono font-semibold shrink-0">
                            Detection Reason:
                          </span>
                          <span className="text-slate-300 truncate font-sans">
                            {primaryReason}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Anomaly Score, AI Badge, Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/50">
                      {/* Anomaly Score */}
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400">Score:</span>
                        <AnomalyScore score={item.anomalyScore} isAnomaly={true} size="md" showBar={true} />
                      </div>

                      {/* AI Ready Indicator */}
                      <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-sky-400 bg-sky-950/20 border border-sky-500/30 px-2.5 py-1 rounded-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Root Cause Ready</span>
                      </div>

                      {/* Inspect action button */}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={ArrowUpRight}
                        iconPosition="right"
                        className="text-xs group-hover:border-sky-500/50"
                      >
                        Inspect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && anomalies.length > 0 && (
            <div className="border-t border-slate-800/80 px-4 py-3 bg-[#0E1420]/60 flex items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Showing page <strong className="text-slate-200">{page}</strong> of{' '}
                <strong className="text-slate-200">{totalPages}</strong> ({total} total anomalies)
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 h-8 w-8"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-2 font-mono text-slate-200">{page}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 h-8 w-8"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
