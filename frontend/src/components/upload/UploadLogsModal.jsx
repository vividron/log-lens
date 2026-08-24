import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { logService } from '../../services/logService';
import { formatBytes } from '../../utils/formatters';
import { parseLogFile } from '../../utils/parser';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export function UploadLogsModal() {
  const { isUploadModalOpen, closeUploadModal, addToast, triggerGlobalRefresh } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewStats, setPreviewStats] = useState(null);
  const [parsingPreview, setParsingPreview] = useState(false);
  const [uploadStage, setUploadStage] = useState('idle'); // 'idle', 'uploading', 'validating', 'processing', 'detecting', 'saving', 'complete', 'error'
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isUploadModalOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setUploadResult(null);
    setUploadStage('idle');
    setParsingPreview(true);

    try {
      // Quick client-side preview parsing
      const parsed = await parseLogFile(file);
      setPreviewStats({
        recordCount: parsed.stats.total,
        validCount: parsed.stats.valid,
        missingTimestamps: parsed.stats.missingTimestamps,
        invalidCount: parsed.stats.invalid,
      });
    } catch (err) {
      setErrorMessage(`Unable to parse log format: ${err.message}`);
    } finally {
      setParsingPreview(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setUploadStage('uploading');
    setProgressPercent(10);
    setErrorMessage(null);

    try {
      const result = await logService.uploadLogs(selectedFile, (stage, percent) => {
        setUploadStage(stage);
        setProgressPercent(percent);
      });

      setUploadResult(result);
      setUploadStage('complete');
      triggerGlobalRefresh();
      addToast({
        type: 'success',
        title: 'Logs Ingested & Evaluated',
        message: `Successfully analyzed ${result.importedRecords || 'all'} records with the anomaly engine.`,
        duration: 3500,
      });
    } catch (err) {
      setUploadStage('error');
      setErrorMessage(err.message || 'Log analysis pipeline failed during execution');
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setPreviewStats(null);
    setUploadStage('idle');
    setProgressPercent(0);
    setUploadResult(null);
    setErrorMessage(null);
  };

  const handleViewAnomalies = () => {
    closeUploadModal();
    resetModal();
    navigate('/anomalies');
  };

  const handleViewLogs = () => {
    closeUploadModal();
    resetModal();
    navigate('/logs');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={uploadStage !== 'uploading' && uploadStage !== 'detecting' ? closeUploadModal : undefined}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Modal Card */}
      <div className="relative bg-[#0E1422] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Ingest & Analyze Logs
            </h2>
            <p className="text-xs text-slate-400">
              Import server logs for anomaly detection and deterministic anomaly detection; AI explanations are generated when you inspect an anomaly
            </p>
          </div>
          <button
            onClick={closeUploadModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {uploadStage === 'idle' && (
          <div className="space-y-4">
            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-3 ${
                dragOver
                  ? 'border-sky-500 bg-sky-950/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop your log file here, or <span className="text-sky-400 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Supports .log, .json, .csv, .txt (JSON Lines & Apache/Nginx formats)
                </p>
              </div>
            </div>

            {/* Selected File & Preview Info */}
            {selectedFile && (
              <div className="bg-[#121927] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 font-mono truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={resetModal}
                    className="text-xs text-slate-500 hover:text-slate-300 font-medium"
                  >
                    Change file
                  </button>
                </div>

                {/* Parsing status / Record count preview */}
                {parsingPreview ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    <span>Inspecting log structure and timestamp formats...</span>
                  </div>
                ) : previewStats ? (
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Total Records</span>
                      <span className="text-slate-200 font-bold">{previewStats.recordCount.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Valid Structure</span>
                      <span className="text-emerald-400 font-bold">{previewStats.validCount.toLocaleString()}</span>
                    </div>
                    {previewStats.missingTimestamps > 0 && (
                      <div className="col-span-2 text-[11px] text-amber-400/90 flex items-center gap-1.5 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{previewStats.missingTimestamps} entries missing timestamps (auto-filled with stream time)</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={closeUploadModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedFile || parsingPreview}
                onClick={handleStartAnalysis}
                icon={Upload}
              >
                Analyze Logs
              </Button>
            </div>
          </div>
        )}

        {/* Multi-Stage Ingestion Progress */}
        {(uploadStage === 'uploading' ||
          uploadStage === 'validating' ||
          uploadStage === 'processing' ||
          uploadStage === 'detecting' ||
          uploadStage === 'saving') && (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 animate-spin">
                <Loader2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                {uploadStage === 'uploading' && 'Uploading log payload...'}
                {uploadStage === 'validating' && 'Validating telemetry schema & timestamps...'}
                {uploadStage === 'processing' && 'Extracting IP entities, routes, and error codes...'}
                {uploadStage === 'detecting' && 'Running Anomaly Detection Engine (EWMA & Isolation Forest)...'}
                {uploadStage === 'saving' && 'Saving results to telemetry database...'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {selectedFile?.name} ({formatBytes(selectedFile?.size)})
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span className="capitalize">{uploadStage}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stage Checklist */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono">
              {[
                { stage: 'uploading', label: '1. Ingest Log File' },
                { stage: 'validating', label: '2. Schema Validation' },
                { stage: 'processing', label: '3. Record Extraction' },
                { stage: 'detecting', label: '4. Anomaly Engine Scoring' },
                { stage: 'saving', label: '5. Database Persistence' },
              ].map((step, idx) => {
                const stages = ['uploading', 'validating', 'processing', 'detecting', 'saving'];
                const currentIdx = stages.indexOf(uploadStage);
                const isPassed = currentIdx > idx;
                const isCurrent = currentIdx === idx;

                return (
                  <div key={step.stage} className="flex items-center justify-between">
                    <span className={isCurrent ? 'text-sky-300 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-600'}>
                      {step.label}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-800" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Complete State */}
        {uploadStage === 'complete' && uploadResult && (
          <div className="py-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Analysis Pipeline Complete
              </h3>
              <p className="text-xs text-slate-400">
                The detection engine has completed scoring all ingested telemetry records.
              </p>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#121927] border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase">Records Processed</span>
                <span className="text-lg font-bold text-slate-100">
                  {uploadResult.importedRecords?.toLocaleString() || '—'}
                </span>
              </div>

              <div className="bg-[#121927] border border-rose-500/30 p-3 rounded-xl">
                <span className="text-rose-400 block text-[10px] uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Anomalies Detected
                </span>
                <span className="text-lg font-bold text-rose-400">
                  {uploadResult.anomaliesDetected || 0}
                </span>
              </div>
            </div>

            {/* Action Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleViewAnomalies}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:flex-1"
              >
                Investigate Anomalies
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleViewLogs}
                className="w-full sm:flex-1"
              >
                Explore All Logs
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {uploadStage === 'error' && (
          <div className="py-4 space-y-4 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">
              Log Ingestion Failed
            </h3>
            <p className="text-xs text-rose-300 max-w-sm mx-auto">
              {errorMessage}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={resetModal}>
                Try another file
              </Button>
              <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleStartAnalysis}>
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
