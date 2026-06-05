"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Sun,
  Settings,
  Bell,
  SlidersHorizontal,
  Download,
  Plus,
  Menu,
  Check,
  Building2
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { workspaceOptions, WorkspaceOption } from '@/components/common/Option';
import { dispatch, useSelector } from '@/store';
import { getAllCompanies } from '@/store/slices/company';
import NotificationModal from './NotificationModal';

interface HeaderProps {
  onToggleMenu?: () => void;
  onOpenCustomize?: () => void;
}

export default function Header({ onToggleMenu, onOpenCustomize }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { companies } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(getAllCompanies());
  }, []);

  const dynamicOptions = React.useMemo(() => {
    if (!companies || companies.length === 0) {
      return workspaceOptions.map((opt, idx) => {
        const mockIndustries = [
          'technology_and_saas',
          'architecture_and_design',
          'financial_services',
          'fleet_management'
        ];
        return {
          ...opt,
          industry: mockIndustries[idx % mockIndustries.length]
        };
      });
    }
    return companies.map((c: any) => ({
      id: c._id,
      label: c.name,
      description: c.industry ? c.industry.replace(/_/g, ' ').toUpperCase() : 'Company Workspace',
      icon: <Building2 size={16} />,
      industry: c.industry
    }));
  }, [companies]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  useEffect(() => {
    if (dynamicOptions.length > 0) {
      const savedCompanyId = localStorage.getItem('selectedCompany');
      const found = savedCompanyId ? dynamicOptions.find(opt => opt.id === savedCompanyId) : null;
      if (found) {
        setSelectedWorkspace(found);
        const savedType = localStorage.getItem('selectedCompanyType');
        if (found.industry && savedType !== found.industry) {
          localStorage.setItem('selectedCompanyType', found.industry);
        }
      } else {
        // If we are using mock options and there is a saved company ID in localStorage,
        // do not overwrite it with a mock ID. We are probably just waiting for the real companies to load.
        if ((!companies || companies.length === 0) && savedCompanyId) {
          const matchedMock = dynamicOptions.find(opt => opt.id === savedCompanyId);
          setSelectedWorkspace(matchedMock || dynamicOptions[0]);
          return;
        }

        const defaultOpt = dynamicOptions[0];
        setSelectedWorkspace(defaultOpt);
        if (defaultOpt) {
          const isInitialLoadLoading = (!companies || companies.length === 0);
          if (!savedCompanyId || (!isInitialLoadLoading && !found)) {
            localStorage.setItem('selectedCompany', defaultOpt.id);
            if (defaultOpt.industry) {
              localStorage.setItem('selectedCompanyType', defaultOpt.industry);
            }
          }
        }
      }
    }
  }, [dynamicOptions, companies]);

  // Determine page title based on current path
  const getPageTitle = () => {
    if (pathname.includes('growth-overview')) return 'Growth Overview';
    if (pathname.includes('operational-overview')) return 'Operational Overview';
    if (pathname.includes('budget-vs-actual')) return 'Budget vs Actual';
    if (pathname === '/dashboard' || pathname === '/') return 'Dashboard';

    // Fallback: convert slug to Title Case
    const lastSegment = pathname.split('/').pop() || 'Overview';
    return lastSegment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[60px] bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">

      {/* Left Section: Mobile Menu + Workspace Selector */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Toggle - Only visible on small screens */}
        <button
          onClick={onToggleMenu}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-500"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-1 md:gap-3 relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0">
              {selectedWorkspace?.icon || <Building2 size={16} />}
            </div>
            <span className="text-[14px] md:text-[15px] font-normal text-[#1e293b] font-inter truncate max-w-[100px] md:max-w-none">
              {selectedWorkspace?.label || 'Loading...'}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-3 w-[240px] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Workspaces</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {dynamicOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setSelectedWorkspace(option);
                      localStorage.setItem('selectedCompany', option.id);
                      if (option.industry) {
                        localStorage.setItem('selectedCompanyType', option.industry);
                      }
                      setIsOpen(false);
                    }}
                    className={`group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all ${selectedWorkspace?.id === option.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${selectedWorkspace?.id === option.id
                      ? 'bg-white border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-600'
                      }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] truncate ${selectedWorkspace?.id === option.id ? 'font-semibold text-blue-600' : 'font-normal text-slate-700'
                        }`}>
                        {option.label}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{option.description}</p>
                    </div>
                    {selectedWorkspace?.id === option.id && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-4 md:h-6 w-px bg-slate-200 mx-1 md:mx-2" />
          <span className="text-[14px] md:text-[15px] font-normal text-slate-500 font-inter hidden sm:inline">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right Section: Icons + Actions */}
      <div className="flex items-center gap-2 md:gap-[20px]">
        {/* Functional Icons Group - Hidden on very small screens, scrollable or wrap on medium */}
        <div className="hidden sm:flex items-center justify-between gap-3 md:gap-[16px]">
          {/* <IconButton icon={<Sun size={18} />} /> */}
          <IconButton icon={<Settings size={18} />} onClick={() => router.push('/settings')} />
          <div className="relative flex items-center" ref={notificationRef}>
            <IconButton icon={<Bell size={18} />} onClick={() => setIsNotificationOpen(!isNotificationOpen)} />
            <NotificationModal isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-200" />

        {/* Buttons Group - Selective Visibility or Responsive Scaling */}
        <div className="flex items-center gap-2 md:gap-[10px]">
          <button
            onClick={onOpenCustomize}
            className="h-[36px] px-3 md:w-[120px] flex items-center gap-[6px] md:px-[12px] md:pr-[16px] py-[4px] bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-all text-slate-900 group whitespace-nowrap"
          >
            <SlidersHorizontal size={16} className="text-slate-400 group-hover:text-blue-600" />
            <span className="text-[13px] md:text-[14px] font-normal leading-[20px] font-inter hidden md:inline">Customize</span>
          </button>

          <button className="h-[36px] px-3 md:w-[120px] flex items-center gap-[6px] md:px-[12px] md:pr-[16px] py-[4px] bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-all text-slate-900 group whitespace-nowrap">
            <DownloadIcon />
            <span className="text-[13px] md:text-[14px] font-normal leading-[20px] font-inter hidden md:inline">Export</span>
          </button>

          <button 
            onClick={() => router.push('/reports?add=true')}
            className="h-[36px] w-auto px-3 md:w-[125px] flex items-center justify-center gap-[6px] bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="text-[13px] md:text-[14px] font-normal leading-[20px] font-inter tracking-normal hidden sm:inline">Add Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all p-1">
      {icon}
    </button>
  );
}

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" />
  </svg>
);
