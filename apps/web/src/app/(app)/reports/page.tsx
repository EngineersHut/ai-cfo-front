"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { List, Activity, Plus, ChevronDown } from "lucide-react";

import { reportsData } from "@/data/reportsData";
import ReportUpload from "./components/ReportUpload";
import ListView from "./components/ListView";
import TimelineView from "./components/TimelineView";
import { useRouter } from "next/navigation";
import DeleteModal from "./components/DeleteModal";
import { dispatch, useSelector } from "@/store";
import {
  getAllReports,
  getAllReportsSilent,
  deleteReport,
} from "@/store/slices/report";
import { Report } from "@/types";
import { IndustryEnum, REPORTS_HEADER_CONFIGS } from "@/config/industryConfig";

export default function ReportsPage() {
  const [companyType, setCompanyType] = useState<string>(
    IndustryEnum.TRANSPORTATION_AND_LOGISTICS,
  );

  useEffect(() => {
    const savedType = localStorage.getItem("selectedCompanyType");
    if (savedType) {
      setCompanyType(savedType);
    }

    const interval = setInterval(() => {
      const saved = localStorage.getItem("selectedCompanyType");
      if (saved && saved !== companyType) {
        setCompanyType(saved);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [companyType]);

  const activeHeader = REPORTS_HEADER_CONFIGS[companyType as IndustryEnum] ??
    REPORTS_HEADER_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS] ?? {
      title: "Reports",
      subtitle: "",
    };
  const [view, setView] = useState<"list" | "timeline">("list");
  const [activePeriod, setActivePeriod] = useState<string>("Jan 2025");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const [reportToDelete, setReportToDelete] = useState<any>(null);
  const [isAddingReport, setIsAddingReport] = useState(false);
  const searchParams = useSearchParams();
  const addParam = searchParams.get("add");

  useEffect(() => {
    if (addParam === "true") {
      setIsAddingReport(true);
    }
  }, [addParam]);
  const [reportData, setReportData] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { reports, actionLoading } = useSelector((state) => state.report);

  const handleDeleteClick = (e: React.MouseEvent, report: any) => {
    e.stopPropagation();
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      const deleteId = reportToDelete._id || reportToDelete.id;
      dispatch(
        deleteReport(deleteId, () => {
          setIsDeleteModalOpen(false);
          setReportToDelete(null);
          loadReports();
        }),
      );
    }
  };

  const handleReportClick = (report: any) => {
    router.push(`/reports/${report._id || report.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadReports(page, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    loadReports(1, newLimit, searchQuery);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    loadReports(1, limit, val);
  };

  const loadReports = (
    pageNumber = currentPage,
    limitVal = limit,
    searchVal = searchQuery,
    silent = false,
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(pageNumber));
    queryParams.append("limit", String(limitVal));
    if (searchVal) {
      queryParams.append("search", searchVal);
    }
    if (silent) {
      dispatch(getAllReportsSilent(`?${queryParams.toString()}`));
    } else {
      dispatch(getAllReports(`?${queryParams.toString()}`));
    }
  };

  const handleUploadClose = () => {
    setIsAddingReport(false);
    window.history.replaceState({}, "", "/reports");
    loadReports(1, limit, searchQuery);
  };

  useEffect(() => {
    loadReports(1, limit, searchQuery);

    const handleCompanyChange = () => {
      loadReports(1, limit, searchQuery);
    };

    window.addEventListener("companyChanged", handleCompanyChange);
    return () => {
      window.removeEventListener("companyChanged", handleCompanyChange);
    };
  }, [limit, searchQuery]);

  useEffect(() => {
    if (reports) {
      const dataArray = Array.isArray(reports) ? reports : reports.data || [];
      setReportData(dataArray);
      if (dataArray.length > 0 && !activePeriod) {
        setActivePeriod(
          dataArray[0].periodStartDate || dataArray[0].period || "",
        );
      }
    }
  }, [reports]);

  // Silent polling: only when reports are processing
  useEffect(() => {
    const hasProcessing = reportData.some(
      (r) => (r.uploadStatus || r.status) === "processing",
    );
    let interval: NodeJS.Timeout;
    if (hasProcessing) {
      interval = setInterval(() => {
        loadReports(currentPage, limit, searchQuery, true);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reportData, currentPage, limit, searchQuery]);

  const paginationObj =
    reports && !Array.isArray(reports)
      ? {
          total: reports.total ?? 0,
          page: reports.page ?? 1,
          limit: reports.limit ?? 10,
          totalPages: reports.totalPages ?? 1,
        }
      : {
          total: reportData.length,
          page: 1,
          limit: reportData.length || 10,
          totalPages: 1,
        };

  return (
    <div className="flex flex-col gap-5  max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {isAddingReport ? (
        <ReportUpload onCancel={handleUploadClose} />
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h1 className="text-[24px] font-medium text-slate-800 dark:text-slate-100 font-inter leading-[32px] tracking-[0%]">
                {activeHeader.title}
              </h1>
              <p className="text-[14px] font-normal text-slate-400 dark:text-slate-500 font-inter leading-[20px] tracking-[0%]">
                {activeHeader.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="w-full sm:w-[290px] h-[48px] p-[5px] flex items-center bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
                <button
                  onClick={() => setView("list")}
                  className={`flex-1 h-[36px] flex items-center justify-center gap-[10px] px-[12px] py-[4px] rounded-[8px] text-[14px] font-normal font-inter leading-[20px] transition-all whitespace-nowrap cursor-pointer ${
                    view === "list"
                      ? "bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] border border-white/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <List size={18} />
                  List View
                </button>
                <button
                  onClick={() => setView("timeline")}
                  className={`flex-1 h-[36px] flex items-center justify-center gap-[10px] px-[12px] py-[4px] rounded-[8px] text-[14px] font-normal font-inter leading-[20px] transition-all whitespace-nowrap cursor-pointer ${
                    view === "timeline"
                      ? "bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] border border-white/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Activity size={18} />
                  Timeline View
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsAddingReport(true)}
                  className="w-[130px] h-[36px] flex items-center justify-center gap-[6px] pt-[4px] pr-[12px] pb-[4px] pl-[12px] bg-[#2563eb] text-white rounded-[8px] border border-white/10 text-[14px] font-normal font-inter leading-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <Plus size={18} />
                  Add Report
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {view === "list" ? (
            <ListView
              reportsData={reportData}
              onDeleteClick={handleDeleteClick}
              onReportClick={handleReportClick}
              pagination={paginationObj}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          ) : (
            <TimelineView
              reportsData={reportData}
              activePeriod={activePeriod}
              setActivePeriod={setActivePeriod}
              onDeleteClick={handleDeleteClick}
              onReportClick={handleReportClick}
            />
          )}
        </>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        reportToDelete={reportToDelete}
        isDeleting={actionLoading}
      />
    </div>
  );
}
