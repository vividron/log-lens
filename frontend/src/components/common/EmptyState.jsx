import React from 'react';
import { Button } from './Button';
import { SearchX, Inbox, CheckCircle2, ShieldCheck } from 'lucide-react';

export function EmptyState({
  icon: CustomIcon,
  type = 'default', // 'default', 'search', 'success', 'shield'
  title = 'No records found',
  description = 'There are no log records matching your current filter criteria.',
  actionLabel,
  onAction,
  className = '',
}) {
  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-10 h-10 text-slate-400" />;
    switch (type) {
      case 'search':
        return <SearchX className="w-10 h-10 text-slate-400" />;
      case 'success':
        return <CheckCircle2 className="w-10 h-10 text-emerald-400" />;
      case 'shield':
        return <ShieldCheck className="w-10 h-10 text-sky-400" />;
      case 'default':
      default:
        return <Inbox className="w-10 h-10 text-slate-400" />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-slate-800/80 bg-slate-900/20 ${className}`}>
      <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/40 mb-4 shadow-inner">
        {getIcon()}
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
