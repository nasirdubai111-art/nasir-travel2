import React, { useState } from "react";
import {
  X,
  User,
  Wallet,
  Coins,
  Ticket,
  ShieldCheck,
  Building,
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plane,
  Train,
  Building2,
  FileText,
  Handshake,
} from "lucide-react";
import { UserProfile, BookingItem } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  bookings: BookingItem[];
  onAddMoney: (amount: number) => void;
  onCancelBooking: (id: string) => void;
  onOpenPartnerPortal?: () => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  userProfile,
  bookings,
  onAddMoney,
  onCancelBooking,
  onOpenPartnerPortal,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "wallet" | "gst" | "travelers">("bookings");
  const [rechargeAmount, setRechargeAmount] = useState(1000);
  const [isRecharging, setIsRecharging] = useState(false);

  if (!isOpen) return null;

  const handleRecharge = () => {
    setIsRecharging(true);
    setTimeout(() => {
      onAddMoney(rechargeAmount);
      setIsRecharging(false);
    }, 600);
  };

  const getServiceBadge = (type: string) => {
    switch (type) {
      case "flights":
        return <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold flex items-center gap-1"><Plane className="w-3 h-3" /> FLIGHT</span>;
      case "trains":
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1"><Train className="w-3 h-3" /> TRAIN</span>;
      case "hotels":
        return <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center gap-1"><Building2 className="w-3 h-3" /> HOTEL</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase">{type}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{userProfile.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase">
                  {userProfile.tier}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{userProfile.phone} • {userProfile.email}</p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet: ₹{userProfile.walletBalance.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>{userProfile.yatraCoins} YatraCoins</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors self-end sm:self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === "bookings"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === "wallet"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet & Coins</span>
          </button>

          <button
            onClick={() => setActiveTab("gst")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === "gst"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Corporate GST Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("travelers")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === "travelers"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Saved Travelers</span>
          </button>

          {onOpenPartnerPortal && (
            <button
              onClick={() => {
                onClose();
                onOpenPartnerPortal();
              }}
              className="ml-auto py-2 my-auto px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-200 transition-colors"
            >
              <Handshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>Merchant & Partner Hub</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Your Active & Completed Trips</h4>
                <span className="text-xs text-slate-400">IRCTC & Airline Sync Active</span>
              </div>

              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-xs transition-all bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      {getServiceBadge(b.serviceType)}
                      <span className="text-xs font-mono font-bold text-slate-500">{b.id}</span>
                      {b.pnr && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold border border-emerald-200">
                          PNR: {b.pnr}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed
                    </span>
                  </div>

                  <div className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{b.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{b.subtitle}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {b.date} {b.time && `• ${b.time}`}
                        </span>
                        {b.seatInfo && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                            Seat: {b.seatInfo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{b.amount.toLocaleString("en-IN")}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Invoice: {b.invoiceNumber}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => alert(`Downloading Boarding Pass & Tax Invoice for ${b.id}...`)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download E-Ticket & Tax Invoice</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel booking ${b.id}? Refund will be credited to your Yatra Wallet.`)) {
                          onCancelBooking(b.id);
                        }
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Ticket className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">No active bookings yet.</p>
                  <p className="text-xs text-slate-400">Explore Flights, Vande Bharat trains, and Yatra packages from the master home.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WALLET & COINS */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-5 rounded-2xl text-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-100">Yatra Cash Wallet</span>
                    <Wallet className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div className="text-3xl font-extrabold mt-3">
                    ₹{userProfile.walletBalance.toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-emerald-100 mt-1">Instant 1-click booking without OTP</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl text-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-100">YatraClub Loyalty Coins</span>
                    <Coins className="w-5 h-5 text-amber-200" />
                  </div>
                  <div className="text-3xl font-extrabold mt-3">
                    {userProfile.yatraCoins} Coins
                  </div>
                  <p className="text-xs text-amber-100 mt-1">Worth ₹{userProfile.yatraCoins} in flight & hotel discounts</p>
                </div>
              </div>

              {/* Instant Recharge Simulator */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h5 className="text-sm font-bold text-slate-900">Quick Wallet Recharge</h5>
                <p className="text-xs text-slate-500">Get 5% extra cashback coins on recharges above ₹2,000.</p>

                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setRechargeAmount(amt)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        rechargeAmount === amt
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      + ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRecharge}
                  disabled={isRecharging}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isRecharging ? "Adding to Wallet via UPI..." : `Recharge ₹${rechargeAmount} Now`}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GST PROFILE */}
          {activeTab === "gst" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Registered Corporate GSTIN Profile</span>
                </div>
                <p className="text-xs text-indigo-800/80 leading-relaxed">
                  All flight, hotel, and corporate cab bookings under this account will automatically generate B2B GST tax invoices with 18% Input Tax Credit.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Company Name</span>
                    <span className="font-bold text-slate-800 text-sm">{userProfile.companyName}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN Number</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{userProfile.gstNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAVED TRAVELERS */}
          {activeTab === "travelers" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-slate-900">Saved Passenger Master List</h5>
                <button
                  onClick={() => alert("Added new traveler to master profile.")}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  + Add Traveler
                </button>
              </div>

              {[
                { name: "Aditya Sharma", age: 34, gender: "Male", idType: "Aadhaar Card (Verified)" },
                { name: "Meera Sharma", age: 31, gender: "Female", idType: "Passport (Verified)" },
                { name: "Aarav Sharma", age: 6, gender: "Male", idType: "Child (DOB Verified)" },
              ].map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {t.name[0]}
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">{t.name}</h6>
                      <p className="text-[11px] text-slate-500">{t.gender}, {t.age} yrs • {t.idType}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Ready for 1-Click
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
