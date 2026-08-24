import React from 'react';
import { AnomalyList } from '../anomalies/AnomalyList';
import { TableSkeleton } from '../common/Skeleton';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RecentAnomalies({
  anomalies = [],
  loading = false,
  onSelectAnomaly,
}) {
  return (
    <div className="bg-[#111726] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-[#0E1420]/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Recent Flagged Anomalies</h3>
            <p className="text-xs text-slate-400">
              High-priority events requiring developer investigation
            </p>
          </div>
        </div>

        <Link
          to="/anomalies"
          className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
        >
          <span>View all anomalies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List Body */}
      {loading ? (
        <div className="p-4">
          <TableSkeleton rows={4} />
        </div>
      ) : (
        <AnomalyList
          anomalies={anomalies}
          loading={loading}
          onSelectAnomaly={onSelectAnomaly}
          limit={5}
        />
      )}
    </div>
  );
}
