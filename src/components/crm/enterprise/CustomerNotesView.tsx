import React, { useState } from "react";
import {
  CustomerNoteEntity,
  NoteType,
  CrmLeadEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  FileText,
  Star,
  Plus,
  Trash2,
  Tag,
  Filter,
  User,
  Clock,
  Pin,
  Sparkles,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  Search,
} from "lucide-react";

interface CustomerNotesViewProps {
  notes: CustomerNoteEntity[];
  leads: CrmLeadEntity[];
  onRefresh: () => void;
  onSelectLeadById?: (leadId: string) => void;
}

const NOTE_TYPE_BADGES: Record<NoteType, { bg: string; text: string; border: string }> = {
  "Special Requirement": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  "Travel Preference": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  "Call Summary": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  "WhatsApp Interaction": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Budget & Quotation": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "Payment & Billing": { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
  "Complaint / Escalation": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  "Internal Memo": { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
};

export const CustomerNotesView: React.FC<CustomerNotesViewProps> = ({
  notes,
  leads,
  onRefresh,
  onSelectLeadById,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterImportantOnly, setFilterImportantOnly] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // New Note Form
  const [formData, setFormData] = useState<{
    customer_id: string;
    lead_id: string;
    note: string;
    note_type: NoteType;
    is_important: boolean;
    created_by: string;
  }>({
    customer_id: leads[0]?.customer_id || "CUST-5001",
    lead_id: leads[0]?.lead_id || "LEAD-1001",
    note: "",
    note_type: "Special Requirement",
    is_important: true,
    created_by: "Rahul Sharma",
  });

  const handleLeadSelectInForm = (leadId: string) => {
    const selected = leads.find((l) => l.lead_id === leadId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        lead_id: selected.lead_id,
        customer_id: selected.customer_id,
      }));
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.note.trim()) {
      alert("Note content cannot be empty.");
      return;
    }

    CrmService.addNote(formData);
    setIsAddNoteModalOpen(false);
    onRefresh();
    setFormData((prev) => ({
      ...prev,
      note: "",
      is_important: false,
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      CrmService.deleteNote(id);
      onRefresh();
    }
  };

  const handleToggleImportance = (id: string) => {
    CrmService.toggleNoteImportance(id);
    onRefresh();
  };

  const filteredNotes = notes.filter((n) => {
    const matchSearch =
      n.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.lead_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.created_by.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = filterType === "all" || n.note_type === filterType;
    const matchImportance = !filterImportantOnly || n.is_important;

    return matchSearch && matchType && matchImportance;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Entity Hierarchy Breadcrumb */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">customer_notes</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Customer Memos, Preferences &amp; Critical Notes</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
              {notes.length} Notes Logged
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict schema enforcement: <span className="text-purple-300 font-mono">customer_id</span>,{" "}
            <span className="text-purple-300 font-mono">lead_id</span>,{" "}
            <span className="text-purple-300 font-mono">note</span>,{" "}
            <span className="text-purple-300 font-mono">note_type</span>,{" "}
            <span className="text-purple-300 font-mono">is_important</span>, and{" "}
            <span className="text-purple-300 font-mono">created_by</span>
          </p>
        </div>

        <button
          onClick={() => setIsAddNoteModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Customer Note</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search notes content, customer_id, lead_id, or created_by..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All note_types</option>
            <option value="Special Requirement">Special Requirement</option>
            <option value="Travel Preference">Travel Preference</option>
            <option value="Call Summary">Call Summary</option>
            <option value="WhatsApp Interaction">WhatsApp Interaction</option>
            <option value="Budget & Quotation">Budget & Quotation</option>
            <option value="Payment & Billing">Payment & Billing</option>
            <option value="Complaint / Escalation">Complaint / Escalation</option>
            <option value="Internal Memo">Internal Memo</option>
          </select>

          <button
            onClick={() => setFilterImportantOnly(!filterImportantOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              filterImportantOnly
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-950 text-slate-400 border-slate-700 hover:text-white"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterImportantOnly ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>Important Only</span>
          </button>
        </div>
      </div>

      {/* Notes Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((item) => {
          const badge = NOTE_TYPE_BADGES[item.note_type] || NOTE_TYPE_BADGES["Internal Memo"];
          const leadMatch = leads.find((l) => l.lead_id === item.lead_id);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-slate-950 border transition-all relative flex flex-col justify-between ${
                item.is_important
                  ? "border-amber-500/40 shadow-lg shadow-amber-950/20"
                  : "border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Header with IDs and Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 font-bold">
                      {item.customer_id}
                    </span>
                    <button
                      onClick={() => onSelectLeadById && onSelectLeadById(item.lead_id)}
                      className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/40 text-[10px] font-mono text-indigo-300 font-bold hover:bg-indigo-800/50 cursor-pointer"
                    >
                      {item.lead_id}
                    </button>
                    {leadMatch && (
                      <span className="text-[11px] font-semibold text-slate-300">
                        {leadMatch.customer_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleImportance(item.id)}
                      className={`p-1 rounded-md transition-colors ${
                        item.is_important
                          ? "text-amber-400 hover:text-amber-300"
                          : "text-slate-600 hover:text-slate-400"
                      }`}
                      title={item.is_important ? "Mark as normal note" : "Mark as important"}
                    >
                      <Star className={`w-4 h-4 ${item.is_important ? "fill-amber-400" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* note_type badge & is_important pill */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {item.note_type}
                  </span>
                  {item.is_important && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[9px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      CRITICAL NOTE
                    </span>
                  )}
                </div>

                {/* note body */}
                <p className="text-xs text-slate-200 leading-relaxed pt-1 whitespace-pre-wrap">
                  {item.note}
                </p>
              </div>

              {/* Footer with created_by and created_at */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold text-slate-300">{item.created_by}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{item.created_at}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
          No customer notes found matching the selected filters.
        </div>
      )}

      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>Log Customer Note</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Associate notes with <span className="font-mono text-cyan-300">customer_id</span> and{" "}
                  <span className="font-mono text-indigo-300">lead_id</span>
                </p>
              </div>
              <button
                onClick={() => setIsAddNoteModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3.5 text-xs">
              {/* Lead & Customer Selection */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Lead &amp; Customer *</label>
                <select
                  value={formData.lead_id}
                  onChange={(e) => handleLeadSelectInForm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.lead_id} value={l.lead_id}>
                      {l.lead_id} ({l.customer_id}) — {l.customer_name} — {l.destination}
                    </option>
                  ))}
                </select>
              </div>

              {/* note_type and created_by */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">note_type *</label>
                  <select
                    value={formData.note_type}
                    onChange={(e) => setFormData({ ...formData, note_type: e.target.value as NoteType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Special Requirement">Special Requirement</option>
                    <option value="Travel Preference">Travel Preference</option>
                    <option value="Call Summary">Call Summary</option>
                    <option value="WhatsApp Interaction">WhatsApp Interaction</option>
                    <option value="Budget & Quotation">Budget & Quotation</option>
                    <option value="Payment & Billing">Payment & Billing</option>
                    <option value="Complaint / Escalation">Complaint / Escalation</option>
                    <option value="Internal Memo">Internal Memo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">created_by *</label>
                  <input
                    type="text"
                    required
                    value={formData.created_by}
                    onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                    placeholder="Agent name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Note Content */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">note Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Record customer preferences, meal requests, elderly assistance, quotation agreements, flight seat preferences..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* is_important toggle */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>is_important Flag</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Pins this note to the top of customer profile and alerts operational staff.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_important}
                  onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
