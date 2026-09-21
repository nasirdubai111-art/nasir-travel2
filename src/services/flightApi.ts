// src/services/flightApi.ts
// Flight Search, Seat Selection & Airfare Ticketing API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Flight, FlightSearchParams } from "../types/api";

const MOCK_FLIGHTS: Flight[] = [
  {
    id: "fl-6e-2041",
    flightNumber: "6E-2041",
    airline: "IndiGo",
    airlineCode: "6E",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop&q=80",
    origin: "DEL",
    originCity: "New Delhi",
    destination: "BOM",
    destinationCity: "Mumbai",
    departureTime: "06:15",
    arrivalTime: "08:30",
    duration: "2h 15m",
    stops: 0,
    price: 4850,
    aircraft: "Airbus A321neo",
    cabinClasses: ["Economy", "Corporate Flex"],
    baggageAllowance: "15 kg Check-in, 7 kg Cabin",
    refundable: true,
  },
  {
    id: "fl-ai-805",
    flightNumber: "AI-805",
    airline: "Air India",
    airlineCode: "AI",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80",
    origin: "DEL",
    originCity: "New Delhi",
    destination: "BLR",
    destinationCity: "Bengaluru",
    departureTime: "09:45",
    arrivalTime: "12:35",
    duration: "2h 50m",
    stops: 0,
    price: 5920,
    aircraft: "Boeing 787-8 Dreamliner",
    cabinClasses: ["Economy", "Premium Economy", "Business"],
    baggageAllowance: "25 kg Check-in, 8 kg Cabin",
    refundable: true,
  },
  {
    id: "fl-uk-975",
    flightNumber: "UK-975",
    airline: "Vistara",
    airlineCode: "UK",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop&q=80",
    origin: "BOM",
    originCity: "Mumbai",
    destination: "VNS",
    destinationCity: "Varanasi (Kashi)",
    departureTime: "14:20",
    arrivalTime: "16:30",
    duration: "2h 10m",
    stops: 0,
    price: 5120,
    aircraft: "Airbus A320neo",
    cabinClasses: ["Economy", "Business"],
    baggageAllowance: "15 kg Check-in, 7 kg Cabin",
    refundable: true,
  },
];

export const flightApi = {
  // Search flights across routes & cabins
  async searchFlights(params: FlightSearchParams): Promise<ApiResponse<Flight[]>> {
    const res = await apiClient.post<Flight[]>("/api/flights/search", params);
    if (res.success && res.data && res.data.length > 0) {
      return res;
    }
    // Filter mock data as fallback
    const filtered = MOCK_FLIGHTS.filter((f) => {
      if (params.origin && !f.origin.toLowerCase().includes(params.origin.toLowerCase()) && !f.originCity.toLowerCase().includes(params.origin.toLowerCase())) {
        return false;
      }
      if (params.destination && !f.destination.toLowerCase().includes(params.destination.toLowerCase()) && !f.destinationCity.toLowerCase().includes(params.destination.toLowerCase())) {
        return false;
      }
      return true;
    });

    return {
      success: true,
      data: filtered.length > 0 ? filtered : MOCK_FLIGHTS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Flight schedule details
  async getFlightDetails(flightId: string): Promise<ApiResponse<Flight | null>> {
    const res = await apiClient.get<Flight>(`/api/flights/${flightId}`);
    if (res.success && res.data) return res;
    const flight = MOCK_FLIGHTS.find((f) => f.id === flightId || f.flightNumber === flightId) || MOCK_FLIGHTS[0];
    return {
      success: true,
      data: flight,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Live seat map layout
  async getSeatMap(flightId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/flights/${flightId}/seatmap`);
  },

  // Fare rules & baggage policies
  async getFareRules(flightId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/flights/${flightId}/fare-rules`);
  },
};

export default flightApi;
