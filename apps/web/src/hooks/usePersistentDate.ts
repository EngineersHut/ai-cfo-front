import { useState, useEffect } from 'react';

export function usePersistentDate() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('selectedMonth');
      if (saved) return Number(saved);
    }
    return currentMonth;
  });

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('selectedYear');
      if (saved) return Number(saved);
    }
    return currentYear;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedMonth', selectedMonth.toString());
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedYear', selectedYear.toString());
    }
  }, [selectedYear]);

  return { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear };
}
