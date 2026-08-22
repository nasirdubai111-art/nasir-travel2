export interface HotelRoomType {
  id: string;
  name: string;
  bedType: string;
  maxGuests: number;
  sizeSqFt: number;
  image: string;
  inventoryLeft: number;
  amenities: string[];
  ratePlans: {
    planCode: "EP" | "CP" | "MAP";
    planName: string;
    description: string;
    pricePerNight: number;
    originalPrice: number;
    freeCancellationUntil: string;
    includesBreakfast: boolean;
    includesDinner: boolean;
  }[];
}

export interface DetailedHotelItem {
  id: string;
  name: string;
  propertyType: "Hotel" | "Heritage Haveli" | "Luxury Resort" | "Eco Lodge" | "Homestay";
  city: string;
  state: string;
  address: string;
  landmark: string;
  starCategory: number;
  rating: number;
  reviewCount: number;
  ratingBreakdown: {
    cleanliness: number;
    location: number;
    service: number;
    food: number;
  };
  featuredImage: string;
  galleryImages: string[];
  priceStart: number;
  originalPriceStart: number;
  badge?: string;
  isCoupleFriendly: boolean;
  freeBreakfast: boolean;
  payAtHotel: boolean;
  swimmingPool: boolean;
  petFriendly: boolean;
  roomTypes: HotelRoomType[];
  amenitiesList: {
    category: string;
    items: string[];
  }[];
  nearbyAttractions: {
    name: string;
    distance: string;
  }[];
  policies: {
    checkInTime: string;
    checkOutTime: string;
    idProofAccepted: string[];
    cancellationRule: string;
    couplePolicy: string;
    childPolicy: string;
  };
  reviews: {
    id: string;
    userName: string;
    userCity: string;
    rating: number;
    date: string;
    comment: string;
    tag: string;
  }[];
}

export const DETAILED_HOTELS_DATABASE: DetailedHotelItem[] = [
  {
    id: "hotel-taj-lake",
    name: "Taj Lake Palace & Heritage Island Resort",
    propertyType: "Heritage Haveli",
    city: "Udaipur",
    state: "Rajasthan",
    address: "Pichola Lake, Lake Palace Island",
    landmark: "Floating on Lake Pichola, 1.2 km from City Palace",
    starCategory: 5,
    rating: 4.95,
    reviewCount: 3240,
    ratingBreakdown: { cleanliness: 5.0, location: 5.0, service: 4.9, food: 4.9 },
    featuredImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    ],
    priceStart: 38500,
    originalPriceStart: 45000,
    badge: "World's Best Heritage Hotel",
    isCoupleFriendly: true,
    freeBreakfast: true,
    payAtHotel: false,
    swimmingPool: true,
    petFriendly: false,
    roomTypes: [
      {
        id: "room-luxury-lake",
        name: "Luxury Lake View Room",
        bedType: "1 King Bed",
        maxGuests: 2,
        sizeSqFt: 450,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
        inventoryLeft: 3,
        amenities: ["Lake Pichola Panoramic View", "Marble Bathroom with Tub", "Jharokha Seating", "High Speed WiFi", "Butler Service"],
        ratePlans: [
          {
            planCode: "CP",
            planName: "Royal Bed & Breakfast (CP)",
            description: "Includes Royal Buffet Breakfast at Jharokha & Sunset Boat Cruise",
            pricePerNight: 38500,
            originalPrice: 45000,
            freeCancellationUntil: "48 Hours before check-in",
            includesBreakfast: true,
            includesDinner: false,
          },
          {
            planCode: "MAP",
            planName: "Heritage Half Board (MAP)",
            description: "Includes Buffet Breakfast + 4-Course Mewari Royal Dinner at Neel Kamal",
            pricePerNight: 44500,
            originalPrice: 52000,
            freeCancellationUntil: "48 Hours before check-in",
            includesBreakfast: true,
            includesDinner: true,
          },
        ],
      },
      {
        id: "room-royal-suite",
        name: "Grand Royal Suite with Lake Balcony",
        bedType: "1 Super King Bed",
        maxGuests: 3,
        sizeSqFt: 850,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
        inventoryLeft: 1,
        amenities: ["Private Rajputana Balcony", "Jacuzzi Overlooking Lake", "24/7 Dedicated Palace Butler", "Complimentary Vintage Car Airport Transfer"],
        ratePlans: [
          {
            planCode: "MAP",
            planName: "Imperial All-Inclusive Dining",
            description: "Includes Gourmet Breakfast + Royal Candlelight Dinner on Floating Pontoon",
            pricePerNight: 72000,
            originalPrice: 85000,
            freeCancellationUntil: "72 Hours before check-in",
            includesBreakfast: true,
            includesDinner: true,
          },
        ],
      },
    ],
    amenitiesList: [
      { category: "Wellness & Spa", items: ["Jiva Spa Boat with Jacuzzi", "Yoga on Mewar Terrace", "Heated Swimming Pool"] },
      { category: "Dining", items: ["Neel Kamal (Mewari Cuisine)", "Bhairo (European Rooftop)", "Amrit Sagar (Cocktails & Hookah)"] },
      { category: "Services", items: ["24x7 Palace Boat Shuttle", "Heritage Historian Walk", "Astrologer on Request", "Valet Parking"] },
    ],
    nearbyAttractions: [
      { name: "City Palace Complex", distance: "1.2 km (via private palace boat)" },
      { name: "Jagdish Temple", distance: "1.5 km" },
      { name: "Bagore Ki Haveli (Cultural Dance)", distance: "1.0 km" },
      { name: "Maharana Pratap Airport (UDR)", distance: "24 km" },
    ],
    policies: {
      checkInTime: "14:00 PM",
      checkOutTime: "12:00 Noon",
      idProofAccepted: ["Passport", "Aadhaar Card", "Voter ID", "Driving License"],
      cancellationRule: "100% Free cancellation up to 48 hours prior to check-in date.",
      couplePolicy: "Unmarried couples with valid government ID are warmly welcomed.",
      childPolicy: "Children below 6 stay complimentary using existing bedding.",
    },
    reviews: [
      { id: "r1", userName: "Aditya & Neha K.", userCity: "Mumbai", rating: 5, date: "August 2026", comment: "The arrival by private motorboat at sunset was unforgettable. Unmatched Rajputana royal service!", tag: "Honeymoon Stay" },
      { id: "r2", userName: "Vikram Singhal", userCity: "New Delhi", rating: 5, date: "July 2026", comment: "Neel Kamal restaurant serves authentic Dal Baati Churma with live sitar music. Outstanding heritage preservation.", tag: "Family Vacation" },
    ],
  },
  {
    id: "hotel-ramada-varanasi",
    name: "BrijRama Palace Heritage Ghat Sanctuary",
    propertyType: "Heritage Haveli",
    city: "Varanasi",
    state: "Uttar Pradesh",
    address: "Darbhanga Ghat, Dashashwamedh Ghat Road",
    landmark: "Directly on Darbhanga Ghat, 300m from Kashi Vishwanath Corridor",
    starCategory: 5,
    rating: 4.92,
    reviewCount: 2890,
    ratingBreakdown: { cleanliness: 4.9, location: 5.0, service: 4.9, food: 4.9 },
    featuredImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80",
    ],
    priceStart: 18500,
    originalPriceStart: 23000,
    badge: "On the Sacred Ganga Ghats",
    isCoupleFriendly: true,
    freeBreakfast: true,
    payAtHotel: true,
    swimmingPool: false,
    petFriendly: false,
    roomTypes: [
      {
        id: "room-varanasi-ghat",
        name: "Maharaja Riverview Deluxe Room",
        bedType: "1 Queen Bed",
        maxGuests: 2,
        sizeSqFt: 380,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80",
        inventoryLeft: 4,
        amenities: ["Direct Ganges Sunrise View", "Pure Satvik Welcome Drink", "Private Ghat Elevator", "Morning Classical Shehnai Recital"],
        ratePlans: [
          {
            planCode: "CP",
            planName: "Ganga View & Satvik Breakfast (CP)",
            description: "Includes Organic Vegetarian Buffet Breakfast & Morning Sunrise Boat Ride",
            pricePerNight: 18500,
            originalPrice: 23000,
            freeCancellationUntil: "24 Hours before check-in",
            includesBreakfast: true,
            includesDinner: false,
          },
          {
            planCode: "MAP",
            planName: "Sacred Spiritual Half Board (MAP)",
            description: "Includes Breakfast + Multi-Course Pure Vegetarian/Jain Thali Dinner",
            pricePerNight: 21500,
            originalPrice: 26000,
            freeCancellationUntil: "24 Hours before check-in",
            includesBreakfast: true,
            includesDinner: true,
          },
        ],
      },
    ],
    amenitiesList: [
      { category: "Spiritual Experience", items: ["Private Bajra Boat for Ganga Aarti", "Vedic Purohit for Rudrabhishek", "Evening Live Classical Sitar"] },
      { category: "Pure Vegetarian Dining", items: ["Darbhanga Dining Hall (100% Pure Veg)", "Kaashi Teahouse on Rooftop"] },
      { category: "Comfort & Luxury", items: ["Historical Elevator (Oldest in South Asia)", "Ayurvedic Herbal Spa", "Ghat Luggage Porter"] },
    ],
    nearbyAttractions: [
      { name: "Kashi Vishwanath Mandir Corridor", distance: "350 m" },
      { name: "Dashashwamedh Ghat (Maha Aarti)", distance: "200 m" },
      { name: "Manikarnika Ghat", distance: "500 m" },
      { name: "Varanasi Junction Railway Station (BSB)", distance: "4.8 km" },
    ],
    policies: {
      checkInTime: "14:00 PM",
      checkOutTime: "11:00 AM",
      idProofAccepted: ["Passport", "Aadhaar Card", "Voter ID"],
      cancellationRule: "Free cancellation up to 24 hours before check-in.",
      couplePolicy: "Couples welcome with standard ID proof.",
      childPolicy: "Children under 5 stay free.",
    },
    reviews: [
      { id: "rv1", userName: "Dr. Rameshwar Shastri", userCity: "Pune", rating: 5, date: "August 2026", comment: "Watching the Ganga Aarti directly from the private Bajra arranged by BrijRama was the spiritual pinnacle of my life.", tag: "Spiritual Yatra" },
    ],
  },
  {
    id: "hotel-bloomrooms-delhi",
    name: "Bloom Boutique Hotel @ Connaught Place",
    propertyType: "Hotel",
    city: "New Delhi",
    state: "Delhi",
    address: "Inner Circle, Block F, Connaught Place",
    landmark: "50m from Rajiv Chowk Metro Gate #5",
    starCategory: 4,
    rating: 4.75,
    reviewCount: 4120,
    ratingBreakdown: { cleanliness: 4.8, location: 4.9, service: 4.7, food: 4.6 },
    featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
    ],
    priceStart: 3899,
    originalPriceStart: 5500,
    badge: "Top Business & Metro Stay",
    isCoupleFriendly: true,
    freeBreakfast: true,
    payAtHotel: true,
    swimmingPool: false,
    petFriendly: false,
    roomTypes: [
      {
        id: "room-bloom-queen",
        name: "Bloom Executive CloudBed Queen",
        bedType: "1 Queen CloudBed",
        maxGuests: 2,
        sizeSqFt: 220,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
        inventoryLeft: 6,
        amenities: ["Bloom Signature CloudBed Mattress", "Rain Shower with Grohe fittings", "43-inch Smart 4K TV", "Work Desk with Fast WiFi"],
        ratePlans: [
          {
            planCode: "EP",
            planName: "Room Only (EP)",
            description: "Flexible stay with zero prepaid fee",
            pricePerNight: 3899,
            originalPrice: 5500,
            freeCancellationUntil: "12:00 PM on day of check-in",
            includesBreakfast: false,
            includesDinner: false,
          },
          {
            planCode: "CP",
            planName: "Room + Artisanal Cafe Breakfast (CP)",
            description: "Includes fresh barista coffee, eggs to order, and Indian breakfast buffet",
            pricePerNight: 4399,
            originalPrice: 6200,
            freeCancellationUntil: "12:00 PM on day of check-in",
            includesBreakfast: true,
            includesDinner: false,
          },
        ],
      },
    ],
    amenitiesList: [
      { category: "Modern Business", items: ["Ultra Fast 250 Mbps WiFi", "Co-working Lounge", "Express 1-Minute Check-in"] },
      { category: "Dining", items: ["Bloom Cafe & Bakery", "24x7 Room Service"] },
      { category: "Safety", items: ["Keyless Digital Door Locks", "Sanitized UV Luggage Scan"] },
    ],
    nearbyAttractions: [
      { name: "Rajiv Chowk Metro Station", distance: "50 m" },
      { name: "India Gate & Kartavya Path", distance: "2.4 km" },
      { name: "New Delhi Railway Station (NDLS)", distance: "1.2 km" },
      { name: "IGI Airport T3 (via Airport Express)", distance: "20 mins" },
    ],
    policies: {
      checkInTime: "14:00 PM",
      checkOutTime: "11:00 AM",
      idProofAccepted: ["Aadhaar Card", "Passport", "Driving License", "Voter ID"],
      cancellationRule: "100% Free cancellation until 12 noon on day of arrival.",
      couplePolicy: "Couple friendly with local and outstation IDs accepted.",
      childPolicy: "Children under 8 stay complimentary.",
    },
    reviews: [
      { id: "rd1", userName: "Pooja Malhotra", userCity: "Bengaluru", rating: 5, date: "August 2026", comment: "Superb location right in CP. The CloudBed is incredibly comfortable and the room is spotless.", tag: "Solo Business" },
    ],
  },
];

export const DETAILED_HOTELS = DETAILED_HOTELS_DATABASE;
