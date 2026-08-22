import { ServiceCategory } from "../types";

export interface CorporateCompanyProfile {
  id: string;
  companyName: string;
  legalEntityName: string;
  gstin: string;
  companyPan: string;
  cin: string;
  billingAddress: string;
  state: string;
  stateCode: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  creditLimit: number;
  creditUsed: number;
  availableCredit: number;
  billingCycleDays: number;
  nextSettlementDate: string;
  planTier: "Enterprise Platinum" | "SME Gold" | "Startup Growth";
}

export interface CorporateEmployee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: "Engineering" | "Sales & Marketing" | "Finance & Legal" | "Executive Board" | "Operations";
  designation: string;
  band: "Executive" | "Manager" | "Senior Manager" | "Director / VP" | "CXO";
  approverId?: string;
  approverName?: string;
  aadhaarMasked: string;
  passportNumber?: string;
  status: "active" | "inactive";
  spendThisMonth: number;
}

export interface CorporateTravelPolicy {
  band: "Executive" | "Manager" | "Senior Manager" | "Director / VP" | "CXO";
  flights: {
    allowedCabin: ("Economy" | "Premium Economy" | "Business")[];
    maxFlightFareDomestic: number;
    advanceBookingDaysMandatory: number;
    allowFlexiFares: boolean;
  };
  hotels: {
    maxStarRating: number; // e.g. 3, 4, 5
    maxPricePerNightMetro: number; // e.g. ₹5,000
    maxPricePerNightNonMetro: number; // e.g. ₹3,500
    freeBreakfastMandatory: boolean;
  };
  cabs: {
    allowedCategories: ("Sedan" | "SUV" | "Luxury Sedan" | "Hatchback")[];
    maxDailyFare: number;
  };
  trains: {
    allowedClasses: ("1A" | "2A" | "3A" | "CC" | "EC")[];
  };
  dailyPerDiemAllowance: number; // e.g. ₹1,200
  approvalRequired: boolean;
}

export interface CorporateApprovalRequest {
  id: string;
  bookingRef: string;
  employeeId: string;
  employeeName: string;
  employeeBand: string;
  department: string;
  serviceCategory: ServiceCategory;
  title: string;
  routeOrDetails: string;
  travelDate: string;
  estimatedCost: number;
  policyCompliance: "Compliant" | "Policy Violation (Exceeds Budget Ceiling)" | "Policy Violation (Cabin Class)";
  violationReason?: string;
  status: "Pending Approver 1" | "Pending Finance" | "Approved" | "Rejected";
  approverName: string;
  requestedAt: string;
  managerNotes?: string;
}

export interface CorporateExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  tripTitle: string;
  claimDate: string;
  category: "Meals & Per-Diem" | "Airport Cab / Tolls" | "Hotel Incidental" | "Client Dinner";
  amount: number;
  gstClaimableAmount: number;
  vendorName: string;
  invoiceNumber: string;
  receiptUrl?: string;
  status: "Submitted" | "Verified by HR" | "Disbursed to Salary Account" | "Rejected";
}

export interface CorporateGstInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  billingMonth: string;
  bookingId: string;
  serviceType: string;
  travelerName: string;
  sacHsnCode: string;
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  totalInvoiceAmount: number;
  gstinSupplier: string;
  gstinBuyer: string;
  gstr2bMatchStatus: "Matched (100% Tax Credit Available)" | "Pending IRN Sync";
}

export const INITIAL_CORPORATE_PROFILE: CorporateCompanyProfile = {
  id: "corp-tcs-tech",
  companyName: "Bharat Nexus Technologies Pvt. Ltd.",
  legalEntityName: "Bharat Nexus Technologies Private Limited",
  gstin: "07AAACB2491P1ZX",
  companyPan: "AAACB2491P",
  cin: "U72200DL2018PTC334912",
  billingAddress: "Tower B, Cyber City, DLF Phase 2, Gurugram, Haryana - 122002",
  state: "Haryana",
  stateCode: "06",
  contactPerson: "Rajeev Singhania (Head of Procurement)",
  contactEmail: "travel-desk@bharatnexus.in",
  contactPhone: "+91 98110 44556",
  creditLimit: 1500000,
  creditUsed: 425600,
  availableCredit: 1074400,
  billingCycleDays: 30,
  nextSettlementDate: "15 Sep 2026",
  planTier: "Enterprise Platinum",
};

export const INITIAL_CORPORATE_EMPLOYEES: CorporateEmployee[] = [
  {
    id: "emp-001",
    employeeCode: "BNT-1042",
    name: "Aakash Verma",
    email: "aakash.v@bharatnexus.in",
    phone: "+91 98765 43210",
    department: "Sales & Marketing",
    designation: "Associate Sales Director",
    band: "Director / VP",
    approverName: "Rajeev Singhania (VP Ops)",
    aadhaarMasked: "XXXX-XXXX-4912",
    passportNumber: "T4918204",
    status: "active",
    spendThisMonth: 124500,
  },
  {
    id: "emp-002",
    employeeCode: "BNT-2089",
    name: "Sneha Mukherjee",
    email: "sneha.m@bharatnexus.in",
    phone: "+91 98112 34567",
    department: "Engineering",
    designation: "Lead Systems Architect",
    band: "Senior Manager",
    approverName: "Aakash Verma",
    aadhaarMasked: "XXXX-XXXX-8921",
    passportNumber: "Z8192031",
    status: "active",
    spendThisMonth: 68400,
  },
  {
    id: "emp-003",
    employeeCode: "BNT-3401",
    name: "Rohan Kulkarni",
    email: "rohan.k@bharatnexus.in",
    phone: "+91 97654 32198",
    department: "Operations",
    designation: "Field Operations Specialist",
    band: "Executive",
    approverName: "Sneha Mukherjee",
    aadhaarMasked: "XXXX-XXXX-1039",
    status: "active",
    spendThisMonth: 34200,
  },
  {
    id: "emp-004",
    employeeCode: "BNT-4102",
    name: "Pooja Hegde",
    email: "pooja.h@bharatnexus.in",
    phone: "+91 99887 76655",
    department: "Finance & Legal",
    designation: "Financial Controller",
    band: "Senior Manager",
    approverName: "Rajeev Singhania (VP Ops)",
    aadhaarMasked: "XXXX-XXXX-7721",
    status: "active",
    spendThisMonth: 41900,
  },
];

export const CORPORATE_TRAVEL_POLICIES: Record<CorporateEmployee["band"], CorporateTravelPolicy> = {
  Executive: {
    band: "Executive",
    flights: {
      allowedCabin: ["Economy"],
      maxFlightFareDomestic: 6500,
      advanceBookingDaysMandatory: 5,
      allowFlexiFares: false,
    },
    hotels: {
      maxStarRating: 3,
      maxPricePerNightMetro: 4000,
      maxPricePerNightNonMetro: 2800,
      freeBreakfastMandatory: true,
    },
    cabs: {
      allowedCategories: ["Hatchback", "Sedan"],
      maxDailyFare: 1500,
    },
    trains: {
      allowedClasses: ["3A", "CC"],
    },
    dailyPerDiemAllowance: 1200,
    approvalRequired: true,
  },
  Manager: {
    band: "Manager",
    flights: {
      allowedCabin: ["Economy"],
      maxFlightFareDomestic: 9000,
      advanceBookingDaysMandatory: 3,
      allowFlexiFares: true,
    },
    hotels: {
      maxStarRating: 4,
      maxPricePerNightMetro: 6500,
      maxPricePerNightNonMetro: 4500,
      freeBreakfastMandatory: true,
    },
    cabs: {
      allowedCategories: ["Sedan", "SUV"],
      maxDailyFare: 2500,
    },
    trains: {
      allowedClasses: ["2A", "3A", "CC", "EC"],
    },
    dailyPerDiemAllowance: 1800,
    approvalRequired: true,
  },
  "Senior Manager": {
    band: "Senior Manager",
    flights: {
      allowedCabin: ["Economy", "Premium Economy"],
      maxFlightFareDomestic: 12500,
      advanceBookingDaysMandatory: 2,
      allowFlexiFares: true,
    },
    hotels: {
      maxStarRating: 4,
      maxPricePerNightMetro: 9000,
      maxPricePerNightNonMetro: 6000,
      freeBreakfastMandatory: true,
    },
    cabs: {
      allowedCategories: ["Sedan", "SUV"],
      maxDailyFare: 3500,
    },
    trains: {
      allowedClasses: ["1A", "2A", "EC"],
    },
    dailyPerDiemAllowance: 2500,
    approvalRequired: false,
  },
  "Director / VP": {
    band: "Director / VP",
    flights: {
      allowedCabin: ["Economy", "Premium Economy", "Business"],
      maxFlightFareDomestic: 22000,
      advanceBookingDaysMandatory: 0,
      allowFlexiFares: true,
    },
    hotels: {
      maxStarRating: 5,
      maxPricePerNightMetro: 15000,
      maxPricePerNightNonMetro: 11000,
      freeBreakfastMandatory: true,
    },
    cabs: {
      allowedCategories: ["Sedan", "SUV", "Luxury Sedan"],
      maxDailyFare: 6000,
    },
    trains: {
      allowedClasses: ["1A", "EC"],
    },
    dailyPerDiemAllowance: 4000,
    approvalRequired: false,
  },
  CXO: {
    band: "CXO",
    flights: {
      allowedCabin: ["Economy", "Premium Economy", "Business"],
      maxFlightFareDomestic: 35000,
      advanceBookingDaysMandatory: 0,
      allowFlexiFares: true,
    },
    hotels: {
      maxStarRating: 5,
      maxPricePerNightMetro: 25000,
      maxPricePerNightNonMetro: 18000,
      freeBreakfastMandatory: true,
    },
    cabs: {
      allowedCategories: ["SUV", "Luxury Sedan"],
      maxDailyFare: 10000,
    },
    trains: {
      allowedClasses: ["1A", "EC"],
    },
    dailyPerDiemAllowance: 6000,
    approvalRequired: false,
  },
};

export const INITIAL_APPROVAL_REQUESTS: CorporateApprovalRequest[] = [
  {
    id: "req-app-8910",
    bookingRef: "BY-CORP-FL-9021",
    employeeId: "emp-003",
    employeeName: "Rohan Kulkarni",
    employeeBand: "Executive",
    department: "Operations",
    serviceCategory: "flights",
    title: "Delhi (DEL) → Mumbai (BOM) • AI-887",
    routeOrDetails: "Morning 07:00 AM Departure for Client Plant Inspection",
    travelDate: "28 Aug 2026",
    estimatedCost: 7450,
    policyCompliance: "Policy Violation (Exceeds Budget Ceiling)",
    violationReason: "Fare ₹7,450 exceeds ₹6,500 Executive domestic flight ceiling by ₹950.",
    status: "Pending Approver 1",
    approverName: "Sneha Mukherjee",
    requestedAt: "21 Aug 2026, 09:30 AM",
  },
  {
    id: "req-app-8911",
    bookingRef: "BY-CORP-HT-4412",
    employeeId: "emp-002",
    employeeName: "Sneha Mukherjee",
    employeeBand: "Senior Manager",
    department: "Engineering",
    serviceCategory: "hotels",
    title: "ITC Grand Chola • Chennai (2 Nights)",
    routeOrDetails: "Guindy Tech Park Tech Conference & Executive Panel",
    travelDate: "02 Sep - 04 Sep 2026",
    estimatedCost: 17800,
    policyCompliance: "Compliant",
    status: "Approved",
    approverName: "Rajeev Singhania (VP Ops)",
    requestedAt: "20 Aug 2026, 04:15 PM",
    managerNotes: "Approved. Keynote delivery for B2B engineering partnership.",
  },
  {
    id: "req-app-8912",
    bookingRef: "BY-CORP-CB-1904",
    employeeId: "emp-003",
    employeeName: "Rohan Kulkarni",
    employeeBand: "Executive",
    department: "Operations",
    serviceCategory: "cabs",
    title: "Mumbai Airport → Pune Hinjewadi Tech Park (AC Sedan)",
    routeOrDetails: "Urgent hardware depot audit",
    travelDate: "28 Aug 2026",
    estimatedCost: 2450,
    policyCompliance: "Compliant",
    status: "Pending Finance",
    approverName: "Pooja Hegde (Finance)",
    requestedAt: "21 Aug 2026, 10:00 AM",
  },
];

export const INITIAL_EXPENSE_CLAIMS: CorporateExpenseClaim[] = [
  {
    id: "exp-901",
    employeeId: "emp-001",
    employeeName: "Aakash Verma",
    tripTitle: "Bangalore Client Summit & Pitch",
    claimDate: "19 Aug 2026",
    category: "Client Dinner",
    amount: 5400,
    gstClaimableAmount: 823.72,
    vendorName: "Karavalli Restaurant, The Gateway",
    invoiceNumber: "KAR-INV-89102",
    status: "Disbursed to Salary Account",
  },
  {
    id: "exp-902",
    employeeId: "emp-002",
    employeeName: "Sneha Mukherjee",
    tripTitle: "Hyderabad Cloud Tech Summit",
    claimDate: "20 Aug 2026",
    category: "Airport Cab / Tolls",
    amount: 1450,
    gstClaimableAmount: 180.0,
    vendorName: "BharatYatra Corporate Cabs",
    invoiceNumber: "BY-CAB-8912",
    status: "Verified by HR",
  },
  {
    id: "exp-903",
    employeeId: "emp-003",
    employeeName: "Rohan Kulkarni",
    tripTitle: "Manesar Plant Setup",
    claimDate: "21 Aug 2026",
    category: "Meals & Per-Diem",
    amount: 1200,
    gstClaimableAmount: 0,
    vendorName: "Standard Per-Diem Daily Rate",
    invoiceNumber: "PERDIEM-20260821",
    status: "Submitted",
  },
];

export const INITIAL_CORPORATE_INVOICES: CorporateGstInvoice[] = [
  {
    id: "gst-inv-101",
    invoiceNumber: "BY-GST-2026-08-00192",
    invoiceDate: "18 Aug 2026",
    billingMonth: "August 2026",
    bookingId: "BY-FL-90214",
    serviceType: "Air Passenger Transport (Domestic)",
    travelerName: "Aakash Verma",
    sacHsnCode: "996411",
    baseAmount: 18500,
    cgst: 462.5,
    sgst: 462.5,
    igst: 0,
    totalGst: 925, // 5% GST on Economy
    totalInvoiceAmount: 19425,
    gstinSupplier: "07AAACB1092Q1ZV",
    gstinBuyer: "07AAACB2491P1ZX",
    gstr2bMatchStatus: "Matched (100% Tax Credit Available)",
  },
  {
    id: "gst-inv-102",
    invoiceNumber: "BY-GST-2026-08-00214",
    invoiceDate: "19 Aug 2026",
    billingMonth: "August 2026",
    bookingId: "BY-HT-88190",
    serviceType: "Hotel Accommodation Services (>₹7,500/night)",
    travelerName: "Sneha Mukherjee",
    sacHsnCode: "996311",
    baseAmount: 24000,
    cgst: 2160,
    sgst: 2160,
    igst: 0,
    totalGst: 4320, // 18% GST on Luxury Hotel
    totalInvoiceAmount: 28320,
    gstinSupplier: "07AAACB1092Q1ZV",
    gstinBuyer: "07AAACB2491P1ZX",
    gstr2bMatchStatus: "Matched (100% Tax Credit Available)",
  },
  {
    id: "gst-inv-103",
    invoiceNumber: "BY-GST-2026-08-00255",
    invoiceDate: "20 Aug 2026",
    billingMonth: "August 2026",
    bookingId: "BY-CB-19042",
    serviceType: "Passenger Transport - Rent-a-Cab",
    travelerName: "Rohan Kulkarni",
    sacHsnCode: "996601",
    baseAmount: 3800,
    cgst: 95,
    sgst: 95,
    igst: 0,
    totalGst: 190, // 5% GST on Cabs
    totalInvoiceAmount: 3990,
    gstinSupplier: "07AAACB1092Q1ZV",
    gstinBuyer: "07AAACB2491P1ZX",
    gstr2bMatchStatus: "Matched (100% Tax Credit Available)",
  },
];
