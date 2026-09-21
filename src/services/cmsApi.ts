// src/services/cmsApi.ts
// Dynamic Banners, Hero Spotlights & Travel Stories CMS API Service

import { apiClient } from "./apiClient";
import { ApiResponse, CMSBanner, BookingVertical } from "../types/api";

const MOCK_BANNERS: CMSBanner[] = [
  {
    id: "bn-vande-bharat",
    title: "Experience 160 km/h Luxury",
    subtitle: "Book Vande Bharat Sleeper & Chair Car with Zero Convenience Fee",
    category: "train",
    imageUrl: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80",
    deeplink: "/trains",
    active: true,
  },
  {
    id: "bn-chardham-yatra",
    title: "Sacred Chardham Yatra 2026",
    subtitle: "Guaranteed VIP Darshan, Helicopter Shuttle & Palki Assistance",
    category: "pilgrimage",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80",
    deeplink: "/pilgrimage",
    active: true,
  },
  {
    id: "bn-kerala-backwaters",
    title: "Alleppey Luxury Houseboat Getaways",
    subtitle: "Authentic Karimeen Pollichathu, Private Sunset Cruise & Ayurveda",
    category: "houseboat",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80",
    deeplink: "/houseboats",
    active: true,
  },
];

export const cmsApi = {
  // Get active banners by category or all
  async getBanners(category?: BookingVertical): Promise<ApiResponse<CMSBanner[]>> {
    const res = await apiClient.get<CMSBanner[]>("/api/cms/banners", {
      headers: category ? { "X-Category": category } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: category ? MOCK_BANNERS.filter((b) => b.category === category) : MOCK_BANNERS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Get destination guides & travel articles
  async getArticles(): Promise<ApiResponse<any[]>> {
    return apiClient.get("/api/cms/articles");
  },

  // Get FAQ items
  async getFaqs(category?: string): Promise<ApiResponse<any[]>> {
    return apiClient.get("/api/cms/faqs", {
      headers: category ? { "X-Category": category } : undefined,
    });
  },
};

export default cmsApi;
