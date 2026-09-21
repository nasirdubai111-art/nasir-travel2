import React, { useState } from "react";
import {
  UserCheck,
  Shield,
  FileText,
  MapPin,
  Calendar,
  CreditCard,
  QrCode,
  MessageSquare,
  X,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Tag,
  Building,
} from "lucide-react";
import { Customer360CompositeRecord } from "../../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../../services/travelVerticalsService";

interface Customer360HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCustomerId?: string;
}

export const Customer360HierarchyModal: React.FC<Customer360HierarchyModalProps> = ({
  isOpen,
  onClose,
  preSelectedCustomerId,
}) => {
  const [customers, setCustomers] = useState<Customer360CompositeRecord[]>(
    travelVerticalsService.getCustomer360List()
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preSelectedCustomerId || (customers[0]?.customer_id ?? "")
  );

  const [activeTab, setActiveTab] = useState<
    "profile" | "documents" | "addresses" | "bookings" | "payments" | "tickets" | "notes"
  >("profile");

  const [notesList, setNotesList] = useState<
    Array<{ id: string; text: string; date: string; author: string }>
  >([
    {
      id: "N-01",
      text: "Customer requested airport luxury chauffeur in Delhi. Prefers Innova Crysta with English-speaking driver.",
      date: "2026-09-17 10:30 AM",
      author: "Pooja Sharma (VIP Concierge)",
    },
    {
      id: "N-02",
      text: "Dietary preference: Pure Vegetarian / Jain breakfast on all outstation circuits.",
      date: "2026-08-14 02:15 PM",
      author: "Rajeev Nambiar (CRM Agent)",
    },
  ]);
  const [newNoteText, setNewNoteText] = useState("");

  if (!isOpen) return null;

  const activeCustomer =
    customers.find((c) => c.customer_id === selectedCustomerId) || customers[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setNotesList((prev) => [
      {
        id: `N-0${prev.length + 1}`,
        text: newNoteText,
        date: "Just now",
        author: "Agent (You)",
      },
      ...prev,
    ]);
    setNewNoteText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <UserCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Customer 360 Architecture
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  auth.users ──► customers ──► 7 Child Sub-Tables
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Customer 360 &amp; Unified Identity Hub
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schema Tree Header */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-purple-400 font-bold">SCHEMA:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">auth.users</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
            customers (profiles, documents, addresses, bookings, payments, tickets, notes)
          </span>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Customer Selector Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {customers.map((c) => (
              <button
                key={c.customer_id}
                onClick={() => setSelectedCustomerId(c.customer_id)}
                className={`p-3 rounded-2xl border text-left transition shrink-0 flex items-center gap-3 ${
                  activeCustomer?.customer_id === c.customer_id
                    ? "bg-purple-950/40 border-purple-500/70 ring-1 ring-purple-500/50"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                  {c.profile.first_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">{c.profile.full_name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                      {c.profile.loyalty_tier}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    {c.customer_id} • auth: {c.auth_user_id}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Customer Profile Card */}
          {activeCustomer && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
              {/* Profile Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-black text-xl">
                    {activeCustomer.profile.first_name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{activeCustomer.profile.full_name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {activeCustomer.profile.loyalty_tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {activeCustomer.profile.email} • {activeCustomer.profile.phone}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      auth_user_id: {activeCustomer.auth_user_id} | customer_id: {activeCustomer.customer_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 block">Trips Booked</span>
                    <span className="font-bold text-white">{activeCustomer.profile.total_trips_booked} Bookings</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 block">Lifetime Spend</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ₹{activeCustomer.profile.total_lifetime_spend.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7 Child Schema Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none text-xs">
                {[
                  { id: "profile", label: "1. Profile Info", icon: UserCheck },
                  { id: "documents", label: `2. Documents (${activeCustomer.documents.length})`, icon: Shield },
                  { id: "addresses", label: `3. Addresses (${activeCustomer.addresses.length})`, icon: MapPin },
                  { id: "bookings", label: `4. Bookings (${activeCustomer.recent_bookings.length})`, icon: Calendar },
                  { id: "payments", label: "5. Payments", icon: CreditCard },
                  { id: "tickets", label: `6. Tickets (${activeCustomer.active_tickets_count})`, icon: QrCode },
                  { id: "notes", label: `7. CRM Notes (${notesList.length})`, icon: MessageSquare },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 ${
                        activeTab === t.id
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: Profile */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth</span>
                    <span className="font-bold text-white text-sm">{activeCustomer.profile.date_of_birth}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender &amp; Nationality</span>
                    <span className="font-bold text-white text-sm">
                      {activeCustomer.profile.gender} • {activeCustomer.profile.nationality}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Customer Tags</span>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      {activeCustomer.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Documents */}
              {activeTab === "documents" && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      customer_documents (KYC &amp; Verified Government IDs)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeCustomer.documents.map((doc) => (
                      <div
                        key={doc.doc_id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{doc.doc_type}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              {doc.verification_status}
                            </span>
                          </div>
                          <p className="font-mono text-slate-300">{doc.doc_number_masked}</p>
                          <p className="text-[11px] text-slate-500">{doc.issuing_authority}</p>
                        </div>
                        <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Addresses */}
              {activeTab === "addresses" && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      customer_addresses (Home, Office &amp; Billing Profiles)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeCustomer.addresses.map((addr) => (
                      <div
                        key={addr.address_id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{addr.address_type} Address</span>
                          {addr.is_primary && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300">{addr.street_address}</p>
                        <p className="text-slate-500">
                          {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      Cross-Vertical Bookings History
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeCustomer.recent_bookings.map((b) => (
                      <div
                        key={b.booking_reference}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-400">{b.booking_reference}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              {b.vertical}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                              {b.booking_status}
                            </span>
                          </div>
                          <p className="text-white font-medium">{b.title}</p>
                          <p className="text-slate-500 text-[11px]">Travel Date: {b.travel_date}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-amber-400 text-sm font-mono">
                            ₹{b.amount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-emerald-400 block uppercase font-bold">
                            {b.payment_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Payments */}
              {activeTab === "payments" && (
                <div className="space-y-3 animate-in fade-in text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Total Reconciled Lifetime Payments
                      </span>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        ₹{activeCustomer.total_payments_value.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
                      Zero Chargebacks / 100% Settled
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 6: Tickets */}
              {activeTab === "tickets" && (
                <div className="space-y-3 animate-in fade-in text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-white text-sm">Active QR Travel Passes</span>
                      <p className="text-slate-400">
                        {activeCustomer.active_tickets_count} valid boarding passes &amp; hotel check-in vouchers.
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-white text-slate-950">
                      <QrCode className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: CRM Notes */}
              {activeTab === "notes" && (
                <div className="space-y-4 animate-in fade-in text-xs">
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal CRM note or customer preference..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-500 flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </form>

                  <div className="space-y-2">
                    {notesList.map((n) => (
                      <div
                        key={n.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1"
                      >
                        <p className="text-slate-200">{n.text}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>By: {n.author}</span>
                          <span>{n.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
