import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScrollText,
  ShieldAlert,
  Settings,
  Activity,
  Upload,
  Cpu,
  Layers,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Sidebar({ isMobileOpen = false, onCloseMobile }) {
  const { openUploadModal } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Logs', path: '/logs', icon: ScrollText },
    {
      name: 'Anomalies',
      path: '/anomalies',
      icon: ShieldAlert,
      badge: '126',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
  ];

  const secondaryItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#0A0E17] border-r border-slate-800/80 text-slate-300 select-none">
      {/* Brand & Top Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-950 font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 font-sans">
                LogLens
                <span className="text-[9px] font-mono uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1 py-0.2 rounded">
                  v2.4
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                Observability & Anomaly AI
              </p>
            </div>
          </div>

          {/* Close mobile button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Upload Action */}
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            openUploadModal();
          }}
          className="w-full mb-6 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-sky-950 transition-all border border-sky-400/30"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Log File</span>
        </button>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            Monitoring
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-slate-800/80" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            System
          </span>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer: Engine Status Pill */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080B12]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-mono font-medium text-slate-200 truncate">
                Detection Engine
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                Status: Operational
              </p>
            </div>
          </div>
          <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed compact) */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
