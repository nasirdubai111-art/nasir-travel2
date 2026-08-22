import React, { useState } from "react";
import {
  X,
  Headphones,
  ShieldAlert,
  MessageSquare,
  Phone,
  FileQuestion,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Ticket,
  ChevronRight,
  LifeBuoy,
} from "lucide-react";

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIDrawer?: () => void;
}

interface SupportTicketItem {
  id: string;
  category: "IRCTC PNR Refund" | "Flight Cancellation" | "Hotel Check-in" | "Cab Dispute" | "Lost Baggage" | "Medical SOS";
  subject: string;
  status: "in_progress" | "resolved" | "escalated";
  eta: string;
  lastUpdate: string;
}

const INITIAL_SUPPORT_TICKETS: SupportTicketItem[] = [
  {
    id: "BY-SUP-8921",
    category: "IRCTC PNR Refund",
    subject: "IRCTC TDR Refund for Train 20641 Delay > 3 Hours",
    status: "in_progress",
    eta: "4 Hours (Auto Bank Credit)",
    lastUpdate: "IRCTC Verified. ₹1,820 refund initiated to Original Payment Method.",
  },
  {
    id: "BY-SUP-7740",
    category: "Flight Cancellation",
    subject: "IndiGo 6E-204 Flight Reschedule Request",
    status: "resolved",
    eta: "Completed",
    lastUpdate: "Zero-fee rescheduling confirmed for 29 Aug 07:30 AM.",
  },
  {
    id: "BY-SUP-6219",
    category: "Hotel Check-in",
    subject: "Early Check-in at Trident Nariman Point",
    status: "resolved",
    eta: "Completed",
    lastUpdate: "Hotel GM confirmed complimentary 09:00 AM early check-in.",
  },
];

export function HelpSupportModal({
  isOpen,
  onClose,
  onOpenAIDrawer,
}: HelpSupportModalProps) {
  const [activeTab, setActiveTab] = useState<"quick_help" | "my_tickets" | "raise_ticket" | "emergency">("quick_help");
  const [tickets, setTickets] = useState<SupportTicketItem[]>(INITIAL_SUPPORT_TICKETS);
  
  // Ticket form state
  const [ticketCategory, setTicketCategory] = useState<SupportTicketItem["category"]>("IRCTC PNR Refund");
  const [pnrOrBookingId, setPnrOrBookingId] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) {
      alert("Please provide ticket subject and description.");
      return;
    }

    const newTicket: SupportTicketItem = {
      id: `BY-SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketCategory,
      subject: ticketSubject,
      status: "in_progress",
      eta: "Within 2 Hours (Priority AI Agent)",
      lastUpdate: "Ticket received and assigned to Tier-2 Travel Support Specialist.",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSubmissionSuccess(newTicket.id);

    setTimeout(() => {
      setSubmissionSuccess(null);
      setActiveTab("my_tickets");
      setTicketSubject("");
      setTicketDescription("");
      setPnrOrBookingId("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">24x7 Customer Help &amp; Support</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  Live Response &lt; 60s
                </span>
              </div>
              <p className="text-xs text-slate-300">
                AI Resolution • IRCTC TDR Refund Escalation • 24/7 SOS Emergency Helpline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toolbar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("quick_help")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "quick_help"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Instant Assistance</span>
          </button>

          <button
            onClick={() => setActiveTab("my_tickets")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "my_tickets"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Active Tickets ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("raise_ticket")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "raise_ticket"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Raise Escalation</span>
          </button>

          <button
            onClick={() => setActiveTab("emergency")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "emergency"
                ? "border-rose-600 text-rose-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-rose-600"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="text-rose-600 font-bold">24x7 SOS Helpline</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: QUICK HELP & FAQ */}
          {activeTab === "quick_help" && (
            <div className="space-y-5">
              {/* AI Quick Assistant Trigger */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm">Need Instant AI Resolution?</h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ask our specialized IRCTC &amp; Airline bot to check live refund status, PNR confirmation chances, or change seats.
                  </p>
                </div>
                {onOpenAIDrawer && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAIDrawer();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
                  >
                    Open AI Chat Assistant ➔
                  </button>
                )}
              </div>

              {/* Quick Action Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: "Track IRCTC TDR / Ticket Refund",
                    desc: "Check live bank credit status for cancelled train tickets",
                    action: () => alert("Direct IRCTC Gateway Sync: No pending uncredited refunds."),
                    badge: "Instant Status",
                  },
                  {
                    title: "Flight Web Check-In & Boarding Pass",
                    desc: "Auto-assign preferred seats and generate QR boarding passes",
                    action: () => alert("Opening web check-in portal for all active airline bookings."),
                    badge: "1-Click",
                  },
                  {
                    title: "Airport Cab Delay or Dispute",
                    desc: "Instant cab replacement or toll refund within 5 minutes",
                    action: () => setActiveTab("raise_ticket"),
                    badge: "5 Min SLA",
                  },
                  {
                    title: "B2B GST Tax Invoice Download",
                    desc: "Download consolidated tax invoice for expense reimbursement",
                    action: () => alert("Consolidated monthly GST tax invoice sent to registered email."),
                    badge: "Automated",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.action}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900">{item.title}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Support Channels */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Toll-Free National Helpline</span>
                    <span className="text-slate-500">1800-11-YATRA (1800 11 92872) • Available 24/7</span>
                  </div>
                </div>
                <button
                  onClick={() => alert("Connecting to 24x7 Priority Support Agent on +91 1800-11-92872")}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black"
                >
                  Call Toll Free
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE TICKETS */}
          {activeTab === "my_tickets" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Your Support &amp; Escalation History</h4>
                <span className="text-xs text-slate-400">Linked to Mobile &amp; Email</span>
              </div>

              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {t.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {t.category}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        t.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.status === "resolved" ? "✓ Resolved" : "⏳ In Progress"}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900">{t.subject}</h5>
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>Latest Status:</strong> {t.lastUpdate}
                  </p>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Resolution ETA: {t.eta}</span>
                    <span className="text-indigo-600 font-bold hover:underline cursor-pointer">
                      View Audit Log ➔
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RAISE ESCALATION FORM */}
          {activeTab === "raise_ticket" && (
            <form onSubmit={handleRaiseTicket} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Submit a Direct Support Escalation</span>
              </h4>

              {submissionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ticket {submissionSuccess} registered! Assigned to priority queue.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="IRCTC PNR Refund">IRCTC PNR Refund</option>
                    <option value="Flight Cancellation">Flight Cancellation / Reschedule</option>
                    <option value="Hotel Check-in">Hotel Check-in &amp; Room Upgrade</option>
                    <option value="Cab Dispute">Cab &amp; Highway Fare Dispute</option>
                    <option value="Lost Baggage">Lost Baggage Tracking</option>
                    <option value="Medical SOS">Medical &amp; Travel Insurance Claim</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">PNR / Booking ID (Optional)</label>
                  <input
                    type="text"
                    value={pnrOrBookingId}
                    onChange={(e) => setPnrOrBookingId(e.target.value)}
                    placeholder="e.g. 284-9182390 or BK-FL-8921"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs space-y-1.5">
                <label className="text-slate-600 block font-medium">Subject Headline</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Briefly state your query or refund request..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="text-xs space-y-1.5">
                <label className="text-slate-600 block font-medium">Detailed Explanation</label>
                <textarea
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Include dates, passenger names, flight/train numbers, and any bank transaction details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("quick_help")}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: 24/7 SOS EMERGENCY */}
          {activeTab === "emergency" && (
            <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-rose-950">24/7 Emergency SOS &amp; Medical Assistance</h4>
                  <p className="text-xs text-rose-800">
                    Direct integration with Indian Railway Police (RPF), Tourist Police, and Digit Insurance cashless medical network.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-600">Railways Emergency (RPF)</span>
                  <div className="text-lg font-black text-slate-900">139 / 182</div>
                  <p className="text-[11px] text-slate-500">Security, medical on-train, theft assistance</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-600">National Emergency Number</span>
                  <div className="text-lg font-black text-slate-900">112</div>
                  <p className="text-[11px] text-slate-500">All-India unified police, ambulance &amp; fire</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-600">Highway Patrol &amp; Ambulance</span>
                  <div className="text-lg font-black text-slate-900">1033 (NHAI)</div>
                  <p className="text-[11px] text-slate-500">Expressway towing, crane, EV charging breakdown</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-600">BharatYatra Cashless Medical SOS</span>
                  <div className="text-lg font-black text-slate-900">+91 9999-SOS-999</div>
                  <p className="text-[11px] text-slate-500">Instant cashless hospital admission approval</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert("SOS Alert broadcasted to 24x7 Emergency Command Desk with your last verified GPS coordinates.")}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Broadcast One-Touch SOS Alert with Location</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
