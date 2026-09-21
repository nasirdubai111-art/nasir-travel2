// src/services/hotelApi.ts
// Hotel Inventory, Room Availability & Booking API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Hotel, HotelSearchParams } from "../types/api";

const MOCK_HOTELS: Hotel[] = [
  {
    id: "htl-taj-ganga-vns",
    name: "Taj Ganges Varanasi",
    city: "Varanasi",
    address: "Nadesar Palace Grounds, Varanasi, UP 221002",
    starRating: 5,
    pricePerNight: 9800,
    guestRating: 4.9,
    reviewsCount: 1420,
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
    ],
    amenities: ["Swimming Pool", "Spa & Wellness", "Ganga Aarti Shuttle", "Fine Dining Pure Veg", "Free Wi-Fi"],
    rooms: [
      {
        roomId: "rm-deluxe",
        name: "Deluxe Palace View Room",
        capacity: "2 Adults, 1 Child",
        pricePerNight: 9800,
        availableCount: 4,
        amenities: ["King Bed", "Garden View", "Breakfast Included"],
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80"],
      },
      {
        roomId: "rm-suite",
        name: "Executive Heritage Suite",
        capacity: "3 Adults",
        pricePerNight: 16500,
        availableCount: 2,
        amenities: ["King Bed", "Living Room", "Butler Service", "VIP Darshan Access"],
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"],
      },
    ],
  },
  {
    id: "htl-leela-delhi",
    name: "The Leela Palace Chanakyapuri",
    city: "New Delhi",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    starRating: 5,
    pricePerNight: 14500,
    guestRating: 4.95,
    reviewsCount: 2150,
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"],
    amenities: ["Rooftop Infinity Pool", "ESPA Spa", "Luxury Airport Limo", "Michelin-Standard Dining"],
    rooms: [
      {
        roomId: "rm-grand-deluxe",
        name: "Grand Deluxe Room",
        capacity: "2 Adults",
        pricePerNight: 14500,
        availableCount: 5,
        amenities: ["King Bed", "City Skyline", "Marble Bath"],
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"],
      },
    ],
  },
];

export const hotelApi = {
  // Search hotels by city & criteria
  async searchHotels(params: HotelSearchParams): Promise<ApiResponse<Hotel[]>> {
    const res = await apiClient.post<Hotel[]>("/api/hotels/search", params);
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_HOTELS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Hotel details
  async getHotelDetails(hotelId: string): Promise<ApiResponse<Hotel | null>> {
    const res = await apiClient.get<Hotel>(`/api/hotels/${hotelId}`);
    if (res.success && res.data) return res;
    const item = MOCK_HOTELS.find((h) => h.id === hotelId) || MOCK_HOTELS[0];
    return {
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Room availability check
  async checkRoomAvailability(hotelId: string, roomId: string, dates: { checkIn: string; checkOut: string }): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/hotels/${hotelId}/rooms/${roomId}/availability`, dates);
  },
};

export default hotelApi;
