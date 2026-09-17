import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Plane,
  Train,
  Bus,
  Building,
  Palmtree,
  Tent,
  Compass,
  Landmark,
  Car,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  FileText,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  Phone,
  Mail,
  IndianRupee,
  Database,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  BookingHierarchy,
  BookingItem,
  BookingItemType,
  PaymentTransaction,
  BookingStatus,
} from "../../types/bookingHierarchy";
import { BookingHierarchyService } from "../../services/bookingHierarchyService";

interface UnifiedBookingHierarchyViewProps {
  onSelectBooking?: (bookingId: string) => void;
}

export function UnifiedBookingHierarchyView({
  onSelectBooking,
}: UnifiedBookingHierarchyViewProps) {
  const [bookings, setBookings] = useState<BookingHierarchy[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemTypeFilter, setSelectedItemTypeFilter] = useState<
    BookingItemType | "ALL"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"hierarchy" | "sql_schema">("hierarchy");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Booking Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemBookingId, setNewItemBookingId] = useState<string>("");
  const [newItemType, setNewItemType] = useState<BookingItemType>("Flight");

  // Load bookings
  const loadBookings = () => {
    const data = BookingHierarchyService.getBookings();
    setBookings(data);
    if (!selectedBookingId && data.length > 0) {
      setSelectedBookingId(data[0].bookingId);
    }
  };

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => loadBookings();
    window.addEventListener("bharatyatra_bookings_updated", handleUpdate);
    return () => window.removeEventListener("bharatyatra_bookings_updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer.phone.includes(searchQuery) ||
        b.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingsItems.some(
          (i) =>
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.itemCodeOrPnr.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "ALL" || b.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesItemType =
        selectedItemTypeFilter === "ALL" ||
        b.bookingsItems.some((i) => i.itemType === selectedItemTypeFilter);

      return matchesSearch && matchesStatus && matchesItemType;
    });
  }, [bookings, searchQuery, statusFilter, selectedItemTypeFilter]);

  const activeBooking = useMemo(() => {
    return (
      bookings.find((b) => b.bookingId === selectedBookingId) ||
      bookings[0] ||
      null
    );
  }, [bookings, selectedBookingId]);

  // Aggregate statistics
  const stats = useMemo(() => {
    let totalItems = 0;
    const categoryCounts: Record<BookingItemType, number> = {
      Flight: 0,
      Train: 0,
      Bus: 0,
      Hotel: 0,
      Resort: 0,
      Lodge: 0,
      Tour: 0,
      Pilgrimage: 0,
      Cab: 0,
    };
    let totalTxCount = 0;
    let totalVolume = 0;

    bookings.forEach((b) => {
      totalVolume += b.netPayableAmount;
      b.bookingsItems.forEach((i) => {
        totalItems++;
        if (categoryCounts[i.itemType] !== undefined) {
          categoryCounts[i.itemType]++;
        }
      });
      totalTxCount += b.payments.paymentTransactions.length;
    });

    return {
      totalBookings: bookings.length,
      totalItems,
      categoryCounts,
      totalTxCount,
      totalVolume,
    };
  }, [bookings]);

  // Helper for Category Icons & Styling
  const getItemTypeMeta = (type: BookingItemType) => {
    switch (type) {
      case "Flight":
        return {
          icon: Plane,
          color: "text-sky-400",
          bg: "bg-sky-500/10 border-sky-500/30",
          label: "Flight",
        };
      case "Train":
        return {
          icon: Train,
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/30",
          label: "Train",
        };
      case "Bus":
        return {
          icon: Bus,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/30",
          label: "Bus",
        };
      case "Hotel":
        return {
          icon: Building,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10 border-indigo-500/30",
          label: "Hotel",
        };
      case "Resort":
        return {
          icon: Palmtree,
          color: "text-teal-400",
          bg: "bg-teal-500/10 border-teal-500/30",
          label: "Resort",
        };
      case "Lodge":
        return {
          icon: Tent,
          color: "text-lime-400",
          bg: "bg-lime-500/10 border-lime-500/30",
          label: "Lodge",
        };
      case "Tour":
        return {
          icon: Compass,
          color: "text-purple-400",
          bg: "bg-purple-500/10 border-purple-500/30",
          label: "Tour",
        };
      case "Pilgrimage":
        return {
          icon: Landmark,
          color: "text-orange-400",
          bg: "bg-orange-500/10 border-orange-500/30",
          label: "Pilgrimage",
        };
      case "Cab":
        return {
          icon: Car,
          color: "text-yellow-400",
          bg: "bg-yellow-500/10 border-yellow-500/30",
          label: "Cab",
        };
    }
  };

  const handleSimulatePayment = (bookingId: string) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return;

    const newTxId = `tx_pay_${Date.now().toString(36)}`;
    const newOrderId = `order_RZP_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newPayId = `pay_${Math.random().toString(36).substring(2, 10)}`;

    BookingHierarchyService.recordPaymentTransaction(bookingId, {
      transactionId: newTxId,
      razorpayOrderId: newOrderId,
      razorpayPaymentId: newPayId,
      razorpaySignature: "sig_verified_hmac_sha256_" + Math.random().toString(36).substring(2, 12),
      signatureVerified: true,
      amount: booking.netPayableAmount,
      currency: "INR",
      status: "captured",
      paymentMethod: "upi",
      paymentMethodDetail: "UPI: quickpay@bharatyatra",
      receiptNumber: `RCPT-BY-${Math.floor(100000 + Math.random() * 900000)}`,
      taxInvoiceNumber: `INV-BY-26-${Math.floor(10000 + Math.random() * 90000)}`,
      nodalEscrowStatus: "held",
    });

    showToast(`Payment transaction ₹${booking.netPayableAmount.toLocaleString("en-IN")} captured for ${bookingId}!`);
  };

  const handleDeleteItem = (bookingId: string, itemId: string, title: string) => {
    BookingHierarchyService.removeItemFromBooking(bookingId, itemId);
    showToast(`Removed item "${title}" from ${bookingId}`);
  };

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 border border-indigo-400/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Architecture Hierarchy Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white tracking-tight">
                    Relational Bookings Hierarchy & Payment Engine
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    Parent-Child Architecture
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Universal hierarchy: <code className="text-cyan-300 font-mono">bookings</code> (Root) ➔ <code className="text-emerald-300 font-mono">bookings_items</code> (9 Categories) ➔ <code className="text-purple-300 font-mono">payments.payment_transactions</code>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setViewMode(viewMode === "hierarchy" ? "sql_schema" : "hierarchy")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                viewMode === "sql_schema"
                  ? "bg-purple-600 text-white border-purple-400"
                  : "bg-slate-800 text-slate-300 hover:text-white border-slate-700"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{viewMode === "sql_schema" ? "View Live Hierarchy" : "View Supabase SQL Schema"}</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Multi-Item Booking</span>
            </button>
            <button
              onClick={() => {
                BookingHierarchyService.resetToDefault();
                loadBookings();
                showToast("Reset to standard test dataset");
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Architecture Tree Diagram Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Canonical Schema Model</span>
          </div>
          <div className="font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
            <div className="text-cyan-300 font-bold">bookings</div>
            <div className="text-slate-500">   │</div>
            <div className="text-slate-300">   ├── <span className="text-cyan-400 font-semibold">booking_id</span> <span className="text-slate-500">(Primary Key, e.g. BY-BK-KEDAR-2026)</span></div>
            <div className="text-slate-500">   │</div>
            <div className="text-emerald-400 font-bold">   ├── bookings_items <span className="text-slate-500 font-normal">(Foreign Key: booking_id, 9 Item Types)</span></div>
            <div className="text-slate-400">   │      ├── <span className="text-sky-300 font-semibold">Flight</span> &nbsp; • &nbsp; <span className="text-amber-300 font-semibold">Train</span> &nbsp; • &nbsp; <span className="text-emerald-300 font-semibold">Bus</span></div>
            <div className="text-slate-400">   │      ├── <span className="text-indigo-300 font-semibold">Hotel</span> &nbsp; • &nbsp; <span className="text-teal-300 font-semibold">Resort</span> &nbsp; • &nbsp; <span className="text-lime-300 font-semibold">Lodge</span></div>
            <div className="text-slate-400">   │      └── <span className="text-purple-300 font-semibold">Tour</span> &nbsp; • &nbsp; <span className="text-orange-300 font-semibold">Pilgrimage</span> &nbsp; • &nbsp; <span className="text-yellow-300 font-semibold">Cab</span></div>
            <div className="text-slate-500">   │</div>
            <div className="text-purple-400 font-bold">   └── payments <span className="text-slate-500 font-normal">(Payment Ledger Node)</span></div>
            <div className="text-slate-300">          └── <span className="text-pink-400 font-semibold">payment_transactions</span> <span className="text-slate-500">(Razorpay Order, Payment ID, Signature, Split Escrow)</span></div>
          </div>
        </div>
      </div>

      {viewMode === "sql_schema" ? (
        /* SQL Schema Code Viewer */
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Supabase PostgreSQL Schema: `public.bookings` &amp; Relational Children</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Migration file: <code className="text-purple-300 font-mono">supabase/migrations/20260917_create_bookings_and_items.sql</code>
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`-- Bookings Hierarchy Schema...`);
                showToast("Schema copied to clipboard!");
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-bold hover:bg-purple-600/30 transition-all"
            >
              Copy Migration SQL
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-3">
            <div className="text-emerald-400 font-bold">-- 1. Root Bookings Table</div>
            <pre className="text-slate-400 text-[11px]">
{`CREATE TABLE public.bookings (
    booking_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    travel_start_date TIMESTAMPTZ NOT NULL,
    travel_end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    total_amount NUMERIC(12, 2) NOT NULL,
    net_payable_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>

            <div className="text-emerald-400 font-bold">-- 2. Bookings Items Table (9 Item Types)</div>
            <pre className="text-slate-400 text-[11px]">
{`CREATE TABLE public.bookings_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN (
        'Flight', 'Train', 'Bus', 'Hotel', 'Resort', 
        'Lodge', 'Tour', 'Pilgrimage', 'Cab'
    )),
    title TEXT NOT NULL,
    service_provider TEXT NOT NULL,
    item_code_or_pnr TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb
);`}
            </pre>

            <div className="text-emerald-400 font-bold">-- 3. Payments &amp; Payment Transactions Table</div>
            <pre className="text-slate-400 text-[11px]">
{`CREATE TABLE public.payment_transactions (
    transaction_id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    signature_verified BOOLEAN DEFAULT FALSE,
    amount NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('captured', 'created', 'authorized', 'failed')),
    receipt_number TEXT NOT NULL
);`}
            </pre>
          </div>
        </div>
      ) : (
        /* Hierarchy Interactive View */
        <div className="space-y-6">
          {/* 9 Category Item Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Item Type:
            </span>
            <button
              onClick={() => setSelectedItemTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedItemTypeFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              All Items ({stats.totalItems})
            </button>

            {(
              [
                "Flight",
                "Train",
                "Bus",
                "Hotel",
                "Resort",
                "Lodge",
                "Tour",
                "Pilgrimage",
                "Cab",
              ] as BookingItemType[]
            ).map((type) => {
              const meta = getItemTypeMeta(type);
              const Icon = meta.icon;
              const count = stats.categoryCounts[type] || 0;
              const isSelected = selectedItemTypeFilter === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedItemTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? `${meta.bg} ${meta.color} font-bold ring-1 ring-inset ring-current shadow-sm`
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{meta.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Booking ID, Customer, PNR, City, Item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="text-xs text-slate-400 font-medium px-2">
                Showing {filteredBookings.length} of {bookings.length} Bookings
              </div>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Bookings List Cards (Level 1: bookings / booking_id) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Bookings (booking_id)</span>
                <span>Items • Total</span>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                  No bookings found matching your search.
                </div>
              ) : (
                filteredBookings.map((bk) => {
                  const isSelected = bk.bookingId === activeBooking?.bookingId;
                  const paidPct = Math.min(
                    100,
                    Math.round(
                      (bk.payments.totalPaidAmount / (bk.netPayableAmount || 1)) * 100
                    )
                  );

                  return (
                    <div
                      key={bk.bookingId}
                      onClick={() => {
                        setSelectedBookingId(bk.bookingId);
                        if (onSelectBooking) onSelectBooking(bk.bookingId);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500/50"
                          : "bg-slate-950/80 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                              {bk.bookingId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                bk.status === "confirmed"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {bk.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-white mt-1.5">
                            {bk.customer.name}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{bk.customer.city || "India"}</span>
                            <span>•</span>
                            <span>{bk.customer.phone}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-white">
                            ₹{bk.netPayableAmount.toLocaleString("en-IN")}
                          </p>
                          <span
                            className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded mt-1 ${
                              bk.payments.paymentStatus === "paid"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {bk.payments.paymentStatus === "paid" ? "Paid (100%)" : "Partial"}
                          </span>
                        </div>
                      </div>

                      {/* Items Pills in this booking */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-semibold mr-1">
                          {bk.bookingsItems.length} Items:
                        </span>
                        {bk.bookingsItems.map((it) => {
                          const meta = getItemTypeMeta(it.itemType);
                          const Icon = meta.icon;
                          return (
                            <span
                              key={it.id}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 ${meta.bg} ${meta.color}`}
                              title={it.title}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{it.itemType}</span>
                            </span>
                          );
                        })}
                      </div>

                      {/* Payment transactions info preview */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-purple-400" />
                          <span>{bk.payments.paymentTransactions.length} tx recorded</span>
                        </span>
                        <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                          <span>Inspect Hierarchy</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Detailed Hierarchy Tree Inspector */}
            <div className="lg:col-span-7 space-y-5">
              {activeBooking ? (
                <div className="space-y-5">
                  {/* Node 1: Root Booking Card */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Booking Root Node
                          </span>
                          <span className="font-mono text-xs font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                            {activeBooking.bookingId}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-white mt-1">
                          {activeBooking.customer.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{activeBooking.customer.email}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{activeBooking.customer.phone}</span>
                          </span>
                          {activeBooking.customer.loyaltyTier && (
                            <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              {activeBooking.customer.loyaltyTier}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-semibold">Net Payable</div>
                        <div className="text-xl font-black text-emerald-400">
                          ₹{activeBooking.netPayableAmount.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Base ₹{activeBooking.totalAmount.toLocaleString("en-IN")} + GST ₹
                          {activeBooking.taxAmount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {activeBooking.specialRequests && (
                      <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-200">Special Notes:</span>{" "}
                          <span>{activeBooking.specialRequests}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Node 2: bookings_items List (Flight, Train, Bus, Hotel, Resort, Lodge, Tour, Pilgrimage, Cab) */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-sm font-black text-white">
                          bookings_items ({activeBooking.bookingsItems.length} Attached Items)
                        </h4>
                      </div>

                      <button
                        onClick={() => {
                          setNewItemBookingId(activeBooking.bookingId);
                          setShowAddItemModal(true);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeBooking.bookingsItems.map((item, idx) => {
                        const meta = getItemTypeMeta(item.itemType);
                        const Icon = meta.icon;

                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}
                                >
                                  <Icon className={`w-5 h-5 ${meta.color}`} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${meta.bg} ${meta.color}`}
                                    >
                                      {item.itemType}
                                    </span>
                                    <span className="font-mono text-xs text-slate-400 font-semibold">
                                      {item.itemCodeOrPnr}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      SAC: {item.sacCode}
                                    </span>
                                  </div>
                                  <h5 className="text-sm font-bold text-white mt-1">
                                    {item.title}
                                  </h5>
                                  <p className="text-xs text-slate-400">
                                    Provider: <span className="text-slate-200">{item.serviceProvider}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="text-right flex flex-col items-end">
                                <p className="text-sm font-black text-white">
                                  ₹{item.amount.toLocaleString("en-IN")}
                                </p>
                                <span className="text-[10px] text-slate-400">
                                  GST: {item.taxRatePercent}%
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteItem(activeBooking.bookingId, item.id, item.title)
                                  }
                                  className="mt-1.5 p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Specific Domain Attributes for each of the 9 types */}
                            <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl">
                              {item.itemType === "Flight" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Flight &amp; Route:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).flightNumber} ({(item.details as any).originIata} → {(item.details as any).destinationIata})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Timing:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).departureTime} - {(item.details as any).arrivalTime}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Seats &amp; Baggage:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).seatNumber} ({(item.details as any).baggageAllowanceKg}kg)
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Train" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Train #:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).trainNumber} {(item.details as any).trainName}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Route &amp; Class:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).fromStationCode} → {(item.details as any).toStationCode} ({(item.details as any).travelClass})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Coach / Berth:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).coach} - {(item.details as any).berthNumber} ({(item.details as any).berthType})
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Bus" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Operator &amp; Type:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).busOperator} ({(item.details as any).busType})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Boarding Point:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).boardingPoint} ({(item.details as any).boardingTime})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Seats:</span>
                                    <span className="text-slate-200">
                                      {((item.details as any).seatNumbers || []).join(", ")}
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Hotel" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Room &amp; Nights:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).roomType} ({(item.details as any).nightsCount} Nights)
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Meal Plan:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).mealPlan}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Dates:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).checkInDate} to {(item.details as any).checkOutDate}
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Resort" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Resort &amp; Villa:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).resortName} - {(item.details as any).villaOrCottageType}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Wellness / Theme:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).packageTheme} ({(item.details as any).wellnessSessionsIncluded} sessions)
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Destination:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).destination}
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Lodge" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Zone &amp; Reserve:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).forestZone} ({(item.details as any).reserveOrHillStation})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Safari Permit:</span>
                                    <span className="text-slate-200 font-mono">
                                      {(item.details as any).safariPermitNumber || "Included at Gate"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Naturalist:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).naturalistGuideAssigned}
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Tour" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Itinerary:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).itineraryCode} ({(item.details as any).durationDays} Days)
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Guide &amp; Languages:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).tourGuideName} ({((item.details as any).spokenLanguages || []).join(", ")})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Vehicle:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).vehicleIncluded}
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Pilgrimage" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Shrine &amp; Slot:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).templeOrShrine}
                                    </span>
                                    <span className="text-[10px] text-orange-300 block">
                                      {(item.details as any).darshanSlot}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Pass / Token:</span>
                                    <span className="text-slate-200 font-mono">
                                      {(item.details as any).tokenOrPassId}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Authorized Pandit:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).authorizedPanditOrSevak || "Shrine Board Certified"}
                                    </span>
                                  </div>
                                </>
                              )}

                              {item.itemType === "Cab" && (
                                <>
                                  <div>
                                    <span className="text-slate-500 block">Vehicle:</span>
                                    <span className="font-bold text-slate-200">
                                      {(item.details as any).vehicleModel} ({(item.details as any).vehicleNumber})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Driver &amp; Phone:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).driverName} ({(item.details as any).driverPhone})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block">Route &amp; Distance:</span>
                                    <span className="text-slate-200">
                                      {(item.details as any).totalDistanceKm} km ({(item.details as any).outstationType})
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Node 3: payments -> payment_transactions */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">
                            payments ➔ payment_transactions ({activeBooking.payments.paymentTransactions.length} Recorded)
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Total Paid: ₹{activeBooking.payments.totalPaidAmount.toLocaleString("en-IN")} • Balance: ₹{activeBooking.payments.balanceDue.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSimulatePayment(activeBooking.bookingId)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 cursor-pointer transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Record Razorpay Payment</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeBooking.payments.paymentTransactions.map((tx) => (
                        <div
                          key={tx.transactionId}
                          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-purple-300">
                                  {tx.transactionId}
                                </span>
                                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>HMAC Verified</span>
                                </span>
                                {tx.nodalEscrowStatus && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[10px] text-indigo-300 border border-indigo-500/30">
                                    Escrow: {tx.nodalEscrowStatus}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                Method: <span className="text-slate-200 font-semibold">{tx.paymentMethodDetail || tx.paymentMethod}</span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-base font-black text-emerald-400">
                                ₹{tx.amount.toLocaleString("en-IN")}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {tx.receiptNumber}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl font-mono text-slate-300">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Razorpay Order:</span>
                              <span className="truncate block">{tx.razorpayOrderId}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Payment ID:</span>
                              <span className="truncate block text-cyan-300">{tx.razorpayPaymentId || "Pending"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Invoice #:</span>
                              <span className="truncate block">{tx.taxInvoiceNumber || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Timestamp:</span>
                              <span className="truncate block text-slate-400">
                                {new Date(tx.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>

                          {/* Sub-merchant splits if present */}
                          {tx.subMerchantSplits && tx.subMerchantSplits.length > 0 && (
                            <div className="pt-2 border-t border-slate-800/80">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Sub-Merchant Settlements &amp; Commission Routing:
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {tx.subMerchantSplits.map((split, i) => (
                                  <div
                                    key={i}
                                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="text-slate-200 font-bold block">
                                        {split.partnerName}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        {split.partnerAccountId}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-emerald-400 font-bold block">
                                        ₹{split.amount.toLocaleString("en-IN")}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {split.commissionPercent}% fee
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 text-slate-400">
                  Select a booking on the left to inspect its hierarchical items and payment transactions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Item to Booking Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Item to {newItemBookingId}</span>
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Item Category (One of 9 Categories)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      "Flight",
                      "Train",
                      "Bus",
                      "Hotel",
                      "Resort",
                      "Lodge",
                      "Tour",
                      "Pilgrimage",
                      "Cab",
                    ] as BookingItemType[]
                  ).map((type) => {
                    const meta = getItemTypeMeta(type);
                    const Icon = meta.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewItemType(type)}
                        className={`p-2 rounded-xl text-left flex items-center gap-2 border transition-all ${
                          newItemType === type
                            ? `${meta.bg} ${meta.color} font-bold ring-1 ring-inset ring-current`
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Item Title</label>
                <input
                  id="new_item_title"
                  type="text"
                  defaultValue={`${newItemType} Service for ${newItemBookingId}`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Provider Name
                  </label>
                  <input
                    id="new_item_provider"
                    type="text"
                    defaultValue="BharatYatra Verified Partner"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Amount (INR)
                  </label>
                  <input
                    id="new_item_amount"
                    type="number"
                    defaultValue="4500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const titleEl = document.getElementById("new_item_title") as HTMLInputElement;
                  const providerEl = document.getElementById("new_item_provider") as HTMLInputElement;
                  const amountEl = document.getElementById("new_item_amount") as HTMLInputElement;

                  const title = titleEl?.value || `${newItemType} Booking Item`;
                  const provider = providerEl?.value || "BharatYatra Travel Services";
                  const amount = Number(amountEl?.value) || 4500;

                  BookingHierarchyService.addItemToBooking(newItemBookingId, {
                    itemType: newItemType,
                    title,
                    serviceProvider: provider,
                    itemCodeOrPnr: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
                    startDate: new Date().toISOString(),
                    amount,
                    taxRatePercent: 5,
                    status: "confirmed",
                    sacCode: "998555",
                    details: {
                      note: `Auto-generated ${newItemType} details`,
                    } as any,
                  });

                  setShowAddItemModal(false);
                  loadBookings();
                  showToast(`Added ${newItemType} (${title}) to ${newItemBookingId}!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
              >
                Save &amp; Link to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create New Multi-Item Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Create New Composite Booking</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Booking ID</label>
                  <input
                    id="modal_bk_id"
                    type="text"
                    defaultValue={`BY-BK-${Date.now().toString(36).toUpperCase()}`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-cyan-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Customer Name</label>
                  <input
                    id="modal_cust_name"
                    type="text"
                    defaultValue="Dr. S. K. Narayanan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Customer Email</label>
                  <input
                    id="modal_cust_email"
                    type="email"
                    defaultValue="narayanan@aiims.edu"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Customer Phone</label>
                  <input
                    id="modal_cust_phone"
                    type="text"
                    defaultValue="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Preset Package Items Included
                </label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-slate-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                      <Plane className="w-3.5 h-3.5" /> Flight: Delhi to Kochi (Economy)
                    </span>
                    <span className="font-bold">₹7,500</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                      <Palmtree className="w-3.5 h-3.5" /> Resort: Kumarakom Lake Resort (2 Nights)
                    </span>
                    <span className="font-bold">₹28,000</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-yellow-400 font-medium">
                      <Car className="w-3.5 h-3.5" /> Cab: Kochi Airport to Kumarakom Return
                    </span>
                    <span className="font-bold">₹4,200</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const idEl = document.getElementById("modal_bk_id") as HTMLInputElement;
                  const nameEl = document.getElementById("modal_cust_name") as HTMLInputElement;
                  const emailEl = document.getElementById("modal_cust_email") as HTMLInputElement;
                  const phoneEl = document.getElementById("modal_cust_phone") as HTMLInputElement;

                  const bookingId = idEl?.value || `BY-BK-${Date.now()}`;
                  const name = nameEl?.value || "Traveler";
                  const email = emailEl?.value || "traveler@bharatyatra.in";
                  const phone = phoneEl?.value || "+91 99999 99999";

                  const now = new Date().toISOString();
                  BookingHierarchyService.createBooking({
                    bookingId,
                    customer: {
                      customerId: `cust_${Date.now().toString(36)}`,
                      name,
                      email,
                      phone,
                      city: "Bengaluru",
                      loyaltyTier: "Gold",
                    },
                    bookingDate: now,
                    travelStartDate: new Date(Date.now() + 86400000 * 14).toISOString(),
                    travelEndDate: new Date(Date.now() + 86400000 * 17).toISOString(),
                    status: "confirmed",
                    totalAmount: 39700,
                    taxAmount: 1985,
                    discountAmount: 1500,
                    netPayableAmount: 40185,
                    currency: "INR",
                    specialRequests: "Kerala Backwater sunset boat ride & lake view villa",
                    bookingsItems: [
                      {
                        id: `item-flt-${Date.now()}`,
                        bookingId,
                        itemType: "Flight",
                        title: "IndiGo 6E-551 Delhi to Kochi",
                        serviceProvider: "IndiGo Airlines",
                        itemCodeOrPnr: "6E-COK-99",
                        startDate: now,
                        amount: 7500,
                        taxRatePercent: 5,
                        status: "confirmed",
                        sacCode: "996411",
                        details: {
                          airline: "IndiGo",
                          flightNumber: "6E-551",
                          pnr: "6E-COK-99",
                          originIata: "DEL",
                          originCity: "New Delhi",
                          originAirport: "IGIA",
                          destinationIata: "COK",
                          destinationCity: "Kochi",
                          destinationAirport: "Cochin International Airport",
                          departureTime: "08:00 AM",
                          arrivalTime: "11:15 AM",
                          cabinClass: "Economy",
                          baggageAllowanceKg: 15,
                        },
                        createdAt: now,
                      },
                      {
                        id: `item-res-${Date.now()}`,
                        bookingId,
                        itemType: "Resort",
                        title: "Kumarakom Lake Resort & Heritage Ayurvedic Retreat",
                        serviceProvider: "Kumarakom Lake Resort",
                        itemCodeOrPnr: "RES-KLR-221",
                        startDate: now,
                        amount: 28000,
                        taxRatePercent: 12,
                        status: "confirmed",
                        sacCode: "996311",
                        details: {
                          resortName: "Kumarakom Lake Resort",
                          destination: "Kumarakom, Kerala Backwaters",
                          villaOrCottageType: "Meandering Pool Villa",
                          checkInDate: "2026-10-15",
                          checkOutDate: "2026-10-17",
                          nightsCount: 2,
                          packageTheme: "Ayurvedic Wellness",
                          includedAmenities: ["Ayurveda Spa", "Backwater Cruise", "Infinity Pool"],
                          complimentaryActivities: ["Sunset Cruise", "Village Walk"],
                          wellnessSessionsIncluded: 2,
                        },
                        createdAt: now,
                      },
                      {
                        id: `item-cab-${Date.now()}`,
                        bookingId,
                        itemType: "Cab",
                        title: "Cochin Airport to Kumarakom Roundtrip Cab",
                        serviceProvider: "Kerala God's Own Cabs",
                        itemCodeOrPnr: "CAB-COK-441",
                        startDate: now,
                        amount: 4200,
                        taxRatePercent: 5,
                        status: "confirmed",
                        sacCode: "996601",
                        details: {
                          cabType: "Sedan",
                          vehicleModel: "Maruti Dzire Tour",
                          vehicleNumber: "KL 07 CC 8821",
                          driverName: "Biju Thomas",
                          driverPhone: "+91 94471 22334",
                          pickupLocation: "Cochin Airport Arrival Terminal",
                          dropoffLocation: "Kumarakom Lake Resort",
                          pickupDateTime: "2026-10-15 11:30 AM",
                          totalDistanceKm: 150,
                          tollAndParkingIncluded: true,
                          outstationType: "Roundtrip",
                        },
                        createdAt: now,
                      },
                    ],
                    payments: {
                      totalPaidAmount: 40185,
                      balanceDue: 0,
                      paymentStatus: "paid",
                      paymentTransactions: [
                        {
                          transactionId: `tx_pay_${Date.now().toString(36)}`,
                          bookingId,
                          razorpayOrderId: `order_COK_${Date.now().toString(36).toUpperCase()}`,
                          razorpayPaymentId: `pay_COK_${Math.random().toString(36).substring(2, 9)}`,
                          razorpaySignature: "sig_mock_verified_sha256",
                          signatureVerified: true,
                          amount: 40185,
                          currency: "INR",
                          status: "captured",
                          paymentMethod: "upi",
                          paymentMethodDetail: "UPI: narayanan@oksbi",
                          receiptNumber: `RCPT-BY-${Math.floor(100000 + Math.random() * 900000)}`,
                          taxInvoiceNumber: `INV-BY-26-${Math.floor(10000 + Math.random() * 90000)}`,
                          nodalEscrowStatus: "held",
                          createdAt: now,
                          verifiedAt: now,
                        },
                      ],
                    },
                  });

                  setShowCreateModal(false);
                  loadBookings();
                  setSelectedBookingId(bookingId);
                  showToast(`Created new multi-item booking ${bookingId}!`);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
