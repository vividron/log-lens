import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Failed to load telemetry data',
  message = 'An unexpected network error occurred while communicating with the anomaly engine.',
  error,
  onRetry,
  className = '',
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`p-6 sm:p-8 rounded-xl border border-rose-500/20 bg-rose-950/10 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3.5">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-4 leading-relaxed">
        {message}
      </p>

      {error && (
        <div className="w-full max-w-md mb-4 text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-300 mx-auto font-mono py-1"
          >
            <span>Technical diagnostics</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showDetails && (
            <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-rose-900/40 text-xs font-mono text-rose-300 overflow-x-auto break-all">
              {typeof error === 'string' ? error : error.message || JSON.stringify(error)}
            </div>
          )}
        </div>
      )}

      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry Request
        </Button>
      )}
    </div>
  );
}
