import { buildSchema } from "graphql";

export const typeDefs = `
  """
  Service Categories available across the platform
  """
  enum ServiceCategory {
    FLIGHTS
    HOTELS
    TRAINS
    BUSES
    CABS
    HOUSEBOATS
    YATRA
    LODGES
    DINING
    OFFERS
  }

  enum BookingStatus {
    CONFIRMED
    PENDING
    CANCELLED
    COMPLETED
  }

  type FlightItem {
    id: ID!
    airline: String!
    flightNumber: String!
    from: String!
    to: String!
    departureTime: String!
    arrivalTime: String!
    duration: String!
    price: Float!
    stops: Int!
    aircraft: String
    cabinClass: String!
    seatsAvailable: Int!
  }

  type HotelItem {
    id: ID!
    name: String!
    city: String!
    address: String
    starRating: Float!
    pricePerNight: Float!
    rating: Float!
    reviewCount: Int!
    amenities: [String!]!
    image: String
    roomType: String!
  }

  type TrainItem {
    id: ID!
    trainNumber: String!
    trainName: String!
    fromStation: String!
    toStation: String!
    departureTime: String!
    arrivalTime: String!
    duration: String!
    fareTier: String!
    price: Float!
    availabilityStatus: String!
  }

  type BusItem {
    id: ID!
    operatorName: String!
    busType: String!
    departureTime: String!
    arrivalTime: String!
    origin: String!
    destination: String!
    fare: Float!
    rating: Float!
    seatsAvailable: Int!
  }

  type CabItem {
    id: ID!
    cabType: String!
    model: String!
    capacity: Int!
    baseFare: Float!
    perKmRate: Float!
    etaMinutes: Int!
    driverRating: Float!
  }

  type YatraPackage {
    id: ID!
    title: String!
    circuit: String!
    durationDays: Int!
    startingPrice: Float!
    highlights: [String!]!
    isHelicopterAvailable: Boolean!
    registrationRequired: Boolean!
  }

  type BookingItem {
    id: ID!
    type: String!
    title: String!
    bookingDate: String!
    travelDate: String!
    amount: Float!
    status: BookingStatus!
    pnr: String
    ticketNumber: String
    passengerCount: Int!
    qrPayload: String
  }

  type UserProfile {
    id: ID!
    name: String!
    email: String!
    phone: String!
    walletBalance: Float!
    yatraCoins: Int!
    tier: String!
    gstNumber: String
    companyName: String
    preferredCurrency: String!
    recentSearches: [String!]!
  }

  type OfferItem {
    id: ID!
    code: String!
    title: String!
    description: String!
    discountPercent: Float!
    maxDiscount: Float!
    validTill: String!
    category: ServiceCategory!
  }

  type PriceTrendPrediction {
    route: String!
    currentPrice: Float!
    predictedPrice7Days: Float!
    recommendation: String!
    confidenceScore: Float!
    bestTimeToBook: String!
  }

  type AiItineraryResponse {
    destination: String!
    durationDays: Int!
    estimatedBudget: Float!
    dayWisePlan: [DayPlan!]!
    smartTips: [String!]!
  }

  type DayPlan {
    day: Int!
    title: String!
    activities: [String!]!
    recommendedDining: String
  }

  input CreateBookingInput {
    userId: ID!
    category: ServiceCategory!
    serviceId: String!
    serviceTitle: String!
    travelDate: String!
    amount: Float!
    passengers: Int!
    contactEmail: String!
    contactPhone: String!
  }

  input UpdateProfileInput {
    name: String
    email: String
    phone: String
    gstNumber: String
    companyName: String
    preferredCurrency: String
  }

  type BookingResult {
    success: Boolean!
    message: String!
    booking: BookingItem
    pnr: String
    transactionId: String
  }

  type WalletRechargeResult {
    success: Boolean!
    newBalance: Float!
    transactionId: String!
    message: String!
  }

  type Query {
    """
    Get current API & platform health status
    """
    health: String!

    """
    Search Flights across domestic and international routes
    """
    flights(from: String, to: String, limit: Int = 10): [FlightItem!]!

    """
    Search Hotels & Lodges by city and price
    """
    hotels(city: String, minRating: Float = 0, limit: Int = 10): [HotelItem!]!

    """
    Search Indian Railways & Vande Bharat Trains
    """
    trains(fromStation: String, toStation: String, limit: Int = 10): [TrainItem!]!

    """
    Search Interstate Buses and Volvo Sleeper Coaches
    """
    buses(origin: String, destination: String, limit: Int = 10): [BusItem!]!

    """
    Search On-demand Cabs and Airport Rentals
    """
    cabs(city: String): [CabItem!]!

    """
    Get Pilgrim & Spiritual Yatra Tour Packages
    """
    yatraPackages(circuit: String): [YatraPackage!]!

    """
    Get User Profile and Active Preferences
    """
    userProfile(userId: ID): UserProfile

    """
    Get Active and Past Bookings for a user
    """
    myBookings(userId: ID, status: BookingStatus): [BookingItem!]!

    """
    Get verified promotional offers and coupon codes
    """
    offers(category: ServiceCategory): [OfferItem!]!

    """
    Predict future fare price trends using AI models
    """
    predictPriceTrend(route: String!, category: ServiceCategory!): PriceTrendPrediction!

    """
    Generate an AI-powered smart travel itinerary
    """
    generateAiItinerary(destination: String!, days: Int = 3, budgetInr: Float): AiItineraryResponse!
  }

  type Mutation {
    """
    Create a new travel booking (Flights, Trains, Hotels, Yatra)
    """
    createBooking(input: CreateBookingInput!): BookingResult!

    """
    Cancel an existing booking and calculate refund
    """
    cancelBooking(bookingId: ID!, reason: String): BookingResult!

    """
    Top up user wallet balance
    """
    addMoneyToWallet(userId: ID!, amount: Float!): WalletRechargeResult!

    """
    Update profile contact and corporate GST details
    """
    updateUserProfile(userId: ID!, input: UpdateProfileInput!): UserProfile!

    """
    Record a new search query into user recent history
    """
    saveSearchQuery(userId: ID!, query: String!): [String!]!
  }
`;

export const schema = buildSchema(typeDefs);
