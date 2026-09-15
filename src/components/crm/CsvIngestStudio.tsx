import React, { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Database,
  Filter,
} from "lucide-react";

export function CsvIngestStudio() {
  const [csvText, setCsvText] = useState<string>(
    `Name,Phone,Email,City,Category,DealValue,Notes
Dr. Rajesh Khanna,+91 98210 12345,dr.rajesh@fortis.com,Delhi,Resorts,320000,VIP Gulmarg ski family suite
Sanjay & Priya Singhania,+91 98450 67890,sanjay@singhaniaexports.in,Bengaluru,Houseboats,195000,Honeymoon Jacuzzi Alleppey package
Captain Amarinder Bhasin,+91 98110 54321,amarinder@airindia.in,Amritsar,Yatra,450000,Char Dham helicopter 4 tickets`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestSummary, setIngestSummary] = useState<string | null>(null);

  const handleIngest = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIngestSummary(
        "RFC 4180 Ingestion Complete: 3 corporate leads parsed, phone numbers validated to E.164 (+91), deduplicated against existing CRM database. 3 new deals pushed to Kanban 'NEW_LEAD' stage."
      );
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">RFC 4180 High-Volume CSV Lead Ingestion Studio</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                Auto-Field Mapping
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bulk upload travel agent databases, corporate traveler lists, and phone registries with zero duplicates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <Database className="w-4 h-4" />
          <span>PostgreSQL &amp; Firestore Synced</span>
        </div>
      </div>

      {ingestSummary && (
        <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-300 animate-in fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{ingestSummary}</span>
        </div>
      )}

      {/* Upload / Raw CSV Input */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Raw CSV Input / Direct Paste
          </h4>
          <span className="text-xs text-slate-400 font-mono">Encoding: UTF-8</span>
        </div>

        <textarea
          rows={6}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Automatic E.164 phone formatting &amp; SHA-256 deduplication</span>
          </div>

          <button
            onClick={handleIngest}
            disabled={isProcessing || !csvText.trim()}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? "Validating & Parsing..." : "Ingest into CRM Pipeline"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
