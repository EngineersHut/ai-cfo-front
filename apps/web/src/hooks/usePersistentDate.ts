import { useState, useEffect } from "react";

export function usePersistentDate() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("selectedMonth");
      if (saved) return Number(saved);
    }
    return currentMonth;
  });

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("selectedYear");
      if (saved) return Number(saved);
    }
    return currentYear;
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("selectedPeriod");
      if (saved) return saved;
    }
    return "monthly";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedMonth", selectedMonth.toString());
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedYear", selectedYear.toString());
    }
  }, [selectedYear]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedPeriod", selectedPeriod);
    }
  }, [selectedPeriod]);

  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedPeriod,
    setSelectedPeriod,
  };
}
