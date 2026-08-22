export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  isPureVeg: boolean;
  isJainFriendly: boolean;
  isSatvik?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
  isBestSeller: boolean;
  image?: string;
  spiceLevel?: "Mild" | "Medium" | "Spicy" | "Desi Teekha";
  category: "Thalis" | "Starters & Snacks" | "Main Course" | "Breads & Rice" | "Desserts & Beverages" | "Jain & Satvik Specials";
}

export interface DiningReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  verifiedTripType: "Highway Pitstop" | "IRCTC Train Delivery" | "Family Dine-in";
  comment: string;
  foodDishRecommended: string;
}

export interface DiningOffer {
  id: string;
  code: string;
  title: string;
  discount: string;
  minBillAmount: number;
  validTill: string;
  terms: string;
}

export interface DetailedDiningItem {
  id: string;
  name: string;
  tagline?: string;
  type: "Highway Dhaba" | "Pure Veg Restaurant" | "Heritage Dining" | "Expressway Food Court" | "IRCTC Delivery Partner" | "South Indian Tiffin Hub";
  highwayCorridor: string; // e.g. "NH-44 (Delhi - Chandigarh)", "Yamuna Expressway (Delhi - Agra)"
  location: string;
  city: string;
  state: string;
  landmark?: string;
  latLng?: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  priceForTwo: number;
  featuredImage: string;
  galleryImages: string[];
  dietaryTags: ("100% Pure Veg" | "Jain Food Available" | "Satvik Food" | "Halal Certified" | "Gluten Free Friendly" | "Live Tandoor" | "Organic Desi Ghee")[];
  features: {
    cleanWashroomCertified: boolean;
    evFastChargingOnSite: boolean;
    familyACSection: boolean;
    valetParking: boolean;
    petFriendlyGarden: boolean;
    outdoorCharpaiSeating?: boolean;
    open24x7?: boolean;
  };
  deliveryToTrainStations: string[]; // e.g. ["NDLS", "CNB", "BSB", "AGC", "LKO"]
  menu: MenuItem[];
  reviews: DiningReview[];
  offers: DiningOffer[];
  tableBookingAvailable: boolean;
  tableDiscountPercent: number;
  trainDeliveryLeadMinutes: number; // e.g. 45 mins before train arrives at station
}

export const DINING_OFFERS_GLOBAL: DiningOffer[] = [
  {
    id: "off-dhaba-1",
    code: "HIGHWAY15",
    title: "15% Instant Off on Table Bills",
    discount: "Flat 15% OFF",
    minBillAmount: 400,
    validTill: "30 Sep 2026",
    terms: "Valid on advance table reservations across all partner highway dhabas.",
  },
  {
    id: "off-dhaba-2",
    code: "FREELASSI",
    title: "Complimentary Clay Pot Lassi on ₹500+",
    discount: "Free Desi Lassi (Worth ₹95)",
    minBillAmount: 500,
    validTill: "31 Oct 2026",
    terms: "Available on dine-in order ahead and pre-paid meals.",
  },
  {
    id: "off-dhaba-3",
    code: "IRCTCHOT",
    title: "IRCTC Train Berth Delivery Waiver",
    discount: "₹0 Delivery Fee + 10% Off",
    minBillAmount: 250,
    validTill: "31 Dec 2026",
    terms: "Valid on all confirmed train PNR meal deliveries at major railway junctions.",
  },
  {
    id: "off-dhaba-4",
    code: "FASTAGREFUND",
    title: "Expressway FASTag Toll Cashback",
    discount: "Flat ₹50 Off on Dining",
    minBillAmount: 600,
    validTill: "15 Nov 2026",
    terms: "Show today's FASTag toll SMS or expressway receipt at billing counter.",
  },
];

export const DETAILED_DINING_DATABASE: DetailedDiningItem[] = [
  {
    id: "dhaba-murthal-amrik-sukhdev",
    name: "Amrik Sukhdev Iconic Dhaba",
    tagline: "The Legend of Grand Trunk Road since 1956",
    type: "Highway Dhaba",
    highwayCorridor: "NH-44 (Grand Trunk Road / Delhi - Chandigarh)",
    location: "52.250 KM Stone, G.T. Road, Murthal",
    city: "Murthal / Sonipat",
    state: "Haryana",
    landmark: "Near Toll Gate 52 KM Stone",
    latLng: { lat: 29.0274, lng: 77.0722 },
    rating: 4.91,
    reviewCount: 18450,
    priceForTwo: 550,
    featuredImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    ],
    dietaryTags: ["100% Pure Veg", "Jain Food Available", "Live Tandoor", "Organic Desi Ghee"],
    features: {
      cleanWashroomCertified: true,
      evFastChargingOnSite: true,
      familyACSection: true,
      valetParking: true,
      petFriendlyGarden: true,
      outdoorCharpaiSeating: true,
      open24x7: true,
    },
    deliveryToTrainStations: ["NDLS", "DLI", "UMB", "PNP"],
    tableBookingAvailable: true,
    tableDiscountPercent: 15,
    trainDeliveryLeadMinutes: 60,
    offers: [DINING_OFFERS_GLOBAL[0], DINING_OFFERS_GLOBAL[1]],
    reviews: [
      {
        id: "rev-1",
        userName: "Harpreet Singh Sodhi",
        userCity: "Chandigarh",
        rating: 5,
        date: "18 Aug 2026",
        verifiedTripType: "Highway Pitstop",
        comment: "Unmatched Amritsari Aloo Pyaaz Paratha dripping with pure white Makhan! Super clean washrooms and EV charger worked flawlessly.",
        foodDishRecommended: "Amritsari Aloo Pyaaz Paratha + Kulhad Lassi",
      },
      {
        id: "rev-2",
        userName: "Shalini Gupta",
        userCity: "Delhi NCR",
        rating: 5,
        date: "14 Aug 2026",
        verifiedTripType: "Family Dine-in",
        comment: "Reserved a family AC table through BharatYatra with 15% discount. Prompt service and top tier Dal Makhani.",
        foodDishRecommended: "Dal Makhani Desi Ghee & Paneer Kulcha",
      },
    ],
    menu: [
      { id: "m1", name: "Amritsari Aloo Pyaaz Paratha with White Butter", hindiName: "अमृतसरी आलू प्याज परांठा", description: "Clay oven roasted jumbo paratha loaded with fresh homemade white Makhan and spicy mango pickle", price: 140, isPureVeg: true, isJainFriendly: false, isBestSeller: true, spiceLevel: "Medium", category: "Starters & Snacks" },
      { id: "m2", name: "Paneer Stuffed Tandoori Paratha", hindiName: "पनीर तंदूरी परांठा", description: "Fresh malai paneer stuffed in crispy whole wheat crust with dollop of Makhan", price: 170, isPureVeg: true, isJainFriendly: true, isBestSeller: true, spiceLevel: "Medium", category: "Starters & Snacks" },
      { id: "m3", name: "Dal Makhani Desi Ghee", hindiName: "दाल मखनी देसी घी", description: "Slow cooked black lentils simmered for 16 hours on coal tandoor with real churned butter", price: 260, isPureVeg: true, isJainFriendly: true, isBestSeller: true, spiceLevel: "Mild", category: "Main Course" },
      { id: "m4", name: "Shahi Paneer (No Onion/Garlic Option Available)", hindiName: "शाही पनीर", description: "Rich cashew and fresh tomato gravy with melt-in-mouth cottage cheese chunks", price: 290, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, spiceLevel: "Mild", category: "Main Course" },
      { id: "m5", name: "Special Murthal Sweet Lassi in Earthen Kulhad", hindiName: "मुरथल स्पेशल मीठी लस्सी", description: "Thick creamy churned yogurt topped with thick Malai layer and crushed green pistachios", price: 95, isPureVeg: true, isJainFriendly: true, isBestSeller: true, category: "Desserts & Beverages" },
      { id: "m6", name: "Satvik Jain Veg Thali (Zero Onion Garlic)", hindiName: "सात्विक जैन थाली", description: "Jain Paneer, Yellow Moong Dal, 4 Tawa Phulkas, Basmati Pulao, Curd & Hot Gulab Jamun", price: 310, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Jain & Satvik Specials" },
    ],
  },
  {
    id: "dhaba-yamuna-expressway-taj",
    name: "Expressway Highway Oasis & Bikanervala",
    tagline: "Premium Pitstop on Yamuna Expressway with 24/7 Food Court",
    type: "Expressway Food Court",
    highwayCorridor: "Yamuna Expressway (Greater Noida - Agra)",
    location: "Milestone 95 km, Jewar Toll Plaza",
    city: "Mathura / Jewar",
    state: "Uttar Pradesh",
    landmark: "Right after Jewar Interchange KM 95",
    latLng: { lat: 28.1254, lng: 77.5582 },
    rating: 4.78,
    reviewCount: 7890,
    priceForTwo: 450,
    featuredImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
    ],
    dietaryTags: ["100% Pure Veg", "Jain Food Available", "Satvik Food", "Gluten Free Friendly"],
    features: {
      cleanWashroomCertified: true,
      evFastChargingOnSite: true,
      familyACSection: true,
      valetParking: false,
      petFriendlyGarden: true,
      outdoorCharpaiSeating: false,
      open24x7: true,
    },
    deliveryToTrainStations: ["AGC", "MTJ", "NDLS"],
    tableBookingAvailable: true,
    tableDiscountPercent: 10,
    trainDeliveryLeadMinutes: 45,
    offers: [DINING_OFFERS_GLOBAL[0], DINING_OFFERS_GLOBAL[3]],
    reviews: [
      {
        id: "rev-3",
        userName: "Abhinav Mehrotra",
        userCity: "Lucknow",
        rating: 5,
        date: "19 Aug 2026",
        verifiedTripType: "Highway Pitstop",
        comment: "Cleanest food court on Yamuna Expressway. Got hot fresh Dosa and Mathura Peda for gifting. Fast billing!",
        foodDishRecommended: "Royal Mathura Peda + Crispy Masala Dosa",
      },
    ],
    menu: [
      { id: "m7", name: "Royal Mathura Peda Box (500g)", hindiName: "मथुरा पेड़ा स्पेशल", description: "Authentic caramelised milk fudge made with pure cow milk, green cardamom and saffron strands", price: 320, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Desserts & Beverages" },
      { id: "m8", name: "Deluxe Satvik Vaishnav Thali", hindiName: "डीलक्स सात्विक वैष्णव थाली", description: "Paneer butter masala, Dal tadka, 2 Aloo pyaz kulcha, Jeera rice, Boondi Raita, Gulab Jamun", price: 340, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Thalis" },
      { id: "m9", name: "Crispy Masala Dosa with Drumstick Sambar", hindiName: "मसाला डोसा", description: "Golden fermented rice crepe stuffed with spiced potato mash, served with coconut & tomato chutney", price: 160, isPureVeg: true, isJainFriendly: true, isGlutenFree: true, isBestSeller: false, category: "Starters & Snacks" },
      { id: "m10", name: "Agra Petha Assorted Box (4 Flavors)", hindiName: "आगरा का मशहूर पेठा", description: "Kesar, Angoori, Pan, and Dry Petha box certified fresh", price: 220, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Desserts & Beverages" },
    ],
  },
  {
    id: "dhaba-haldirams-train-delivery",
    name: "Haldiram's Express IRCTC e-Catering Hub",
    tagline: "Hygienic Railway Berth Food Delivery Across 150+ Stations",
    type: "IRCTC Delivery Partner",
    highwayCorridor: "Pan-India Rail Network Hub (Delhi / Kanpur / Varanasi / Mumbai / Kolkata)",
    location: "Railway Station Commercial Kitchens",
    city: "New Delhi (NDLS) / Kanpur (CNB) / Varanasi (BSB)",
    state: "National",
    landmark: "Platform 1 IRCTC Food Plaza",
    latLng: { lat: 28.6429, lng: 77.2195 },
    rating: 4.88,
    reviewCount: 24500,
    priceForTwo: 390,
    featuredImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    ],
    dietaryTags: ["100% Pure Veg", "Jain Food Available", "Satvik Food", "Gluten Free Friendly"],
    features: {
      cleanWashroomCertified: true,
      evFastChargingOnSite: false,
      familyACSection: true,
      valetParking: false,
      petFriendlyGarden: false,
      outdoorCharpaiSeating: false,
      open24x7: true,
    },
    deliveryToTrainStations: ["NDLS", "CNB", "BSB", "DDU", "MMCT", "SBC", "MAS", "HWH", "PNBE", "GHY"],
    tableBookingAvailable: false,
    tableDiscountPercent: 0,
    trainDeliveryLeadMinutes: 30,
    offers: [DINING_OFFERS_GLOBAL[2]],
    reviews: [
      {
        id: "rev-4",
        userName: "Pramodini Sen",
        userCity: "Kolkata",
        rating: 5,
        date: "20 Aug 2026",
        verifiedTripType: "IRCTC Train Delivery",
        comment: "Delivered piping hot to my Rajdhani coach B3 seat 42 at Kanpur central! Sealed packaging with wet wipes.",
        foodDishRecommended: "Train Seat Jumbo Maharaja Thali",
      },
    ],
    menu: [
      { id: "m11", name: "Train Seat Jumbo Maharaja Thali (Hot Sealed Box)", hindiName: "ट्रेन महाराजा थाली (गरम पैक्ड)", description: "Paneer Lababdar, Dal Makhani, 4 Butter Phulkas, Jeera Pulao, Curd, Pickle, Rasgulla & Sanitizer sachet", price: 280, isPureVeg: true, isJainFriendly: false, isBestSeller: true, category: "Thalis" },
      { id: "m12", name: "Jain No-Onion No-Garlic Thali (Certified Green)", hindiName: "जैन स्पेशल सात्विक थाली", description: "Special Jain Paneer, Yellow Dal Tadka, 4 Tawa Rotis, Steamed Rice, Sweet & Roasted Papad", price: 260, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Jain & Satvik Specials" },
      { id: "m13", name: "Chole Bhature with Pickled Green Chilli (2 Pcs)", hindiName: "छोले भटूरे स्पेशल", description: "Fluffy golden fried bhature with spicy Punjabi style chickpeas and pickled onion salad", price: 180, isPureVeg: true, isJainFriendly: false, isBestSeller: true, category: "Main Course" },
      { id: "m14", name: "Masala Chai Flask (Serves 4)", hindiName: "मसाला चाय थर्मस फ्लास्क", description: "Hot ginger-cardamom tea delivered in thermal stay-hot container with 4 paper cups", price: 120, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Desserts & Beverages" },
    ],
  },
  {
    id: "dhaba-mumbai-pune-datta",
    name: "Datta Snacks & Highway Vada Pav Lounge",
    tagline: "The Authentic Maharashtrian Taste of Expressway since 1978",
    type: "Highway Dhaba",
    highwayCorridor: "Mumbai - Pune Expressway (NH-48)",
    location: "Palaspe Phata / Shedung Toll Plaza, Panvel",
    city: "Panvel / Lonavala",
    state: "Maharashtra",
    landmark: "Before Khalapur Toll Plaza",
    latLng: { lat: 18.9102, lng: 73.1204 },
    rating: 4.84,
    reviewCount: 14200,
    priceForTwo: 320,
    featuredImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    ],
    dietaryTags: ["100% Pure Veg", "Jain Food Available", "Gluten Free Friendly"],
    features: {
      cleanWashroomCertified: true,
      evFastChargingOnSite: true,
      familyACSection: true,
      valetParking: false,
      petFriendlyGarden: true,
      outdoorCharpaiSeating: false,
      open24x7: true,
    },
    deliveryToTrainStations: ["LNL", "PUNE", "CSMT", "KYN"],
    tableBookingAvailable: true,
    tableDiscountPercent: 10,
    trainDeliveryLeadMinutes: 30,
    offers: [DINING_OFFERS_GLOBAL[0]],
    reviews: [
      {
        id: "rev-5",
        userName: "Chinmayee Deshpande",
        userCity: "Mumbai",
        rating: 5,
        date: "16 Aug 2026",
        verifiedTripType: "Highway Pitstop",
        comment: "Kothimbir Vadi and spicy Misal Pav are iconic! Quickest service on Mumbai-Pune expressway.",
        foodDishRecommended: "Puneri Misal Pav + Kothimbir Vadi",
      },
    ],
    menu: [
      { id: "m15", name: "Puneri Kolhapuri Spicy Misal Pav with Farsan", hindiName: "पुणेरी मिसळ पाव", description: "Spicy sprout curry with crunch farsan, chopped onions, lemon and 2 fresh buttery ladi pavs", price: 110, isPureVeg: true, isJainFriendly: false, isBestSeller: true, spiceLevel: "Desi Teekha", category: "Starters & Snacks" },
      { id: "m16", name: "Crispy Kothimbir Vadi (6 Pcs)", hindiName: "कोथिंबीर वडी", description: "Gram flour and fresh coriander cakes steamed and crisp fried with mint dip", price: 120, isPureVeg: true, isJainFriendly: true, isBestSeller: true, category: "Starters & Snacks" },
      { id: "m17", name: "Batata Vada & Green Thecha Pav (2 Pcs)", hindiName: "गरमागरम बटाटा वड़ा", description: "Hot crispy potato fritters stuffed in ladi pav with fiery peanut-garlic thecha", price: 80, isPureVeg: true, isJainFriendly: false, isBestSeller: true, spiceLevel: "Spicy", category: "Starters & Snacks" },
      { id: "m18", name: "Fresh Filter Coffee in Davarah Glass", hindiName: "फ़िल्टर कॉफ़ी", description: "Freshly brewed chicory filter decoction with rich foamy whole milk", price: 45, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Desserts & Beverages" },
    ],
  },
  {
    id: "dhaba-chennai-saravana-nh45",
    name: "Saravana Bhavan Highway Grand & Tiffin",
    tagline: "Authentic South Indian Filter Coffee & Ghee Roast Dosas",
    type: "South Indian Tiffin Hub",
    highwayCorridor: "NH-45 (Grand Southern Trunk / Chennai - Trichy)",
    location: "KM 78, Tindivanam Highway Junction",
    city: "Tindivanam / Kanchipuram",
    state: "Tamil Nadu",
    landmark: "Tindivanam Bypass Toll Plaza",
    latLng: { lat: 12.2287, lng: 79.6508 },
    rating: 4.86,
    reviewCount: 11200,
    priceForTwo: 380,
    featuredImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    ],
    dietaryTags: ["100% Pure Veg", "Jain Food Available", "Satvik Food", "Gluten Free Friendly"],
    features: {
      cleanWashroomCertified: true,
      evFastChargingOnSite: true,
      familyACSection: true,
      valetParking: true,
      petFriendlyGarden: true,
      outdoorCharpaiSeating: false,
      open24x7: false,
    },
    deliveryToTrainStations: ["MAS", "MS", "TPJ", "MDU"],
    tableBookingAvailable: true,
    tableDiscountPercent: 12,
    trainDeliveryLeadMinutes: 40,
    offers: [DINING_OFFERS_GLOBAL[0]],
    reviews: [
      {
        id: "rev-6",
        userName: "Karthik Subramanian",
        userCity: "Chennai",
        rating: 5,
        date: "17 Aug 2026",
        verifiedTripType: "Highway Pitstop",
        comment: "Best Ghee Roast Dosa on the highway towards Pondicherry/Trichy. Excellent parking and neat restrooms.",
        foodDishRecommended: "Special Ghee Paper Roast + Filter Coffee",
      },
    ],
    menu: [
      { id: "m19", name: "Special Ghee Paper Roast Dosa", hindiName: "स्पेशल घी रोस्ट डोसा", description: "Ultra-crisp 2-foot long golden crepe bathed in pure ghee, served with 3 chutneys & piping hot sambar", price: 170, isPureVeg: true, isJainFriendly: true, isGlutenFree: true, isBestSeller: true, category: "Starters & Snacks" },
      { id: "m20", name: "Traditional South Indian Full Meals (Banana Leaf)", hindiName: "दक्षिण भारतीय थाली", description: "Rice, Sambar, Rasam, Kara Kuzhambu, Kootu, Poriyal, Appalam, Curd, Payasam", price: 230, isPureVeg: true, isJainFriendly: false, isBestSeller: true, category: "Thalis" },
      { id: "m21", name: "Medu Vada Sambar Dip (2 Pcs)", hindiName: "मेदु वड़ा सांबर डिप", description: "Crispy lentil fritters submerged in hot aromatic drumstick sambar", price: 90, isPureVeg: true, isJainFriendly: false, isGlutenFree: true, isBestSeller: true, category: "Starters & Snacks" },
      { id: "m22", name: "Kumbakonam Degree Coffee", hindiName: "डिग्री फ़िल्टर कॉफ़ी", description: "Brass cup filter coffee brewed from freshly roasted Arabica & Robusta beans", price: 50, isPureVeg: true, isJainFriendly: true, isSatvik: true, isBestSeller: true, category: "Desserts & Beverages" },
    ],
  },
];

export const DETAILED_DINING = DETAILED_DINING_DATABASE;
