import React, { useState } from "react";
import {
  CrmLeadEntity,
  LeadStatus,
  LeadSource,
  LeadPriority,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  UserCheck,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Building,
  Bell,
  Smartphone,
  Settings,
  Zap,
} from "lucide-react";

interface CrmLeadsViewProps {
  leads: CrmLeadEntity[];
  onSelectLead: (lead: CrmLeadEntity) => void;
  onRefresh: () => void;
  onOpenSettings?: () => void;
}

const PRIORITY_BADGES: Record<LeadPriority, { bg: string; text: string; border: string }> = {
  Urgent: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  High: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  Medium: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  Low: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
};

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  Contacted: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  Qualified: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  "Proposal Sent": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  Negotiation: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "Closed Won": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Closed Lost": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
};

const SOURCE_BADGES: Record<LeadSource, string> = {
  WhatsApp: "bg-emerald-900/40 text-emerald-300 border-emerald-500/30",
  "Meta Ads": "bg-blue-900/40 text-blue-300 border-blue-500/30",
  "Google Search": "bg-red-900/40 text-red-300 border-red-500/30",
  "Organic SEO": "bg-teal-900/40 text-teal-300 border-teal-500/30",
  "Direct App": "bg-indigo-900/40 text-indigo-300 border-indigo-500/30",
  Telesales: "bg-amber-900/40 text-amber-300 border-amber-500/30",
  "Partner Portal": "bg-purple-900/40 text-purple-300 border-purple-500/30",
  Referral: "bg-pink-900/40 text-pink-300 border-pink-500/30",
};

export const CrmLeadsView: React.FC<CrmLeadsViewProps> = ({
  leads,
  onSelectLead,
  onRefresh,
  onOpenSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const notificationSettings = CrmService.getSettings();

  // Form state for creating a new lead
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "+91 ",
    customer_email: "",
    city: "New Delhi",
    destination: "",
    category: "Pilgrimage" as CrmLeadEntity["category"],
    source: "WhatsApp" as LeadSource,
    status: "New" as LeadStatus,
    priority: "High" as LeadPriority,
    assigned_to: "Rahul Sharma (Sr. Yatra Specialist)",
    deal_value: 125000,
    score: 85,
  });

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.lead_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.assigned_to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = selectedStatus === "all" || lead.status === selectedStatus;
    const matchSource = selectedSource === "all" || lead.source === selectedSource;
    const matchPriority = selectedPriority === "all" || (lead.priority || "Medium") === selectedPriority;

    return matchSearch && matchStatus && matchSource && matchPriority;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.destination) {
      alert("Please enter customer name and destination.");
      return;
    }

    CrmService.addLead(formData);
    setIsNewLeadModalOpen(false);
    onRefresh();
    // Reset form
    setFormData({
      customer_name: "",
      customer_phone: "+91 ",
      customer_email: "",
      city: "New Delhi",
      destination: "",
      category: "Pilgrimage",
      source: "WhatsApp",
      status: "New",
      priority: "High",
      assigned_to: "Rahul Sharma (Sr. Yatra Specialist)",
      deal_value: 125000,
      score: 85,
    });
  };

  const handleStatusChange = (lead_id: string, newStatus: LeadStatus) => {
    CrmService.updateLead(lead_id, { status: newStatus });
    onRefresh();
  };

  const totalValue = leads.reduce((acc, l) => acc + l.deal_value, 0);
  const wonValue = leads
    .filter((l) => l.status === "Closed Won")
    .reduce((acc, l) => acc + l.deal_value, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Entity Hierarchy Breadcrumb */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">leads</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Travel Inquiries &amp; Deal Pipeline</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
              {leads.length} Total Records
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit tracking of <span className="text-indigo-300 font-mono font-semibold">lead_id</span>,{" "}
            <span className="text-indigo-300 font-mono font-semibold">customer_id</span>,{" "}
            <span className="text-indigo-300 font-mono font-semibold">source</span>,{" "}
            <span className="text-indigo-300 font-mono font-semibold">status</span>, and{" "}
            <span className="text-indigo-300 font-mono font-semibold">assigned_to</span>
          </p>
        </div>

        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Lead</span>
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400">Total Pipeline Value</div>
          <div className="text-lg font-black text-white mt-1">₹{(totalValue / 100000).toFixed(2)} Lakhs</div>
          <div className="text-[10px] text-indigo-400 font-medium">{leads.length} Active Leads</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400">Closed Won Deals</div>
          <div className="text-lg font-black text-emerald-400 mt-1">₹{(wonValue / 100000).toFixed(2)} Lakhs</div>
          <div className="text-[10px] text-emerald-500/80 font-medium">
            {leads.filter((l) => l.status === "Closed Won").length} Confirmed Bookings
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400">Under Negotiation</div>
          <div className="text-lg font-black text-amber-400 mt-1">
            {leads.filter((l) => l.status === "Negotiation" || l.status === "Proposal Sent").length}
          </div>
          <div className="text-[10px] text-amber-500/80 font-medium">High Probability Closure</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400">Avg Lead Score</div>
          <div className="text-lg font-black text-cyan-400 mt-1">
            {Math.round(leads.reduce((a, b) => a + b.score, 0) / (leads.length || 1))}/100
          </div>
          <div className="text-[10px] text-cyan-500/80 font-medium">AI Inbound Intent Rating</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by lead_id, customer_id, name, destination, agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Google Search">Google Search</option>
            <option value="Organic SEO">Organic SEO</option>
            <option value="Direct App">Direct App</option>
            <option value="Telesales">Telesales</option>
            <option value="Partner Portal">Partner Portal</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-purple-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Notification Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <th className="p-3.5 font-bold font-mono">lead_id</th>
                <th className="p-3.5 font-bold font-mono">customer_id</th>
                <th className="p-3.5 font-bold">Customer Details</th>
                <th className="p-3.5 font-bold">Package &amp; Deal</th>
                <th className="p-3.5 font-bold">Priority</th>
                <th className="p-3.5 font-bold font-mono">source</th>
                <th className="p-3.5 font-bold font-mono">status</th>
                <th className="p-3.5 font-bold font-mono">assigned_to</th>
                <th className="p-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLeads.map((lead) => {
                const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS["New"];
                const sourceBadge = SOURCE_BADGES[lead.source] || "bg-slate-800 text-slate-300";
                const priorityBadge = PRIORITY_BADGES[lead.priority || "Medium"] || PRIORITY_BADGES.Medium;

                return (
                  <tr
                    key={lead.lead_id}
                    className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectLead(lead)}
                  >
                    {/* lead_id */}
                    <td className="p-3.5 font-mono font-bold text-indigo-400">
                      <div className="flex items-center gap-1.5">
                        <span>{lead.lead_id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                      </div>
                    </td>

                    {/* customer_id */}
                    <td className="p-3.5 font-mono text-cyan-300 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                        {lead.customer_id}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-xs">{lead.customer_name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{lead.customer_phone}</span>
                        <span>•</span>
                        <span>{lead.city}</span>
                      </div>
                    </td>

                    {/* Package & Deal */}
                    <td className="p-3.5">
                      <div className="text-white font-medium text-xs max-w-[200px] truncate" title={lead.destination}>
                        {lead.destination}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                        ₹{lead.deal_value.toLocaleString("en-IN")}
                        <span className="text-[10px] text-slate-400 font-normal ml-1.5">({lead.category})</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}>
                        {lead.priority === "Urgent" && <Zap className="w-2.5 h-2.5 animate-pulse" />}
                        <span>{lead.priority || "Medium"}</span>
                      </span>
                    </td>

                    {/* source */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${sourceBadge}`}
                      >
                        {lead.source}
                      </span>
                    </td>

                    {/* status (with direct inline update) */}
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.lead_id, e.target.value as LeadStatus)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none cursor-pointer`}
                      >
                        <option value="New" className="bg-slate-900 text-white">New</option>
                        <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                        <option value="Qualified" className="bg-slate-900 text-white">Qualified</option>
                        <option value="Proposal Sent" className="bg-slate-900 text-white">Proposal Sent</option>
                        <option value="Negotiation" className="bg-slate-900 text-white">Negotiation</option>
                        <option value="Closed Won" className="bg-slate-900 text-white">Closed Won</option>
                        <option value="Closed Lost" className="bg-slate-900 text-white">Closed Lost</option>
                      </select>
                    </td>

                    {/* assigned_to */}
                    <td className="p-3.5">
                      <div className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                          {lead.assigned_to.charAt(0)}
                        </div>
                        <span className="max-w-[150px] truncate" title={lead.assigned_to}>
                          {lead.assigned_to}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold border border-indigo-500/40 transition-all flex items-center gap-1 ml-auto"
                      >
                        <span>Customer 360</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <span>Create New Travel Lead</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Generates sequential <span className="font-mono text-indigo-300">lead_id</span> and{" "}
                  <span className="font-mono text-cyan-300">customer_id</span>
                </p>
              </div>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="+91 98..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="client@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Customer Origin City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai / Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Destination &amp; Trip Package *</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Varanasi Ganga Aarti & Ayodhya Ram Mandir 4N/5D"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Pilgrimage">Pilgrimage</option>
                    <option value="Flights">Flights</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Resorts">Resorts</option>
                    <option value="Tours">Tours</option>
                    <option value="Trains">Trains</option>
                    <option value="Buses">Buses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">source *</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none font-mono"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Organic SEO">Organic SEO</option>
                    <option value="Direct App">Direct App</option>
                    <option value="Telesales">Telesales</option>
                    <option value="Partner Portal">Partner Portal</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none font-mono"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-purple-300 font-bold focus:outline-none"
                  >
                    <option value="Urgent">Urgent (Immediate SLA)</option>
                    <option value="High">High (Automated Alert)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">assigned_to *</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Rahul Sharma (Sr. Yatra Specialist)">Rahul Sharma (Sr. Yatra Specialist)</option>
                    <option value="Priya Patel (Luxury Lead)">Priya Patel (Luxury Lead)</option>
                    <option value="Vikram Rathore (Corporate MICE Desk)">Vikram Rathore (Corporate MICE Desk)</option>
                    <option value="Aisha Khan (Himalayan Specialist)">Aisha Khan (Himalayan Specialist)</option>
                    <option value="Tanvi Saxena (Inbound Desk)">Tanvi Saxena (Inbound Desk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Estimated Deal Value (₹ INR)</label>
                  <input
                    type="number"
                    value={formData.deal_value}
                    onChange={(e) => setFormData({ ...formData, deal_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dynamic Notification Automation Preview Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-purple-200">
                    <Bell className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>Automated Agent Notification Trigger</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      formData.priority === "High" || formData.priority === "Urgent"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {formData.priority === "High" || formData.priority === "Urgent" ? "WILL TRIGGER" : "STANDBY"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {formData.priority === "High" || formData.priority === "Urgent" ? (
                    <>
                      Assigned agent <strong className="text-white">{formData.assigned_to.split(" ")[0]}</strong> will receive automated alerts via:{" "}
                      <span className={notificationSettings.agentEmailNotification ? "text-cyan-300 font-bold" : "text-slate-500"}>
                        Email ({notificationSettings.agentEmailNotification ? "ON" : "OFF"})
                      </span>{" "}
                      and{" "}
                      <span className={notificationSettings.agentPushNotification ? "text-purple-300 font-bold" : "text-slate-500"}>
                        Push Notification ({notificationSettings.agentPushNotification ? "ON" : "OFF"})
                      </span>{" "}
                      immediately upon saving.
                    </>
                  ) : (
                    "Standard lead priority. High-priority automated agent notifications are bypassed unless priority is set to High or Urgent."
                  )}
                </p>

                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewLeadModalOpen(false);
                      onOpenSettings();
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium pt-0.5 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Manage automated notifications in CRM Suite Settings</span>
                  </button>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Save &amp; Generate Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
