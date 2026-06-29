"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { dispatch, useSelector } from '@/store';
import { 
  fetchDashboardConfig, 
  toggleDashboardVisibility, 
  toggleDashboardVisibilityBulk,
  resetDashboardConfig 
} from '@/store/slices/dashboard';

interface DashboardContextType {
  visibility: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
  toggleVisibilityBulk: (ids: string[], visible: boolean) => void;
  resetToDefaults: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { visibility } = useSelector((state) => state.dashboard);

  // Initialize and load config from Redux store thunk (which calls API internally)
  useEffect(() => {
    dispatch(fetchDashboardConfig());
  }, []);

  const toggleVisibility = (id: string) => {
    dispatch(toggleDashboardVisibility(id, visibility));
  };

  const toggleVisibilityBulk = (ids: string[], visible: boolean) => {
    dispatch(toggleDashboardVisibilityBulk(ids, visible, visibility));
  };

  const resetToDefaults = () => {
    dispatch(resetDashboardConfig());
  };

  return (
    <DashboardContext.Provider value={{ visibility, toggleVisibility, toggleVisibilityBulk, resetToDefaults }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardSettings() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardSettings must be used within a DashboardProvider');
  }
  return context;
}
