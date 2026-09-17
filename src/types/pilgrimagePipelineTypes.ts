// Pilgrimage & Cab Role-Based Access Hierarchy Type Definitions

export interface PilgrimageCustomerProfile {
  customerId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isSeniorCitizenPriority: boolean;
  medicalFitnessDeclared: boolean;
}

export interface PilgrimagePackage {
  packageId: string;
  packageName: string;
  circuit: "Char Dham" | "12 Jyotirlinga" | "Vaishno Devi" | "Kashi & Ayodhya" | "South Temple Circuit" | "Puri Jagannath";
  temples: string[];
  duration: string;
  departureCity: string;
  arrivalCity: string;
  basePriceAdult: number;
  basePriceSenior: number;
  helipadAddonPrice: number;
  vipDarshanFee: number;
  availableBatchDates: string[];
  totalSeatsPerBatch: number;
  remainingSeatsCurrentBatch: number;
  transportVehicle: string;
  accommodationType: string;
  mealPlan: string;
  vedicGuideIncluded: boolean;
  operatorId: string;
  operatorName: string;
  rating: number;
  reviewsCount: number;
  image: string;
  highlights: string[];
  highAltitudeAdvisory?: string;
}

export interface PilgrimagePassenger {
  id: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  aadhaarToken: string; // Tokenized Aadhaar / ID proof
  specialSeva: "Rudrabhishek Puja" | "Aarti Pass" | "Mahaprasad Box" | "Senior Wheelchair / Doli" | "None";
  highAltitudeFitnessOk: boolean;
}

export interface PilgrimageBookingRecord {
  bookingId: string; // e.g. "PLG-BK-2026-8819"
  packageId: string;
  packageName: string;
  circuit: string;
  customerId: string;
  customer: PilgrimageCustomerProfile;
  travelDate: string;
  passengersCount: {
    adults: number;
    seniors: number;
    total: number;
  };
  passengers: PilgrimagePassenger[];
  accommodationType: string;
  transportSeats: string[]; // e.g. ["Seat 12A", "Seat 12B"]
  hasHelicopterAddon: boolean;
  
  // Financials
  baseFare: number;
  vipDarshanFees: number;
  helicopterFees: number;
  sevaAddonFees: number;
  gstAmount: number;
  totalAmount: number;
  
  // Payment
  paymentId: string;
  paymentMethod: "UPI" | "NetBanking" | "CreditCard" | "DebitCard";
  paymentStatus: "paid" | "escrow_held" | "refunded";
  
  // Status & Shrine Board Pass
  bookingStatus: "confirmed" | "darshan_pass_issued" | "in_progress" | "completed" | "cancelled";
  ticketNumber: string; // e.g. "TKT-YATRA-2026-9041"
  taxInvoiceNumber: string; // e.g. "INV-PLG-2026-4412"
  darshanSlotTime: string; // e.g. "05:30 AM - 07:00 AM Sugam Darshan"
  helipadPriorityToken?: string;
  shrineBoardQrPayload: string;
  assignedVedicGuide: {
    name: string;
    phone: string;
    badgeId: string;
  };
  createdAt: string;
}

export interface PilgrimageOperator {
  operatorId: string;
  samitiName: string;
  headPriestName: string;
  phone: string;
  email: string;
  regNumber: string; // Trust / Society registration
  gstin: string;
  headquartersCity: string;
  circuitsCovered: string[];
  fleetBusesCount: number;
  accreditedVedicGuidesCount: number;
  verificationStatus: "accredited" | "audit_pending" | "suspended";
  rating: number;
  totalPilgrimsServed: number;
  escrowBalance: number;
}

export interface PilgrimagePaymentLedgerItem {
  paymentId: string;
  bookingId: string;
  packageName: string;
  customerName: string;
  totalCollected: number;
  operatorEscrowPayout: number; // 90%
  platformCommission: number; // 5%
  templeTrustSevaContribution: number; // 5%
  razorpayTransferId: string;
  payoutStatus: "escrow_held" | "settled_to_bank" | "refunded";
  settlementDate: string;
}

// ----------------------------------------------------------------------------
// CAB 4-TIER ROLE ACCESS DEFINITIONS
// ----------------------------------------------------------------------------

export type CabRoleTier = "customer" | "operator" | "admin" | "super_admin";

export interface CabSystemAuditLog {
  logId: string;
  timestamp: string;
  actorRole: CabRoleTier;
  actorId: string;
  actorName: string;
  action: "DISPATCH_CREATED" | "DRIVER_ASSIGNED" | "FARE_OVERRIDE" | "PAYMENT_SPLIT_RELEASED" | "OPERATOR_KYC_VERIFIED" | "TRIP_CANCELLED" | "SECURITY_ALERT";
  entityType: "cab" | "cab_booking" | "payment" | "rate_card" | "driver";
  entityId: string;
  details: string;
  ipAddress: string;
  cryptoChecksum: string;
}

export interface CabFinancialReconciliation {
  reconciliationId: string;
  bookingId: string;
  cabId: string;
  registrationNumber: string;
  partnerId: string;
  partnerName: string;
  totalCustomerPaid: number;
  operatorNetEarnings: number; // 85%
  platformTakeRate: number; // 10%
  gstTdsDeduction: number; // 5%
  driverIncentiveBonus: number;
  razorpayTransferId: string;
  razorpayPayoutBatch: string;
  escrowStatus: "funds_escrowed" | "transferred_to_operator_bank" | "under_review";
  clearedAt: string;
}
