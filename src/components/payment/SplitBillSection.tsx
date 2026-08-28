import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Share2,
  Send,
  Copy,
  Check,
  QrCode,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  Percent,
  Trash2,
  Download,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { SplitBillConfig, SplitBillMember, ServiceCategory, UserProfile } from "../../types";
import { SplitBillService } from "../../services/SplitBillService";
import { SplitBillQRModal } from "./SplitBillQRModal";

interface SplitBillSectionProps {
  initialConfig?: SplitBillConfig;
  totalAmount: number;
  title: string;
  subtitle?: string;
  serviceCategory?: ServiceCategory;
  pnr?: string;
  userProfile: UserProfile;
  passengersList: Array<{
    id?: string;
    name: string;
    phone?: string;
    email?: string;
    seatPreference?: string;
    seatNumber?: string;
  }>;
  isConfirmed?: boolean;
  onConfigChange?: (config: SplitBillConfig) => void;
  compact?: boolean;
}

export const SplitBillSection: React.FC<SplitBillSectionProps> = ({
  initialConfig,
  totalAmount,
  title,
  subtitle,
  serviceCategory = "flights",
  pnr,
  userProfile,
  passengersList,
  isConfirmed = false,
  onConfigChange,
  compact = false,
}) => {
  const [config, setConfig] = useState<SplitBillConfig>(() => {
    if (initialConfig) return initialConfig;
    return SplitBillService.createDefaultSplitConfig({
      totalAmount,
      title,
      subtitle,
      serviceCategory,
      pnr,
      userProfile,
      passengers: passengersList.map((p) => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        email: p.email,
        seatNumber: p.seatPreference || p.seatNumber,
      })),
    });
  });

  const [activeQRMember, setActiveQRMember] = useState<SplitBillMember | null>(null);
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);
  const [copiedMasterLink, setCopiedMasterLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingCustom, setEditingCustom] = useState(false);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});

  // Sync if totalAmount or passenger count changes
  useEffect(() => {
    if (!initialConfig) {
      const newConfig = SplitBillService.createDefaultSplitConfig({
        totalAmount,
        title,
        subtitle,
        serviceCategory,
        pnr,
        userProfile,
        passengers: passengersList.map((p) => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          email: p.email,
          seatNumber: p.seatPreference || p.seatNumber,
        })),
        customUpiId: config.primaryBookerUpiId,
      });
      setConfig(newConfig);
      onConfigChange?.(newConfig);
    }
  }, [totalAmount, passengersList.length, pnr]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleModeChange = (mode: "equal" | "custom" | "percentage") => {
    const updated = SplitBillService.recalculateSplit(config, mode);
    setConfig(updated);
    onConfigChange?.(updated);
    showToast(`Switched split mode to: ${mode.toUpperCase()}`);
  };

  const handleUpdateCustomAmount = (memberId: string, value: number) => {
    setCustomAmounts((prev) => ({ ...prev, [memberId]: value }));
    const updated = SplitBillService.updateMemberShare(config, memberId, value);
    setConfig(updated);
    onConfigChange?.(updated);
  };

  const handleToggleStatus = (memberId: string) => {
    const member = config.members.find((m) => m.id === memberId);
    if (!member) return;
    const nextStatus = member.paymentStatus === "paid" ? "pending" : "paid";
    const updated = SplitBillService.toggleMemberStatus(config, memberId, nextStatus);
    setConfig(updated);
    onConfigChange?.(updated);
    showToast(
      nextStatus === "paid"
        ? `Marked ${member.name}'s share as Received (₹${member.shareAmount.toLocaleString("en-IN")})!`
        : `Marked ${member.name}'s share as Pending.`
    );
  };

  const handleNudgeMember = (member: SplitBillMember) => {
    const updated = SplitBillService.toggleMemberStatus(config, member.id, "reminded");
    setConfig(updated);
    onConfigChange?.(updated);
    showToast(`Payment reminder SMS & Push notification simulated for ${member.name}!`);
  };

  const handleCopyLink = (member: SplitBillMember) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(member.paymentLink);
      setCopiedMemberId(member.id);
      showToast(`Payment link for ${member.name} copied to clipboard!`);
      setTimeout(() => setCopiedMemberId(null), 2000);
    }
  };

  const handleShareWhatsAppMember = (member: SplitBillMember) => {
    const msg = SplitBillService.formatMemberWhatsAppMessage(config, member);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    showToast(`Opening WhatsApp with personalized split link for ${member.name}...`);
  };

  const handleShareGroupWhatsApp = () => {
    const msg = SplitBillService.formatGroupWhatsAppMessage(config);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    showToast("Opening WhatsApp with group split summary...");
  };

  const handleCopyMasterLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(config.masterPaymentLink);
      setCopiedMasterLink(true);
      showToast("Group Master Split link copied to clipboard!");
      setTimeout(() => setCopiedMasterLink(false), 2000);
    }
  };

  const handleAddCoPayer = () => {
    const nextIdx = config.members.length + 1;
    const newMemberId = `m-extra-${Date.now()}`;
    const newMembers = [
      ...config.members,
      {
        id: newMemberId,
        name: `Friend / Contributor ${nextIdx}`,
        phone: "+91 98765 00000",
        email: "contributor@bharatyatra.in",
        shareAmount: 0,
        percentage: 0,
        isPrimaryBooker: false,
        paymentStatus: "pending" as const,
        paymentLink: SplitBillService.generateWebPaymentLink(config.splitId, newMemberId, 0, config.pnr),
        upiDeepLink: SplitBillService.generateUpiDeepLink({
          upiId: config.primaryBookerUpiId || "yatri@bharatyatra.in",
          payeeName: config.members[0]?.name || "Primary Booker",
          amount: 0,
          transactionNote: `BharatYatra Split: ${config.title}`,
        }),
      },
    ];

    const updatedConfig: SplitBillConfig = {
      ...config,
      members: newMembers,
    };
    const recalculated = SplitBillService.recalculateSplit(updatedConfig, "equal");
    setConfig(recalculated);
    onConfigChange?.(recalculated);
    showToast("Added extra friend to split bill & recalculated shares!");
  };

  const handleRemoveMember = (memberId: string) => {
    if (config.members.length <= 1) {
      alert("At least 1 member is required for split bill.");
      return;
    }
    const filtered = config.members.filter((m) => m.id !== memberId);
    const updatedConfig: SplitBillConfig = {
      ...config,
      members: filtered,
    };
    const recalculated = SplitBillService.recalculateSplit(updatedConfig, "equal");
    setConfig(recalculated);
    onConfigChange?.(recalculated);
    showToast("Removed member and rebalanced remaining shares.");
  };

  const handleDownloadReceipt = () => {
    const summaryText = `=========================================\n` +
      `BHARATYATRA TRAVEL BILL SPLIT RECEIPT\n` +
      `=========================================\n` +
      `Trip: ${config.title}\n` +
      `PNR: ${config.pnr || "N/A"}\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `Total Booking Cost: ₹${config.totalAmount.toLocaleString("en-IN")}\n` +
      `Total Collected: ₹${config.collectedAmount.toLocaleString("en-IN")}\n` +
      `Remaining Due: ₹${config.remainingAmount.toLocaleString("en-IN")}\n` +
      `Status: ${config.allSettled ? "ALL SETTLED ✅" : "SETTLEMENT IN PROGRESS ⏳"}\n\n` +
      `MEMBER BREAKDOWN:\n` +
      config.members.map((m, i) => `${i + 1}. ${m.name}: ₹${m.shareAmount} [${m.paymentStatus.toUpperCase()}]`).join("\n") +
      `\n\nGenerated via BharatYatra Smart Split Platform.`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BharatYatra-SplitBill-${config.pnr || config.splitId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded Split Bill Summary text receipt!");
  };

  const percentCollected = Math.min(100, Math.round((config.collectedAmount / Math.max(1, config.totalAmount)) * 100));

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-xl animate-in fade-in flex items-center justify-between shadow-md">
          <span>{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
        </div>
      )}

      {/* Main Container Card */}
      <div className="rounded-2xl border-2 border-indigo-500/80 bg-white p-4 sm:p-5 space-y-4 shadow-sm relative overflow-hidden">
        {/* Top Watermark Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Smart Split Bill &amp; Payment Links
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Instant UPI Links
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Share cost with fellow travelers via generated UPI &amp; Web payment links
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareGroupWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share All on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyMasterLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              title="Copy group split master link"
            >
              {copiedMasterLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Group Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Total Cost & Collection Progress Bar */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/40 rounded-xl p-3.5 border border-indigo-100 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Bill Amount
              </span>
              <span className="text-lg font-black text-slate-900">
                ₹{config.totalAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5 font-medium">
                across {config.members.length} {config.members.length === 1 ? "person" : "travelers"}
              </span>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-bold text-emerald-700">
                  Collected: ₹{config.collectedAmount.toLocaleString("en-IN")}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-amber-700">
                  Pending: ₹{config.remainingAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 block">
                {percentCollected}% Settled ({config.members.filter((m) => m.paymentStatus === "paid").length} of {config.members.length} Paid)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${percentCollected}%` }}
            />
          </div>
        </div>

        {/* Split Mode Selector */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Split Mode:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => handleModeChange("equal")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                config.splitMode === "equal"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200 font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equal (1/N)</span>
            </button>

            <button
              onClick={() => {
                setEditingCustom(!editingCustom);
                if (config.splitMode !== "custom") handleModeChange("custom");
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                config.splitMode === "custom"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200 font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom (₹)</span>
            </button>

            <button
              onClick={handleAddCoPayer}
              className="px-2.5 py-1 rounded-lg text-indigo-700 hover:bg-indigo-50 flex items-center gap-1 transition-colors cursor-pointer border border-dashed border-indigo-200 ml-1"
              title="Add non-traveling contributor"
            >
              <UserPlus className="w-3 h-3" />
              <span>+ Co-Payer</span>
            </button>
          </div>
        </div>

        {/* Member Cards List */}
        <div className="space-y-2.5">
          {config.members.map((member, index) => {
            const isLead = member.isPrimaryBooker;
            const isPaid = member.paymentStatus === "paid";
            const isReminded = member.paymentStatus === "reminded";

            return (
              <div
                key={member.id || index}
                className={`p-3.5 rounded-xl border transition-all ${
                  isPaid
                    ? "bg-emerald-50/40 border-emerald-200"
                    : isReminded
                    ? "bg-amber-50/40 border-amber-200"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Member Info */}
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPaid
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">
                          {member.name}
                        </span>
                        {isLead && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                            Lead Booker
                          </span>
                        )}
                        {member.seatInfo && (
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {member.seatInfo.split("•")[0] || member.seatInfo}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {member.phone || "+91 98765 43210"}
                      </span>
                    </div>
                  </div>

                  {/* Share Amount & Input (if Custom) */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {config.splitMode === "custom" && editingCustom ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-500">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={customAmounts[member.id] ?? member.shareAmount}
                          onChange={(e) =>
                            handleUpdateCustomAmount(member.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">
                          ₹{member.shareAmount.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {member.percentage}% of bill
                        </span>
                      </div>
                    )}

                    {/* Status Pill */}
                    <div className="ml-1">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Paid</span>
                        </span>
                      ) : isReminded ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Reminded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-slate-200 text-slate-700">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Direct Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/70 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* WhatsApp Pay Link */}
                    <button
                      type="button"
                      onClick={() => handleShareWhatsAppMember(member)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Send payment link on WhatsApp"
                    >
                      <Send className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp Link</span>
                    </button>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(member)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy payment link"
                    >
                      {copiedMemberId === member.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {/* Show QR Modal */}
                    <button
                      type="button"
                      onClick={() => setActiveQRMember(member)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Show Instant UPI QR Code"
                    >
                      <QrCode className="w-3 h-3 text-indigo-600" />
                      <span>UPI QR</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Send Nudge / Reminder */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => handleNudgeMember(member)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Send SMS / Push reminder"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Nudge</span>
                      </button>
                    )}

                    {/* Toggle Paid / Settle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(member.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border ${
                        isPaid
                          ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isPaid ? "Received ✓" : "Mark Paid"}</span>
                    </button>

                    {/* Remove extra co-payer */}
                    {config.members.length > passengersList.length && !isLead && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Remove co-payer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>NPCI / UPI Deep Links • Real-Time Split Reconciliation</span>
          </div>

          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Split Receipt</span>
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {activeQRMember && (
        <SplitBillQRModal
          isOpen={!!activeQRMember}
          onClose={() => setActiveQRMember(null)}
          config={config}
          member={activeQRMember}
          onStatusChange={(newStatus) => {
            const updated = SplitBillService.toggleMemberStatus(config, activeQRMember.id, newStatus);
            setConfig(updated);
            onConfigChange?.(updated);
            setActiveQRMember(null);
          }}
        />
      )}
    </div>
  );
};
