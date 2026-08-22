export interface TourDayPlan {
  dayNumber: number;
  title: string;
  activities: string[];
  mealsIncluded: string[]; // ["Breakfast", "Lunch", "Dinner"]
  stayHotel: string;
  transferType: string;
}

export interface DetailedTourPackage {
  id: string;
  title: string;
  hindiTitle?: string;
  destination: string;
  circuitType: "Domestic" | "International";
  theme: "Adventure" | "Beach" | "Heritage" | "Wildlife" | "Cultural" | "Honeymoon" | "Family" | "Day Tour" | "Group Tour";
  duration: string;
  durationDays: number;
  durationNights: number;
  rating: number;
  reviewsCount: number;
  featuredImage: string;
  galleryImages: string[];
  pricePerAdult: number;
  originalPrice: number;
  emiPerMonth: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: TourDayPlan[];
  datesAvailable: string[];
  cancellationPolicy: {
    daysBeforeDeparture: string;
    refundAmount: string;
  }[];
}

export const DETAILED_TOURS_DATABASE: DetailedTourPackage[] = [
  {
    id: "tour-kashmir-paradise",
    title: "Heavenly Kashmir: Srinagar, Gulmarg Gondola & Pahalgam Valley",
    destination: "Kashmir (Srinagar, Gulmarg, Pahalgam, Sonamarg)",
    circuitType: "Domestic",
    theme: "Honeymoon",
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    durationNights: 5,
    rating: 4.94,
    reviewsCount: 1840,
    featuredImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
    ],
    pricePerAdult: 24999,
    originalPrice: 34999,
    emiPerMonth: 2150,
    highlights: [
      "1 Night in Luxury Heritage Woodcarved Houseboat on Nigeen Lake",
      "Phase-1 & Phase-2 Gulmarg Gondola Cable Car tickets included",
      "Romantic Shikara Sunset Ride on Dal Lake with Kahwa tea",
      "Pahalgam Betaab Valley & Aru Valley Pony & Taxi excursion",
      "Dedicated Private Chauffeur in heated 4x4 SUV",
    ],
    inclusions: [
      "5 Nights accommodation in 4-Star deluxe hotels & premium houseboat",
      "Daily Buffet Breakfast & 4-Course Dinners with Kashmiri Wazwan",
      "All airport transfers and sightseeing in private AC Innova / Scorpio",
      "Gulmarg Gondola Phase 1 & 2 pre-booked fast-track passes",
      "Union taxi charges in Pahalgam & Sonamarg included",
    ],
    exclusions: [
      "Flights to/from Srinagar (available as add-on)",
      "Pony rides and ATV personal rentals",
      "Personal laundry and tips",
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival in Srinagar & Nigeen Lake Luxury Houseboat Check-in",
        activities: [
          "Meet & greet at Srinagar Airport (SXR) with traditional saffron Kahwa welcome",
          "Transfer to hand-carved Cedar Houseboat on peaceful Nigeen Lake",
          "Evening 2-hour private Shikara ride through floating flower markets & Char Chinar",
          "Traditional Wazwan dinner prepared by master Waza chef",
        ],
        mealsIncluded: ["Dinner"],
        stayHotel: "Mascot Luxury Heritage Houseboat (Nigeen Lake)",
        transferType: "Private Innova Chauffeur",
      },
      {
        dayNumber: 2,
        title: "Srinagar to Gulmarg: The Meadow of Flowers & Gondola Ride",
        activities: [
          "Scenic drive to Gulmarg with snow-capped Pir Panjal mountain views",
          "Board Asia's highest cable car: Gulmarg Gondola Phase 1 (Kongdoori) & Phase 2 (Apharwat Peak at 13,780 ft)",
          "Snow sledging, skiing briefing, and hot Maggi & Kahwa at summit cafe",
          "Check-in to mountain chalet with heated wooden rooms",
        ],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "The Vintage Gulmarg (4-Star Alpine Chalet)",
        transferType: "Private 4x4 SUV",
      },
      {
        dayNumber: 3,
        title: "Gulmarg to Pahalgam: Valley of Shepherds & Saffron Fields",
        activities: [
          "Drive along Apple orchards of Shopian and Saffron fields of Pampore",
          "Visit historic Avantipur ruins from 9th century",
          "Lidder River trout fishing and riverside walk in Pahalgam",
          "Leisure evening at Club Park and Pine Forest",
        ],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Pahalgam Hotel & River Spa",
        transferType: "Private Innova Chauffeur",
      },
      {
        dayNumber: 4,
        title: "Pahalgam: Betaab Valley, Aru Valley & Chandanwari",
        activities: [
          "Excursion to scenic Betaab Valley (named after the Bollywood hit)",
          "Explore pristine meadow of Aru Valley with snow glacier views",
          "Chandanwari start point of sacred Amarnath Yatra",
          "Bonfire night with Kashmiri music",
        ],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Pahalgam Hotel & River Spa",
        transferType: "Local Union 4x4 Mountain Jeep",
      },
      {
        dayNumber: 5,
        title: "Pahalgam to Srinagar & Mughal Heritage Gardens Tour",
        activities: [
          "Return drive to Srinagar",
          "Guided tour of Shalimar Bagh, Nishat Bagh & Chashme Shahi terraced gardens",
          "Shopping at Lal Chowk for authentic Kashmiri Pashmina shawls, saffron & walnut woodcraft",
          "Farewell dinner overlooking illuminated Dal Lake Boulevard",
        ],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Radisson Collection Hotel Srinagar",
        transferType: "Private Innova Chauffeur",
      },
      {
        dayNumber: 6,
        title: "Farewell Srinagar & Airport Departure",
        activities: [
          "Leisure breakfast with fresh bakery breads (Lavas & Girda)",
          "Assisted departure transfer to Srinagar Airport",
        ],
        mealsIncluded: ["Breakfast"],
        stayHotel: "Check-out",
        transferType: "Private Airport Drop",
      },
    ],
    datesAvailable: ["2026-09-05", "2026-09-12", "2026-09-19", "2026-09-26", "2026-10-03"],
    cancellationPolicy: [
      { daysBeforeDeparture: "> 30 Days before travel", refundAmount: "90% Refund" },
      { daysBeforeDeparture: "15 to 30 Days before travel", refundAmount: "70% Refund" },
      { daysBeforeDeparture: "7 to 14 Days before travel", refundAmount: "50% Refund" },
      { daysBeforeDeparture: "< 7 Days before travel", refundAmount: "Non-refundable (Date change available)" },
    ],
  },
  {
    id: "tour-rajasthan-royal",
    title: "Royal Rajasthan Circuit: Jaipur, Jodhpur & Jaisalmer Thar Desert",
    destination: "Rajasthan (Jaipur, Pushkar, Jodhpur, Jaisalmer Dunes)",
    circuitType: "Domestic",
    theme: "Heritage",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    durationNights: 6,
    rating: 4.91,
    reviewsCount: 1420,
    featuredImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    ],
    pricePerAdult: 28999,
    originalPrice: 38000,
    emiPerMonth: 2480,
    highlights: [
      "Overnight Luxury Swiss Tent Camping in Sam Sand Dunes Jaisalmer",
      "Thar Desert Sunset Camel Safari & 4x4 Dune Bashing",
      "Private Guided Tours of Amber Fort, Mehrangarh Fort & Golden Jaisalmer Fort",
      "Rajasthani Kalbelia Folk Dance & Ghoomar Gala with Dal Baati feast",
      "All Intercity transfers in AC Crysta with English/Hindi Chauffeur",
    ],
    inclusions: [
      "6 Nights stay in 4-Star Heritage Haveli properties + Luxury AC Swiss Desert Camp",
      "Daily Royal Buffet Breakfast and authentic Dinners",
      "Jeep Safari & Camel Safari tickets in Jaisalmer Thar Dunes",
      "All monument fast-track entry passes with Govt-licensed Historian guides",
      "Toll taxes, state permits, and driver allowances",
    ],
    exclusions: [
      "Flight/Train tickets to Jaipur and from Jodhpur/Jaisalmer",
      "Personal shopping and alcoholic beverages",
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Jaipur: Pink City Heritage & Hawa Mahal Walk",
        activities: ["Jaipur Airport pickup", "Check-in at Alsisar Haveli", "Visit Hawa Mahal, City Palace museum & Jantar Mantar", "LMB Johari Bazaar street food walk"],
        mealsIncluded: ["Dinner"],
        stayHotel: "Alsisar Haveli Heritage Palace Jaipur",
        transferType: "AC Crysta Chauffeur",
      },
      {
        dayNumber: 2,
        title: "Jaipur: Amber Fort Elephant/Jeep & Nahargarh Sunset",
        activities: ["Morning Jeep ascent to majestic Amber Fort & Sheesh Mahal", "Visit Jal Mahal floating palace", "Sunset panoramic view of Jaipur from Nahargarh Fort ramparts"],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Alsisar Haveli Heritage Palace Jaipur",
        transferType: "AC Crysta Chauffeur",
      },
      {
        dayNumber: 3,
        title: "Jaipur to Jodhpur (The Blue City) via Holy Pushkar",
        activities: ["Drive to Pushkar Holy Brahma Temple & Sacred Sarovar Lake", "Continue to Jodhpur Blue City", "Evening walk through blue Brahmin alleys around Clock Tower"],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Ajit Bhawan - India's First Heritage Hotel",
        transferType: "AC Crysta Chauffeur",
      },
      {
        dayNumber: 4,
        title: "Jodhpur: Mehrangarh Fort & Drive to Golden City Jaisalmer",
        activities: ["Explore massive Mehrangarh Fort & Jaswant Thada marble cenotaph", "Drive across Thar Desert corridor to Jaisalmer", "First glimpse of golden sandstone fortress"],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Fort Rajwada Luxury Heritage Jaisalmer",
        transferType: "AC Crysta Chauffeur",
      },
      {
        dayNumber: 5,
        title: "Jaisalmer Living Fort & Sam Sand Dunes Overnight Desert Safari",
        activities: ["Walk through Jaisalmer Living Fort, Patwon Ki Haveli & Salim Singh Haveli", "Drive to Sam Sand Dunes", "Sunset Camel ride and thrilling 4x4 Jeep Dune Bashing", "Night Rajasthani folk music, Fire Dance & Stargazing dinner in desert camp"],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Royal Desert Camp & Luxury Swiss Tents (Sam Dunes)",
        transferType: "AC Crysta & Desert 4x4 Jeep",
      },
      {
        dayNumber: 6,
        title: "Desert to Jodhpur / Jaisalmer Cultural Highlights",
        activities: ["Sunrise desert tea walk", "Visit Kuldhara Abandoned Ghost Village", "Return to Jodhpur for overnight stay & shopping at Sardar Market for blue pottery & bandhani"],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Ajit Bhawan Jodhpur",
        transferType: "AC Crysta Chauffeur",
      },
      {
        dayNumber: 7,
        title: "Umaid Bhawan Palace & Departure Transfer",
        activities: ["Morning tour of Umaid Bhawan Royal Museum", "Transfer to Jodhpur Airport / Railway Station"],
        mealsIncluded: ["Breakfast"],
        stayHotel: "Check-out",
        transferType: "Airport Drop",
      },
    ],
    datesAvailable: ["2026-09-10", "2026-09-20", "2026-10-01", "2026-10-15", "2026-11-01"],
    cancellationPolicy: [
      { daysBeforeDeparture: "> 30 Days before travel", refundAmount: "90% Refund" },
      { daysBeforeDeparture: "15 to 30 Days before travel", refundAmount: "70% Refund" },
      { daysBeforeDeparture: "< 15 Days before travel", refundAmount: "50% Refund" },
    ],
  },
  {
    id: "tour-dubai-international",
    title: "Dazzling Dubai & Abu Dhabi: Burj Khalifa, Desert Safari & Yas Island",
    destination: "Dubai & Abu Dhabi (UAE)",
    circuitType: "International",
    theme: "Family",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    durationNights: 4,
    rating: 4.96,
    reviewsCount: 3120,
    featuredImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=80",
    ],
    pricePerAdult: 42999,
    originalPrice: 58000,
    emiPerMonth: 3750,
    highlights: [
      "Burj Khalifa 124th & 125th Floor Observatory At The Top Non-Prime Ticket",
      "Red Dunes Evening Desert Safari with BBQ Buffet & Belly Dance",
      "Abu Dhabi Day Tour: Sheikh Zayed Grand Mosque & Louvre Museum",
      "Marina Luxury Dhow Cruise with 5-Star International Buffet Dinner",
      "Dubai 30-Day Express Tourist Visa & Medical Insurance Included",
    ],
    inclusions: [
      "4 Nights stay in 4-Star Deluxe Hotel (Downtown / Sheikh Zayed Road)",
      "Daily International Buffet Breakfast",
      "Express UAE Tourist Visa + COVID/Health Insurance",
      "All Sightseeing Transfers on private / shared luxury coach",
      "Desert Safari 4x4 Land Cruiser Dune Bashing with BBQ Dinner",
    ],
    exclusions: [
      "International flights from India (Add on from ₹18,000 return)",
      "Tourism Dirham fee (approx. 15 AED / room / night payable at hotel)",
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Welcome to Dubai & Marina Dhow Cruise Dinner",
        activities: ["Dubai International Airport (DXB) arrival & hotel transfer", "Evening 5-Star Dubai Marina Luxury Glass Dhow Cruise with live Tanoura dance & buffet dinner"],
        mealsIncluded: ["Dinner"],
        stayHotel: "Crowne Plaza Dubai Marina (4-Star Deluxe)",
        transferType: "Private Coach",
      },
      {
        dayNumber: 2,
        title: "Dubai City Tour, Dubai Mall & Burj Khalifa 124th Floor",
        activities: ["Photo stop at Burj Al Arab & Dubai Frame", "Drive through Palm Jumeirah & Atlantis Hotel", "Dubai Mall & world-famous Dubai Fountain show", "Ascend Burj Khalifa At The Top (124th Floor)"],
        mealsIncluded: ["Breakfast"],
        stayHotel: "Crowne Plaza Dubai Marina",
        transferType: "Private Coach",
      },
      {
        dayNumber: 3,
        title: "Thrill Red Dunes Desert Safari with BBQ Dinner",
        activities: ["Morning free for Gold Souk & Spice Souk shopping", "Afternoon pickup in 4x4 Toyota Land Cruiser for thrilling Lahbab Red Dunes safari", "Sandboarding, Camel ride, Henna tattooing, BBQ Buffet dinner with Tanoura & Belly Dance show"],
        mealsIncluded: ["Breakfast", "Dinner"],
        stayHotel: "Crowne Plaza Dubai Marina",
        transferType: "4x4 Land Cruiser",
      },
      {
        dayNumber: 4,
        title: "Abu Dhabi Full Day Tour: Grand Mosque & BAPS Hindu Mandir",
        activities: ["Scenic drive to Abu Dhabi capital city", "Marvel at architectural wonder Sheikh Zayed Grand Mosque", "Visit historic BAPS Hindu Mandir Abu Dhabi", "Drive past Emirates Palace and Yas Island (Ferrari World photo stop)"],
        mealsIncluded: ["Breakfast"],
        stayHotel: "Crowne Plaza Dubai Marina",
        transferType: "AC Luxury Coach",
      },
      {
        dayNumber: 5,
        title: "Farewell Dubai & Airport Departure",
        activities: ["Breakfast & last-minute duty-free shopping", "Assisted transfer to Dubai International Airport (DXB)"],
        mealsIncluded: ["Breakfast"],
        stayHotel: "Check-out",
        transferType: "Airport Drop",
      },
    ],
    datesAvailable: ["2026-09-08", "2026-09-18", "2026-10-02", "2026-10-20", "2026-11-05"],
    cancellationPolicy: [
      { daysBeforeDeparture: "> 30 Days before travel", refundAmount: "85% Refund (Visa fee non-refundable)" },
      { daysBeforeDeparture: "15 to 30 Days before travel", refundAmount: "60% Refund" },
      { daysBeforeDeparture: "< 15 Days before travel", refundAmount: "Non-refundable" },
    ],
  },
];

export const DETAILED_TOURS = DETAILED_TOURS_DATABASE;
export type DetailedTourItem = DetailedTourPackage;
