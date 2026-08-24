import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Upload, RefreshCw, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

export function Header({
  title = 'Overview',
  subtitle = 'Monitor application activity and investigate unusual behavior.',
  onOpenMobileNav,
  actions,
}) {
  const { openUploadModal, triggerGlobalRefresh } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 sm:py-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Titles */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-750"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          {actions}

          {/* Refresh Secondary Button */}
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={triggerGlobalRefresh}
            title="Refresh logs and metrics"
          >
            Refresh
          </Button>

          {/* Upload Logs Primary Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Upload}
            onClick={openUploadModal}
          >
            Upload Logs
          </Button>
        </div>
      </div>
    </header>
  );
}
