import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  BarChart3,
  LineChart as LineChartIcon,
  Calendar,
  DollarSign,
  Download,
  Info,
} from "lucide-react";

export interface DailySettlementDataPoint {
  date: string;
  displayDate: string;
  fullDate: string;
  settled: number;
  failed: number;
  settledCount: number;
  failedCount: number;
  settlementRate: number;
}

// Generate deterministic 30-day time-series history
export function generate30DaySettlementTrend(): DailySettlementDataPoint[] {
  const points: DailySettlementDataPoint[] = [];
  const now = new Date();

  // 30 days baseline with realistic variance, weekend patterns, and spikes
  const baseSettled = [
    215000, 248000, 290000, 265000, 310000, 385000, 420000, // Week 1
    230000, 255000, 275000, 298000, 340000, 450000, 490000, // Week 2
    240000, 280000, 315000, 305000, 360000, 480000, 520000, // Week 3
    270000, 295000, 330000, 350000, 395000, 510000, 560000, // Week 4
    380000, 445000, // Final 2 days
  ];

  const baseFailed = [
    8500, 12000, 9400, 15000, 11200, 18500, 22000,
    9800, 11500, 14000, 10800, 16200, 24500, 26000,
    11000, 13400, 15800, 12600, 19000, 27000, 29500,
    12500, 14200, 16800, 15400, 21000, 28000, 31000,
    18200, 22400,
  ];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const index = 29 - i;
    const settledAmount = baseSettled[index] || 250000;
    const failedAmount = baseFailed[index] || 12000;

    const total = settledAmount + failedAmount;
    const rate = Number(((settledAmount / total) * 100).toFixed(1));
    const settledTxns = Math.floor(settledAmount / (4500 + (index % 5) * 800));
    const failedTxns = Math.max(1, Math.floor(failedAmount / (6000 + (index % 3) * 1200)));

    const monthName = d.toLocaleDateString("en-IN", { month: "short" });
    const day = d.getDate().toString().padStart(2, "0");

    points.push({
      date: `${day} ${monthName}`,
      displayDate: `${day} ${monthName}`,
      fullDate: d.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      settled: settledAmount,
      failed: failedAmount,
      settledCount: settledTxns,
      failedCount: failedTxns,
      settlementRate: rate,
    });
  }

  return points;
}

interface RazorpaySettlementTrendChartProps {
  customData?: DailySettlementDataPoint[];
}

export function RazorpaySettlementTrendChart({ customData }: RazorpaySettlementTrendChartProps) {
  const [timeRange, setTimeRange] = useState<"7D" | "14D" | "30D">("30D");
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const fullData = useMemo(() => {
    return customData && customData.length > 0 ? customData : generate30DaySettlementTrend();
  }, [customData]);

  const filteredData = useMemo(() => {
    if (timeRange === "7D") return fullData.slice(-7);
    if (timeRange === "14D") return fullData.slice(-14);
    return fullData;
  }, [fullData, timeRange]);

  const summary = useMemo(() => {
    const totalSettled = filteredData.reduce((acc, curr) => acc + curr.settled, 0);
    const totalFailed = filteredData.reduce((acc, curr) => acc + curr.failed, 0);
    const totalSettledCount = filteredData.reduce((acc, curr) => acc + curr.settledCount, 0);
    const totalFailedCount = filteredData.reduce((acc, curr) => acc + curr.failedCount, 0);
    const overallRate =
      totalSettled + totalFailed > 0
        ? ((totalSettled / (totalSettled + totalFailed)) * 100).toFixed(1)
        : "100.0";

    return {
      totalSettled,
      totalFailed,
      totalSettledCount,
      totalFailedCount,
      overallRate,
    };
  }, [filteredData]);

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Full Date",
      "Settled Amount (INR)",
      "Failed Amount (INR)",
      "Settled Transactions",
      "Failed Transactions",
      "Settlement Success Rate (%)",
    ];

    const rows = filteredData.map((d) => [
      d.displayDate,
      `"${d.fullDate}"`,
      d.settled,
      d.failed,
      d.settledCount,
      d.failedCount,
      `${d.settlementRate}%`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `razorpay_settlement_trend_${timeRange.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: DailySettlementDataPoint = payload[0]?.payload;
      if (!dataPoint) return null;

      return (
        <div className="bg-slate-950 border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-sans min-w-[240px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {dataPoint.fullDate}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-3xs font-bold border border-emerald-500/30">
              {dataPoint.settlementRate}% Cleared
            </span>
          </div>

          <div className="space-y-2">
            {/* Settled */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span>Settled Amount:</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                ₹{dataPoint.settled.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Failed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0"></span>
                <span>Failed Amount:</span>
              </div>
              <span className="font-mono font-bold text-rose-400">
                ₹{dataPoint.failed.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Counts Breakdown */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-3xs text-slate-400 font-mono">
              <span>
                <strong className="text-emerald-300">{dataPoint.settledCount}</strong> successful
              </span>
              <span>
                <strong className="text-rose-300">{dataPoint.failedCount}</strong> failed
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="razorpay-settlement-trend-container"
      className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4"
    >
      {/* HEADER & TIME CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Daily Settlement &amp; Failure Trend (Last 30 Days)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-3xs font-mono font-bold border border-emerald-500/30">
                  {summary.overallRate}% Success Rate
                </span>
              </h3>
              <p className="text-2xs text-slate-400">
                Daily comparison of settled merchant funds vs gateway failed/reversed transactions
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Time Range Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            {(["7D", "14D", "30D"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                  timeRange === range
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range === "7D" ? "7 Days" : range === "14D" ? "14 Days" : "30 Days"}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`p-1.5 rounded-lg text-3xs transition-all ${
                chartType === "area"
                  ? "bg-slate-800 text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title="Area Trend Chart"
            >
              <LineChartIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded-lg text-3xs transition-all ${
                chartType === "bar"
                  ? "bg-slate-800 text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title="Bar Comparison Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CSV Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-3xs font-bold border border-slate-800 transition-colors"
            title="Download Daily Settlement Trend to CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
          <div className="flex items-center justify-between text-3xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settled Volume ({timeRange})
            </span>
            <span className="text-slate-500 font-mono">{summary.totalSettledCount} txns</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-1">
            ₹{summary.totalSettled.toLocaleString("en-IN")}
          </div>
          <div className="text-3xs text-slate-400 mt-0.5">
            Auto-disbursed via RazorpayX Route
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-rose-500/30">
          <div className="flex items-center justify-between text-3xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
              Failed / Reversed Volume
            </span>
            <span className="text-slate-500 font-mono">{summary.totalFailedCount} txns</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-rose-400 font-mono mt-1">
            ₹{summary.totalFailed.toLocaleString("en-IN")}
          </div>
          <div className="text-3xs text-slate-400 mt-0.5">
            Bank timeouts &amp; payment reversals
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-blue-500/30">
          <div className="flex items-center justify-between text-3xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-blue-400">
              <TrendingUp className="w-3.5 h-3.5" />
              Net Clearance Rate
            </span>
            <span className="text-emerald-400 font-bold font-mono">T+0 Switch</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-blue-300 font-mono mt-1">
            {summary.overallRate}%
          </div>
          <div className="text-3xs text-slate-400 mt-0.5">
            Gateway uptime exceeds 99.9%
          </div>
        </div>
      </div>

      {/* RECHARTS DAILY TREND VISUALIZATION */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="settledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} vertical={false} />

              <XAxis
                dataKey="displayDate"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                interval={timeRange === "30D" ? 3 : timeRange === "14D" ? 1 : 0}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />

              <Tooltip content={<CustomTooltipContent />} />

              <Legend
                verticalAlign="top"
                align="right"
                height={30}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "0px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-300 font-semibold text-2xs mr-2">{value}</span>
                )}
              />

              <Area
                type="monotone"
                dataKey="settled"
                name="Settled Amount (₹)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#settledGradient)"
                activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
              />

              <Area
                type="monotone"
                dataKey="failed"
                name="Failed Amount (₹)"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#failedGradient)"
                activeDot={{ r: 4, fill: "#f43f5e", stroke: "#ffffff", strokeWidth: 1.5 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} vertical={false} />

              <XAxis
                dataKey="displayDate"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                interval={timeRange === "30D" ? 3 : timeRange === "14D" ? 1 : 0}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />

              <Tooltip content={<CustomTooltipContent />} />

              <Legend
                verticalAlign="top"
                align="right"
                height={30}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-300 font-semibold text-2xs mr-2">{value}</span>
                )}
              />

              <Bar
                dataKey="settled"
                name="Settled Amount (₹)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="failed"
                name="Failed Amount (₹)"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* FOOTER ANNOTATION */}
      <div className="flex items-center justify-between text-3xs text-slate-500 pt-2 border-t border-slate-900 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Real-time webhook sync enabled with Razorpay Settlement Engine &amp; RBI compliance guidelines.</span>
        </div>
        <span className="font-mono text-slate-400">Timezone: Asia/Kolkata (IST)</span>
      </div>
    </div>
  );
}
