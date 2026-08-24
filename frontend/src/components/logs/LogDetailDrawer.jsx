import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SeverityBadge } from '../anomalies/SeverityBadge';
import { AnomalyScore } from './AnomalyScore';
import { AIAnalysis } from '../ai/AIAnalysis';
import { formatTimestamp, getHttpStatusStyle, copyToClipboard } from '../../utils/formatters';
import {
  X,
  Copy,
  Check,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Globe,
  Terminal,
  Activity,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '../common/Button';

export function LogDetailDrawer() {
  const { selectedLog, isDrawerOpen, closeDrawer, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [rawView, setRawView] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen && !selectedLog) return null;

  const log = selectedLog || {};
  const statusStyle = getHttpStatusStyle(log.status);

  const handleCopyLog = async () => {
    const content = log.rawLog || log.message || JSON.stringify(log, null, 2);
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Copied to Clipboard',
        message: 'Log record copied to clipboard.',
        duration: 2500,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 ease-out ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Container (Slide-in from right on desktop, full screen on mobile) */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full w-full sm:max-w-2xl bg-[#0D131F] border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-200 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0B101A] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <SeverityBadge severity={log.severity} size="md" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-100 font-mono truncate">
                {log.event || 'Log Inspection'}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                ID: {log.id || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* SECTION 1: Event Information Grid */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Event Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Timestamp */}
              <div className="bg-[#121927] border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Timestamp
                </span>
                <span className="text-xs font-mono text-slate-200 break-all" title={log.timestamp}>
                  {formatTimestamp(log.timestamp, 'full')}
                </span>
              </div>

              {/* Source / IP */}
              <div className="bg-[#121927] border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Source / Host IP
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {log.source || '127.0.0.1'}
                </span>
              </div>

              {/* Status Code */}
              <div className="bg-[#121927] border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  HTTP Status
                </span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                >
                  {statusStyle.label}
                </span>
              </div>

              {/* Service */}
              <div className="bg-[#121927] border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Service / Pod
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {log.service || 'api-gateway'}
                </span>
              </div>

              {/* Response Time */}
              <div className="bg-[#121927] border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Response Latency
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {log.responseTime || '18ms'}
                </span>
              </div>

              {/* Anomaly Engine Assessment */}
              <div className="bg-[#121927] border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Engine Assessment
                </span>
                <span className="text-xs font-mono">
                  {log.isAnomaly ? (
                    <span className="text-rose-400 font-semibold">Anomalous ({log.anomalyScore}/100)</span>
                  ) : (
                    <span className="text-emerald-400">Baseline Normal</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Original Log Monospace Block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                Original Log Payload
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRawView(!rawView)}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 transition-colors"
                >
                  {rawView ? 'Structured View' : 'Raw Payload'}
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={handleCopyLog}
                  className="h-7 text-xs px-2"
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="bg-[#080B12] border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap break-all">
                {rawView
                  ? log.rawLog || log.message
                  : typeof log.rawLog === 'string' && log.rawLog.startsWith('{')
                  ? (() => {
                      try { return JSON.stringify(JSON.parse(log.rawLog), null, 2); }
                      catch { return log.rawLog; }
                    })()
                  : log.rawLog || log.message}
              </pre>
            </div>
          </div>

          {/* SECTION 3: Detection Engine Analysis */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Detection Engine Analysis
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded">
                Engine: {log.detectionEngineVersion || 'v2.4.1 (EWMA + Isolation Forest)'}
              </span>
            </div>

            {!log.isAnomaly ? (
              /* Normal Log Banner */
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-emerald-300">
                    ✓ No anomaly detected
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    This log conforms to baseline telemetry thresholds for this service. No unusual frequency, status code, or execution pattern was flagged.
                  </p>
                </div>
              </div>
            ) : (
              /* Anomaly Flagged Banner & Reasons Breakdown */
              <div className="bg-[#141A28] border border-rose-500/30 rounded-xl p-4 sm:p-5 space-y-4">
                {/* Engine Anomaly Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                        Anomaly Detected by Engine
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Deterministic scoring evaluation produced an anomaly flag.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">Anomaly Score:</span>
                    <span className="text-sm font-mono font-bold text-rose-400">
                      {log.anomalyScore || 75}
                    </span>
                    <span className="text-xs font-mono text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Quantitative Detection Reasons */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2 font-medium">
                    Engine Detection Reasons (Breakdown):
                  </span>
                  <div className="space-y-2">
                    {log.detectionReasons && log.detectionReasons.length > 0 ? (
                      log.detectionReasons.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono"
                        >
                          <span className="text-slate-200">{item.reason}</span>
                          <span className="text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[11px] shrink-0">
                            +{item.score}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Anomaly score computed based on statistical divergence from historical baseline.
                      </div>
                    )}
                  </div>
                </div>

                {/* Explicit Disclaimer Notice */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span>
                    <strong>Note:</strong> The Detection Engine calculated the score and identified this anomaly. AI does not decide whether a log is anomalous.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: AI Analysis for Flagged Anomalies */}
          {log.isAnomaly && <AIAnalysis log={log} />}
        </div>
      </div>
    </div>
  );
}
