import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { QuickLogModal } from '../dashboard/QuickLogModal';
import { PageTransition } from '../animations/PageTransition';

export const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogCreated = () => {
    // Notify child routes to refetch if needed
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex bg-[#08100d] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar
          onOpenQuickLog={() => setQuickLogOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <PageTransition>
            <Outlet context={{ refreshTrigger, onOpenQuickLog: () => setQuickLogOpen(true) }} />
          </PageTransition>
        </main>
      </div>

      {/* Global Quick Log Modal */}
      <QuickLogModal
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        onLogCreated={handleLogCreated}
      />
    </div>
  );
};
