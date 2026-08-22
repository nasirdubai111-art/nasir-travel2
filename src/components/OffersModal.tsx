import React, { useState } from "react";
import {
  X,
  Tag,
  Copy,
  Check,
  Sparkles,
  Plane,
  Train,
  Building2,
  Car,
  Percent,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Plus,
  Users,
  CheckCircle2,
} from "lucide-react";
import { TravelOffer, ServiceCategory } from "../types";
import { PROMO_OFFERS } from "../data/mockTravelData";
import { PROMOTION_COUPONS, CouponRule } from "../data/loyaltyOffersData";

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: ServiceCategory) => void;
}

type PromoTab = "coupons" | "bank_deals" | "creator" | "analytics";

export function OffersModal({
  isOpen,
  onClose,
  onSelectCategory,
}: OffersModalProps) {
  const [activeTab, setActiveTab] = useState<PromoTab>("coupons");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [couponsList, setCouponsList] = useState<CouponRule[]>(PROMOTION_COUPONS);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("10");
  const [newCouponCategory, setNewCouponCategory] = useState("flights");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newRule: CouponRule = {
      id: `CPN-${Date.now()}`,
      code: newCouponCode.toUpperCase(),
      title: `${newCouponCode.toUpperCase()} Special Promo`,
      description: `Save ${newCouponDiscount}% instantly on ${newCouponCategory} booking.`,
      category: newCouponCategory as any,
      discountType: "percentage",
      discountValue: parseInt(newCouponDiscount) || 10,
      maxDiscountCap: 1000,
      minBookingAmount: 2000,
      validTill: "31 Dec 2026",
      terms: ["Instant checkout validation", "Valid for all verified users"],
      totalRedemptions: 0,
      status: "active",
    };

    setCouponsList([newRule, ...couponsList]);
    setNewCouponCode("");
    setSuccessToast(`Promo Code ${newRule.code} created & deployed live!`);
    setTimeout(() => setSuccessToast(null), 3000);
    setActiveTab("coupons");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">BharatYatra Offers, Coupons & Promotion Engine</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Instant Discount Rails
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Bank Cards, Segmented Promo Codes, Zero Convenience Fee Waivers & Campaign Yield
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "coupons" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> Active Promo Codes ({couponsList.length})
          </button>

          <button
            onClick={() => setActiveTab("bank_deals")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "bank_deals" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Bank & RuPay Deals
          </button>

          <button
            onClick={() => setActiveTab("creator")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "creator" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Create New Coupon
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              activeTab === "analytics" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Campaign Analytics
          </button>
        </div>

        {successToast && (
          <div className="bg-emerald-50 text-emerald-800 px-6 py-2 border-b border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successToast}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
          {/* 1. ACTIVE COUPONS */}
          {activeTab === "coupons" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {couponsList.map((cpn) => (
                <div
                  key={cpn.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 text-[10px] font-black uppercase border border-indigo-200">
                        {cpn.category}
                      </span>
                      {cpn.bankPartner && (
                        <span className="text-[10px] font-bold text-slate-500">{cpn.bankPartner}</span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cpn.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{cpn.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>Min Booking: ₹{cpn.minBookingAmount}</span>
                      <span>•</span>
                      <span>Valid till: {cpn.validTill}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 font-mono font-black text-amber-900 text-xs tracking-wider">
                        {cpn.code}
                      </span>
                      <button
                        onClick={() => handleCopy(cpn.code)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === cpn.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (cpn.category !== "all") {
                          onSelectCategory(cpn.category as ServiceCategory);
                        }
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>Apply Deal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. BANK DEALS */}
          {activeTab === "bank_deals" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">HDFC Bank Credit & Debit Cards</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">15% Instant Off</span>
                  </div>
                  <p className="text-xs text-slate-600">Save up to ₹1,500 on flights and ₹2,000 on luxury hotels with code <span className="font-mono font-bold text-indigo-600">HDFCFLY</span>.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">SBI RuPay Credit Cards on UPI</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">Zero Surcharge + 5% Coins</span>
                  </div>
                  <p className="text-xs text-slate-600">Scan & pay with RuPay credit cards on UPI with zero extra transaction fees.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. COUPON CREATOR */}
          {activeTab === "creator" && (
            <form onSubmit={handleCreateCoupon} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 max-w-lg mx-auto">
              <h4 className="text-sm font-bold text-slate-900">Deploy New Promotional Campaign</h4>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON500, DIWALI20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Category</label>
                  <select
                    value={newCouponCategory}
                    onChange={(e) => setNewCouponCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="flights">Flights</option>
                    <option value="trains">Trains</option>
                    <option value="hotels">Hotels</option>
                    <option value="buses">Buses</option>
                    <option value="pilgrimage">Pilgrimage Yatras</option>
                    <option value="cabs">Cabs</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Create & Activate Promotion Rule
              </button>
            </form>
          )}

          {/* 4. CAMPAIGN ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-slate-500 text-[10px]">Total Discounts Disbursed</p>
                  <p className="text-base font-black text-slate-900 mt-1">₹48.20 Lakhs</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-slate-500 text-[10px]">Attributed GMV</p>
                  <p className="text-base font-black text-emerald-600 mt-1">₹12.40 Cr</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-slate-500 text-[10px]">Campaign ROI</p>
                  <p className="text-base font-black text-indigo-600 mt-1">25.7x</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex items-center justify-between text-xs">
          <p className="text-slate-500 text-[11px]">
            Offers cannot be clubbed with corporate central billing discounts.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
