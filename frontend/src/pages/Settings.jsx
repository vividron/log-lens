import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { API_BASE_URL } from '../services/api';
import { logService } from '../services/logService';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Server,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Cpu,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export function Settings() {
  const { onOpenMobileNav } = useOutletContext();
  const { addToast, triggerGlobalRefresh } = useApp();

  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [anomalyThreshold, setAnomalyThreshold] = useState(35);
  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [contaminationRate, setContaminationRate] = useState(0.05);
  const [aiModel, setAiModel] = useState('AI Root Cause Model v3.2');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Engine configuration and anomaly thresholds updated successfully.',
        duration: 3000,
      });
    }, 400);
  };

  const handleResetData = () => {
    logService.resetLogs();
    triggerGlobalRefresh();
    addToast({
      type: 'info',
      title: 'Database Reset',
      message: 'Telemetry database restored to baseline demonstration state.',
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Settings"
        subtitle="Manage anomaly detection thresholds, backend endpoints, and AI explanation parameters."
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
        {/* Section 1: Anomaly Detection Engine Settings */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Anomaly Detection Engine Tuning
              </h2>
              <p className="text-xs text-slate-400">
                Mathematical scoring thresholds for EWMA & Isolation Forest models
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Anomaly Score Threshold */}
            <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">Flagging Threshold</span>
                <span className="text-amber-400 font-bold">{anomalyThreshold} / 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Minimum calculated score required to flag a log as anomalous.
              </p>
              <input
                type="range"
                min="10"
                max="70"
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-750 rounded-lg"
              />
            </div>

            {/* Critical Anomaly Threshold */}
            <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">Critical Severity Threshold</span>
                <span className="text-rose-400 font-bold">{criticalThreshold} / 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Score at which an event is escalated to Critical status.
              </p>
              <input
                type="range"
                min="60"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-750 rounded-lg"
              />
            </div>

            {/* Contamination Rate */}
            <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 sm:col-span-2">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">Isolation Forest Contamination Baseline</span>
                <span className="text-sky-400 font-bold">{(contaminationRate * 100).toFixed(1)}%</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Expected proportion of outliers in the background telemetry stream.
              </p>
              <input
                type="range"
                min="0.01"
                max="0.15"
                step="0.01"
                value={contaminationRate}
                onChange={(e) => setContaminationRate(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-750 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Backend API & Service Settings */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Server className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Telemetry Backend API
              </h2>
              <p className="text-xs text-slate-400">
                Configure endpoint connectivity for real-time log streaming
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                API Base URL (VITE_API_URL)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:5000/api"
                className="w-full bg-slate-900 border border-slate-750 text-xs text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Automatic client-side simulation & fallback active when server is offline.</span>
            </div>
          </div>
        </div>

        {/* Section 3: AI Root Cause Assistant Settings */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                AI Explanation Engine
              </h2>
              <p className="text-xs text-slate-400">
                Configure generative explanation parameters for detected anomalies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                AI Explanation Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer font-mono"
              >
                <option value="AI Root Cause Model v3.2">AI Root Cause Model v3.2 (Default)</option>
                <option value="Claude 3.5 Sonnet Integration">Claude 3.5 Sonnet Telemetry</option>
                <option value="GPT-4o Observability">GPT-4o Observability Plugin</option>
              </select>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span>AI models only synthesize explanations and remediation proposals after the detection engine flags a log.</span>
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={handleResetData}
            className="text-slate-400 hover:text-slate-200"
          >
            Reset Seed Data
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Save}
            loading={isSaving}
            onClick={handleSaveSettings}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
