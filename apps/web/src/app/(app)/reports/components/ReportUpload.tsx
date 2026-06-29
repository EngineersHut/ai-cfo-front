"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  FileText,
  UploadCloud,
  Paperclip,
  Info,
  Loader2,
  CheckCircle,
  BadgeCheck,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";
import { ReportTypeEnum } from "@/types";
import * as yup from "yup";
import { dispatch, useSelector } from "@/store";
import { createReport, hasActionError } from "@/store/slices/report";
import { ErrorAlert } from "@/components/common/errorMessage";

const reportUploadSchema = yup.object().shape({
  reportName: yup.string().required("Report Name is required"),
  reportType: yup.string().required("Report Type is required"),
  month: yup.string().required("Month is required"),
  year: yup.string().required("Year is required"),
  file: yup
    .array()
    .min(1, "At least one file is required")
    .required("At least one file is required")
    .test(
      "fileType",
      "Only Excel (.xlsx, .xls) or CSV files are supported",
      (files) => {
        if (!files) return true;
        return files.every((file: any) => {
          const name = file.name ? file.name.toLowerCase() : "";
          return (
            name.endsWith(".xlsx") ||
            name.endsWith(".xls") ||
            name.endsWith(".csv")
          );
        });
      },
    ),
});

const reportTypeOptions = [
  { label: "Income Statement", value: ReportTypeEnum.INCOME_STATEMENT },
  { label: "Balance Sheet", value: ReportTypeEnum.BALANCE_SHEET },
  { label: "Cash Flow", value: ReportTypeEnum.CASH_FLOW },
  { label: "Financial Statement", value: ReportTypeEnum.FINANCIAL_STATEMENT },
  { label: "Other", value: ReportTypeEnum.OTHER },
];

const monthOptions = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => {
  const y = currentYear - 5 + i;
  return { label: String(y), value: String(y) };
}).reverse(); // Show most recent years first

interface ReportUploadProps {
  onCancel: () => void;
}

export default function ReportUpload({ onCancel }: ReportUploadProps) {
  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();

  const [formData, setFormData] = useState({
    reportName: "",
    month: String(currentMonthNum),
    year: String(currentYearNum),
    reportType: "" as ReportTypeEnum | "",
    file: [] as any[],
  });

  const { actionLoading, actionError } = useSelector((state) => state.report);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    dispatch(hasActionError(null));
    return () => {
      dispatch(hasActionError(null));
    };
  }, []);

  // Effect to prevent future month selection if current year is selected
  useEffect(() => {
    if (
      parseInt(formData.year) === currentYearNum &&
      parseInt(formData.month) > currentMonthNum
    ) {
      setFormData((prev) => ({ ...prev, month: String(currentMonthNum) }));
    }
  }, [formData.year, formData.month]);

  const steps = [
    "Scanning Bank statements...",
    "Scanning Income statements...",
    "Tax document statements...",
    "Scanning Invoice...",
  ];

  useEffect(() => {
    if (isAnalyzing && analysisStep < steps.length) {
      const timer = setTimeout(() => {
        setAnalysisStep((prev) => prev + 1);
      }, 1500); // 1.5 seconds per step
      return () => clearTimeout(timer);
    } else if (isAnalyzing && analysisStep === steps.length) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setIsCompleted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, analysisStep]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGenerate = async () => {
    setValidationErrors({});
    dispatch(hasActionError(null));
    try {
      await reportUploadSchema.validate(formData, { abortEarly: false });

      const payload = new FormData();
      payload.append("reportName", formData.reportName);
      payload.append("month", formData.month);
      payload.append("year", formData.year);
      payload.append("reportType", formData.reportType);

      formData.file.forEach((f: any) => {
        payload.append("file", f);
      });

      dispatch(
        createReport(payload, () => {
          setIsAnalyzing(true);
          setAnalysisStep(0);
        }),
      );
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      } else {
        console.error("Non-validation error:", err);
      }
    }
  };

  const handleFileBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      handleInputChange("file", newFiles);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-[#f8fafc]/50 dark:bg-slate-900/50 rounded-[24px] p-12 animate-in fade-in duration-700">
        <div className="flex flex-col gap-12 w-full max-w-[500px]">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-[3px] border-indigo-100 dark:border-indigo-900/30" />
              <div className="absolute w-8 h-8 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
            </div>
            <h2 className="text-[20px] font-semibold text-slate-800 dark:text-slate-100 font-inter">
              Analyzing your financial documents...
            </h2>
          </div>

          <div className="space-y-6 ml-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-4 transition-all duration-700 ${
                  index <= analysisStep
                    ? "opacity-100 translate-y-0"
                    : "opacity-20 translate-y-2"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    index < analysisStep ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {index < analysisStep ? (
                    <CheckCircle size={14} className="text-white" />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full bg-indigo-600 ${index === analysisStep ? "animate-pulse" : "opacity-0"}`}
                    />
                  )}
                </div>
                <span
                  className={`text-[18px] font-normal font-inter leading-[24px] tracking-[0%] transition-colors duration-500 ${
                    index <= analysisStep ? "text-[#0f172a] dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[24px] p-12 animate-in zoom-in-95 duration-1000">
        <div className="w-[60px] h-[60px] rounded-[15px] bg-[#27ae60] flex items-center justify-center text-white mb-8 transform hover:scale-110 transition-transform cursor-pointer">
          <BadgeCheck size={32} />
        </div>
        <h2 className="text-[24px] font-medium text-[#2e2e37] dark:text-slate-100 font-inter leading-[32px] tracking-[0%] mb-1">
          Report Uploaded Successfully
        </h2>
        <p className="text-[18px] font-normal text-[#0f172a] dark:text-slate-200 font-inter text-center max-w-2xl mb-6 leading-[24px] tracking-[0%]">
          Your document has been added to the queue and is now being analyzed.{" "}
          <br />
          We will notify you once the analysis is complete.
        </p>
        <button
          onClick={onCancel}
          className="w-[100px] h-[36px] px-[12px] py-[4px] gap-[6px] bg-[#2563eb] text-[#f8fafc] font-normal font-inter text-[14px] leading-[20px] tracking-[0%] rounded-[8px] border border-white/10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
        >
          All Report
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <div className="flex items-center">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.06)] font-inter cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Reports
        </button>
      </div>

      {/* New Report Upload Header */}
      <div className="space-y-1">
        <h1 className="text-[24px] font-medium text-slate-800 dark:text-slate-100 font-inter leading-[32px]">
          New Report Upload
        </h1>
        <p className="text-[14px] font-normal text-slate-400 dark:text-slate-500 font-inter leading-[20px]">
          Integrate new financial data points into the Precision Ledger
          ecosystem. Ensure all documents meet our architectural quant standards
          for processing.
        </p>
      </div>

      {/* Grid for Metadata and Precision Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Metadata Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 p-[24px] pb-[16px] shadow-sm flex flex-col gap-6">
          <div className="border-b border-[#f1f5f9] dark:border-slate-700 pb-4">
            <h3 className="text-[18px] font-normal text-slate-800 dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
              Report metadata
            </h3>
            <p className="text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-[0%]">
              Enter your email and password to Login
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-slate-600 dark:text-slate-300 font-inter block">
                Report name
              </label>
              <input
                type="text"
                value={formData.reportName}
                onChange={(e) =>
                  handleInputChange("reportName", e.target.value)
                }
                placeholder="e.g. Q3 Architecture Sustainability Audit"
                className={`w-full max-w-[648px] h-[38px] px-[10px] py-[8px] rounded-[8px] border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 transition-all text-[14px] font-inter shadow-sm ${
                  validationErrors.reportName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-[#e2e8f0] dark:border-slate-600"
                }`}
              />
              {validationErrors.reportName && (
                <span className="text-red-500 text-[11px] mt-1 block">
                  {validationErrors.reportName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-slate-600 dark:text-slate-300 font-inter flex items-center gap-1">
                Report Type <span className="text-red-500">*</span>
              </label>
              <div className="relative group max-w-[648px] w-full">
                <select
                  value={formData.reportType}
                  onChange={(e) =>
                    handleInputChange("reportType", e.target.value)
                  }
                  className={`w-full h-[38px] pl-[10px] pr-[36px] py-[8px] rounded-[8px] border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 transition-all text-[14px] font-inter shadow-sm appearance-none cursor-pointer ${
                    validationErrors.reportType
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-[#e2e8f0] dark:border-slate-600"
                  }`}
                >
                  <option value="" disabled>
                    Select report type
                  </option>
                  {reportTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none">
                  <ChevronDown size={18} />
                </div>
              </div>
              {validationErrors.reportType && (
                <span className="text-red-500 text-[11px] mt-1 block">
                  {validationErrors.reportType}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-[648px] w-full">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] font-medium text-slate-600 dark:text-slate-300 font-inter flex items-center gap-1">
                  Month <span className="text-red-500">*</span>
                </label>
                <div className="relative group w-full">
                  <select
                    value={formData.month}
                    onChange={(e) => handleInputChange("month", e.target.value)}
                    className={`w-full h-[38px] pl-[10px] pr-[36px] py-[8px] rounded-[8px] border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 transition-all text-[14px] font-inter shadow-sm appearance-none cursor-pointer ${
                      validationErrors.month
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-[#e2e8f0] dark:border-slate-600"
                    }`}
                  >
                    {monthOptions.map((option) => {
                      const isFutureMonth =
                        parseInt(formData.year) === currentYearNum &&
                        parseInt(option.value) > currentMonthNum;
                      return (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={isFutureMonth}
                        >
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none">
                    <ChevronDown size={18} />
                  </div>
                </div>
                {validationErrors.month && (
                  <span className="text-red-500 text-[11px] mt-1 block">
                    {validationErrors.month}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] font-medium text-slate-600 dark:text-slate-300 font-inter flex items-center gap-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <div className="relative group w-full">
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className={`w-full h-[38px] pl-[10px] pr-[36px] py-[8px] rounded-[8px] border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 transition-all text-[14px] font-inter shadow-sm appearance-none cursor-pointer ${
                      validationErrors.year
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-[#e2e8f0] dark:border-slate-600"
                    }`}
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none">
                    <ChevronDown size={18} />
                  </div>
                </div>
                {validationErrors.year && (
                  <span className="text-red-500 text-[11px] mt-1 block">
                    {validationErrors.year}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Precision Analysis Active Card (Blue) */}
        <div className="bg-[#2563eb] rounded-[12px] p-[18px] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

          <div className="space-y-4 relative z-10">
            <h3 className="text-[16px] font-normal font-inter leading-[24px] tracking-[0%] text-white">
              Precision Analysis Active
            </h3>
            <p className="text-[12px] font-normal text-white font-inter leading-[16px] tracking-[0%]">
              Uploaded reports are automatically processed by our proprietary AI
              engine to extract quantitative architectural data.
            </p>

            <div className="space-y-2 ">
              {[
                "Real-time verification",
                "Cross-ledger auditing",
                "Encrypted data ingestion",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="text-[14px] font-medium font-inter leading-[20px] tracking-[0%] text-white">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#2563eb] bg-slate-200 overflow-hidden ring-2 ring-white/10 hover:translate-y-[-4px] transition-transform cursor-pointer"
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=ai-cfo-${i}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-[13px] font-medium font-inter text-blue-100">
              Trusted by 24 regional partners
            </span>
          </div>
        </div>
      </div>

      {/* Document Assets Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 p-[16px] shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
              <FileText size={20} />
            </div>
            <h3 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
              Document Assets
            </h3>
          </div>
          <div className="w-[100px] h-[23px] rounded-[2px] bg-[#f6f8fa] dark:bg-slate-700 flex items-center justify-center text-[10px] font-semibold text-[#64748b] dark:text-slate-300 font-inter leading-[15px] tracking-[0px] uppercase">
            Secure Upload
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-[16px] p-8 flex flex-col items-center justify-center gap-6 bg-slate-50/20 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group relative ${
            validationErrors.file
              ? "border-red-400 dark:border-red-500 bg-red-50/5 hover:border-red-500"
              : "border-slate-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500"
          }`}
        >
          <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
            <UploadCloud width={44} height={32} className="text-[#94a3b8]" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-[18px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
              Drag and drop documents here
            </h4>
            <p className="text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-[0%] text-center">
              XLSX, XLS, or CSV formats supported (Max 50MB)
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              multiple
              accept=".xlsx, .xls, .csv"
              onChange={handleFileBrowse}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <button className="mt-4 w-[140px] h-[40px] pt-[4px] pr-[16px] pb-[4px] pl-[12px] gap-[6px] bg-white dark:bg-slate-700 border border-[#e2e8f0] dark:border-slate-600 rounded-[8px] text-[14px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[20px] tracking-[0%] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center pointer-events-none">
              <Paperclip size={16} className="text-[#64748b] dark:text-slate-400" />
              Browse Files
            </button>
          </div>
        </div>
        {validationErrors.file && (
          <span className="text-red-500 text-[11px] mt-1 block text-center">
            {validationErrors.file}
          </span>
        )}

        {formData.file && formData.file.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-[12px] font-semibold text-slate-500 font-inter">
              Selected Files:
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.file.map((f: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[12px] text-slate-600 font-inter"
                >
                  <Paperclip size={12} className="text-slate-400" />
                  <span>{f.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updatedFiles = formData.file.filter(
                        (_, i) => i !== index,
                      );
                      handleInputChange("file", updatedFiles);
                    }}
                    className="text-slate-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {actionError && (
        <div className=" w-full">
          <ErrorAlert
            error={actionError}
            onDismiss={() => dispatch(hasActionError(null))}
          />
        </div>
      )}
      {/* Footer Section */}
      <div className="flex flex-col gap-6 ">
        <div className="w-full h-[68px] px-4 rounded-[12px] border border-[#f2f2f3] dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
              <Info size={18} />
            </div>
            <p className="text-[14px] font-inter text-[#434654] dark:text-slate-300 font-normal leading-[20px] tracking-[0px]">
              Final submission will trigger an email notification to the
              compliance team.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={actionLoading}
              className="w-[100px] h-[36px] px-[12px] py-[4px] bg-[#f6f8fa] dark:bg-slate-700 text-[#394c84] dark:text-slate-200 rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 text-[14px] font-normal font-inter leading-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:bg-[#eef2f6] dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={actionLoading}
              className="w-[140px] h-[36px] px-[12px] py-[4px] gap-[6px] bg-[#2563eb] disabled:bg-blue-400 disabled:cursor-not-allowed text-[#f8fafc] font-normal font-inter text-[14px] leading-[20px] tracking-[0%] rounded-[8px] border border-white/10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
            >
              {actionLoading ? (
                <div className="flex items-center gap-2 ">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Generate Report"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
