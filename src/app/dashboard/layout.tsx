"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-inter">
      {/* Sidebar - Now handles its own toggle button internally */}
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${isCollapsed ? 'ml-[80px]' : 'ml-[220px]'
          }`}
      >
        {/* Header - Cleaned up (toggle removed) */}
        <Header />

        {/* Content Area - Premium Rounded Card Style */}
        <main className="flex-1 bg-white relative">
          <div
            style={{ backgroundColor: 'rgba(246, 248, 250, 1)' }}
            className="absolute inset-0 rounded-t-[20px] border-t border-l border-slate-200/30 p-8 overflow-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
