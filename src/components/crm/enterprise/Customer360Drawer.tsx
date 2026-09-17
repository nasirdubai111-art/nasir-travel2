import React, { useState } from "react";
import {
  CrmLeadEntity,
  CustomerNoteEntity,
  CustomerActivityEntity,
  CustomerContactEntity,
  CustomerTagEntity,
  FollowUpEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  Star,
  Activity,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Customer360DrawerProps {
  lead: CrmLeadEntity;
  notes: CustomerNoteEntity[];
  activities: CustomerActivityEntity[];
  contacts: CustomerContactEntity[];
  tags: CustomerTagEntity[];
  followUps: FollowUpEntity[];
  onClose: () => void;
  onRefresh: () => void;
}

export const Customer360Drawer: React.FC<Customer360DrawerProps> = ({
  lead,
  notes,
  activities,
  contacts,
  tags,
  followUps,
  onClose,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "notes" | "activities" | "contacts" | "tags" | "followups"
  >("overview");

  // Filter entities specifically for this lead & customer
  const customerNotes = notes.filter(
    (n) => n.customer_id === lead.customer_id || n.lead_id === lead.lead_id
  );
  const customerActivities = activities.filter(
    (a) => a.customer_id === lead.customer_id || a.lead_id === lead.lead_id
  );
  const customerContacts = contacts.filter((c) => c.customer_id === lead.customer_id);
  const customerTags = tags.filter((t) => t.customer_id === lead.customer_id);
  const customerFollowUps = followUps.filter(
    (f) => f.customer_id === lead.customer_id || f.lead_id === lead.lead_id
  );

  // Quick inline note creation
  const [quickNoteText, setQuickNoteText] = useState("");
  const [quickNoteImportant, setQuickNoteImportant] = useState(false);

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;

    CrmService.addNote({
      customer_id: lead.customer_id,
      lead_id: lead.lead_id,
      note: quickNoteText,
      note_type: "Call Summary",
      is_important: quickNoteImportant,
      created_by: lead.assigned_to,
    });
    setQuickNoteText("");
    setQuickNoteImportant(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header with IDs and Badges */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black">
              {lead.customer_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">{lead.customer_name}</h3>
                <span className="px-2 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-[10px] font-mono text-cyan-300 font-bold">
                  {lead.customer_id}
                </span>
                <span className="px-2 py-0.2 rounded bg-indigo-950 border border-indigo-800 text-[10px] font-mono text-indigo-300 font-bold">
                  {lead.lead_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lead.destination} • ₹{lead.deal_value.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              {lead.status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              activeSubTab === "overview"
                ? "bg-indigo-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab("notes")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === "notes"
                ? "bg-purple-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Notes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {customerNotes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("activities")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === "activities"
                ? "bg-teal-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Activities</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {customerActivities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("contacts")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === "contacts"
                ? "bg-cyan-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Contacts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {customerContacts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("tags")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === "tags"
                ? "bg-pink-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Tags</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {customerTags.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("followups")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === "followups"
                ? "bg-amber-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Follow-ups</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {customerFollowUps.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. OVERVIEW TAB */}
          {activeSubTab === "overview" && (
            <div className="space-y-4">
              {/* Lead Snapshot Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lead Information
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">lead_id</span>
                    <span className="font-mono text-indigo-400 font-bold">{lead.lead_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">customer_id</span>
                    <span className="font-mono text-cyan-300 font-bold">{lead.customer_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">source</span>
                    <span className="text-white font-semibold">{lead.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">status</span>
                    <span className="text-emerald-400 font-bold">{lead.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">assigned_to</span>
                    <span className="text-slate-200">{lead.assigned_to}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Deal Value</span>
                    <span className="text-amber-400 font-bold">
                      ₹{lead.deal_value.toLocaleString("en-IN")} ({lead.category})
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags Assigned */}
              {customerTags.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-400">Assigned Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {customerTags.map((t) => (
                      <span
                        key={t.tag_id}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30"
                      >
                        {t.tag_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Note Input */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Quick Log Note</span>
                </div>
                <form onSubmit={handleAddQuickNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={quickNoteText}
                    onChange={(e) => setQuickNoteText(e.target.value)}
                    placeholder="Type a quick note or phone call observation..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quickNoteImportant}
                        onChange={(e) => setQuickNoteImportant(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Mark Important</span>
                    </label>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                    >
                      Post Note
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Important Notes Preview */}
              {customerNotes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>Critical Notes ({customerNotes.length})</span>
                    <button
                      onClick={() => setActiveSubTab("notes")}
                      className="text-[11px] text-purple-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {customerNotes.slice(0, 3).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl bg-slate-950 border text-xs ${
                        n.is_important ? "border-amber-500/40" : "border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-purple-300">{n.note_type}</span>
                        <span>{n.created_at}</span>
                      </div>
                      <p className="text-slate-200">{n.note}</p>
                      <div className="text-[10px] text-slate-500 mt-1">by {n.created_by}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. NOTES TAB */}
          {activeSubTab === "notes" && (
            <div className="space-y-3">
              {customerNotes.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl bg-slate-950 border text-xs space-y-1.5 ${
                    n.is_important ? "border-amber-500/50 shadow-md shadow-amber-950/20" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {n.note_type}
                    </span>
                    {n.is_important && (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 leading-relaxed">{n.note}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>Logged by: <strong className="text-slate-300">{n.created_by}</strong></span>
                    <span>{n.created_at}</span>
                  </div>
                </div>
              ))}
              {customerNotes.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">No notes logged for this customer.</div>
              )}
            </div>
          )}

          {/* 3. ACTIVITIES TAB */}
          {activeSubTab === "activities" && (
            <div className="space-y-3">
              {customerActivities.map((act) => (
                <div key={act.activity_id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-teal-400">{act.activity_type}</span>
                    <span>{act.timestamp}</span>
                  </div>
                  <p className="text-slate-200">{act.description}</p>
                  <div className="text-[10px] text-slate-500">
                    Channel: {act.channel} • Performed by: {act.performed_by}
                  </div>
                </div>
              ))}
              {customerActivities.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">No activities recorded.</div>
              )}
            </div>
          )}

          {/* 4. CONTACTS TAB */}
          {activeSubTab === "contacts" && (
            <div className="space-y-3">
              {customerContacts.map((c) => (
                <div key={c.contact_id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{c.full_name}</span>
                    {c.is_primary && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400">{c.designation_or_relation}</div>
                  <div className="text-slate-300 font-mono">{c.phone}</div>
                  {c.email && <div className="text-slate-400">{c.email}</div>}
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${c.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30"
                    >
                      Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. TAGS TAB */}
          {activeSubTab === "tags" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {customerTags.map((t) => (
                  <div
                    key={t.tag_id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 w-full"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                        {t.tag_name}
                      </span>
                      <span className="text-[10px] text-slate-500">{t.category}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Added by: {t.added_by} on {t.created_at}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FOLLOW-UPS TAB */}
          {activeSubTab === "followups" && (
            <div className="space-y-3">
              {customerFollowUps.map((f) => (
                <div key={f.follow_up_id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{f.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {f.status}
                    </span>
                  </div>
                  {f.notes && <p className="text-slate-300">{f.notes}</p>}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Due: <strong className="text-amber-400 font-mono">{f.due_date}</strong></span>
                    <span>Assigned: {f.assigned_to}</span>
                  </div>
                </div>
              ))}
              {customerFollowUps.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">No pending follow-ups for this customer.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
