"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { drawerGroups } from '@/data/drawerData';

// Generate initial state from drawerData IDs
const getInitialVisibility = () => {
  const initial: Record<string, boolean> = {};
  drawerGroups.forEach(group => {
    group.sections.forEach(section => {
      section.items.forEach(item => {
        initial[item.id] = true; // By default all are visible
      });
    });
  });
  return initial;
};

interface DashboardContextType {
  visibility: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
  resetToDefaults: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_visibility');
    const initial = getInitialVisibility();
    if (saved) {
      // Merge saved settings with initial (new IDs will default to true)
      setVisibility({ ...initial, ...JSON.parse(saved) });
    } else {
      setVisibility(initial);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever visibility changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dashboard_visibility', JSON.stringify(visibility));
    }
  }, [visibility, isInitialized]);

  const toggleVisibility = (id: string) => {
    setVisibility(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetToDefaults = () => {
    setVisibility(getInitialVisibility());
  };

  return (
    <DashboardContext.Provider value={{ visibility, toggleVisibility, resetToDefaults }}>
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
