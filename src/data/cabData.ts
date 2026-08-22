export interface CabVehicleOption {
  id: string;
  categoryName: string; // "Hatchback", "Prime Sedan", "Ertiga SUV", "Innova Crysta", "Electric EV", "Tempo Traveller"
  models: string; // e.g. "Maruti Suzuki Dzire, Honda Amaze"
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
    id: "fleet-hatchback",
    categoryName: "Economy Hatchback",
    models: "Maruti Suzuki WagonR / Tata Tiago / Hyundai Grand i10",
    capacitySeats: 4,
    capacityLuggage: 1,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 9.5,
    outstationMinKmPerDay: 250,
    driverAllowancePerNight: 300,
    extraKmRate: 10.5,
    extraHourRate: 120,
    rating: 4.81,
    features: ["Pocket Friendly", "Clean AC Cabin", "Best for Solo or Couple Travel", "Instant Chauffeur Dispatch"],
  },
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
    rating: 4.88,
    features: ["Top Rated Chauffeurs", "Spacious Boot for 2 Large Bags", "Fastag Enabled Express Lane", "Complimentary Water Bottle"],
  },
  {
    id: "fleet-ev-green",
    categoryName: "Eco Electric EV",
    models: "Tata Nexon EV Max / MG ZS EV / BYD e6",
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
    features: ["100% Zero Emission", "Whisper Quiet Cabin", "Free Express FASTag Toll", "Fast Charging Stopovers mapped"],
  },
  {
    id: "fleet-ertiga-suv",
    categoryName: "Ertiga 6-Seater",
    models: "Maruti Suzuki Ertiga Smart Hybrid / Kia Carens",
    capacitySeats: 6,
    capacityLuggage: 3,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 15.0,
    outstationMinKmPerDay: 250,
    driverAllowancePerNight: 350,
    extraKmRate: 16.0,
    extraHourRate: 200,
    rating: 4.84,
    features: ["Spacious for 5-6 Passengers", "Foldable Rear 3rd Row", "Dual Air Conditioning", "Rear USB Phone Chargers"],
  },
  {
    id: "fleet-innova-crysta",
    categoryName: "Innova Crysta Luxury",
    models: "Toyota Innova Crysta 2.4 VX / Hycross",
    capacitySeats: 7,
    capacityLuggage: 4,
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 18.5,
    outstationMinKmPerDay: 300,
    driverAllowancePerNight: 400,
    extraKmRate: 19.5,
    extraHourRate: 250,
    rating: 4.96,
    features: ["Plush Leather Captain Seats", "Supreme Highway Stability", "Dual Zone Climate Control", "Chauffeur in Uniform"],
  },
  {
    id: "fleet-tempo-traveller",
    categoryName: "Tempo Traveller (12-16 Seater)",
    models: "Force Urbania / Tempo Traveller 3350 Luxury",
    capacitySeats: 14,
    capacityLuggage: 10,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80",
    isElectric: false,
    baseFarePerKm: 26.0,
    outstationMinKmPerDay: 300,
    driverAllowancePerNight: 600,
    extraKmRate: 28.0,
    extraHourRate: 400,
    rating: 4.89,
    features: ["Push-back Reclining Seats", "Individual AC Vents", "Large Overhead Luggage Carrier", "Curtains & LED TV Screen"],
  },
];

export const HOURLY_RENTAL_PACKAGES = [
  { id: "h4", name: "4 Hours / 40 Km", description: "City shopping, doctor visit, or brief business meetings", hours: 4, km: 40, sedanPrice: 999, suvPrice: 1599, innovaPrice: 2199 },
  { id: "h8", name: "8 Hours / 80 Km", description: "Full day city sightseeing, monuments, and multi-stop client visits", hours: 8, km: 80, sedanPrice: 1799, suvPrice: 2799, innovaPrice: 3899 },
  { id: "h12", name: "12 Hours / 120 Km", description: "Extended day travel across NCR / MMR / Greater Bengaluru / Hyderabad", hours: 12, km: 120, sedanPrice: 2499, suvPrice: 3899, innovaPrice: 5199 },
];

export const POPULAR_CAB_ROUTES = [
  { from: "Delhi NCR", to: "Agra (Taj Expressway)", km: 235, duration: "3h 30m", toll: 415 },
  { from: "Delhi NCR", to: "Jaipur (Delhi-Mumbai Expy)", km: 275, duration: "3h 45m", toll: 520 },
  { from: "Mumbai", to: "Pune (Mumbai-Pune Expy)", km: 150, duration: "2h 45m", toll: 320 },
  { from: "Bengaluru", to: "Mysuru (Bangalore-Mysore Expy)", km: 145, duration: "2h 15m", toll: 320 },
  { from: "Chennai", to: "Puducherry (East Coast Road)", km: 155, duration: "3h 10m", toll: 180 },
  { from: "Kochi Airport", to: "Munnar Tea Hills", km: 110, duration: "3h 45m", toll: 90 },
  { from: "Chandigarh", to: "Manali (Kiratpur-Nerchowk Expy)", km: 270, duration: "6h 30m", toll: 240 },
  { from: "Hyderabad", to: "Vijayawada", km: 275, duration: "4h 30m", toll: 380 },
];

export const SAMPLE_CHAUFFEURS = [
  {
    id: "drv-01",
    name: "Gurpreet Singh",
    phone: "+91 98110 44219",
    rating: 4.95,
    totalTrips: 1840,
    languages: ["Hindi", "Punjabi", "English"],
    vehicleModel: "Toyota Innova Crysta (White)",
    vehiclePlate: "DL 01 TA 8842",
    vehicleColor: "Pearl White",
    kycVerified: true,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "drv-02",
    name: "Rameshwar Patil",
    phone: "+91 98220 11984",
    rating: 4.91,
    totalTrips: 1220,
    languages: ["Marathi", "Hindi", "English"],
    vehicleModel: "Maruti Suzuki Dzire Prime",
    vehiclePlate: "MH 01 EA 3920",
    vehicleColor: "Silky Silver",
    kycVerified: true,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "drv-03",
    name: "K. Venkatesh",
    phone: "+91 94480 33810",
    rating: 4.94,
    totalTrips: 2150,
    languages: ["Kannada", "Tamil", "English", "Hindi"],
    vehicleModel: "Tata Nexon EV Electric",
    vehiclePlate: "KA 03 AG 7712",
    vehicleColor: "Intense Teal",
    kycVerified: true,
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
  },
];

export const DETAILED_CAB_VEHICLES = CAB_VEHICLE_FLEET;
export const RENTAL_PACKAGES = HOURLY_RENTAL_PACKAGES;
