"use client";

import { Pin } from "lucide-react";
import { useSelector } from "@/store";

interface AIInsightItem {
  id: string;
  title: string;
  description: string;
  percentage?: string;
  color?: string;
  bgColor?: string;
  textColor?: string;
}

export default function AIInsights({
  insights,
}: {
  insights?: AIInsightItem[];
}) {
  const { aiInsights: dashboardInsights } = useSelector(
    (state) => state.dashboard,
  );
  const rawInsights = (insights || dashboardInsights || []).slice(0, 3);

  const activeInsights = rawInsights.map((item, index) => {
    const classColors = [
      {
        barColor: "#2563eb",
        badgeClasses:
          "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      {
        barColor: "#f59e0b",
        badgeClasses:
          "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      {
        barColor: "#10b981",
        badgeClasses:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
    ];
    const colorSet = classColors[index % classColors.length];
    return {
      ...colorSet,
      ...item,
    };
  });

  return (
    <div className="w-full h-auto md:h-[200px] bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50 dark:border-slate-700 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
          <Pin size={16} />
        </div>
        <h3 className="text-[16px] font-normal text-slate-800 dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
          AI Insights
        </h3>
      </div>

      {/* Insights Grid */}
      <div className="p-[16px] flex-grow flex items-center justify-center min-h-0 w-full">
        {activeInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full min-h-0">
            {activeInsights.map((item, idx) => (
              <div
                key={item.id || `insight-${idx}`}
                className="flex gap-2 group h-full min-h-0"
              >
                {/* Left Indicator Bar */}
                <div
                  className="w-1 rounded-full shrink-0 h-full"
                  style={{ backgroundColor: item.color || item.barColor }}
                />

                <div className="space-y-1 flex-1 flex flex-col min-h-0">
                  {/* Category Badge */}
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-normal font-inter leading-[16px] tracking-[0%] align-middle shrink-0 ${!item.bgColor ? item.badgeClasses : ""}`}
                    style={
                      item.bgColor
                        ? {
                            backgroundColor: item.bgColor,
                            color: item.textColor,
                          }
                        : undefined
                    }
                  >
                    {item.title}{" "}
                    <span className="ml-1 opacity-70">{item.percentage}</span>
                  </div>

                  {/* Insight Text */}
                  <p className="text-[13.5px] text-slate-600 dark:text-slate-400 font-inter font-normal leading-[19px] tracking-[0%] align-middle overflow-y-auto pr-1 flex-1 min-h-0 insight-scrollbar">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-slate-400 text-[13px] font-inter py-4">
            No AI Insights available yet. Upload documents to get started.
          </div>
        )}
      </div>

      <style>{`
        .insight-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .insight-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .insight-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark .insight-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
