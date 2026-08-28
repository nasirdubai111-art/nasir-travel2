import { SplitBillConfig, SplitBillMember, BookingPassengerDetail, ServiceCategory, UserProfile } from "../types";

const STORAGE_KEY = "bharatyatra_split_bills_v1";

export class SplitBillService {
  /**
   * Load saved split bill configurations from localStorage
   */
  public static getAllSplitBills(): SplitBillConfig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Get split bill by split ID or Booking PNR
   */
  public static getSplitBillById(splitIdOrPnr: string): SplitBillConfig | null {
    const list = this.getAllSplitBills();
    return list.find((s) => s.splitId === splitIdOrPnr || s.pnr === splitIdOrPnr || s.bookingRef === splitIdOrPnr) || null;
  }

  /**
   * Save or update a split bill configuration
   */
  public static saveSplitBill(config: SplitBillConfig): SplitBillConfig {
    const list = this.getAllSplitBills();
    const index = list.findIndex((s) => s.splitId === config.splitId);
    let updated: SplitBillConfig[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = config;
    } else {
      updated = [config, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("bharatyatra:split-bill-updated", { detail: config }));
    } catch (e) {
      console.error("Failed to save split bill:", e);
    }
    return config;
  }

  /**
   * Generate a UPI Deep Link (NPCI Compliant)
   */
  public static generateUpiDeepLink(params: {
    upiId: string;
    payeeName: string;
    amount: number;
    transactionNote: string;
    currency?: string;
  }): string {
    const { upiId, payeeName, amount, transactionNote, currency = "INR" } = params;
    const cleanUpi = upiId.trim();
    const cleanAmount = Math.max(1, Math.round(amount)).toFixed(2);
    const encName = encodeURIComponent(payeeName.trim());
    const encNote = encodeURIComponent(transactionNote.trim());
    return `upi://pay?pa=${cleanUpi}&pn=${encName}&am=${cleanAmount}&cu=${currency}&tn=${encNote}`;
  }

  /**
   * Generate Web Payment Link
   */
  public static generateWebPaymentLink(splitId: string, memberId: string, amount: number, pnr?: string): string {
    const baseUrl = window.location.origin || "https://bharatyatra.in";
    const pnrParam = pnr ? `&pnr=${encodeURIComponent(pnr)}` : "";
    return `${baseUrl}/pay/split?sid=${splitId}&mid=${memberId}&amt=${amount}${pnrParam}`;
  }

  /**
   * Generate Master Group Payment Link
   */
  public static generateMasterGroupLink(splitId: string, pnr?: string): string {
    const baseUrl = window.location.origin || "https://bharatyatra.in";
    const pnrParam = pnr ? `&pnr=${encodeURIComponent(pnr)}` : "";
    return `${baseUrl}/split-pool/${splitId}?ref=bharatyatra${pnrParam}`;
  }

  /**
   * Build initial SplitBillConfig from booking details and passengers
   */
  public static createDefaultSplitConfig(params: {
    totalAmount: number;
    title: string;
    subtitle?: string;
    serviceCategory?: ServiceCategory;
    pnr?: string;
    bookingRef?: string;
    userProfile: UserProfile;
    passengers: Array<{
      id?: string;
      name: string;
      phone?: string;
      email?: string;
      seatNumber?: string;
    }>;
    customUpiId?: string;
    currency?: string;
  }): SplitBillConfig {
    const {
      totalAmount,
      title,
      subtitle,
      serviceCategory,
      pnr,
      bookingRef,
      userProfile,
      passengers,
      customUpiId,
      currency = "INR",
    } = params;

    const splitId = `SPLIT-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const count = Math.max(1, passengers.length);
    const defaultUpi = customUpiId || (userProfile.phone ? `${userProfile.phone.replace(/[^0-9]/g, "").slice(-10)}@upi` : "yatri@bharatyatra.in");
    
    // Equal distribution base
    const baseShare = Math.floor(totalAmount / count);
    const remainder = totalAmount - baseShare * count;

    const members: SplitBillMember[] = passengers.map((p, index) => {
      const isLead = index === 0;
      // allocate remainder to primary or last
      const shareAmount = isLead ? baseShare + remainder : baseShare;
      const percentage = Math.round((shareAmount / totalAmount) * 100);
      const memberId = p.id || `m-${index + 1}`;
      const memberUpi = defaultUpi;
      const note = `BharatYatra Split: ${title.slice(0, 24)}${pnr ? ` (PNR: ${pnr})` : ""}`;

      const upiDeepLink = this.generateUpiDeepLink({
        upiId: memberUpi,
        payeeName: userProfile.name || "BharatYatra Primary Booker",
        amount: shareAmount,
        transactionNote: note,
        currency,
      });

      const paymentLink = this.generateWebPaymentLink(splitId, memberId, shareAmount, pnr);

      return {
        id: memberId,
        name: p.name || (isLead ? userProfile.name || "Primary Booker" : `Traveler ${index + 1}`),
        phone: p.phone || (isLead ? userProfile.phone : "+91 98765 43210"),
        email: p.email || (isLead ? userProfile.email : "co-traveler@bharatyatra.in"),
        upiId: memberUpi,
        seatInfo: p.seatNumber,
        shareAmount,
        percentage,
        isPrimaryBooker: isLead,
        paymentStatus: isLead ? "paid" : "pending",
        paymentLink,
        upiDeepLink,
        paidAt: isLead ? new Date().toISOString() : undefined,
        paymentMethod: isLead ? "Primary Card / UPI" : undefined,
      };
    });

    const collected = members.filter((m) => m.paymentStatus === "paid").reduce((sum, m) => sum + m.shareAmount, 0);

    const config: SplitBillConfig = {
      splitId,
      bookingRef,
      pnr,
      title,
      subtitle,
      serviceCategory,
      totalAmount,
      collectedAmount: collected,
      remainingAmount: totalAmount - collected,
      currency,
      splitMode: "equal",
      members,
      masterPaymentLink: this.generateMasterGroupLink(splitId, pnr),
      primaryBookerUpiId: defaultUpi,
      note: `Split bill for ${title}`,
      createdAt: new Date().toISOString(),
      allSettled: collected >= totalAmount,
    };

    return config;
  }

  /**
   * Recalculate members when split mode changes
   */
  public static recalculateSplit(config: SplitBillConfig, mode: "equal" | "custom" | "percentage" | "by_passenger"): SplitBillConfig {
    const total = config.totalAmount;
    const members = [...config.members];
    const count = members.length;

    if (count === 0) return config;

    if (mode === "equal" || mode === "by_passenger") {
      const base = Math.floor(total / count);
      const rem = total - base * count;

      members.forEach((m, idx) => {
        m.shareAmount = idx === 0 ? base + rem : base;
        m.percentage = Number(((m.shareAmount / total) * 100).toFixed(1));
        m.upiDeepLink = this.generateUpiDeepLink({
          upiId: config.primaryBookerUpiId || m.upiId || "yatri@bharatyatra.in",
          payeeName: config.members[0]?.name || "Primary Booker",
          amount: m.shareAmount,
          transactionNote: `BharatYatra Split: ${config.title.slice(0, 20)}`,
        });
        m.paymentLink = this.generateWebPaymentLink(config.splitId, m.id, m.shareAmount, config.pnr);
      });
    }

    const collected = members.filter((m) => m.paymentStatus === "paid").reduce((sum, m) => sum + m.shareAmount, 0);

    const updated: SplitBillConfig = {
      ...config,
      splitMode: mode,
      members,
      collectedAmount: collected,
      remainingAmount: Math.max(0, total - collected),
      allSettled: collected >= total,
    };

    return updated;
  }

  /**
   * Update individual member share
   */
  public static updateMemberShare(
    config: SplitBillConfig,
    memberId: string,
    newAmount: number
  ): SplitBillConfig {
    const total = config.totalAmount;
    const members = config.members.map((m) => {
      if (m.id === memberId) {
        const amt = Math.max(0, newAmount);
        return {
          ...m,
          shareAmount: amt,
          percentage: Number(((amt / total) * 100).toFixed(1)),
          upiDeepLink: this.generateUpiDeepLink({
            upiId: config.primaryBookerUpiId || m.upiId || "yatri@bharatyatra.in",
            payeeName: config.members[0]?.name || "Primary Booker",
            amount: amt,
            transactionNote: `BharatYatra Split: ${config.title.slice(0, 20)}`,
          }),
          paymentLink: this.generateWebPaymentLink(config.splitId, m.id, amt, config.pnr),
        };
      }
      return m;
    });

    const collected = members.filter((m) => m.paymentStatus === "paid").reduce((sum, m) => sum + m.shareAmount, 0);

    return {
      ...config,
      splitMode: "custom",
      members,
      collectedAmount: collected,
      remainingAmount: Math.max(0, total - collected),
      allSettled: collected >= total,
    };
  }

  /**
   * Toggle payment status for a member
   */
  public static toggleMemberStatus(
    config: SplitBillConfig,
    memberId: string,
    status?: "paid" | "pending" | "reminded",
    method?: string
  ): SplitBillConfig {
    const members = config.members.map((m) => {
      if (m.id === memberId) {
        const nextStatus = status || (m.paymentStatus === "paid" ? "pending" : "paid");
        return {
          ...m,
          paymentStatus: nextStatus,
          paidAt: nextStatus === "paid" ? new Date().toISOString() : undefined,
          paymentMethod: nextStatus === "paid" ? (method || "UPI / Direct Transfer") : undefined,
        };
      }
      return m;
    });

    const collected = members.filter((m) => m.paymentStatus === "paid").reduce((sum, m) => sum + m.shareAmount, 0);

    const updated: SplitBillConfig = {
      ...config,
      members,
      collectedAmount: collected,
      remainingAmount: Math.max(0, config.totalAmount - collected),
      allSettled: collected >= config.totalAmount,
    };

    this.saveSplitBill(updated);
    return updated;
  }

  /**
   * Format WhatsApp message for a single member
   */
  public static formatMemberWhatsAppMessage(config: SplitBillConfig, member: SplitBillMember): string {
    const formattedAmt = `₹${member.shareAmount.toLocaleString("en-IN")}`;
    const pnrText = config.pnr ? ` (PNR: *${config.pnr}*)` : "";
    
    return `🇮🇳 *BharatYatra Trip Bill Split*\n\n` +
      `Hey *${member.name}*! 👋\n` +
      `Here is your share for our booking *${config.title}*${pnrText}:\n\n` +
      `💰 *Your Share:* ${formattedAmt}\n` +
      `💺 *Seat/Pass:* ${member.seatInfo || "Assigned Passenger"}\n` +
      `📊 *Total Group Bill:* ₹${config.totalAmount.toLocaleString("en-IN")}\n\n` +
      `⚡ *Pay your share in 1-Click via UPI / GPay / PhonePe / Paytm:*\n` +
      `${member.paymentLink}\n\n` +
      `📱 *Direct UPI Link:* \`${member.upiDeepLink}\`\n\n` +
      `UPI ID to transfer: *${config.primaryBookerUpiId || "yatri@bharatyatra.in"}*\n` +
      `_Powered by BharatYatra Smart Split_ ✨`;
  }

  /**
   * Format Group WhatsApp summary message
   */
  public static formatGroupWhatsAppMessage(config: SplitBillConfig): string {
    const pnrText = config.pnr ? ` (PNR: *${config.pnr}*)` : "";
    const memberLines = config.members
      .map((m, i) => {
        const icon = m.paymentStatus === "paid" ? "✅ [PAID]" : "⏳ [PENDING]";
        return `${i + 1}. *${m.name}*: ₹${m.shareAmount.toLocaleString("en-IN")} ${icon}`;
      })
      .join("\n");

    return `🇮🇳 *BharatYatra Group Booking Bill Split*\n\n` +
      `✈️ *Trip:* ${config.title}${pnrText}\n` +
      `💵 *Total Booking Amount:* ₹${config.totalAmount.toLocaleString("en-IN")}\n` +
      `👥 *Split Breakdown (${config.members.length} Travelers):*\n` +
      `${memberLines}\n\n` +
      `🔗 *Group Payment & Split Status Pool:* \n${config.masterPaymentLink}\n\n` +
      `⚡ *UPI ID to settle:* *${config.primaryBookerUpiId || "yatri@bharatyatra.in"}*\n` +
      `_Let's settle up before our journey!_ 🎒`;
  }

  /**
   * Format SMS message
   */
  public static formatMemberSmsMessage(config: SplitBillConfig, member: SplitBillMember): string {
    return `BharatYatra: Hi ${member.name}, your share for ${config.title} is Rs.${member.shareAmount}. Pay via UPI/Card link: ${member.paymentLink} (Ref: ${config.pnr || config.splitId})`;
  }
}
