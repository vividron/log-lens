import React, { useState } from 'react';
import { Activity, ShieldAlert, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export function ActivityTimeline({ timeline = [], loading = false, onSelectBucket }) {
  const [activeHoverIndex, setActiveHoverIndex] = useState(null);
  const [viewMode, setViewMode] = useState('combined'); // 'combined', 'anomalies_only', 'volume'

  if (!loading && (!timeline || timeline.length === 0)) {
    return (
      <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          Activity Timeline
        </h3>
        <EmptyState
          type="default"
          title="No timeline telemetry available"
          description="Timeline metrics will appear as logs are received and processed by the anomaly engine."
        />
      </div>
    );
  }

  // Calculate maximum values for SVG scaling
  const maxTotal = Math.max(...timeline.map((d) => d.totalLogs || 1), 100);
  const maxAnomalies = Math.max(...timeline.map((d) => d.anomalies || 1), 10);

  const hoveredData = activeHoverIndex !== null ? timeline[activeHoverIndex] : null;

  return (
    <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
      {/* Header with Title and Mode Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">Activity Timeline</h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded">
              Telemetry Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            When did unusual activity and error spikes happen?
          </p>
        </div>

        {/* Legend / Filter */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-600 inline-block" />
            <span className="text-slate-400">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 inline-block" />
            <span className="text-orange-400">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block animate-pulse" />
            <span className="text-rose-400 font-semibold">Critical Spike</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-4 pb-2">
        {/* Tooltip on hover */}
        {hoveredData && (
          <div
            className="absolute z-20 top-0 left-1/2 -translate-x-1/2 bg-[#0B0F17] border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs font-mono pointer-events-none transition-all duration-100 flex items-center gap-4"
          >
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{hoveredData.time || '—'}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-200">
              <span className="text-slate-400">Total:</span>
              <span className="font-bold">{hoveredData.totalLogs?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-bold">{hoveredData.anomalies} anomalies</span>
            </div>
            <div className="flex items-center gap-1 text-rose-400">
              <span className="text-slate-400">Critical:</span>
              <span className="font-bold">{hoveredData.criticalLogs}</span>
            </div>
          </div>
        )}

        {/* Responsive Bar Graphic */}
        <div className="h-44 sm:h-48 flex items-end justify-between gap-1 sm:gap-2 px-1 border-b border-slate-800/80">
          {timeline.map((item, index) => {
            const normalHeight = (item.normalLogs / maxTotal) * 100;
            const highHeight = (item.highLogs / maxTotal) * 100;
            const criticalHeight = (item.criticalLogs / maxTotal) * 100;
            const isSpike = item.criticalLogs > 5;
            const isHovered = activeHoverIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveHoverIndex(index)}
                onMouseLeave={() => setActiveHoverIndex(null)}
                onClick={() => onSelectBucket && onSelectBucket(item)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
              >
                {/* Visual spike beacon */}
                {isSpike && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -top-2 animate-ping" />
                )}

                {/* Stacked bar segments */}
                <div
                  className={`w-full max-w-[28px] rounded-t-sm flex flex-col justify-end overflow-hidden transition-all duration-150 ${
                    isHovered ? 'ring-2 ring-sky-400 ring-offset-1 ring-offset-[#111726]' : 'opacity-90 group-hover:opacity-100'
                  }`}
                  style={{ height: `${Math.max(12, ((item.totalLogs || 1) / maxTotal) * 100)}%` }}
                >
                  {/* Critical Anomaly segment (Top) */}
                  {criticalHeight > 0 && (
                    <div
                      className="w-full bg-rose-500 shrink-0"
                      style={{ height: `${Math.max(4, (item.criticalLogs / item.totalLogs) * 100)}%` }}
                      title={`${item.criticalLogs} critical anomalies`}
                    />
                  )}

                  {/* High Anomaly segment (Middle) */}
                  {highHeight > 0 && (
                    <div
                      className="w-full bg-orange-500 shrink-0"
                      style={{ height: `${Math.max(3, (item.highLogs / item.totalLogs) * 100)}%` }}
                      title={`${item.highLogs} high anomalies`}
                    />
                  )}

                  {/* Normal log volume (Bottom) */}
                  <div
                    className="w-full bg-slate-700/80 group-hover:bg-slate-600 flex-1 transition-colors"
                    title={`${item.normalLogs} normal logs`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Timestamps */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5 px-1">
          {timeline.map((item, index) => (
            <span
              key={index}
              className={`truncate text-center ${
                activeHoverIndex === index ? 'text-sky-300 font-bold' : ''
              }`}
              style={{ width: `${100 / timeline.length}%` }}
            >
              {item.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
