export interface LoyaltyTierInfo {
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Kohinoor";
  hindiName: string;
  minSpendAnnual: number;
  multiplier: string;
  badgeColor: string;
  gradient: string;
  perks: string[];
  convenienceFeeWaiver: string;
  loungeAccess: string;
  cancellationBenefit: string;
}

export interface CoinRewardItem {
  id: string;
  title: string;
  description: string;
  category: "dining" | "flights" | "trains" | "hotels" | "cabs";
  coinsRequired: number;
  originalRupeeValue: number;
  icon: string;
  badge?: string;
  expiryDays: number;
}

export interface CouponRule {
  id: string;
  code: string;
  title: string;
  description: string;
  category: "all" | "flights" | "trains" | "buses" | "hotels" | "pilgrimage" | "dining" | "corporate";
  discountType: "flat" | "percentage";
  discountValue: number;
  maxDiscountCap: number;
  minBookingAmount: number;
  bankPartner?: string;
  validTill: string;
  terms: string[];
  totalRedemptions: number;
  status: "active" | "scheduled" | "expired";
}

export const LOYALTY_TIERS: LoyaltyTierInfo[] = [
  {
    tier: "Bronze",
    hindiName: "प्रारंभिक यात्री",
    minSpendAnnual: 0,
    multiplier: "1x YatraCoins",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    gradient: "from-amber-700 to-amber-900",
    perks: [
      "Earn 1 Coin per ₹100 spent",
      "Instant e-ticket via WhatsApp & SMS",
      "Standard customer support via AI chatbot",
    ],
    convenienceFeeWaiver: "Standard Rates",
    loungeAccess: "No",
    cancellationBenefit: "Standard Airline/IRCTC rules",
  },
  {
    tier: "Silver",
    hindiName: "सिल्वर एक्सप्लोरर",
    minSpendAnnual: 25000,
    multiplier: "2x YatraCoins",
    badgeColor: "bg-slate-200 text-slate-800 border-slate-400",
    gradient: "from-slate-400 to-slate-700",
    perks: [
      "Earn 2 Coins per ₹100 spent",
      "5% Extra discount at verified Highway Dhabas",
      "Free seat selection on select Bus routes",
      "Early access to festive Tatkal packages",
    ],
    convenienceFeeWaiver: "₹10 off on Bus bookings",
    loungeAccess: "Discounted access voucher",
    cancellationBenefit: "Instant refund to wallet",
  },
  {
    tier: "Gold",
    hindiName: "स्वर्ण यात्री",
    minSpendAnnual: 75000,
    multiplier: "3x YatraCoins",
    badgeColor: "bg-yellow-100 text-yellow-900 border-yellow-400",
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    perks: [
      "Earn 3 Coins per ₹100 spent",
      "100% Zero Convenience Fee on all IRCTC Train bookings",
      "Free room upgrades at partner 4-star hotels (subject to availability)",
      "Priority WhatsApp concierge with human agent connect",
      "10% discount on outstation cab bookings",
    ],
    convenienceFeeWaiver: "Zero on Trains & Cabs",
    loungeAccess: "2 Complimentary Lounge Passes per year",
    cancellationBenefit: "Zero platform cancellation fee",
  },
  {
    tier: "Platinum",
    hindiName: "प्लैटिनम महाराजा",
    minSpendAnnual: 200000,
    multiplier: "4x YatraCoins",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    gradient: "from-indigo-600 via-purple-600 to-slate-900",
    perks: [
      "Earn 4 Coins per ₹100 spent",
      "Zero Convenience Fee on all Flights & Trains",
      "4 Complimentary Executive Railway / Airport Lounge Passes",
      "Guaranteed late check-out till 4:00 PM at hotels",
      "Dedicated Relationship Manager for pilgrimage & family tours",
      "Complimentary travel insurance on all trips",
    ],
    convenienceFeeWaiver: "Zero on Flights, Trains & Buses",
    loungeAccess: "4 Airport / Vande Bharat Executive Passes",
    cancellationBenefit: "1 Free Date Change on Flights",
  },
  {
    tier: "Kohinoor",
    hindiName: "कोहिनूर एलिट",
    minSpendAnnual: 500000,
    multiplier: "5x YatraCoins",
    badgeColor: "bg-cyan-100 text-cyan-950 border-cyan-400",
    gradient: "from-cyan-500 via-blue-700 to-slate-950",
    perks: [
      "Earn 5 Coins per ₹100 spent (Highest in India)",
      "Zero Convenience Fee across the entire BharatYatra ecosystem",
      "Unlimited Airport Lounge Access for Primary Traveler + 1 Guest",
      "VIP Darshan protocol coordination at select Jyotirlinga shrines",
      "24x7 Dedicated Executive Travel Concierge with direct WhatsApp line",
      "Complimentary 5-star airport chauffeur transfers twice a year",
    ],
    convenienceFeeWaiver: "100% Lifetime Zero Convenience Fee",
    loungeAccess: "Unlimited Domestic Airport & Railway Lounges",
    cancellationBenefit: "100% Free Rescheduling on all bookings",
  },
];

export const REWARD_COINS_CATALOG: CoinRewardItem[] = [
  {
    id: "RWD-01",
    title: "Vande Bharat Hot Gourmet Meal Hamper",
    description: "Enjoy a freshly served hot Satvik or Special Meal delivered to your seat on any train.",
    category: "dining",
    coinsRequired: 350,
    originalRupeeValue: 420,
    icon: "UtensilsCrossed",
    badge: "Bestseller",
    expiryDays: 90,
  },
  {
    id: "RWD-02",
    title: "₹500 Instant Flight Discount Voucher",
    description: "Direct instant deduction on any domestic flight booking with IndiGo, Air India, Akasa.",
    category: "flights",
    coinsRequired: 500,
    originalRupeeValue: 500,
    icon: "Plane",
    badge: "100% Cash Value",
    expiryDays: 180,
  },
  {
    id: "RWD-03",
    title: "Complimentary Airport Lounge Access Pass",
    description: "Access premium luxury lounge with buffet dining, high-speed Wi-Fi and resting pods.",
    category: "flights",
    coinsRequired: 800,
    originalRupeeValue: 1400,
    icon: "Sparkles",
    badge: "Luxury Perk",
    expiryDays: 120,
  },
  {
    id: "RWD-04",
    title: "₹300 Outstation Cab Ride Cashback",
    description: "Deduct ₹300 on any one-way or roundtrip cab from Delhi, Mumbai, Bengaluru.",
    category: "cabs",
    coinsRequired: 300,
    originalRupeeValue: 300,
    icon: "Car",
    expiryDays: 60,
  },
  {
    id: "RWD-05",
    title: "1-Night Hotel Room Upgrade at Heritage Haveli",
    description: "Upgrade from Deluxe Room to Executive Royal Suite across partner heritage resorts.",
    category: "hotels",
    coinsRequired: 1200,
    originalRupeeValue: 2800,
    icon: "Building",
    badge: "High Value",
    expiryDays: 365,
  },
];

export const PROMOTION_COUPONS: CouponRule[] = [
  {
    id: "CPN-HDFC15",
    code: "HDFCFLY",
    title: "HDFC Bank 15% Instant Discount",
    description: "Up to ₹1,500 instant off on domestic flights using HDFC Credit / Debit Cards.",
    category: "flights",
    discountType: "percentage",
    discountValue: 15,
    maxDiscountCap: 1500,
    minBookingAmount: 4000,
    bankPartner: "HDFC Bank",
    validTill: "31 Dec 2026",
    terms: ["Valid once per user per month", "Applicable on HDFC Credit & Debit Cards"],
    totalRedemptions: 48200,
    status: "active",
  },
  {
    id: "CPN-VANDEZERO",
    code: "VANDEZERO",
    title: "Zero Convenience Fee on Vande Bharat",
    description: "100% waiver of payment gateway & platform convenience fee on Vande Bharat trains.",
    category: "trains",
    discountType: "flat",
    discountValue: 30,
    maxDiscountCap: 30,
    minBookingAmount: 500,
    bankPartner: "BharatYatra Direct",
    validTill: "Open 2026",
    terms: ["Applicable on all Vande Bharat 2.0 express routes", "No minimum fare constraint"],
    totalRedemptions: 124000,
    status: "active",
  },
  {
    id: "CPN-YATRASTAY",
    code: "YATRASTAY",
    title: "Flat ₹800 Off on Spiritual Hotels & Resorts",
    description: "Save ₹800 instantly on booking stays in Varanasi, Tirupati, Ayodhya, Puri, Haridwar.",
    category: "hotels",
    discountType: "flat",
    discountValue: 800,
    maxDiscountCap: 800,
    minBookingAmount: 2999,
    bankPartner: "ICICI & SBI RuPay",
    validTill: "30 Nov 2026",
    terms: ["Valid across 450+ verified pilgrimage hotels", "Includes complimentary breakfast"],
    totalRedemptions: 34100,
    status: "active",
  },
  {
    id: "CPN-DHABA100",
    code: "DHABA100",
    title: "₹100 Off Highway Dhaba Pre-Orders",
    description: "Save ₹100 on pre-ordering hot food at Murthal, Cheetal Grand, or Expressways.",
    category: "dining",
    discountType: "flat",
    discountValue: 100,
    maxDiscountCap: 100,
    minBookingAmount: 400,
    bankPartner: "UPI Direct",
    validTill: "31 Oct 2026",
    terms: ["Valid for drive-through and dine-in pre-orders", "Instant table reservation included"],
    totalRedemptions: 59000,
    status: "active",
  },
];
