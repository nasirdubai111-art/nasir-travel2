import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart3,
  Info,
  ShieldCheck,
  Percent,
  RefreshCw,
} from "lucide-react";
import {
  MONTHLY_RECONCILIATION_VARIANCES,
  MonthlyReconciliationVariance,
} from "../../data/gstrFilingHistoryData";

interface TaxReconciliationSummaryCardProps {
  onSelectPeriod?: (periodId: string) => void;
}

export function TaxReconciliationSummaryCard({ onSelectPeriod }: TaxReconciliationSummaryCardProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMonthData, setSelectedMonthData] = useState<MonthlyReconciliationVariance | null>(
    MONTHLY_RECONCILIATION_VARIANCES[MONTHLY_RECONCILIATION_VARIANCES.length - 1]
  );
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyReconciliationVariance | null>(null);
  const [chartMetric, setChartMetric] = useState<"COMPARISON" | "VARIANCE">("COMPARISON");

  // Summary figures
  const totalTaxCollected = MONTHLY_RECONCILIATION_VARIANCES.reduce((sum, item) => sum + item.taxCollectedExpectedINR, 0);
  const totalTaxFiled = MONTHLY_RECONCILIATION_VARIANCES.reduce((sum, item) => sum + item.taxFiledPortalINR, 0);
  const totalVariance = MONTHLY_RECONCILIATION_VARIANCES.reduce((sum, item) => sum + item.varianceINR, 0);
  const overallAccuracy = ((1 - totalVariance / totalTaxCollected) * 100).toFixed(2);

  // D3 Chart rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerWidth = containerRef.current.clientWidth || 700;
    const height = 280;
    const margin = { top: 30, right: 35, bottom: 45, left: 55 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("width", containerWidth)
      .attr("height", height)
      .attr("viewBox", `0 0 ${containerWidth} ${height}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = MONTHLY_RECONCILIATION_VARIANCES;

    // X Scale
    const x0Scale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.28);

    if (chartMetric === "COMPARISON") {
      // Comparison of Tax Collected vs Tax Filed (in ₹ Lakhs)
      const maxVal = (d3.max(data, (d) => Math.max(d.taxCollectedExpectedINR, d.taxFiledPortalINR)) || 6000000) / 100000;
      
      const yScale = d3
        .scaleLinear()
        .domain([0, maxVal * 1.15])
        .nice()
        .range([innerHeight, 0]);

      // Sub-scale for grouped bars
      const xSubScale = d3
        .scaleBand()
        .domain(["collected", "filed"])
        .range([0, x0Scale.bandwidth()])
        .padding(0.12);

      // Grid lines
      g.append("g")
        .attr("class", "grid")
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => "")
        )
        .selectAll("line")
        .attr("stroke", "#1e293b")
        .attr("stroke-dasharray", "3 3");

      g.select(".grid .domain").remove();

      // Groups for each month
      const monthGroups = g
        .selectAll(".month-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "month-group")
        .attr("transform", (d) => `translate(${x0Scale(d.month) || 0},0)`)
        .style("cursor", "pointer")
        .on("mouseenter", (_, d) => setHoveredMonth(d))
        .on("mouseleave", () => setHoveredMonth(null))
        .on("click", (_, d) => {
          setSelectedMonthData(d);
          if (onSelectPeriod) onSelectPeriod(d.periodId);
        });

      // Bar 1: Tax Collected (Indigo)
      monthGroups
        .append("rect")
        .attr("x", () => xSubScale("collected") || 0)
        .attr("y", (d) => yScale(d.taxCollectedExpectedINR / 100000))
        .attr("width", xSubScale.bandwidth())
        .attr("height", (d) => Math.max(0, innerHeight - yScale(d.taxCollectedExpectedINR / 100000)))
        .attr("fill", "#6366f1")
        .attr("rx", 4)
        .attr("opacity", (d) => (hoveredMonth && hoveredMonth.month !== d.month ? 0.45 : 0.95))
        .transition()
        .duration(400);

      // Bar 2: Tax Filed (Emerald)
      monthGroups
        .append("rect")
        .attr("x", () => xSubScale("filed") || 0)
        .attr("y", (d) => yScale(d.taxFiledPortalINR / 100000))
        .attr("width", xSubScale.bandwidth())
        .attr("height", (d) => Math.max(0, innerHeight - yScale(d.taxFiledPortalINR / 100000)))
        .attr("fill", "#10b981")
        .attr("rx", 4)
        .attr("opacity", (d) => (hoveredMonth && hoveredMonth.month !== d.month ? 0.45 : 0.95))
        .transition()
        .duration(400);

      // Variance warning pill indicator above bars if discrepancy exists
      monthGroups
        .filter((d) => d.varianceINR !== 0)
        .append("circle")
        .attr("cx", x0Scale.bandwidth() / 2)
        .attr("cy", (d) => yScale(d.taxCollectedExpectedINR / 100000) - 12)
        .attr("r", 5)
        .attr("fill", "#f59e0b")
        .attr("stroke", "#78350f")
        .attr("stroke-width", 1.5);

      // X Axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x0Scale))
        .selectAll("text")
        .attr("font-size", "11px")
        .attr("fill", "#94a3b8")
        .attr("font-family", "ui-monospace, monospace")
        .attr("dy", "1em");

      // Y Axis
      g.append("g")
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickFormat((d) => `₹${d}L`)
        )
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("fill", "#94a3b8")
        .attr("font-family", "ui-monospace, monospace");

      // Axes Styling
      g.selectAll(".domain").attr("stroke", "#334155");
      g.selectAll(".tick line").attr("stroke", "#334155");

    } else {
      // Month-Over-Month Variance Chart (₹ Thousands)
      const minVar = Math.min(0, d3.min(data, (d) => d.varianceINR / 1000) || 0);
      const maxVar = Math.max(6, d3.max(data, (d) => d.varianceINR / 1000) || 6);

      const yVarScale = d3
        .scaleLinear()
        .domain([minVar * 1.2, maxVar * 1.25])
        .nice()
        .range([innerHeight, 0]);

      // Zero baseline line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yVarScale(0))
        .attr("y2", yVarScale(0))
        .attr("stroke", "#475569")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4 2");

      // Bars for variance
      g.selectAll(".var-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "var-bar")
        .attr("x", (d) => x0Scale(d.month) || 0)
        .attr("width", x0Scale.bandwidth())
        .attr("y", (d) => (d.varianceINR >= 0 ? yVarScale(d.varianceINR / 1000) : yVarScale(0)))
        .attr("height", (d) => Math.abs(yVarScale(d.varianceINR / 1000) - yVarScale(0)))
        .attr("fill", (d) => (d.varianceINR === 0 ? "#10b981" : "#f59e0b"))
        .attr("rx", 3)
        .attr("opacity", 0.9)
        .style("cursor", "pointer")
        .on("mouseenter", (_, d) => setHoveredMonth(d))
        .on("mouseleave", () => setHoveredMonth(null))
        .on("click", (_, d) => setSelectedMonthData(d));

      // Value label on top of bar
      g.selectAll(".var-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "var-label")
        .attr("x", (d) => (x0Scale(d.month) || 0) + x0Scale.bandwidth() / 2)
        .attr("y", (d) => (d.varianceINR >= 0 ? yVarScale(d.varianceINR / 1000) - 6 : yVarScale(0) + 14))
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "ui-monospace, monospace")
        .attr("fill", (d) => (d.varianceINR === 0 ? "#10b981" : "#f59e0b"))
        .attr("font-weight", "bold")
        .text((d) => (d.varianceINR === 0 ? "₹0 (Reconciled)" : `+₹${d.varianceINR.toLocaleString("en-IN")}`));

      // X Axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x0Scale))
        .selectAll("text")
        .attr("font-size", "11px")
        .attr("fill", "#94a3b8")
        .attr("font-family", "ui-monospace, monospace")
        .attr("dy", "1em");

      // Y Axis
      g.append("g")
        .call(
          d3
            .axisLeft(yVarScale)
            .ticks(4)
            .tickFormat((d) => `₹${d}k`)
        )
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("fill", "#94a3b8")
        .attr("font-family", "ui-monospace, monospace");

      g.selectAll(".domain").attr("stroke", "#334155");
      g.selectAll(".tick line").attr("stroke", "#334155");
    }
  }, [chartMetric, hoveredMonth, onSelectPeriod]);

  return (
    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white tracking-tight">
                Tax Reconciliation Summary (MoM Variance)
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                D3 ENGINE POWERED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Month-over-month variance visualization comparing expected tax collected from bookings vs. tax filed on statutory returns.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setChartMetric("COMPARISON")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                chartMetric === "COMPARISON"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tax Collected vs. Filed
            </button>
            <button
              onClick={() => setChartMetric("VARIANCE")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                chartMetric === "VARIANCE"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Variance Delta (MoM)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Tax Collected</span>
          <span className="text-base font-black text-indigo-400 font-mono">
            ₹{(totalTaxCollected / 100000).toFixed(2)} Lakhs
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Booking transaction ledger</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Tax Declared / Filed</span>
          <span className="text-base font-black text-emerald-400 font-mono">
            ₹{(totalTaxFiled / 100000).toFixed(2)} Lakhs
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Statutory GSTR-1 &amp; 3B</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Net MoM Variance</span>
          <span className={`text-base font-black font-mono ${totalVariance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            ₹{totalVariance.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {totalVariance === 0 ? "100% Fully Matched" : "Timing delta under review"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Reconciliation Precision</span>
          <span className="text-base font-black text-white font-mono">
            {overallAccuracy}%
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            Statutory Safe Harbor Compliant
          </span>
        </div>
      </div>

      {/* D3 Chart Container */}
      <div ref={containerRef} className="relative w-full pt-1">
        <svg ref={svgRef} className="w-full overflow-visible"></svg>

        {/* Chart Legend */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-3 border-t border-slate-900 text-xs">
          {chartMetric === "COMPARISON" ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500"></span>
                <span className="text-slate-300 text-[11px]">Expected Tax Collected (Bookings)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-slate-300 text-[11px]">Tax Filed on GSTN Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-800"></span>
                <span className="text-amber-300 text-[11px]">Discrepancy Marker</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-slate-300 text-[11px]">Zero Variance (Perfect Match)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500"></span>
                <span className="text-slate-300 text-[11px]">Positive Discrepancy (Review Required)</span>
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 italic">
            Click any month bar to inspect ledger entries &amp; variance audit breakdown
          </div>
        </div>
      </div>

      {/* Drill-down Inspection for Selected Month */}
      {selectedMonthData && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <strong className="text-white font-mono text-sm">{selectedMonthData.month} Reconciliation Audit</strong>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedMonthData.reconciliationStatus === "FULLY_RECONCILED"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}>
                {selectedMonthData.reconciliationStatus === "FULLY_RECONCILED" ? "MATCHED & VERIFIED" : "DISCREPANCY FLAGGED"}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Aggregated Entries: <strong className="text-slate-200">{selectedMonthData.ledgerEntriesCount}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Expected Tax from Bookings</span>
              <strong className="text-indigo-400">₹{selectedMonthData.taxCollectedExpectedINR.toLocaleString("en-IN")}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Tax Declared on GSTR</span>
              <strong className="text-emerald-400">₹{selectedMonthData.taxFiledPortalINR.toLocaleString("en-IN")}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Variance Delta</span>
              <strong className={selectedMonthData.varianceINR === 0 ? "text-emerald-400" : "text-amber-400"}>
                ₹{selectedMonthData.varianceINR.toLocaleString("en-IN")} ({selectedMonthData.varianceRatePercent}%)
              </strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            <strong>Audit Note:</strong> {selectedMonthData.auditNotes}
          </p>
        </div>
      )}
    </div>
  );
}
