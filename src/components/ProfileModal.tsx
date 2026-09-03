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
  Globe,
  RefreshCw,
  ArrowRightLeft,
  Check,
  History,
  Search,
} from "lucide-react";
import { UserProfile, BookingItem } from "../types";
import { SUPPORTED_CURRENCIES, convertFromInr, getCurrencyInfo } from "../data/currencyData";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  bookings: BookingItem[];
  onAddMoney: (amount: number) => void;
  onCancelBooking: (id: string) => void;
  onUpdatePreferredCurrency?: (curr: string) => void;
  onSelectSearchQuery?: (query: string) => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  userProfile,
  bookings,
  onAddMoney,
  onCancelBooking,
  onUpdatePreferredCurrency,
  onSelectSearchQuery,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "wallet" | "searches" | "currency" | "gst" | "travelers">("bookings");
  const [rechargeAmount, setRechargeAmount] = useState(1000);
  const [isRecharging, setIsRecharging] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(userProfile.preferredCurrency || "INR");
  const [calcInrAmount, setCalcInrAmount] = useState<number>(5000);

  if (!isOpen) return null;

  const handleRecharge = () => {
    setIsRecharging(true);
    setTimeout(() => {
      onAddMoney(rechargeAmount);
      setIsRecharging(false);
    }, 600);
  };

  const handleSelectCurrency = (currCode: string) => {
    setSelectedCurrency(currCode);
    if (onUpdatePreferredCurrency) {
      onUpdatePreferredCurrency(currCode);
    }
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
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-300/30 text-indigo-200 text-[10px] font-semibold">
                  Currency: {selectedCurrency}
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
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
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "wallet"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet & Coins</span>
          </button>

          <button
            onClick={() => setActiveTab("searches")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "searches"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Recent Searches ({userProfile.recentSearches?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("currency")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "currency"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Currency Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab("gst")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
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
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "travelers"
                ? "border-indigo-600 text-indigo-600 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Saved Travelers</span>
          </button>
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
                      {getServiceBadge(b.serviceType || "tours")}
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

                  <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{b.title}</h5>
                      <p className="text-xs text-slate-500">{b.subtitle || `${b.fromLocation || "Origin"} ➔ ${b.toLocation || "Destination"}`}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-indigo-600">
                        ₹{(b.amount || 0).toLocaleString("en-IN")}
                      </span>
                      <p className="text-[11px] text-slate-400">{b.date} • {b.time || "10:00 AM"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">{b.seatInfo || "Confirmed Seats"}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Downloaded Official Tax Invoice for ${b.id}`)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 text-xs"
                      >
                        <Download className="w-3 h-3" />
                        Invoice
                      </button>
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                      >
                        Cancel Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: WALLET & COINS */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-emerald-100 text-xs font-semibold">
                    <span>BharatYatra Direct Cash Wallet</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black">₹{userProfile.walletBalance.toLocaleString("en-IN")}</div>
                  <p className="text-[11px] text-emerald-100">Zero-OTP 1-Click Instant Bookings Enabled</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-amber-100 text-xs font-semibold">
                    <span>YatraCoins Loyalty Balance</span>
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black">{userProfile.yatraCoins} Coins</div>
                  <p className="text-[11px] text-amber-100">1 Coin = ₹1.00 Value on Flights & Luxury Hotels</p>
                </div>
              </div>

              {/* Instant Wallet Recharge */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Instant Wallet Top-up (UPI & NetBanking)</span>
                </h5>

                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000, 5000, 10000].map((amt) => (
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

          {/* TAB: RECENT SEARCHES */}
          {activeTab === "searches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    <span>Recent Search History</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Saved in your user profile for 1-click lightning access across all travel booking modes.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  {userProfile.recentSearches?.length || 0} / 5 Slots
                </span>
              </div>

              {(!userProfile.recentSearches || userProfile.recentSearches.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">No recent searches saved yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your next flights, trains, hotels, and yatra searches will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userProfile.recentSearches.map((queryText, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate block group-hover:text-indigo-600 transition-colors">
                            {queryText}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Persistent across userProfile sessions
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectSearchQuery) {
                              onSelectSearchQuery(queryText);
                            }
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Search className="w-3 h-3" />
                          <span>Search Now</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRENCY PREFERENCES */}
          {activeTab === "currency" && (
            <div className="space-y-6">
              {/* Header & Quick Selector */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>International Currency Preferences</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Choose your default display currency for bookings, packages, and checkouts. Rates are benchmarked against live Reserve Bank of India (RBI) reference rates.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
                    <span>Active:</span> {selectedCurrency}
                  </span>
                </div>

                {/* Currency Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
                  {SUPPORTED_CURRENCIES.map((curr) => {
                    const isSelected = selectedCurrency === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => handleSelectCurrency(curr.code)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? "border-indigo-600 bg-white ring-2 ring-indigo-500 shadow-xs"
                            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{curr.flag}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-900">{curr.code}</div>
                        <div className="text-[11px] text-slate-500 truncate">{curr.symbol} {curr.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Exchange Rate Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Live Exchange Rates (Base: 1 INR)</h5>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Updated Real-Time</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-12 px-5 py-2.5 bg-slate-100/70 font-bold text-slate-600 text-[11px] uppercase">
                    <span className="col-span-4">Currency</span>
                    <span className="col-span-3 text-right">Rate (per 1 INR)</span>
                    <span className="col-span-3 text-right">INR Value (1 Unit)</span>
                    <span className="col-span-2 text-center">Action</span>
                  </div>

                  {SUPPORTED_CURRENCIES.map((curr) => {
                    const isSelected = selectedCurrency === curr.code;
                    return (
                      <div
                        key={curr.code}
                        className={`grid grid-cols-12 px-5 py-3 items-center hover:bg-indigo-50/40 transition-colors ${
                          isSelected ? "bg-indigo-50/60 font-semibold" : ""
                        }`}
                      >
                        <div className="col-span-4 flex items-center gap-2">
                          <span className="text-base">{curr.flag}</span>
                          <div>
                            <span className="font-bold text-slate-900">{curr.code}</span>
                            <span className="text-[11px] text-slate-500 ml-1.5 hidden sm:inline">({curr.name})</span>
                          </div>
                        </div>
                        <div className="col-span-3 text-right font-mono text-slate-700">
                          {curr.ratePerInr >= 1 ? curr.ratePerInr.toFixed(2) : curr.ratePerInr.toFixed(4)} {curr.symbol}
                        </div>
                        <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                          ₹{curr.inrPerUnit.toFixed(2)}
                        </div>
                        <div className="col-span-2 text-center">
                          {isSelected ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSelectCurrency(curr.code)}
                              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Converter Calculator */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-700 block mb-1">Quick Conversion Preview (INR to {selectedCurrency})</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      value={calcInrAmount}
                      onChange={(e) => setCalcInrAmount(Math.max(0, Number(e.target.value)))}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-400">INR</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto text-left sm:text-right bg-white p-3 rounded-xl border border-slate-200 flex-1 sm:max-w-xs">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">Calculated Output</span>
                  <span className="text-lg font-black text-indigo-600">
                    {convertFromInr(calcInrAmount, selectedCurrency).formatted}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    1 {selectedCurrency} = ₹{getCurrencyInfo(selectedCurrency).inrPerUnit.toFixed(2)} INR
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GST PROFILE */}
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
                    <span className="font-bold text-slate-800 text-sm">{userProfile.companyName || "Bharat Enterprises Pvt Ltd"}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN Number</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{userProfile.gstNumber || "07AAAAA0000A1Z5"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAVED TRAVELERS */}
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
