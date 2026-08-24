import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LogFilterBar } from '../components/logs/LogFilterBar';
import { LogTable } from '../components/logs/LogTable';
import { useLogs } from '../hooks/useLogs';
import { useFilter } from '../context/FilterContext';
import { useApp } from '../context/AppContext';

export function Logs() {
  const { onOpenMobileNav } = useOutletContext();
  const { filters, updateFilter, clearFilters } = useFilter();
  const { selectedLog, openDrawer } = useApp();

  const {
    logs,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    setPage,
    setLimit,
    refetch,
  } = useLogs(filters, { initialLimit: 25 });

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Logs"
        subtitle="Search, filter, and inspect incoming server telemetry with deterministic anomaly detection."
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="p-4 sm:p-8 space-y-4 max-w-7xl w-full mx-auto">
        {/* Filters */}
        <LogFilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          totalCount={total}
          visibleCount={logs.length}
        />

        {/* Log Table */}
        <LogTable
          logs={logs}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          selectedLogId={selectedLog?.id}
          onSelectLog={(log) => openDrawer(log)}
          onRetry={refetch}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
