import React, { useState } from "react";
import {
  X,
  Coins,
  Wallet,
  Sparkles,
  Gift,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Award,
  Crown,
  Users,
  Building,
  UserCheck,
  Percent,
  Calendar,
  Share2,
} from "lucide-react";
import { UserProfile } from "../types";
import { SCRATCH_CARD_REWARDS, ScratchCardReward } from "../data/travelExperienceData";
import { LOYALTY_TIERS, REWARD_COINS_CATALOG, LoyaltyTierInfo, CoinRewardItem } from "../data/loyaltyOffersData";

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onAddMoney: (amount: number) => void;
}

type RewardTab = "tiers" | "coins" | "scratch" | "referral" | "wallets" | "ledger";

export function RewardsModal({
  isOpen,
  onClose,
  userProfile,
  onAddMoney,
}: RewardsModalProps) {
  const [activeTab, setActiveTab] = useState<RewardTab>("tiers");
  const [scratchCards, setScratchCards] = useState<ScratchCardReward[]>(SCRATCH_CARD_REWARDS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimedCoinReward, setClaimedCoinReward] = useState<string | null>(null);
  const [walletTypeView, setWalletTypeView] = useState<"customer" | "agent" | "partner">("customer");

  if (!isOpen) return null;

  const handleScratch = (card: ScratchCardReward) => {
    if (card.isScratched) return;

    setScratchCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isScratched: true } : c))
    );

    if (card.cashbackAmount) {
      onAddMoney(card.cashbackAmount);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleRedeemCoin = (reward: CoinRewardItem) => {
    if (userProfile.yatraCoins < reward.coinsRequired) {
      alert(`You need ${reward.coinsRequired} YatraCoins to redeem this perk. Keep traveling to earn more!`);
      return;
    }
    setClaimedCoinReward(reward.id);
    setTimeout(() => setClaimedCoinReward(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-amber-300">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">BharatYatra Loyalty, Rewards & Wallets</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  5-Tier Privilege Program
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Kohinoor Elite Privileges, 100% YatraCoins Redemptions & Instant Cashback
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Wallet Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Customer YatraCash</p>
                <p className="text-sm font-black text-emerald-400">₹{userProfile.walletBalance.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">YatraCoins (1 Coin = ₹1)</p>
                <p className="text-sm font-black text-amber-400">{userProfile.yatraCoins.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onAddMoney(500)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-xs"
          >
            + Top-up ₹500
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("tiers")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "tiers" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Crown className="w-3.5 h-3.5" /> 5 Loyalty Tiers
          </button>

          <button
            onClick={() => setActiveTab("coins")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "coins" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Coins className="w-3.5 h-3.5" /> YatraCoins Catalog
          </button>

          <button
            onClick={() => setActiveTab("scratch")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "scratch" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Gift className="w-3.5 h-3.5" /> Scratch Cards & Drops
          </button>

          <button
            onClick={() => setActiveTab("referral")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "referral" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Refer & Earn ₹500
          </button>

          <button
            onClick={() => setActiveTab("wallets")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              activeTab === "wallets" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Agent / Partner Wallets
          </button>
        </div>

        {/* Dynamic Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
          {/* 1. 5 LOYALTY TIERS */}
          {activeTab === "tiers" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">BharatYatra 5-Tier Royalty Hierarchy</h4>
                <p className="text-xs text-slate-500">
                  Earn elevated coin multipliers, zero convenience fees, lounge access & VIP Darshan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LOYALTY_TIERS.map((tier) => (
                  <div
                    key={tier.tier}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase ${tier.badgeColor}`}>
                          {tier.tier} ({tier.hindiName})
                        </span>
                        <span className="text-xs font-black text-amber-600">{tier.multiplier}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] space-y-1">
                        <p><span className="text-slate-500 font-semibold">Convenience Fee:</span> <span className="font-bold text-slate-900">{tier.convenienceFeeWaiver}</span></p>
                        <p><span className="text-slate-500 font-semibold">Lounge Access:</span> <span className="font-bold text-slate-900">{tier.loungeAccess}</span></p>
                        <p><span className="text-slate-500 font-semibold">Cancellation:</span> <span className="font-bold text-slate-900">{tier.cancellationBenefit}</span></p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Exclusive Perks:</p>
                        {tier.perks.map((p, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      Annual Eligibility Spend: <span className="font-bold text-slate-700">₹{tier.minSpendAnnual.toLocaleString("en-IN")}+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. YATRACOINS CATALOG */}
          {activeTab === "coins" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">YatraCoins Redemption Store</h4>
                <p className="text-xs text-slate-500">
                  Redeem your earned coins directly for complimentary Vande Bharat meals, flight vouchers & lounge passes
                </p>
              </div>

              {claimedCoinReward && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Perk Voucher claimed! Sent to your registered email and WhatsApp.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REWARD_COINS_CATALOG.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {item.category.toUpperCase()}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[9px] font-black uppercase">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400">Worth ₹{item.originalRupeeValue}</p>
                        <p className="text-sm font-black text-amber-600">{item.coinsRequired} Coins</p>
                      </div>

                      <button
                        onClick={() => handleRedeemCoin(item)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs"
                      >
                        Redeem Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SCRATCH CARDS */}
          {activeTab === "scratch" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mystery Scratch Cards & Cashback Drops</h4>
                <p className="text-xs text-slate-500">Scratch to reveal instant BharatYatra Cash & exclusive discount codes</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {scratchCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleScratch(card)}
                    className={`relative p-5 rounded-3xl border text-center transition-all cursor-pointer overflow-hidden ${
                      card.isScratched
                        ? "bg-amber-50/50 border-amber-300 shadow-xs"
                        : "bg-gradient-to-tr from-indigo-700 via-purple-700 to-amber-600 text-white border-indigo-400 shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    {!card.isScratched ? (
                      <div className="py-6 space-y-2">
                        <Gift className="w-10 h-10 mx-auto text-amber-300 animate-bounce" />
                        <p className="font-extrabold text-sm">TAP TO SCRATCH</p>
                        <p className="text-[11px] text-indigo-100">{card.unscratchedText}</p>
                      </div>
                    ) : (
                      <div className="py-2 space-y-2 animate-in fade-in">
                        <Sparkles className="w-8 h-8 mx-auto text-amber-500" />
                        <h4 className="font-black text-slate-900 text-base">{card.title}</h4>
                        <p className="text-xs text-slate-600">{card.description}</p>
                        {card.promoCode && (
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border">
                              {card.promoCode}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(card.promoCode!);
                              }}
                              className="p-1 text-slate-500 hover:text-indigo-600"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. REFERRAL & EARN */}
          {activeTab === "referral" && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Referral Bounty
                </span>
                <h4 className="text-lg font-black">Invite Friends & Earn ₹500 + 1,000 YatraCoins</h4>
                <p className="text-xs text-slate-300">
                  Give friends ₹500 off on their first journey. When they travel, you get ₹500 in your wallet + 1,000 Coins!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-slate-300 uppercase font-bold">Your Unique Referral Code:</p>
                  <p className="text-base font-black tracking-widest text-amber-400 font-mono">BHARAT-RAJESH26</p>
                </div>
                <button
                  onClick={() => handleCopy("https://bharatyatra.in/invite/BHARAT-RAJESH26")}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Link
                </button>
              </div>
            </div>
          )}

          {/* 5. MULTI-WALLET ARCHITECTURE */}
          {activeTab === "wallets" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Multi-Wallet Ecosystem Overview</h4>
                <p className="text-xs text-slate-500">Separate ring-fenced ledgers for Customers, B2B Travel Agents, and Partner Operators</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-[10px] font-bold">
                    Customer Wallet
                  </span>
                  <p className="text-xs text-slate-500">For passenger bookings, instant refunds & promo cashbacks.</p>
                  <p className="text-lg font-black text-emerald-600">₹{userProfile.walletBalance.toLocaleString("en-IN")}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                    Agent Virtual Credit Line
                  </span>
                  <p className="text-xs text-slate-500">Wholesale net ticketing balance with T+0 instant replenishment.</p>
                  <p className="text-lg font-black text-blue-600">₹5,00,000</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Partner Payout Escrow
                  </span>
                  <p className="text-xs text-slate-500">Automated daily bank settlements net of commission & 1% TDS.</p>
                  <p className="text-lg font-black text-amber-600">₹8,42,000</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex items-center justify-between text-xs">
          <p className="text-slate-500 text-[11px]">
            Points expire in 12 months from issuance. Zero maintenance charges.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
