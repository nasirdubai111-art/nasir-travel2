// src/services/tourApi.ts
// Curated Holiday Packages & Multi-Day Tour Circuits API Service

import { apiClient } from "./apiClient";
import { ApiResponse, TourPackage } from "../types/api";

const MOCK_TOURS: TourPackage[] = [
  {
    id: "tour-golden-triangle",
    title: "Royal Golden Triangle: Delhi, Agra & Jaipur Heritage",
    destination: "Delhi - Agra - Jaipur",
    durationDays: 6,
    pricePerPerson: 18500,
    highlights: ["Taj Mahal Sunrise Tour", "Amber Fort Elephant Ride", "Qutub Minar & Red Fort", "Chokhi Dhani Cultural Dinner"],
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80"],
    itinerary: [
      { day: 1, title: "Arrival in Delhi & Historic Sightseeing", activities: ["Old Delhi Rickshaw Ride", "Jama Masjid", "India Gate"] },
      { day: 2, title: "Delhi to Agra & Sunset at Mehtab Bagh", activities: ["Yamuna Expressway Drive", "Agra Fort", "Sunset View of Taj"] },
      { day: 3, title: "Taj Mahal Sunrise & Drive to Jaipur via Fatehpur Sikri", activities: ["Taj Mahal guided tour", "Buland Darwaza", "Check-in Jaipur"] },
    ],
  },
  {
    id: "tour-kashmir-paradise",
    title: "Heaven on Earth: Srinagar, Gulmarg & Pahalgam Tour",
    destination: "Kashmir Valley",
    durationDays: 7,
    pricePerPerson: 24900,
    highlights: ["Shikara Ride on Dal Lake", "Gulmarg Gondola Phase 1 & 2", "Betaab Valley Horse Riding", "Pahalgam Pine Valley"],
    rating: 4.95,
    images: ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80"],
    itinerary: [
      { day: 1, title: "Welcome to Srinagar & Luxury Houseboat Check-in", activities: ["Airport Pickup", "Dal Lake Shikara", "Mughal Gardens"] },
    ],
  },
];

export const tourApi = {
  async getTours(destination?: string): Promise<ApiResponse<TourPackage[]>> {
    const res = await apiClient.get<TourPackage[]>("/api/tours", {
      headers: destination ? { "X-Destination": destination } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_TOURS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async getTourDetails(tourId: string): Promise<ApiResponse<TourPackage | null>> {
    const res = await apiClient.get<TourPackage>(`/api/tours/${tourId}`);
    if (res.success && res.data) return res;
    return {
      success: true,
      data: MOCK_TOURS.find((t) => t.id === tourId) || MOCK_TOURS[0],
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async bookTour(tourId: string, bookingPayload: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/tours/${tourId}/book`, bookingPayload);
  },
};

export default tourApi;
