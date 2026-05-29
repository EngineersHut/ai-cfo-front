"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CustomizeDrawer from '@/components/ui/CustomizeDrawer';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardProvider } from '@/context/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Authenticate user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/?modal=login');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // Handle window resize and initial check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fa]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-white overflow-hidden font-inter">

        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden transition-all duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar Wrapper */}
        <div className={`fixed inset-y-0 left-0 z-[50] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <Sidebar
            isCollapsed={isMobile ? false : isCollapsed}
            onToggle={toggleSidebar}
          />
        </div>

        {/* Main Container */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out w-full`}
        >
          {/* Header */}
          <Header
            onToggleMenu={toggleSidebar}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />

          {/* Content Area */}
          <main className="flex-1 bg-white relative">
            <div
              className="absolute inset-0 mr-2 rounded-t-[16px] p-[24px] overflow-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] bg-[#f6f8fa]"
            >
              {children}
            </div>
          </main>
        </div>

        {/* Customize Drawer */}
        <CustomizeDrawer
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
        />
      </div>
    </DashboardProvider>
  );
}
