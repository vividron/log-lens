import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { Sparkles, RefreshCw, AlertCircle, CheckCircle, Bot, HelpCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';

export function AIAnalysis({ log }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = async (regenerate = false) => {
    if (!log || !log.isAnomaly) return;
    setLoading(true);
    setError(null);
    try {
      const data = regenerate
        ? await aiService.retryAIAnalysis(log)
        : await aiService.getAIAnalysis(log);
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'AI root-cause model unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [log?.id]);

  if (!log?.isAnomaly) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-[#131B2E] to-[#0E1524] border border-sky-500/30 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">AI Analysis</h3>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                Root Cause & Remediation
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generative insight explaining the already-flagged anomaly
            </p>
          </div>
        </div>

        {!loading && (
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={fetchAnalysis}
            className="text-xs text-slate-400 hover:text-slate-200 h-7 px-2"
            title="Re-analyze anomaly with AI"
          >
            Re-analyze
          </Button>
        )}
      </div>

      {/* Loading State: Skeleton */}
      {loading && (
        <div className="space-y-3.5 animate-pulse">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
            <Bot className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing anomaly context and correlating error signatures...</span>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-11/12" />
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">AI analysis unavailable:</span>{' '}
              <span>{error}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchAnalysis}
            className="text-rose-200 border-rose-500/40 hover:bg-rose-900/30 text-xs shrink-0"
          >
            Retry AI
          </Button>
        </div>
      )}

      {/* Success Content */}
      {!loading && !error && analysis && (
        <div className="space-y-4 text-xs">
          {/* Section 1: What happened? */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              What happened?
            </h4>
            <p className="text-slate-300 leading-relaxed pl-3 border-l border-sky-500/20">
              {analysis.whatHappened}
            </p>
          </div>

          {/* Section 2: Likely cause */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Likely cause
            </h4>
            <p className="text-slate-300 leading-relaxed pl-3 border-l border-amber-500/20">
              {analysis.likelyCause}
            </p>
          </div>

          {/* Section 3: Recommended next step */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Recommended next step
            </h4>
            <div className="text-slate-200 leading-relaxed pl-3 border-l border-emerald-500/20 bg-emerald-950/10 p-2.5 rounded-r-lg">
              {analysis.recommendedNextStep}
            </div>
          </div>

          {/* Meta footer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Model: {analysis.model || 'AI Root Cause Engine'}</span>
            <span>Confidence: {analysis.confidence || '95%'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
