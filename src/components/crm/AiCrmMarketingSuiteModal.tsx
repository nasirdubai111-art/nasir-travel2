import React, { useState } from "react";
import {
  Zap,
  MessageSquare,
  Kanban,
  Activity,
  Globe,
  Video,
  Award,
  Mail,
  Sparkles,
  Coins,
  FileSpreadsheet,
  ShieldCheck,
  ArrowLeft,
  X,
  ExternalLink,
  Sliders,
  CheckCircle,
} from "lucide-react";
import { AiAutomationDripEngine } from "./AiAutomationDripEngine";
import { WhatsAppCloudCrmDesk } from "./WhatsAppCloudCrmDesk";
import { CrmDealPipelineKanban } from "./CrmDealPipelineKanban";
import { MetaAdsCapiSuite } from "./MetaAdsCapiSuite";
import { GoogleAdsPerformanceMax } from "./GoogleAdsPerformanceMax";
import { InstagramReelsStudio } from "./InstagramReelsStudio";
import { OrganicSeoHub } from "./OrganicSeoHub";
import { OmnichannelEmailMarketing } from "./OmnichannelEmailMarketing";
import { AiContentEngineSuite } from "./AiContentEngineSuite";
import { B2bTelesalesCommissionHub } from "./B2bTelesalesCommissionHub";
import { CsvIngestStudio } from "./CsvIngestStudio";
import { RbacSecurityAuditStream } from "./RbacSecurityAuditStream";

import { CrmEnterpriseMasterPage } from "./enterprise/CrmEnterpriseMasterPage";
import { UserCheck } from "lucide-react";

export type CrmSuiteTab =
  | "enterprise_crm"
  | "automation"
  | "whatsapp"
  | "pipeline"
  | "meta_ads"
  | "google_ads"
  | "reels"
  | "seo"
  | "email"
  | "ai_content"
  | "telesales"
  | "csv_ingest"
  | "rbac_audit";

interface AiCrmMarketingSuiteProps {
  initialTab?: CrmSuiteTab;
  onOpenStandalone?: () => void;
}

export function AiCrmMarketingSuite({
  initialTab = "enterprise_crm",
  onOpenStandalone,
}: AiCrmMarketingSuiteProps) {
  const [activeTab, setActiveTab] = useState<CrmSuiteTab>(initialTab);

  const TABS: { id: CrmSuiteTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "enterprise_crm", label: "CRM Hierarchy (6 Entities)", icon: <UserCheck className="w-4 h-4 text-purple-400" />, badge: "leads & notes" },
    { id: "whatsapp", label: "WhatsApp Cloud CRM", icon: <MessageSquare className="w-4 h-4" />, badge: "Live" },
    { id: "pipeline", label: "Deal Pipeline (Kanban)", icon: <Kanban className="w-4 h-4" />, badge: "₹1.8Cr" },
    { id: "automation", label: "AI Automation Drips", icon: <Zap className="w-4 h-4" /> },
    { id: "meta_ads", label: "Meta Ads & CAPI", icon: <Activity className="w-4 h-4" />, badge: "8.9x" },
    { id: "google_ads", label: "Google PMax & Search", icon: <Globe className="w-4 h-4" /> },
    { id: "reels", label: "Instagram Reels Studio", icon: <Video className="w-4 h-4" />, badge: "9:16" },
    { id: "seo", label: "Organic SEO (13 Cats)", icon: <Award className="w-4 h-4" />, badge: "#1" },
    { id: "email", label: "Omnichannel Email", icon: <Mail className="w-4 h-4" /> },
    { id: "ai_content", label: "AI Content Engine", icon: <Sparkles className="w-4 h-4" /> },
    { id: "telesales", label: "B2B & Telesales Hub", icon: <Coins className="w-4 h-4" /> },
    { id: "csv_ingest", label: "CSV Lead Ingestion", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "rbac_audit", label: "RBAC & Audit Stream", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-emerald-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {onOpenStandalone && (
          <button
            onClick={onOpenStandalone}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch Standalone Dashboard</span>
          </button>
        )}
      </div>

      {/* Render Active Module */}
      <div className="animate-in fade-in duration-200">
        {activeTab === "enterprise_crm" && (
          <CrmEnterpriseMasterPage onOpenWhatsAppDesk={() => setActiveTab("whatsapp")} />
        )}
        {activeTab === "whatsapp" && <WhatsAppCloudCrmDesk />}
        {activeTab === "pipeline" && <CrmDealPipelineKanban />}
        {activeTab === "automation" && <AiAutomationDripEngine />}
        {activeTab === "meta_ads" && <MetaAdsCapiSuite />}
        {activeTab === "google_ads" && <GoogleAdsPerformanceMax />}
        {activeTab === "reels" && <InstagramReelsStudio />}
        {activeTab === "seo" && <OrganicSeoHub />}
        {activeTab === "email" && <OmnichannelEmailMarketing />}
        {activeTab === "ai_content" && <AiContentEngineSuite />}
        {activeTab === "telesales" && <B2bTelesalesCommissionHub />}
        {activeTab === "csv_ingest" && <CsvIngestStudio />}
        {activeTab === "rbac_audit" && <RbacSecurityAuditStream />}
      </div>
    </div>
  );
}

interface AiCrmMarketingSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToAdminConsole?: () => void;
  initialTab?: CrmSuiteTab;
}

export function AiCrmMarketingSuiteModal({
  isOpen,
  onClose,
  onBackToAdminConsole,
  initialTab = "whatsapp",
}: AiCrmMarketingSuiteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden text-slate-100">
      {/* Top Standalone Header */}
      <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          {onBackToAdminConsole && (
            <button
              onClick={onBackToAdminConsole}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
              title="Return to Admin Console"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Console</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  BharatYatra AI Automation, WhatsApp CRM &amp; Growth Suite
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Separate Dashboard
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dedicated Executive Console • WhatsApp Cloud API • Meta CAPI • Google PMax • 13 Verticals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Live Agent Desk</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
        <AiCrmMarketingSuite initialTab={initialTab} />
      </main>
    </div>
  );
}
