"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import CustomizeDrawer from "@/components/ui/CustomizeDrawer";
import { useRouter, usePathname } from "next/navigation";
import { DashboardProvider } from "@/context/DashboardContext";
import Modal from "@/components/common/Modal";
import { LogOut } from "lucide-react";
import GlobalProcessingBanner from "@/components/common/GlobalProcessingBanner";

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/?modal=login";
  };

  // Authenticate user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/?modal=login");
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fa] dark:bg-[#0a0f1c]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-white dark:bg-[#0a0f1c] overflow-hidden font-inter">
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden transition-all duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar Wrapper */}
        <div
          className={`fixed inset-y-0 left-0 z-[50] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isCollapsed={isMobile ? false : isCollapsed}
            onToggle={toggleSidebar}
            onLogout={() => setIsLogoutModalOpen(true)}
          />
        </div>

        {/* Main Container */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out w-full`}
        >
          <GlobalProcessingBanner />

          {/* Header */}
          <Header
            onToggleMenu={toggleSidebar}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />

          {/* Content Area */}
          <main className="flex-1 bg-white dark:bg-[#0a0f1c] relative">
            <div className="absolute inset-0 mr-2 rounded-t-[16px] p-[24px] overflow-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] bg-[#f6f8fa] dark:bg-[#0d1424]">
              {children}
            </div>
          </main>
        </div>

        {/* Customize Drawer */}
        <CustomizeDrawer
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
        />

        {/* Logout Confirmation Modal - Rendered at root level so it covers full screen */}
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          width="360px"
        >
          <div className="p-6 text-center font-inter">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
              <LogOut size={24} strokeWidth={2} />
            </div>
            <h3 className="text-[#0f172a] font-semibold text-[18px] leading-[26px] mb-1">
              Confirm Logout
            </h3>
            <p className="text-slate-500 text-[14px] leading-[20px] mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 h-[36px] bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-medium text-[14px] leading-[20px] rounded-[8px] transition-all shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-[36px] bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-medium text-[14px] leading-[20px] rounded-[8px] transition-all shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardProvider>
  );
}
