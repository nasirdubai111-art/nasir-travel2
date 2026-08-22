export interface CabVehicleOption {
  id: string;
  categoryName: string; // "Hatchback", "Prime Sedan", "Ertiga SUV", "Innova Crysta", "Electric EV", "Luxury"
  models: string; // e.g. "Maruti Suzuki Dzire, Hyundai Aura"
  capacitySeats: number;
  capacityLuggage: number;
  image: string;
  isElectric: boolean;
  baseFarePerKm: number;
  outstationMinKmPerDay: number;
  driverAllowancePerNight: number;
  extraKmRate: number;
  extraHourRate: number;
  rating: number;
  features: string[];
}

export interface DetailedCabBookingQuote {
  tripType: "oneway" | "roundtrip" | "hourly" | "airport";
  pickupCity: string;
  dropCity: string;
  pickupAddress: string;
  dropAddress: string;
  pickupDate: string;
  pickupTime: string;
  estimatedDistanceKm: number;
  estimatedDurationHours: number;
  vehicle: CabVehicleOption;
  pricingBreakdown: {
    baseFare: number;
    distanceCharge: number;
    tollAndStateTaxIncluded: boolean;
    tollEstimate: number;
    driverAllowance: number;
    gstAmount: number;
    discountApplied: number;
    totalPayable: number;
  };
}

export const CAB_VEHICLE_FLEET: CabVehicleOption[] = [
  {
    id: "fleet-sedan",
    categoryName: "Prime Sedan",
    models: "Maruti Suzuki Dzire / Honda Amaze / Hyundai Aura",
    capacitySeats: 4,
    capacityLuggage: 2,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 11.5,
    outstationMinKmPerDay: 250,
    driverAllowancePerNight: 350,
    extraKmRate: 12.5,
    extraHourRate: 150,
    rating: 4.86,
    features: ["Top Rated Chauffeurs", "Clean AC Sedan", "Generous Boot Space for 2 Big Bags", "Zero Cancellation Fee"],
  },
  {
    id: "fleet-innova-crysta",
    categoryName: "Innova Crysta Luxury",
    models: "Toyota Innova Crysta 2.4 VX",
    capacitySeats: 7,
    capacityLuggage: 4,
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 18.5,
    outstationMinKmPerDay: 300,
    driverAllowancePerNight: 400,
    extraKmRate: 19.5,
    extraHourRate: 250,
    rating: 4.95,
    features: ["Captain Leather Recliners", "Dual AC Blower", "Superior Highway Suspension", "Complimentary Water & Mints"],
  },
  {
    id: "fleet-ev-green",
    categoryName: "Eco Electric EV",
    models: "Tata Nexon EV Max / BYD e6",
    capacitySeats: 4,
    capacityLuggage: 2,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
    isElectric: true,
    baseFarePerKm: 12.0,
    outstationMinKmPerDay: 200,
    driverAllowancePerNight: 300,
    extraKmRate: 13.0,
    extraHourRate: 160,
    rating: 4.92,
    features: ["100% Zero Emission", "Silent Electric Ride", "Free FASTag Toll included on Select Expressways"],
  },
  {
    id: "fleet-ertiga-suv",
    categoryName: "Ertiga 6-Seater",
    models: "Maruti Suzuki Ertiga Smart Hybrid",
    capacitySeats: 6,
    capacityLuggage: 3,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 15.0,
    outstationMinKmPerDay: 250,
    driverAllowancePerNight: 350,
    extraKmRate: 16.0,
    extraHourRate: 200,
    rating: 4.82,
    features: ["Spacious for Family with Kids", "Foldable Rear 3rd Row", "Economic Long Distance Travel"],
  },
];

export const HOURLY_RENTAL_PACKAGES = [
  { id: "h4", name: "4 Hours / 40 Km", description: "Ideal for city shopping, doctor visits, or business meetings", hours: 4, km: 40, sedanPrice: 999, suvPrice: 1599 },
  { id: "h8", name: "8 Hours / 80 Km", description: "Full day city sightseeing, monuments, and client visits", hours: 8, km: 80, sedanPrice: 1799, suvPrice: 2799 },
  { id: "h12", name: "12 Hours / 120 Km", description: "Extended day package across NCR / MMR / Greater Bangalore", hours: 12, km: 120, sedanPrice: 2499, suvPrice: 3899 },
];

export const DETAILED_CAB_VEHICLES = CAB_VEHICLE_FLEET;
export const RENTAL_PACKAGES = HOURLY_RENTAL_PACKAGES;
