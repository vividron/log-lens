import React from 'react';
import { StatCardSkeleton } from '../common/Skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend, // { value: '+12%', isPositive: false }
  variant = 'normal', // 'normal', 'critical', 'warning', 'info', 'success'
  loading = false,
  onClick,
}) {
  if (loading) {
    return <StatCardSkeleton />;
  }

  const variantStyles = {
    normal: {
      border: 'border-slate-800/80 hover:border-slate-700',
      iconBg: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
      valueColor: 'text-slate-100',
    },
    critical: {
      border: 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      valueColor: 'text-rose-400',
    },
    warning: {
      border: 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      valueColor: 'text-amber-400',
    },
    info: {
      border: 'border-sky-500/30 hover:border-sky-500/50 bg-sky-950/10',
      iconBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      valueColor: 'text-sky-400',
    },
    success: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-950/10',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      valueColor: 'text-emerald-400',
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.normal;

  return (
    <div
      onClick={onClick}
      className={`bg-[#111726] border rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 ease-out shadow-xs ${
        currentStyle.border
      } ${onClick ? 'cursor-pointer hover:bg-[#151D2F]' : ''}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${currentStyle.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${currentStyle.valueColor}`}>
          {value !== undefined && value !== null ? value : '—'}
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium font-mono ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-2 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
