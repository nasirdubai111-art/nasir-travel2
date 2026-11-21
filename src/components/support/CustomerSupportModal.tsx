import React, { useState, useEffect } from "react";
import {
  X,
  LifeBuoy,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";

interface SupportTicket {
  id: string;
  ticket_number?: string;
  user_id?: string;
  category: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  booking_id?: string;
  created_at: string;
}

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState("Train Booking");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [bookingId, setBookingId] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v2/support/tickets", {
        headers: {
          "x-user-id": user?.id || "usr_customer_01",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.warn("Failed fetching support tickets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTickets();
      setSuccessMsg(null);
    }
  }, [isOpen, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/v2/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "usr_customer_01",
        },
        body: JSON.stringify({
          category,
          subject,
          description,
          priority,
          booking_id: bookingId.trim() || undefined,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setSuccessMsg(`Ticket created successfully! Ticket ID: ${created.ticket_number || created.id || "BY-SUP-OK"}`);
        setSubject("");
        setDescription("");
        setBookingId("");
        fetchTickets();
        setTimeout(() => setActiveTab("history"), 1500);
      }
    } catch (err) {
      console.error("Failed creating support ticket:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1B4332] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E9C46A]">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                24x7 Customer Support Desk
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E9C46A] text-[#1B4332]">
                  Live
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80">
                Direct escalation to BharatYatra travel officers &amp; operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "new"
                ? "border-[#1B4332] text-[#1B4332]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Raise New Ticket
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "history"
                ? "border-[#1B4332] text-[#1B4332]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            My Tickets ({tickets.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "new" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Booking Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-white"
                  >
                    <option value="Train Booking">Train Booking (IRCTC)</option>
                    <option value="Flight Booking">Flight Booking (DGCA)</option>
                    <option value="Bus Booking">Bus Booking</option>
                    <option value="Hotel Booking">Hotel &amp; Resort Booking</option>
                    <option value="Cab Booking">Cab &amp; Outstation</option>
                    <option value="Wildlife Safari">Wildlife Safari</option>
                    <option value="Houseboat Booking">Houseboat Booking</option>
                    <option value="Pilgrimage Tour">Pilgrimage Tour</option>
                    <option value="Refund & Cancellation">Refund &amp; Cancellation</option>
                    <option value="Wallet & Payment">Wallet &amp; Payment</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-white font-medium"
                  >
                    <option value="LOW">Low (General question / 24-48 hrs)</option>
                    <option value="MEDIUM">Medium (Upcoming journey / 12 hrs)</option>
                    <option value="HIGH">High (Journey in &lt; 6 hrs / 2 hrs)</option>
                    <option value="URGENT">Urgent (At Station/Airport / Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Associated PNR / Booking ID (Optional)
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. BY-BUS-88319, PNR 4829103948"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Berth change request / Need refund update"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Detailed Issue Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your issue, passenger names, or any error messages seen..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Backed by BharatYatra SLA &amp; RLS Protection</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-[#E9C46A] text-xs font-bold hover:bg-[#2D6A4F] transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Submitting..." : "Submit Support Request"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center text-xs text-gray-500">Loading support tickets...</div>
              ) : tickets.length === 0 ? (
                <div className="p-10 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 space-y-2">
                  <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-gray-600">No support tickets found</p>
                  <p className="text-[11px] text-gray-400">
                    If you face any issues with your travel bookings, raise a ticket and our 24x7 team will respond immediately.
                  </p>
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#2D6A4F]/40 transition space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {t.ticket_number || t.id.slice(0, 12)}
                        </span>
                        <span className="text-[11px] font-bold text-gray-800">{t.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            t.status === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : t.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {t.status}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            t.priority === "URGENT" || t.priority === "HIGH"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900">{t.subject}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{t.description}</p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                      <span>
                        Created: {new Date(t.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {t.booking_id && (
                        <span className="font-mono text-gray-500">Ref: {t.booking_id}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Toll-Free Helpline: <strong>1800-103-YATRA</strong></span>
          </div>
          <span>support@bharatyatra.in</span>
        </div>
      </div>
    </div>
  );
};
