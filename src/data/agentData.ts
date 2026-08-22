export interface TravelAgentKYC {
  agencyName: string;
  tradeLicenseName: string;
  agentName: string;
  email: string;
  phone: string;
  agencyCity: string;
  agencyState: string;
  panNumber: string;
  panVerified: boolean;
  aadhaarNumberMasked: string;
  aadhaarVerified: boolean;
  gstin: string;
  iataNumber?: string;
  taaiNumber?: string;
  irctcPrincipalAgentId?: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  beneficiaryName: string;
  kycStatus: "VERIFIED" | "UNDER_REVIEW" | "PENDING_DOCS";
  kycApprovedDate: string;
  agentTier: "Platinum Master Distributor" | "Gold Agency" | "Silver Agent";
}

export interface AgentCustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalBookingsCount: number;
  totalSpent: number;
  passportNumber?: string;
  passportExpiry?: string;
  frequentFlyerAirIndia?: string;
  frequentFlyerIndiGo?: string;
  irctcUserHandle?: string;
  mealPreference: "Vegetarian" | "Non-Veg" | "Jain Meal" | "Diabetic Meal";
  seatPreference: "Window" | "Aisle";
}

export interface AgentSubAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchLocation: string;
  role: "Counter Booking Executive" | "Branch Manager" | "Accounts & Settlement";
  permissions: {
    canBookFlights: boolean;
    canBookTrains: boolean;
    canBookHotels: boolean;
    canModifyMarkup: boolean;
    canWithdrawCommission: boolean;
  };
  dailyBookingCap: number;
  todayBookedAmount: number;
  status: "Active" | "Suspended";
}

export interface AgentMarkupRule {
  id: string;
  serviceCategory: "flights" | "trains" | "buses" | "hotels" | "tours" | "pilgrimage";
  markupType: "percentage" | "flat_inr";
  markupValue: number; // e.g. 5% or ₹250
  applyToSubAgents: boolean;
  isActive: boolean;
}

export interface AgentWholesaleInventoryItem {
  id: string;
  serviceCategory: "flights" | "trains" | "buses" | "hotels" | "tours" | "pilgrimage";
  title: string;
  route: string;
  date: string;
  provider: string;
  retailPrice: number;
  wholesaleNetAgentPrice: number;
  commissionEarned: number;
  seatOrRoomAvailable: string;
  supplierPnrCode: string;
}

export const INITIAL_AGENT_KYC: TravelAgentKYC = {
  agencyName: "Swastik Tours & Travels B2B Network",
  tradeLicenseName: "Swastik World Travel Solutions LLP",
  agentName: "Sunil Sharma (Principal Partner)",
  email: "bookings@swastiktravels.in",
  phone: "+91 98220 11990",
  agencyCity: "Pune",
  agencyState: "Maharashtra",
  panNumber: "AAWFS9102K",
  panVerified: true,
  aadhaarNumberMasked: "XXXX-XXXX-9104",
  aadhaarVerified: true,
  gstin: "27AAWFS9102K1ZV",
  iataNumber: "14-3-90214",
  taaiNumber: "TAAI-MH-2021-98",
  irctcPrincipalAgentId: "IRCTC-PSP-891024",
  bankAccountNumber: "50200081920491",
  ifscCode: "HDFC0000104",
  bankName: "HDFC Bank Ltd., FC Road Pune",
  beneficiaryName: "Swastik World Travel Solutions LLP",
  kycStatus: "VERIFIED",
  kycApprovedDate: "12 Jan 2024",
  agentTier: "Platinum Master Distributor",
};

export const INITIAL_AGENT_CUSTOMERS: AgentCustomerProfile[] = [
  {
    id: "cust-1",
    name: "Dr. Vikramaditya Joshi",
    phone: "+91 98230 45678",
    email: "dr.v.joshi@rubyhall.com",
    city: "Pune",
    totalBookingsCount: 14,
    totalSpent: 184500,
    passportNumber: "M9021840",
    passportExpiry: "2031-10-15",
    frequentFlyerAirIndia: "AI-1049281",
    frequentFlyerIndiGo: "6E-89210",
    irctcUserHandle: "vjoshi_pune",
    mealPreference: "Vegetarian",
    seatPreference: "Aisle",
  },
  {
    id: "cust-2",
    name: "Meenakshi Sundaram & Family",
    phone: "+91 94440 12890",
    email: "meenakshi.sundaram@tcs.com",
    city: "Chennai",
    totalBookingsCount: 8,
    totalSpent: 92400,
    passportNumber: "Z4819201",
    passportExpiry: "2029-05-20",
    irctcUserHandle: "msundaram77",
    mealPreference: "Jain Meal",
    seatPreference: "Window",
  },
  {
    id: "cust-3",
    name: "Rajeshwar Rao Choudhary",
    phone: "+91 98110 99221",
    email: "rrc.investments@gmail.com",
    city: "New Delhi",
    totalBookingsCount: 22,
    totalSpent: 341000,
    passportNumber: "P3049182",
    passportExpiry: "2033-02-18",
    frequentFlyerIndiGo: "6E-55410",
    irctcUserHandle: "rrc_delhi",
    mealPreference: "Vegetarian",
    seatPreference: "Window",
  },
];

export const INITIAL_AGENT_SUB_ACCOUNTS: AgentSubAccount[] = [
  {
    id: "sub-1",
    name: "Kunal Deshmukh",
    email: "kunal.d@swastiktravels.in",
    phone: "+91 97654 11029",
    branchLocation: "Kothrud Branch, Pune",
    role: "Counter Booking Executive",
    permissions: {
      canBookFlights: true,
      canBookTrains: true,
      canBookHotels: true,
      canModifyMarkup: false,
      canWithdrawCommission: false,
    },
    dailyBookingCap: 200000,
    todayBookedAmount: 48500,
    status: "Active",
  },
  {
    id: "sub-2",
    name: "Pooja Kulkarni",
    email: "pooja.k@swastiktravels.in",
    phone: "+91 98221 55432",
    branchLocation: "Vashi Branch, Navi Mumbai",
    role: "Branch Manager",
    permissions: {
      canBookFlights: true,
      canBookTrains: true,
      canBookHotels: true,
      canModifyMarkup: true,
      canWithdrawCommission: false,
    },
    dailyBookingCap: 500000,
    todayBookedAmount: 142000,
    status: "Active",
  },
  {
    id: "sub-3",
    name: "Deepak Sane",
    email: "accounts@swastiktravels.in",
    phone: "+91 98900 33211",
    branchLocation: "Head Office Pune",
    role: "Accounts & Settlement",
    permissions: {
      canBookFlights: false,
      canBookTrains: false,
      canBookHotels: false,
      canModifyMarkup: true,
      canWithdrawCommission: true,
    },
    dailyBookingCap: 1000000,
    todayBookedAmount: 0,
    status: "Active",
  },
];

export const INITIAL_AGENT_MARKUP_RULES: AgentMarkupRule[] = [
  {
    id: "mk-1",
    serviceCategory: "flights",
    markupType: "flat_inr",
    markupValue: 350, // Add ₹350 per sector
    applyToSubAgents: true,
    isActive: true,
  },
  {
    id: "mk-2",
    serviceCategory: "hotels",
    markupType: "percentage",
    markupValue: 8.5, // Add 8.5% margin on B2B hotel net rate
    applyToSubAgents: true,
    isActive: true,
  },
  {
    id: "mk-3",
    serviceCategory: "buses",
    markupType: "flat_inr",
    markupValue: 75,
    applyToSubAgents: false,
    isActive: true,
  },
  {
    id: "mk-4",
    serviceCategory: "tours",
    markupType: "percentage",
    markupValue: 12.0,
    applyToSubAgents: true,
    isActive: true,
  },
  {
    id: "mk-5",
    serviceCategory: "pilgrimage",
    markupType: "percentage",
    markupValue: 10.0,
    applyToSubAgents: true,
    isActive: true,
  },
];

export const AGENT_WHOLESALE_INVENTORY: AgentWholesaleInventoryItem[] = [
  {
    id: "wh-fl-1",
    serviceCategory: "flights",
    title: "IndiGo 6E-204 • Pune (PNQ) → Delhi (DEL)",
    route: "PNQ - DEL (06:40 AM)",
    date: "28 Aug 2026",
    provider: "IndiGo Airlines",
    retailPrice: 5800,
    wholesaleNetAgentPrice: 5220,
    commissionEarned: 580,
    seatOrRoomAvailable: "7 B2B Seats Held",
    supplierPnrCode: "6E-B2B-89410",
  },
  {
    id: "wh-ht-1",
    serviceCategory: "hotels",
    title: "Taj Vivanta Dwarka • New Delhi (Deluxe City View)",
    route: "Dwarka Sector 21, Metro Connected",
    date: "28 Aug 2026 (1 Night)",
    provider: "IHCL Taj Group",
    retailPrice: 9500,
    wholesaleNetAgentPrice: 7900,
    commissionEarned: 1600,
    seatOrRoomAvailable: "4 Rooms Available",
    supplierPnrCode: "TAJ-B2B-4410",
  },
  {
    id: "wh-tr-1",
    serviceCategory: "trains",
    title: "Vande Bharat Express (20901) • Executive Chair Car (EC)",
    route: "Mumbai Central (MMCT) → Gandhinagar Capital",
    date: "29 Aug 2026",
    provider: "Indian Railways / IRCTC",
    retailPrice: 2475,
    wholesaleNetAgentPrice: 2400,
    commissionEarned: 75,
    seatOrRoomAvailable: "12 Seats (IRCTC B2B Agent Quota)",
    supplierPnrCode: "IRCTC-AQ-9014",
  },
  {
    id: "wh-tour-1",
    serviceCategory: "tours",
    title: "Golden Triangle Royal Heritage (5D/4N All-Inclusive)",
    route: "Delhi - Agra - Jaipur - Delhi (Private AC Innova)",
    date: "01 Sep 2026 Departure",
    provider: "Bharat Heritage DMC",
    retailPrice: 28500,
    wholesaleNetAgentPrice: 24200,
    commissionEarned: 4300,
    seatOrRoomAvailable: "6 Slots Confirmed",
    supplierPnrCode: "DMC-GT-1049",
  },
];
