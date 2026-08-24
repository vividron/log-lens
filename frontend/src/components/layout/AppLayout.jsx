import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LogDetailDrawer } from '../logs/LogDetailDrawer';
import { UploadLogsModal } from '../upload/UploadLogsModal';
import { ToastContainer } from '../common/Toast';

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 flex flex-col antialiased">
      {/* Sidebar for Desktop + Drawer for Mobile */}
      <Sidebar
        isMobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on large screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <main className="flex-1">
          <Outlet context={{ onOpenMobileNav: () => setMobileNavOpen(true) }} />
        </main>
      </div>

      {/* Modals & Slide-out Drawers */}
      <LogDetailDrawer />
      <UploadLogsModal />
      <ToastContainer />
    </div>
  );
}
