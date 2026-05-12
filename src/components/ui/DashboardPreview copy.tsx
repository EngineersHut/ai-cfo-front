"use client";

import { useState, useEffect, useRef } from "react";

interface MonthlyData {
  month: string;
  revenue: number;
  profit: number;
  expense: number;
}

interface TooltipData {
  index: number;
  x: number;
  y: number;
  data: MonthlyData;
}

const monthlyData: MonthlyData[] = [
  { month: "Jan", revenue: 17000, profit: 8000, expense: 9000 },
  { month: "Feb", revenue: 17000, profit: 6000, expense: 11000 },
  { month: "Mar", revenue: 11000, profit: 8560, expense: 2440 },
  { month: "Apr", revenue: 24000, profit: 10000, expense: 14000 },
  { month: "May", revenue: 32000, profit: 12000, expense: 20000 },
  { month: "Jun", revenue: 38000, profit: 16000, expense: 22000 },
  { month: "Jul", revenue: 38000, profit: 14000, expense: 24000 },
  { month: "Aug", revenue: 25000, profit: 5000, expense: 20000 },
  { month: "Sep", revenue: 25000, profit: 4500, expense: 20500 },
  { month: "Oct", revenue: 15000, profit: 3800, expense: 11200 },
  { month: "Nov", revenue: 15000, profit: 7000, expense: 8000 },
  { month: "Dec", revenue: 25000, profit: 7500, expense: 17500 },
];

function LineChart({ data }: { data: MonthlyData[] }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const w = 540, h = 220;
  const pad = { top: 20, right: 20, bottom: 40, left: 48 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const maxVal = 60000;
  const yTicks = [0, 10000, 20000, 30000, 40000, 50000, 60000];

  const xScale = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => pad.top + chartH - (v / maxVal) * chartH;

  // Professional Monotone Cubic Spline generator
  const getSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return "";
    let d = `M${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      
      // Control points for smooth monotone curve
      const cp1x = curr.x + (next.x - curr.x) / 2.5;
      const cp2x = next.x - (next.x - curr.x) / 2.5;
      
      d += ` C${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.revenue) }));
  const linePath = getSmoothPath(points);

  const areaPath =
    linePath +
    ` L${xScale(data.length - 1)},${pad.top + chartH} L${pad.left},${pad.top + chartH} Z`;

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Grid lines (Square/Full Grid) */}
        {yTicks.map((v) => (
          <g key={`y-axis-${v}`}>
            <line
              x1={pad.left} y1={yScale(v)}
              x2={pad.left + chartW} y2={yScale(v)}
              stroke="#f1f5f9" strokeWidth="1"
            />
            <text
              x={pad.left - 6} y={yScale(v) + 4}
              textAnchor="end" fontSize="9"
              fill="#9ca3af"
            >
              {v === 0 ? "$0k" : `$${v / 1000}0k`}
            </text>
          </g>
        ))}
        {data.map((_, i) => (
          <line
            key={`v-${i}`}
            x1={xScale(i)} y1={pad.top}
            x2={xScale(i)} y2={pad.top + chartH}
            stroke="#f1f5f9" strokeWidth="1"
          />
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X labels */}
        {data.map((d: MonthlyData, i: number) => (
          <text
            key={i}
            x={xScale(i)} y={h - 8}
            textAnchor="middle" fontSize="9" fill="#9ca3af"
          >
            {d.month}
          </text>
        ))}

        {/* Hover points */}
        {data.map((d: MonthlyData, i: number) => (
          <circle
            key={i}
            cx={xScale(i)} cy={yScale(d.revenue)}
            r={tooltip?.index === i ? 5 : 4}
            fill={tooltip?.index === i ? "#6366f1" : "white"}
            stroke="#6366f1"
            strokeWidth="2"
            style={{ cursor: "pointer", transition: "r 0.15s" }}
            onMouseEnter={(e) => {
              if (!svgRef.current) return;
              const rect = svgRef.current.getBoundingClientRect();
              const svgX = xScale(i);
              const svgY = yScale(d.revenue);
              const scaleX = rect.width / w;
              const scaleY = rect.height / h;
              setTooltip({
                index: i,
                x: svgX * scaleX,
                y: svgY * scaleY,
                data: d,
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {/* Tooltip vertical line */}
        {tooltip && (
          <line
            x1={xScale(tooltip.index)} y1={pad.top}
            x2={xScale(tooltip.index)} y2={pad.top + chartH}
            stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3"
          />
        )}
      </svg>

      {/* Tooltip box */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 85,
            left: tooltip.x - 60,
            background: "#e0ebff",
            border: "1px solid #c2d6ff",
            borderRadius: 14,
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 500,
            color: "#1e3a8a",
            boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
            pointerEvents: "none",
            zIndex: 10,
            lineHeight: "1.6",
            minWidth: 140,
          }}
        >
          <div style={{ opacity: 0.8 }}>Revenue : ${tooltip.data.revenue.toLocaleString()}</div>
          <div style={{ opacity: 0.8 }}>Profite : ${tooltip.data.profit.toLocaleString()}</div>
          <div style={{ opacity: 0.8 }}>Expense : ${tooltip.data.expense.toLocaleString()}</div>
          {/* Tooltip arrow tail */}
          <div style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 12,
            height: 12,
            background: "#e0ebff",
            borderRight: "1px solid #c2d6ff",
            borderBottom: "1px solid #c2d6ff",
          }} />
        </div>
      )}
    </div>
  );
}

function DonutRing({ pct, color, size = 36, stroke = 4 }: any) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

export default function DashboardPreview() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  const card = {
    background: "white",
    borderRadius: 14,
    padding: "16px 18px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f4",
  };

  const label = {
    fontSize: 11,
    color: "#94a3b8",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.02em",
    marginBottom: 6,
  };

  const bigNum = {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  };

  const upBadge = {
    fontSize: 11,
    fontWeight: 600,
    color: "#22c55e",
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    gap: 2,
  };

  const downBadge = {
    ...upBadge,
    color: "#ef4444",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* Premium Blue Glow backdrop */}
      <div
        style={{
          position: "absolute",
          inset: "-100px",
          background: "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      {/* Main card */}
      <div
        style={{
          background: "#f4f7ff",
          borderRadius: 24,
          padding: 20,
          width: "100%",
          maxWidth: 620,
          boxShadow: "0px 0px 220px 0px rgba(197, 221, 255, 1)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Top KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] mb-[10px]">
          {/* Revenue */}
          <div style={card}>
            <div style={label}>Revenue</div>
            <div style={bigNum}>$128,400</div>
            <div style={upBadge}><span>↑</span> +12.5%</div>
          </div>
          {/* Profit */}
          <div style={card}>
            <div style={label}>Profit</div>
            <div style={bigNum}>$32,800</div>
            <div style={upBadge}><span>↑</span> +8.2%</div>
          </div>
          {/* Expenses */}
          <div style={card}>
            <div style={label}>Expenses</div>
            <div style={bigNum}>$95,600</div>
            <div style={downBadge}><span>↓</span> -3.1%</div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div style={{ ...card, marginBottom: 10, border: "none", borderTop: "0.73px solid rgba(26, 21, 83, 0.08)", backgroundColor: "#ffffff", overflow: "hidden", padding: 0 }}>
          <div style={{ padding: "16px 18px 0 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>
              Revenue Trend
            </div>
            <LineChart data={monthlyData} />
          </div>
        </div>

        {/* Cash metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] mb-[10px]">
          <div style={{ ...card, height: 59, padding: "12px", borderRadius: 10, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ ...label, fontSize: 12, marginBottom: 4, lineHeight: "16px", fontWeight: 500 }}>Cash Burn Rate</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", lineHeight: "1" }}>-$10,400</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>/ Month</span>
            </div>
          </div>
          <div style={{ ...card, height: 59, padding: "12px", borderRadius: 10, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ ...label, fontSize: 12, marginBottom: 4, lineHeight: "16px", fontWeight: 500 }}>Cash Runway</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", lineHeight: "1" }}>10.00</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>/ Month</span>
            </div>
          </div>
          <div style={{ ...card, height: 59, padding: "12px", borderRadius: 10, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ ...label, fontSize: 12, marginBottom: 4, lineHeight: "16px", fontWeight: 500 }}>Cash in Hand</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", lineHeight: "1" }}>$95,600</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", display: "flex", alignItems: "center", gap: 1 }}>
                ↑ +12.4%
              </span>
            </div>
          </div>
        </div>

        {/* Forecast + Budget row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mb-[10px]">
          {/* Forecast */}
          <div style={card}>
            <div style={label}>Forecast</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ ...bigNum, fontSize: 22 }}>$5,600 M</div>
              <div style={{ ...upBadge, fontSize: 13 }}>↑ 94%</div>
            </div>
          </div>

          {/* Budget vs Actual vs Forecast */}
          <div style={card}>
            <div style={label}>Budget vs Actual vs Forecast</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <DonutRing pct={80} color="#2563eb" size={36} stroke={5} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>80%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <DonutRing pct={75} color="#2563eb" size={36} stroke={5} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>75%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <DonutRing pct={100} color="#2563eb" size={36} stroke={5} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div
          style={{
            background: "#eff6ff",
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid #dbeafe",
          }}
        >
          <div
            style={{
              width: 38, height: 38,
              borderRadius: 10,
              background: "#2563eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L19 7L15.45 11.91L21 14L15.45 16.09L19 21L13.09 15.74L12 22L10.91 15.74L5 21L8.55 16.09L3 14L8.55 11.91L5 7L10.91 8.26L12 2Z"
                fill="white" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a", marginBottom: 2 }}>
              AI Insight
            </div>
            <div style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.5 }}>
              Revenue increased 12% over the last 3 months driven by higher client retention.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}