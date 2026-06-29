"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sun,
  Moon,
  Settings,
  Bell,
  SlidersHorizontal,
  Plus,
  Menu,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { dispatch, useSelector } from "@/store";
import { getAllCompanies } from "@/store/slices/company";
import { getAllNotifications } from "@/store/slices/realtimeNotification";
import NotificationModal from "./NotificationModal";
import { usePersistentDate } from "@/hooks/usePersistentDate";
import { getData } from "@/utils/apiHelper";

interface HeaderProps {
  onToggleMenu?: () => void;
  onOpenCustomize?: () => void;
}

export default function Header({ onToggleMenu, onOpenCustomize }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const router = useRouter();

  const { selectedMonth, selectedYear } = usePersistentDate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      let exportUrl = "";
      let filePrefix = "export";

      if (pathname.includes("growth-overview")) {
        exportUrl = `/api/growth-overview/export?month=${selectedMonth}&year=${selectedYear}`;
        filePrefix = "growth_export";
      } else if (pathname.includes("operational-overview")) {
        exportUrl = `/api/operational-overview/export?month=${selectedMonth}&year=${selectedYear}`;
        filePrefix = "operational_export";
      } else if (pathname.includes("budget-vs-actual")) {
        exportUrl = `/api/budget-planning/export?month=${selectedMonth}&year=${selectedYear}`;
        filePrefix = "budget_actual_export";
      } else {
        exportUrl = `/api/dashboard/export?month=${selectedMonth}&year=${selectedYear}`;
        filePrefix = "dashboard_export";
      }

      const response = await getData(exportUrl, {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.setAttribute("download", `${filePrefix}_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const { companies } = useSelector((state) => state.company);
  const { unreadCount } = useSelector((state) => state.realtimeNotification);

  useEffect(() => {
    dispatch(
      getAllCompanies("", (fetchedCompanies) => {
        if (
          fetchedCompanies &&
          fetchedCompanies.length === 0 &&
          !pathname.includes("/settings")
        ) {
          router.push("/settings?createCompany=true");
        }
      }),
    );
  }, [pathname, router]);

  const dynamicOptions = React.useMemo(() => {
    if (!companies || companies.length === 0) return [];
    return companies.map((c: any) => ({
      id: c._id,
      label: c.name,
      description: c.industry
        ? c.industry.replace(/_/g, " ").toUpperCase()
        : "Company Workspace",
      icon: <Building2 size={16} />,
      industry: c.industry,
    }));
  }, [companies]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllNotifications());

    if (dynamicOptions.length > 0) {
      const savedCompanyId = localStorage.getItem("selectedCompany");
      const found = savedCompanyId
        ? dynamicOptions.find((opt) => opt.id === savedCompanyId)
        : null;
      if (found) {
        setSelectedWorkspace(found);
        const savedType = localStorage.getItem("selectedCompanyType");
        if (found.industry && savedType !== found.industry) {
          localStorage.setItem("selectedCompanyType", found.industry);
        }
      } else {
        const defaultOpt = dynamicOptions[0];
        setSelectedWorkspace(defaultOpt);
        if (defaultOpt) {
          localStorage.setItem("selectedCompany", defaultOpt.id);
          if (defaultOpt.industry) {
            localStorage.setItem("selectedCompanyType", defaultOpt.industry);
          }
        }
      }
    } else {
      setSelectedWorkspace(null);
    }
  }, [dynamicOptions]);

  // Determine page title based on current path
  const getPageTitle = () => {
    if (pathname.includes("growth-overview")) return "Growth Overview";
    if (pathname.includes("operational-overview"))
      return "Operational Overview";
    if (pathname.includes("budget-vs-actual")) return "Budget vs Actual";
    if (pathname === "/dashboard" || pathname === "/") return "Dashboard";
    if (pathname.startsWith("/reports/")) return "Report Detail";

    // Fallback: convert slug to Title Case
    const lastSegment = pathname.split("/").pop() || "Overview";
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <header
      className={`h-[60px] flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 border-b transition-colors duration-200 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
      }`}
    >
      {/* Left Section: Mobile Menu + Workspace Selector */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Toggle - Only visible on small screens */}
        <button
          onClick={onToggleMenu}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-slate-800 text-slate-400 hover:text-blue-400"
              : "hover:bg-slate-50 text-slate-500"
          }`}
        >
          <Menu size={20} />
        </button>

        {companies && companies.length > 0 && (
          <div
            className="flex items-center gap-1 md:gap-3 relative"
            ref={dropdownRef}
          >
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`transition-colors shrink-0 ${isDark ? "text-slate-400 group-hover:text-blue-400" : "text-slate-400 group-hover:text-blue-500"}`}
              >
                {selectedWorkspace?.icon || <Building2 size={16} />}
              </div>
              <span
                className={`text-[14px] md:text-[15px] font-normal font-inter truncate max-w-[100px] md:max-w-none transition-colors ${
                  isDark ? "text-slate-200" : "text-[#1e293b]"
                }`}
              >
                {selectedWorkspace?.label || "Loading..."}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 shrink-0 ${
                  isDark
                    ? "text-slate-400 group-hover:text-blue-400"
                    : "text-slate-400 group-hover:text-slate-600"
                } ${isOpen ? "rotate-180" : ""}`}
              />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className={`absolute top-full left-0 mt-3 w-[240px] rounded-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200 border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                    : "bg-white border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div
                  className={`px-4 py-2 border-b mb-1 ${isDark ? "border-slate-700" : "border-slate-50"}`}
                >
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Workspaces
                  </p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {dynamicOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => {
                        setSelectedWorkspace(option);
                        localStorage.setItem("selectedCompany", option.id);
                        if (option.industry) {
                          localStorage.setItem(
                            "selectedCompanyType",
                            option.industry,
                          );
                        }
                        window.dispatchEvent(new Event("companyChanged"));
                        setIsOpen(false);
                      }}
                      className={`group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all ${
                        selectedWorkspace?.id === option.id
                          ? isDark
                            ? "bg-slate-800"
                            : "bg-blue-50"
                          : isDark
                            ? "hover:bg-slate-800/50"
                            : "hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                          selectedWorkspace?.id === option.id
                            ? isDark
                              ? "bg-slate-800 border-slate-700 text-blue-400"
                              : "bg-white border-blue-200 text-blue-600 shadow-sm"
                            : isDark
                              ? "bg-slate-800 border-slate-700 text-slate-400 group-hover:text-blue-400"
                              : "bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[14px] truncate ${
                            selectedWorkspace?.id === option.id
                              ? isDark
                                ? "font-semibold text-blue-400"
                                : "font-semibold text-blue-600"
                              : isDark
                                ? "font-normal text-slate-300"
                                : "font-normal text-slate-700"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {option.description}
                        </p>
                      </div>
                      {selectedWorkspace?.id === option.id && (
                        <Check
                          size={16}
                          className={isDark ? "text-blue-400" : "text-blue-600"}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={`h-4 md:h-6 w-px mx-1 md:mx-2 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
            />
          </div>
        )}

        <div className="flex items-center gap-1 md:gap-3 relative">
          <span
            className={`text-[16px] font-medium font-inter transition-colors duration-200 ${isDark ? "text-white" : "text-slate-800"}`}
          >
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right Section: Icons + Actions */}
      <div className="flex items-center gap-2 md:gap-[20px]">
        {/* Functional Icons Group - Hidden on very small screens, scrollable or wrap on medium */}
        <div className="hidden sm:flex items-center justify-between gap-3 md:gap-[16px]">
          {mounted && (
            <IconButton
              icon={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              isDark={isDark}
            />
          )}
          <IconButton
            icon={<Settings size={18} />}
            onClick={() => router.push("/settings")}
            isDark={isDark}
          />
          <div className="relative flex items-center" ref={notificationRef}>
            <div className="relative">
              <IconButton
                icon={<Bell size={18} />}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                isDark={isDark}
              />
              {unreadCount > 0 && (
                <span
                  className={`absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border ${isDark ? "border-slate-900" : "border-white"}`}
                ></span>
              )}
            </div>
            <NotificationModal
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>
        </div>

        <div
          className={`hidden sm:block h-6 w-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
        />

        {/* Buttons Group - Selective Visibility or Responsive Scaling */}
        <div className="flex items-center gap-2 md:gap-[10px]">
          <button
            onClick={onOpenCustomize}
            className={`h-[36px] px-3 md:w-[120px] flex items-center gap-[6px] md:px-[12px] md:pr-[16px] py-[4px] border rounded-[8px] transition-all group whitespace-nowrap cursor-pointer ${
              isDark
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
            }`}
          >
            <SlidersHorizontal
              size={16}
              className={`transition-colors ${isDark ? "text-slate-400 group-hover:text-blue-400" : "text-slate-400 group-hover:text-blue-600"}`}
            />
            <span className="text-[13px] md:text-[14px] font-normal leading-[20px] font-inter hidden md:inline">
              Customize
            </span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`h-[36px] px-3 md:w-[120px] flex items-center gap-[6px] md:px-[12px] md:pr-[16px] py-[4px] border rounded-[8px] transition-all group whitespace-nowrap cursor-pointer ${
              isExporting ? "opacity-60 cursor-not-allowed" : ""
            } ${
              isDark
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
            }`}
          >
            <DownloadIcon isDark={isDark} />
            <span className="text-[13px] md:text-[14px] font-normal leading-[20px] font-inter hidden md:inline">
              {isExporting ? "Exporting..." : "Export"}
            </span>
          </button>

          <button
            onClick={() => router.push("/reports?add=true")}
            className="h-[36px] w-auto px-3 md:w-[125px] flex items-center justify-center gap-[6px] bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus size={18} />
            <span className="text-[13px] md:text-[14px] font-normal leading-[20px] font-inter tracking-normal hidden sm:inline">
              Add Report
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  icon,
  onClick,
  isDark,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  isDark?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center transition-all p-1 cursor-pointer rounded-lg ${
        isDark
          ? "text-slate-400 hover:text-blue-400 hover:bg-slate-800"
          : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {icon}
    </button>
  );
}

const DownloadIcon = ({ isDark }: { isDark?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={
      isDark
        ? "text-slate-400 group-hover:text-blue-400"
        : "text-slate-400 group-hover:text-blue-600"
    }
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18v-6" />
    <path d="m9 15 3 3 3-3" />
  </svg>
);
