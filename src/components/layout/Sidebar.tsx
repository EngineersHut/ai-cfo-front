"use client";

import React from 'react';
import {
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import Link from 'next/link';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function NavItem({ icon, label, active = false, isCollapsed = false, href = "#" }: { icon: React.ReactNode, label: string, active?: boolean, isCollapsed?: boolean, href?: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center cursor-pointer transition-all duration-300 ease-in-out mb-[8px] last:mb-0 rounded-[8px] border-transparent tracking-[-0.045em] ${isCollapsed ? 'w-[44px] justify-center px-0' : 'w-[180px] px-3 gap-3'
        } h-[40px] ${active
          ? 'bg-[#2563eb] text-white shadow-sm font-medium'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <span className={`shrink-0 transition-all duration-300 ${active ? 'text-white' : 'text-slate-400'}`}>
        {icon}
      </span>
      <span
        className={`text-[14px] font-normal leading-[20px] whitespace-nowrap transition-all duration-300 overflow-hidden font-inter ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white flex flex-col h-full  transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'w-[80px]' : 'w-[220px]'
        }`}
    >
      {/* Branding & Toggle Section */}
      <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center pt-8 pb-4' : 'px-[20px] pt-[14px] pb-[14px]'}`}>
        <div className="flex items-center justify-between w-full">
          <div className={`relative transition-all duration-300 ${isCollapsed ? 'w-11 h-11' : 'w-auto h-11'}`}>
            <img
              src="/logo.png"
              alt="Logo"
              className={`h-full object-contain transition-all duration-300 ${isCollapsed ? 'scale-125' : 'w-auto'
                }`}
            />
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="w-9 h-9 flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-blue-600 active:scale-95"
              title="Collapse"
            >
              <LayoutToggleButton isCollapsed={false} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={onToggle}
            className="mt-6 w-9 h-9 flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-blue-600 active:scale-95"
            title="Expand"
          >
            <LayoutToggleButton isCollapsed={true} />
          </button>
        )}
      </div>

      {/* Indented Separator Line */}
      <div className={`px-5 mb-2 ${isCollapsed ? 'px-4' : 'px-5'}`}>
        <div className="h-px bg-slate-100 w-full" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[20px] py-2">
        <p className={`text-[12px] font-normal leading-4 text-slate-400 tracking-normal mb-[12px] transition-all duration-300 overflow-hidden font-inter ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto px-1'
          }`}>
          Main
        </p>
        <NavItem 
          icon={<DashboardIcon />} 
          label="Dashboard" 
          isCollapsed={isCollapsed} 
          href="/dashboard" 
          active={pathname === '/dashboard'} 
        />
        <NavItem 
          icon={<OperationalIcon />} 
          label="Operational Overview" 
          isCollapsed={isCollapsed} 
          href="/operational-overview" 
          active={pathname === '/operational-overview'} 
        />
        <NavItem 
          icon={<ReportIcon />} 
          label="Reports" 
          isCollapsed={isCollapsed} 
          href="/reports" 
          active={pathname === '/reports'} 
        />
        <NavItem 
          icon={<GrowthIcon />} 
          label="Growth Overview" 
          isCollapsed={isCollapsed} 
          href="/growth-overview" 
          active={pathname === '/growth-overview'} 
        />
        <NavItem 
          icon={<BudgetIcon />} 
          label="Budget vs Actual" 
          isCollapsed={isCollapsed} 
          href="/budget-vs-actual" 
          active={pathname === '/budget-vs-actual'} 
        />
        <NavItem 
          icon={<ForcastIcon />} 
          label="Forcast" 
          isCollapsed={isCollapsed} 
          href="/dashboard/forecast" 
          active={pathname === '/dashboard/forecast'} 
        />
        <NavItem 
          icon={<ForcastIcon />} 
          label="Forcast Reports" 
          isCollapsed={isCollapsed} 
          href="/dashboard/forecast-reports" 
          active={pathname === '/dashboard/forecast-reports'} 
        />
      </nav>

      {/* User Section - Restoring sequence while maintaining size parity */}
      <div className={`p-[20px] border-t border-slate-50 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        <NavItem icon={<SettingsIcon />} label="Settings" isCollapsed={isCollapsed} />
        <NavItem icon={<LogoutIcon />} label="Logout" isCollapsed={isCollapsed} />

        <div className={`bg-[#2563eb] border border-blue-400/50 flex items-center text-white shadow-lg shadow-blue-200 transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-[44px] h-[44px] justify-center p-0 rounded-xl' : 'w-[180px] h-[40px] px-[12px] py-[4px] gap-[12px] rounded-[8px]'
          }`}>
          <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center font-bold text-[12px] border border-white/20 shrink-0">M</div>
          {!isCollapsed && (
            <div className="flex items-center flex-1 transition-all duration-300 min-w-0">
              <div className="flex-1 overflow-hidden">
                <p className="text-[12px] font-semibold truncate leading-none mb-0.5">Michale</p>
                <p className="text-[9px] opacity-70 truncate uppercase tracking-tighter leading-none">Admin Account</p>
              </div>
              <ChevronDown size={14} className="opacity-70 ml-1 shrink-0" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// Custom SVGs (No changes here)
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="m16 10-4 4-1-1" /><path d="M7 12c0-2.8 2.2-5 5-5s5 2.2 5 5" />
  </svg>
);
const OperationalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v18" /><path d="M12 3v18" /><path d="M18 3v18" /><circle cx="6" cy="15" r="2" /><circle cx="12" cy="9" r="2" /><circle cx="18" cy="12" r="2" />
  </svg>
);
const ReportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 9h18" /><path d="M9 21V9" /><path d="M14 13h2" /><path d="M14 17h2" />
  </svg>
);
const GrowthIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);
const BudgetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" /><path d="M2 22h20" /><path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
  </svg>
);
const ForcastIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="12" height="16" x="6" y="4" rx="2" /><path d="M9 2h6" /><path d="M10 8h4" /><path d="M10 12h2" /><circle cx="16" cy="18" r="3" /><path d="m20 22-1.5-1.5" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const LayoutToggleButton = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d={isCollapsed ? "m12 9 2 2-2 2" : "m14 9-2 2 2 2"} />
  </svg>
);
