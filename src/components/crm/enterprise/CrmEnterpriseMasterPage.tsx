import React, { useState, useEffect } from "react";
import {
  CrmSubSection,
  CrmLeadEntity,
  CustomerNoteEntity,
  CustomerActivityEntity,
  CustomerContactEntity,
  CustomerTagEntity,
  FollowUpEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import { CrmLeadsView } from "./CrmLeadsView";
import { CustomerNotesView } from "./CustomerNotesView";
import { CustomerActivitiesView } from "./CustomerActivitiesView";
import { CustomerContactsView } from "./CustomerContactsView";
import { CustomerTagsView } from "./CustomerTagsView";
import { FollowUpsView } from "./FollowUpsView";
import { Customer360Drawer } from "./Customer360Drawer";
import { CrmSettingsView } from "./CrmSettingsView";
import { CrmAgentAlertToast } from "./CrmAgentAlertToast";
import {
  UserCheck,
  FileText,
  Activity,
  Users,
  Tag,
  Calendar,
  LayoutDashboard,
  RotateCcw,
  Download,
  Search,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Bell,
  Settings,
} from "lucide-react";

interface CrmEnterpriseMasterPageProps {
  initialSubSection?: CrmSubSection;
  onOpenWhatsAppDesk?: () => void;
}

export const CrmEnterpriseMasterPage: React.FC<CrmEnterpriseMasterPageProps> = ({
  initialSubSection = "dashboard",
  onOpenWhatsAppDesk,
}) => {
  const [activeTab, setActiveTab] = useState<CrmSubSection>(initialSubSection);

  // Core CRM Datasets
  const [leads, setLeads] = useState<CrmLeadEntity[]>([]);
  const [notes, setNotes] = useState<CustomerNoteEntity[]>([]);
  const [activities, setActivities] = useState<CustomerActivityEntity[]>([]);
  const [contacts, setContacts] = useState<CustomerContactEntity[]>([]);
  const [tags, setTags] = useState<CustomerTagEntity[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpEntity[]>([]);

  // Selected Lead for Customer 360 View
  const [selectedLeadFor360, setSelectedLeadFor360] = useState<CrmLeadEntity | null>(null);

  const loadData = () => {
    setLeads(CrmService.getLeads());
    setNotes(CrmService.getNotes());
    setActivities(CrmService.getActivities());
    setContacts(CrmService.getContacts());
    setTags(CrmService.getTags());
    setFollowUps(CrmService.getFollowUps());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("bharatyatra:crm-updated", handleUpdate);
    return () => window.removeEventListener("bharatyatra:crm-updated", handleUpdate);
  }, []);

  const handleSelectLeadById = (leadId: string) => {
    const target = leads.find((l) => l.lead_id === leadId);
    if (target) {
      setSelectedLeadFor360(target);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all CRM modules to initial default travel dataset?")) {
      CrmService.resetToDefaults();
      loadData();
    }
  };

  const handleExportJson = () => {
    const data = {
      exported_at: new Date().toISOString(),
      leads,
      customer_notes: notes,
      customer_activities: activities,
      customer_contacts: contacts,
      customer_tags: tags,
      follow_ups: followUps,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bharatyatra-crm-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const totalPipelineValue = leads.reduce((acc, l) => acc + l.deal_value, 0);
  const overdueFollowUps = followUps.filter((f) => f.status === "Overdue");
  const importantNotes = notes.filter((n) => n.is_important);

  const TABS: { id: CrmSubSection; label: string; icon: React.ReactNode; count?: number; badge?: string }[] = [
    {
      id: "dashboard",
      label: "CRM Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "leads",
      label: "leads",
      icon: <UserCheck className="w-4 h-4 text-indigo-400" />,
      count: leads.length,
      badge: "Core",
    },
    {
      id: "customer_notes",
      label: "customer_notes",
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      count: notes.length,
      badge: `${importantNotes.length} Critical`,
    },
    {
      id: "customer_activities",
      label: "customer_activities",
      icon: <Activity className="w-4 h-4 text-teal-400" />,
      count: activities.length,
    },
    {
      id: "customer_contacts",
      label: "customer_contacts",
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      count: contacts.length,
    },
    {
      id: "customer_tags",
      label: "customer_tags",
      icon: <Tag className="w-4 h-4 text-pink-400" />,
      count: tags.length,
    },
    {
      id: "follow_ups",
      label: "follow_ups",
      icon: <Calendar className="w-4 h-4 text-amber-400" />,
      count: followUps.length,
      badge: overdueFollowUps.length > 0 ? `${overdueFollowUps.length} Overdue` : undefined,
    },
    {
      id: "crm_settings",
      label: "crm_settings",
      icon: <Bell className="w-4 h-4 text-purple-400" />,
      badge: "Alerts",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Realtime Floating Agent Alert Toast */}
      <CrmAgentAlertToast onSelectLead={(lead) => setSelectedLeadFor360(lead)} />

      {/* Master CRM Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
              CRM Engine v2.6
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Enterprise Multi-tenant Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Customer Relationship &amp; Lead Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete relational CRM data hierarchy managing traveler leads, persistent notes, activity audit logs, multi-channel contacts, behavioral tags, and scheduled callback follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export JSON snapshot"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Snapshot</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset seeds to initial Indian travel data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seeds</span>
          </button>

          {onOpenWhatsAppDesk && (
            <button
              onClick={onOpenWhatsAppDesk}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>WhatsApp Live Desk</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Sub-Navigation Bar matching User's Exact Tree Hierarchy */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto no-scrollbar shadow-inner">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-md shadow-indigo-600/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              {tab.icon}
              <span className={tab.id !== "dashboard" ? "font-mono font-bold" : ""}>
                {tab.label}
              </span>
              {typeof tab.count === "number" && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    tab.badge.includes("Overdue")
                      ? "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                      : isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-SECTION 1: DASHBOARD OVERVIEW */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Overdue Alert Banner if any */}
          {overdueFollowUps.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-950 border border-rose-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {overdueFollowUps.length} Overdue Follow-up Task{overdueFollowUps.length > 1 ? "s" : ""}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Callback and document clearances have breached scheduled SLA. Review now.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("follow_ups")}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                Review Tasks
              </button>
            </div>
          )}

          {/* Quick Stat Blocks for all entities */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* leads stat */}
            <div
              onClick={() => setActiveTab("leads")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-indigo-400 flex items-center justify-between">
                <span>leads</span>
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5">{leads.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">₹{(totalPipelineValue / 100000).toFixed(1)}L Pipeline</div>
            </div>

            {/* customer_notes stat */}
            <div
              onClick={() => setActiveTab("customer_notes")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-purple-400 flex items-center justify-between">
                <span>customer_notes</span>
                <FileText className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5">{notes.length}</div>
              <div className="text-[10px] text-purple-300 mt-0.5">{importantNotes.length} Critical Notes</div>
            </div>

            {/* customer_activities stat */}
            <div
              onClick={() => setActiveTab("customer_activities")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-teal-500/30 hover:border-teal-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-teal-400 flex items-center justify-between">
                <span>activities</span>
                <Activity className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5">{activities.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Audit Events</div>
            </div>

            {/* customer_contacts stat */}
            <div
              onClick={() => setActiveTab("customer_contacts")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                <span>contacts</span>
                <Users className="w-3.5 h-3.5 text-cyan-300" />
              </div>
              <div className="text-xl font-black text-white mt-1.5">{contacts.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Address Book</div>
            </div>

            {/* customer_tags stat */}
            <div
              onClick={() => setActiveTab("customer_tags")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-pink-500/30 hover:border-pink-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-pink-400 flex items-center justify-between">
                <span>customer_tags</span>
                <Tag className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5">{tags.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Segments Defined</div>
            </div>

            {/* follow_ups stat */}
            <div
              onClick={() => setActiveTab("follow_ups")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-amber-400 flex items-center justify-between">
                <span>follow_ups</span>
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5">{followUps.length}</div>
              <div className="text-[10px] text-amber-400 mt-0.5">
                {followUps.filter((f) => f.status === "Pending").length} Pending
              </div>
            </div>

            {/* crm_settings stat */}
            <div
              onClick={() => setActiveTab("crm_settings")}
              className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-mono text-purple-400 flex items-center justify-between">
                <span>agent_alerts</span>
                <Bell className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-base font-black text-white mt-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Alerts ON</span>
              </div>
              <div className="text-[10px] text-purple-300 mt-0.5">Auto Notification</div>
            </div>
          </div>

          {/* Two-column layout: High Priority Leads & Recent Critical Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Leads Summary */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Active High-Intent Leads</h4>
                </div>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs text-indigo-400 hover:underline font-semibold"
                >
                  View All leads &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.lead_id}
                    onClick={() => setSelectedLeadFor360(lead)}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/50 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{lead.customer_name}</span>
                        <span className="font-mono text-[10px] text-indigo-300">{lead.lead_id}</span>
                        <span className="font-mono text-[10px] text-cyan-300">{lead.customer_id}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.destination} • ₹{lead.deal_value.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Notes & Tasks Summary */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-white">Critical Customer Notes</h4>
                </div>
                <button
                  onClick={() => setActiveTab("customer_notes")}
                  className="text-xs text-purple-400 hover:underline font-semibold"
                >
                  View All customer_notes &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {importantNotes.slice(0, 4).map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-amber-500/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-cyan-300">{note.customer_id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="font-bold text-purple-300">{note.note_type}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{note.created_at}</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {note.note}
                    </p>
                    <div className="text-[10px] text-slate-400">Author: {note.created_by}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: LEADS */}
      {activeTab === "leads" && (
        <CrmLeadsView
          leads={leads}
          onSelectLead={(lead) => setSelectedLeadFor360(lead)}
          onRefresh={loadData}
          onOpenSettings={() => setActiveTab("crm_settings")}
        />
      )}

      {/* SUB-SECTION 3: CUSTOMER_NOTES */}
      {activeTab === "customer_notes" && (
        <CustomerNotesView
          notes={notes}
          leads={leads}
          onRefresh={loadData}
          onSelectLeadById={handleSelectLeadById}
        />
      )}

      {/* SUB-SECTION 4: CUSTOMER_ACTIVITIES */}
      {activeTab === "customer_activities" && (
        <CustomerActivitiesView
          activities={activities}
          leads={leads}
          onRefresh={loadData}
          onSelectLeadById={handleSelectLeadById}
        />
      )}

      {/* SUB-SECTION 5: CUSTOMER_CONTACTS */}
      {activeTab === "customer_contacts" && (
        <CustomerContactsView
          contacts={contacts}
          leads={leads}
          onRefresh={loadData}
        />
      )}

      {/* SUB-SECTION 6: CUSTOMER_TAGS */}
      {activeTab === "customer_tags" && (
        <CustomerTagsView
          tags={tags}
          leads={leads}
          onRefresh={loadData}
        />
      )}

      {/* SUB-SECTION 7: FOLLOW_UPS */}
      {activeTab === "follow_ups" && (
        <FollowUpsView
          followUps={followUps}
          leads={leads}
          onRefresh={loadData}
          onSelectLeadById={handleSelectLeadById}
        />
      )}

      {/* SUB-SECTION 8: CRM_SETTINGS (Automated Agent Notifications) */}
      {activeTab === "crm_settings" && (
        <CrmSettingsView
          onSelectLeadById={handleSelectLeadById}
          onOpenLeads={() => setActiveTab("leads")}
        />
      )}

      {/* UNIFIED CUSTOMER 360 DRAWER */}
      {selectedLeadFor360 && (
        <Customer360Drawer
          lead={selectedLeadFor360}
          notes={notes}
          activities={activities}
          contacts={contacts}
          tags={tags}
          followUps={followUps}
          onClose={() => setSelectedLeadFor360(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
};
