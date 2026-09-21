// src/services/offersApi.ts
// Promotional Deals, Coupon Validation & Discount Calculation API Service

import { apiClient } from "./apiClient";
import { ApiResponse, PromoOffer, BookingVertical } from "../types/api";

const MOCK_OFFERS: PromoOffer[] = [
  {
    code: "BHARATFIRST",
    title: "Flat ₹250 Off on First Booking",
    description: "Valid on Trains, Flights, Buses & Cabs with no minimum spend.",
    vertical: "ALL",
    discountAmount: 250,
    minimumBookingAmount: 500,
    validUntil: "2026-12-31",
  },
  {
    code: "VANDEBHARAT100",
    title: "Save ₹100 on Executive Vande Bharat",
    description: "Exclusive discount on Vande Bharat Executive Chair Car.",
    vertical: "train",
    discountAmount: 100,
    minimumBookingAmount: 1200,
    validUntil: "2026-11-30",
  },
  {
    code: "YATRA15",
    title: "15% Off Sacred Pilgrimage Packages",
    description: "Get up to ₹2,500 off on senior-friendly Chardham & Kashi yatras.",
    vertical: "pilgrimage",
    discountPercentage: 15,
    minimumBookingAmount: 5000,
    validUntil: "2026-10-31",
  },
];

export const offersApi = {
  // Get all active offers
  async getOffers(vertical?: BookingVertical): Promise<ApiResponse<PromoOffer[]>> {
    const res = await apiClient.get<PromoOffer[]>("/api/offers", {
      headers: vertical ? { "X-Vertical": vertical } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: vertical ? MOCK_OFFERS.filter((o) => o.vertical === "ALL" || o.vertical === vertical) : MOCK_OFFERS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Validate coupon code against an amount and vertical
  async validateCoupon(code: string, amount: number, vertical: BookingVertical): Promise<ApiResponse<{ valid: boolean; discountAmount: number; message: string }>> {
    const res = await apiClient.post("/api/offers/validate", { code, amount, vertical });
    if (res.success && res.data) return res;

    const offer = MOCK_OFFERS.find((o) => o.code.toUpperCase() === code.trim().toUpperCase());
    if (!offer) {
      return {
        success: false,
        error: "Invalid or expired coupon code",
        data: { valid: false, discountAmount: 0, message: "Invalid coupon code" },
        timestamp: new Date().toISOString(),
      };
    }

    if (amount < offer.minimumBookingAmount) {
      return {
        success: false,
        error: `Minimum booking value of ₹${offer.minimumBookingAmount} required`,
        data: { valid: false, discountAmount: 0, message: `Minimum spend ₹${offer.minimumBookingAmount} required` },
        timestamp: new Date().toISOString(),
      };
    }

    const discount = offer.discountAmount || Math.round((amount * (offer.discountPercentage || 0)) / 100);

    return {
      success: true,
      data: {
        valid: true,
        discountAmount: discount,
        message: `Coupon applied successfully! You saved ₹${discount}`,
      },
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },
};

export default offersApi;
