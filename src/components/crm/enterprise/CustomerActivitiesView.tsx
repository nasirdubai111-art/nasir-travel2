import React, { useState } from "react";
import {
  CustomerActivityEntity,
  ActivityType,
  CrmLeadEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  Activity,
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  Calendar,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowUpRight,
  ShieldCheck,
  Send,
} from "lucide-react";

interface CustomerActivitiesViewProps {
  activities: CustomerActivityEntity[];
  leads: CrmLeadEntity[];
  onRefresh: () => void;
  onSelectLeadById?: (leadId: string) => void;
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  "Inquiry Received": <Send className="w-4 h-4 text-emerald-400" />,
  "Outbound Call": <Phone className="w-4 h-4 text-cyan-400" />,
  "WhatsApp Sent": <MessageSquare className="w-4 h-4 text-emerald-400" />,
  "Quotation Shared": <FileText className="w-4 h-4 text-purple-400" />,
  "Itinerary Downloaded": <FileText className="w-4 h-4 text-indigo-400" />,
  "Payment Link Clicked": <CreditCard className="w-4 h-4 text-amber-400" />,
  "Deposit Received": <CreditCard className="w-4 h-4 text-emerald-400" />,
  "Follow-up Scheduled": <Calendar className="w-4 h-4 text-amber-400" />,
  "Status Changed": <ArrowUpRight className="w-4 h-4 text-blue-400" />,
  "Note Added": <FileText className="w-4 h-4 text-pink-400" />,
  "Tag Assigned": <CheckCircle2 className="w-4 h-4 text-teal-400" />,
};

export const CustomerActivitiesView: React.FC<CustomerActivitiesViewProps> = ({
  activities,
  leads,
  onRefresh,
  onSelectLeadById,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Activity Form
  const [formData, setFormData] = useState<{
    customer_id: string;
    lead_id: string;
    activity_type: ActivityType;
    description: string;
    performed_by: string;
    channel: CustomerActivityEntity["channel"];
  }>({
    customer_id: leads[0]?.customer_id || "CUST-5001",
    lead_id: leads[0]?.lead_id || "LEAD-1001",
    activity_type: "Outbound Call",
    description: "",
    performed_by: "Rahul Sharma",
    channel: "Phone",
  });

  const handleLeadSelect = (leadId: string) => {
    const selected = leads.find((l) => l.lead_id === leadId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        lead_id: selected.lead_id,
        customer_id: selected.customer_id,
      }));
    }
  };

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    CrmService.addActivity(formData);
    setIsLogModalOpen(false);
    onRefresh();
    setFormData((prev) => ({
      ...prev,
      description: "",
    }));
  };

  const filtered = activities.filter((a) => {
    const matchSearch =
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.activity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lead_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.performed_by.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = selectedType === "all" || a.activity_type === selectedType;
    const matchChannel = selectedChannel === "all" || a.channel === selectedChannel;

    return matchSearch && matchType && matchChannel;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Entity Hierarchy Breadcrumb */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">customer_activities</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Omnichannel Customer Journey &amp; Activity Stream</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs border border-teal-500/30">
              {activities.length} Recorded Events
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit logging of touchpoints, phone calls, WhatsApp messages, quotes, and payment milestones
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Activity Event</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search activity description, activity_id, customer_id, performed_by..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Activity Types</option>
            <option value="Inquiry Received">Inquiry Received</option>
            <option value="Outbound Call">Outbound Call</option>
            <option value="WhatsApp Sent">WhatsApp Sent</option>
            <option value="Quotation Shared">Quotation Shared</option>
            <option value="Payment Link Clicked">Payment Link Clicked</option>
            <option value="Deposit Received">Deposit Received</option>
            <option value="Follow-up Scheduled">Follow-up Scheduled</option>
            <option value="Status Changed">Status Changed</option>
            <option value="Note Added">Note Added</option>
          </select>

          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="App Web">App Web</option>
            <option value="System Automation">System Automation</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filtered.map((act) => {
            const icon = ACTIVITY_ICONS[act.activity_type] || <Activity className="w-4 h-4 text-slate-400" />;
            const leadMatch = leads.find((l) => l.lead_id === act.lead_id);

            return (
              <div key={act.activity_id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-teal-400 transition-colors">
                  {icon}
                </div>

                {/* Content Box */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{act.activity_type}</span>
                      <span className="px-2 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/40 text-[10px] font-mono text-cyan-300">
                        {act.customer_id}
                      </span>
                      <button
                        onClick={() => onSelectLeadById && onSelectLeadById(act.lead_id)}
                        className="px-2 py-0.2 rounded bg-indigo-950/80 border border-indigo-800/40 text-[10px] font-mono text-indigo-300 hover:bg-indigo-800/50 cursor-pointer"
                      >
                        {act.lead_id}
                      </button>
                      {leadMatch && (
                        <span className="text-[11px] text-slate-400">
                          ({leadMatch.customer_name})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      {act.channel && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {act.channel}
                        </span>
                      )}
                      <span>{act.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 border-t border-slate-800/40">
                    <span className="font-mono text-slate-500">ID: {act.activity_id}</span>
                    <span className="text-slate-300">Logged by: <strong className="text-teal-400">{act.performed_by}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Activity Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  <span>Log Customer Activity Event</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Register customer interactions to audit timeline
                </p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Lead &amp; Customer *</label>
                <select
                  value={formData.lead_id}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.lead_id} value={l.lead_id}>
                      {l.lead_id} ({l.customer_id}) — {l.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Activity Type *</label>
                  <select
                    value={formData.activity_type}
                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value as ActivityType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Outbound Call">Outbound Call</option>
                    <option value="WhatsApp Sent">WhatsApp Sent</option>
                    <option value="Quotation Shared">Quotation Shared</option>
                    <option value="Itinerary Downloaded">Itinerary Downloaded</option>
                    <option value="Payment Link Clicked">Payment Link Clicked</option>
                    <option value="Deposit Received">Deposit Received</option>
                    <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Phone">Phone</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="App Web">App Web</option>
                    <option value="System Automation">System Automation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Performed By</label>
                <input
                  type="text"
                  required
                  value={formData.performed_by}
                  onChange={(e) => setFormData({ ...formData, performed_by: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description / Outcome *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of call or action taken..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md shadow-teal-600/30"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
