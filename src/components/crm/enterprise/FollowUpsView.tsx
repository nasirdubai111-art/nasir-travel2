import React, { useState } from "react";
import {
  FollowUpEntity,
  FollowUpPriority,
  FollowUpStatus,
  CrmLeadEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Search,
  User,
  Phone,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface FollowUpsViewProps {
  followUps: FollowUpEntity[];
  leads: CrmLeadEntity[];
  onRefresh: () => void;
  onSelectLeadById?: (leadId: string) => void;
}

const PRIORITY_BADGES: Record<FollowUpPriority, { bg: string; text: string; border: string }> = {
  Urgent: { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/40" },
  High: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40" },
  Medium: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/40" },
  Low: { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/40" },
};

const STATUS_BADGES: Record<FollowUpStatus, { bg: string; text: string; border: string }> = {
  Pending: { bg: "bg-blue-500/10", text: "text-blue-300", border: "border-blue-500/30" },
  Completed: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
  Overdue: { bg: "bg-rose-500/10", text: "text-rose-300", border: "border-rose-500/30" },
  Rescheduled: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30" },
};

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followUps,
  leads,
  onRefresh,
  onSelectLeadById,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    customer_id: string;
    lead_id: string;
    title: string;
    due_date: string;
    priority: FollowUpPriority;
    status: FollowUpStatus;
    assigned_to: string;
    notes: string;
    reminder_channel: FollowUpEntity["reminder_channel"];
  }>({
    customer_id: leads[0]?.customer_id || "CUST-5001",
    lead_id: leads[0]?.lead_id || "LEAD-1001",
    title: "",
    due_date: "2026-09-18 11:00",
    priority: "High",
    status: "Pending",
    assigned_to: "Rahul Sharma",
    notes: "",
    reminder_channel: "WhatsApp Alert",
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Follow-up title is required.");
      return;
    }

    CrmService.addFollowUp(formData);
    setIsAddModalOpen(false);
    onRefresh();
    setFormData((prev) => ({
      ...prev,
      title: "",
      notes: "",
    }));
  };

  const handleMarkComplete = (id: string) => {
    CrmService.markFollowUpComplete(id);
    onRefresh();
  };

  const handleReschedule = (id: string) => {
    const newDate = prompt("Enter new due date (e.g. 2026-09-20 15:00):");
    if (newDate) {
      CrmService.updateFollowUp(id, {
        due_date: newDate,
        status: "Rescheduled",
      });
      onRefresh();
    }
  };

  const filtered = followUps.filter((f) => {
    const matchSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.follow_up_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.lead_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.assigned_to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = selectedStatus === "all" || f.status === selectedStatus;
    const matchPriority = selectedPriority === "all" || f.priority === selectedPriority;

    return matchSearch && matchStatus && matchPriority;
  });

  const overdueCount = followUps.filter((f) => f.status === "Overdue").length;
  const pendingCount = followUps.filter((f) => f.status === "Pending" || f.status === "Rescheduled").length;
  const completedCount = followUps.filter((f) => f.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Entity Hierarchy Breadcrumb */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">follow_ups</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Scheduled Follow-ups &amp; Action Reminders</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30">
              {followUps.length} Total Tasks
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage callback SLAs, proposal negotiations, document verifications, and VIP darshan clearances
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Follow-up</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Active &amp; Pending Tasks</span>
          </div>
          <div className="text-xl font-black text-white mt-1">{pendingCount}</div>
          <div className="text-[10px] text-blue-400">Scheduled within agent queues</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Overdue Reminders</span>
          </div>
          <div className="text-xl font-black text-rose-400 mt-1">{overdueCount}</div>
          <div className="text-[10px] text-rose-500/80">Requires immediate attention</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed Follow-ups</span>
          </div>
          <div className="text-xl font-black text-emerald-400 mt-1">{completedCount}</div>
          <div className="text-[10px] text-emerald-500/80">SLA targets achieved</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search follow-up title, lead_id, customer_id, assigned_to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Follow-up Tasks List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const prio = PRIORITY_BADGES[item.priority] || PRIORITY_BADGES["Medium"];
          const stat = STATUS_BADGES[item.status] || STATUS_BADGES["Pending"];
          const leadMatch = leads.find((l) => l.lead_id === item.lead_id);

          return (
            <div
              key={item.follow_up_id}
              className={`p-4 rounded-2xl bg-slate-950 border transition-all flex flex-wrap items-center justify-between gap-4 ${
                item.status === "Overdue"
                  ? "border-rose-500/40 bg-gradient-to-r from-rose-950/20 to-slate-950 shadow-md shadow-rose-950/20"
                  : item.status === "Completed"
                  ? "border-slate-800/60 opacity-80"
                  : "border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                    {item.follow_up_id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 font-bold">
                    {item.customer_id}
                  </span>
                  <button
                    onClick={() => onSelectLeadById && onSelectLeadById(item.lead_id)}
                    className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/40 text-[10px] font-mono text-indigo-300 font-bold hover:bg-indigo-800/50 cursor-pointer"
                  >
                    {item.lead_id}
                  </button>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${prio.bg} ${prio.text} ${prio.border}`}
                  >
                    {item.priority}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${stat.bg} ${stat.text} ${stat.border}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="font-bold text-white text-sm">{item.title}</div>

                {item.notes && (
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {item.notes}
                  </p>
                )}

                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assigned: <strong className="text-slate-200">{item.assigned_to}</strong></span>
                  </div>
                  {leadMatch && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <span>•</span>
                      <span>{leadMatch.customer_name} ({leadMatch.destination})</span>
                    </div>
                  )}
                  {item.reminder_channel && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] text-slate-500 font-mono">
                      {item.reminder_channel}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Due Date & Actions */}
              <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due: {item.due_date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.status !== "Completed" && (
                    <button
                      onClick={() => handleMarkComplete(item.follow_up_id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleReschedule(item.follow_up_id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    title="Change due date"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Follow-up Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Schedule Customer Follow-up</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Set deadline reminder for call, quotation, or payment
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Lead &amp; Customer *</label>
                <select
                  value={formData.lead_id}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.lead_id} value={l.lead_id}>
                      {l.lead_id} ({l.customer_id}) — {l.customer_name} ({l.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Task Title / Action Item *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Call client regarding Kedarnath helicopter slot clearance"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Due Date &amp; Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    placeholder="YYYY-MM-DD HH:mm"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as FollowUpPriority })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Assigned Agent</label>
                  <input
                    type="text"
                    required
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Reminder Channel</label>
                  <select
                    value={formData.reminder_channel}
                    onChange={(e) => setFormData({ ...formData, reminder_channel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="WhatsApp Alert">WhatsApp Alert</option>
                    <option value="Email Reminder">Email Reminder</option>
                    <option value="Push Notification">Push Notification</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Task Context &amp; Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional context or requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
