// Client-side API Service Gateway for BharatYatra Super App

export interface PricingBreakdown {
  serviceType: string;
  passengers: number;
  baseFarePerPax: number;
  totalBaseFare: number;
  discountAmount: number;
  taxableAmount: number;
  gstRatePercent: number;
  gstAmount: number;
  insuranceAmount: number;
  finalPayableAmount: number;
  currency: string;
}

export interface BookingPayload {
  serviceType: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  amount: number;
  passengers: number;
  seatInfo: string;
}

export const api = {
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch("/api/health");
      return await res.json();
    } catch (err) {
      console.error("API Health check failed:", err);
      return { status: "offline" };
    }
  },

  // Calculate pricing via backend pricing engine
  async calculatePricing(payload: {
    serviceType: string;
    baseFare: number;
    passengers?: number;
    couponCode?: string;
    isInsuranceSelected?: boolean;
  }): Promise<PricingBreakdown | null> {
    try {
      const res = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.breakdown;
    } catch (err) {
      console.error("Pricing API error:", err);
      return null;
    }
  },

  // Create booking via backend booking engine
  async createBooking(payload: BookingPayload) {
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.error("Booking API error:", err);
      return { success: false, error: "Network error creating booking" };
    }
  },

  // Cancel booking & process instant refund
  async cancelBooking(bookingId: string) {
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      return await res.json();
    } catch (err) {
      console.error("Cancel Booking API error:", err);
      return { success: false, error: "Network error cancelling booking" };
    }
  },

  // Verify Admin RBAC session
  async verifyAdminSession(role: string, pin: string) {
    try {
      const res = await fetch("/api/auth/verify-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, pin }),
      });
      return await res.json();
    } catch (err) {
      console.error("Admin Auth API error:", err);
      return { success: false, error: "Authentication service unavailable" };
    }
  },

  // Verify IRCTC PNR Status
  async verifyPnr(pnr: string) {
    try {
      const res = await fetch("/api/pnr-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr }),
      });
      return await res.json();
    } catch (err) {
      console.error("PNR API error:", err);
      return { error: "Failed to fetch PNR status" };
    }
  },

  // AI Concierge Chat
  async chatWithMaya(messages: Array<{ role: string; content: string }>, activeLocation?: any, activeCategory?: string) {
    try {
      const res = await fetch("/api/chat-travel-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, activeLocation, activeCategory }),
      });
      return await res.json();
    } catch (err) {
      console.error("Maya Chat API error:", err);
      return { reply: "Namaste! I am here to help you navigate India's top travel destinations, Vande Bharat trains, and heritage stays." };
    }
  },

  // AI Travel Planner
  async planAITrip(params: {
    prompt: string;
    originCity: string;
    destinationCity: string;
    travelers: number;
    budget: string;
    travelStyle: string;
  }) {
    try {
      const res = await fetch("/api/ai-travel-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err) {
      console.error("AI Travel Planner API error:", err);
      return { success: false, error: "AI Planner service unavailable" };
    }
  },
};
