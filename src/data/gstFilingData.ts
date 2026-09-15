export interface GstinRegistration {
  stateCode: string;
  stateName: string;
  gstin: string;
  legalName: string;
  tradeName: string;
  registrationDate: string;
  taxpayerType: "Regular" | "E-Commerce Operator (Sec 52)" | "ISD";
  status: "ACTIVE" | "PENDING_RENEWAL";
  nodalJurisdiction: string;
  authorizedSignatory: string;
}

export interface GstFilingPeriod {
  periodId: string; // e.g. "2026-08"
  periodLabel: string; // e.g. "August 2026"
  financialYear: string; // e.g. "2026-27"
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  gstr1: {
    status: "FILED" | "READY_TO_FILE" | "DRAFTED" | "OVERDUE";
    dueDate: string;
    filingDate?: string;
    arn?: string;
    totalInvoices: number;
    taxableValueINR: number;
    cgstINR: number;
    sgstINR: number;
    igstINR: number;
    totalTaxINR: number;
  };
  gstr3b: {
    status: "FILED" | "READY_TO_FILE" | "PENDING_OFFSET" | "DRAFTED";
    dueDate: string;
    filingDate?: string;
    arn?: string;
    outputTaxLiabilityINR: number;
    itcEligibleINR: number;
    itcUtilizedINR: number;
    netCashTaxPaidINR: number;
    interestINR: number;
    lateFeeINR: number;
    cpinChallan?: string;
  };
  gstr8Tcs: {
    status: "FILED" | "READY_TO_FILE" | "DRAFTED";
    dueDate: string;
    filingDate?: string;
    arn?: string;
    totalSuppliers: number;
    grossSuppliesINR: number;
    returnsValueINR: number;
    netTaxableSuppliesINR: number;
    tcsCollectedINR: number; // 1% (0.5% CGST + 0.5% SGST or 1% IGST)
  };
  gstr2b: {
    autoDraftedDate: string;
    totalInwardInvoices: number;
    availableItcINR: number;
    ineligibleItcINR: number;
    reconciliationMatchRate: number; // % e.g. 98.4%
  };
}

export interface Gstr1OutwardSupplyRecord {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGstin?: string;
  recipientType: "B2B" | "B2C_LARGE" | "B2C_SMALL" | "SEZ_WITH_PAY" | "CREDIT_NOTE";
  posStateCode: string;
  posStateName: string;
  travelCategory: "Flights" | "Hotels" | "IRCTC Trains" | "Buses" | "Cabs" | "Yatras" | "Corporate";
  sacCode: string;
  sacDescription: string;
  taxableValueINR: number;
  gstRatePercent: number;
  cgstINR: number;
  sgstINR: number;
  igstINR: number;
  totalInvoiceINR: number;
  eInvoiceStatus: "IRN_GENERATED" | "NOT_APPLICABLE" | "PENDING_IRN" | "FAILED";
  irnNumber?: string;
  eWayBillNo?: string;
  filingStatus: "VALIDATED" | "DRAFT" | "SUBMITTED" | "ERROR";
}

export interface Gstr8TcsSupplierRecord {
  supplierId: string;
  partnerName: string;
  partnerGstin: string;
  partnerType: "Lodge & PMS" | "Bus Fleet Operator" | "Cab Fleet Partner" | "Dhaba & Dining" | "Tour Organizer";
  stateCode: string;
  grossSuppliesINR: number;
  returnsINR: number;
  netTaxableSuppliesINR: number;
  cgstTcsINR: number; // 0.5%
  sgstTcsINR: number; // 0.5%
  igstTcsINR: number; // 1.0%
  totalTcsINR: number;
  settlementMonth: string;
  status: "DRAFT" | "VERIFIED" | "REPORTED";
}

export interface Gstr2bItcReconciliationRecord {
  recordId: string;
  supplierName: string;
  supplierGstin: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableValueINR: number;
  cgstINR: number;
  sgstINR: number;
  igstINR: number;
  totalTaxINR: number;
  itcEligibility: "INPUT_SERVICES" | "CAPITAL_GOODS" | "INELIGIBLE_SEC_17_5" | "RCM";
  reconciliationStatus: "MATCHED_100" | "VALUE_MISMATCH" | "MISSING_IN_BOOKS" | "PENDING_VENDOR_GSTR1";
  varianceNotes?: string;
}

export interface SacSummaryItem {
  sacCode: string;
  description: string;
  category: string;
  taxRatePercent: number;
  totalInvoices: number;
  taxableValueINR: number;
  cgstINR: number;
  sgstINR: number;
  igstINR: number;
  totalTaxINR: number;
}

export interface Pmt06Challan {
  challanId: string;
  cpin: string;
  generationDate: string;
  expiryDate: string;
  periodLabel: string;
  igstTax: number;
  cgstTax: number;
  sgstTax: number;
  totalChallanAmountINR: number;
  paymentMode: "NEFT_RTGS" | "NET_BANKING" | "OVER_THE_COUNTER";
  status: "PAID" | "AWAITING_PAYMENT" | "EXPIRED";
  cinNumber?: string;
  paymentBank?: string;
  paymentDate?: string;
}

// 1. Registered GSTINs across India
export const BHARAT_YATRA_GSTIN_REGISTRATIONS: GstinRegistration[] = [
  {
    stateCode: "07",
    stateName: "Delhi (Principal Place of Business)",
    gstin: "07AABCB1421R1Z8",
    legalName: "BharatYatra Travel & Mobility Technologies Private Limited",
    tradeName: "BharatYatra SuperApp",
    registrationDate: "2024-04-01",
    taxpayerType: "Regular",
    status: "ACTIVE",
    nodalJurisdiction: "Ward 42, Range 11, Central GST Delhi West",
    authorizedSignatory: "Nasir Khan (Director of Compliance)",
  },
  {
    stateCode: "27",
    stateName: "Maharashtra",
    gstin: "27AABCB1421R1Z5",
    legalName: "BharatYatra Travel & Mobility Technologies Private Limited",
    tradeName: "BharatYatra West Hub",
    registrationDate: "2024-04-15",
    taxpayerType: "E-Commerce Operator (Sec 52)",
    status: "ACTIVE",
    nodalJurisdiction: "Bandra Kurla Complex Division IV, Mumbai",
    authorizedSignatory: "Nasir Khan",
  },
  {
    stateCode: "29",
    stateName: "Karnataka",
    gstin: "29AABCB1421R1Z1",
    legalName: "BharatYatra Travel & Mobility Technologies Private Limited",
    tradeName: "BharatYatra South Tech Campus",
    registrationDate: "2024-05-01",
    taxpayerType: "E-Commerce Operator (Sec 52)",
    status: "ACTIVE",
    nodalJurisdiction: "Koramangala Commercial Taxes Office, Bengaluru",
    authorizedSignatory: "Nasir Khan",
  },
  {
    stateCode: "33",
    stateName: "Tamil Nadu",
    gstin: "33AABCB1421R1Z8",
    legalName: "BharatYatra Travel & Mobility Technologies Private Limited",
    tradeName: "BharatYatra Chennai Hub",
    registrationDate: "2024-06-10",
    taxpayerType: "Regular",
    status: "ACTIVE",
    nodalJurisdiction: "Nungambakkam Assessment Circle, Chennai",
    authorizedSignatory: "Nasir Khan",
  },
  {
    stateCode: "08",
    stateName: "Rajasthan",
    gstin: "08AABCB1421R1Z6",
    legalName: "BharatYatra Travel & Mobility Technologies Private Limited",
    tradeName: "BharatYatra Heritage Tourism Hub",
    registrationDate: "2024-07-01",
    taxpayerType: "Regular",
    status: "ACTIVE",
    nodalJurisdiction: "Circle B, Jaipur South",
    authorizedSignatory: "Nasir Khan",
  },
  {
    stateCode: "30",
    stateName: "Goa",
    gstin: "30AABCB1421R1Z9",
    legalName: "BharatYatra Travel & Mobility Technologies Private Limited",
    tradeName: "BharatYatra Coastal Gateway",
    registrationDate: "2024-08-01",
    taxpayerType: "Regular",
    status: "ACTIVE",
    nodalJurisdiction: "Panaji Commercial Tax Office",
    authorizedSignatory: "Nasir Khan",
  },
];

// 2. Historical & Current Filing Periods
export const GST_FILING_PERIODS: GstFilingPeriod[] = [
  {
    periodId: "2026-08",
    periodLabel: "August 2026",
    financialYear: "2026-27",
    quarter: "Q2",
    gstr1: {
      status: "READY_TO_FILE",
      dueDate: "2026-09-11",
      totalInvoices: 3842,
      taxableValueINR: 84729000,
      cgstINR: 3418200,
      sgstINR: 3418200,
      igstINR: 2894500,
      totalTaxINR: 9730900,
    },
    gstr3b: {
      status: "PENDING_OFFSET",
      dueDate: "2026-09-20",
      outputTaxLiabilityINR: 9730900,
      itcEligibleINR: 6841200,
      itcUtilizedINR: 6841200,
      netCashTaxPaidINR: 2889700,
      interestINR: 0,
      lateFeeINR: 0,
      cpinChallan: "CPIN-260908129481",
    },
    gstr8Tcs: {
      status: "READY_TO_FILE",
      dueDate: "2026-09-10",
      totalSuppliers: 428,
      grossSuppliesINR: 52400000,
      returnsValueINR: 2150000,
      netTaxableSuppliesINR: 50250000,
      tcsCollectedINR: 502500, // 1%
    },
    gstr2b: {
      autoDraftedDate: "2026-09-14",
      totalInwardInvoices: 512,
      availableItcINR: 6841200,
      ineligibleItcINR: 142000,
      reconciliationMatchRate: 98.7,
    },
  },
  {
    periodId: "2026-07",
    periodLabel: "July 2026",
    financialYear: "2026-27",
    quarter: "Q2",
    gstr1: {
      status: "FILED",
      dueDate: "2026-08-11",
      filingDate: "2026-08-10 17:42",
      arn: "AA0708260019481",
      totalInvoices: 3614,
      taxableValueINR: 79140000,
      cgstINR: 3180000,
      sgstINR: 3180000,
      igstINR: 2690000,
      totalTaxINR: 9050000,
    },
    gstr3b: {
      status: "FILED",
      dueDate: "2026-08-20",
      filingDate: "2026-08-19 14:15",
      arn: "AB0708260038194",
      outputTaxLiabilityINR: 9050000,
      itcEligibleINR: 6380000,
      itcUtilizedINR: 6380000,
      netCashTaxPaidINR: 2670000,
      interestINR: 0,
      lateFeeINR: 0,
      cpinChallan: "CPIN-260818391048",
    },
    gstr8Tcs: {
      status: "FILED",
      dueDate: "2026-08-10",
      filingDate: "2026-08-09 11:20",
      arn: "AC0708260027193",
      totalSuppliers: 412,
      grossSuppliesINR: 48900000,
      returnsValueINR: 1980000,
      netTaxableSuppliesINR: 46920000,
      tcsCollectedINR: 469200,
    },
    gstr2b: {
      autoDraftedDate: "2026-08-14",
      totalInwardInvoices: 488,
      availableItcINR: 6380000,
      ineligibleItcINR: 128000,
      reconciliationMatchRate: 99.1,
    },
  },
  {
    periodId: "2026-06",
    periodLabel: "June 2026",
    financialYear: "2026-27",
    quarter: "Q1",
    gstr1: {
      status: "FILED",
      dueDate: "2026-07-11",
      filingDate: "2026-07-09 16:30",
      arn: "AA0707260081294",
      totalInvoices: 3420,
      taxableValueINR: 74200000,
      cgstINR: 2980000,
      sgstINR: 2980000,
      igstINR: 2540000,
      totalTaxINR: 8500000,
    },
    gstr3b: {
      status: "FILED",
      dueDate: "2026-07-20",
      filingDate: "2026-07-18 19:12",
      arn: "AB0707260094182",
      outputTaxLiabilityINR: 8500000,
      itcEligibleINR: 6010000,
      itcUtilizedINR: 6010000,
      netCashTaxPaidINR: 2490000,
      interestINR: 0,
      lateFeeINR: 0,
      cpinChallan: "CPIN-260717281940",
    },
    gstr8Tcs: {
      status: "FILED",
      dueDate: "2026-07-10",
      filingDate: "2026-07-08 14:05",
      arn: "AC0707260071948",
      totalSuppliers: 395,
      grossSuppliesINR: 45600000,
      returnsValueINR: 1820000,
      netTaxableSuppliesINR: 43780000,
      tcsCollectedINR: 437800,
    },
    gstr2b: {
      autoDraftedDate: "2026-07-14",
      totalInwardInvoices: 465,
      availableItcINR: 6010000,
      ineligibleItcINR: 115000,
      reconciliationMatchRate: 98.9,
    },
  },
];

// 3. Outward Supply B2B / B2C Invoices (GSTR-1 Sample Data)
export const GSTR1_OUTWARD_SUPPLIES: Gstr1OutwardSupplyRecord[] = [
  {
    invoiceId: "INV-2026-8801",
    invoiceNumber: "BY/2026-27/08801",
    invoiceDate: "2026-08-28",
    customerName: "Tata Consultancy Services Ltd",
    customerGstin: "27AAACT2727Q1ZW",
    recipientType: "B2B",
    posStateCode: "27",
    posStateName: "Maharashtra",
    travelCategory: "Corporate",
    sacCode: "998555",
    sacDescription: "Tour operator & corporate corporate travel desk management service",
    taxableValueINR: 850000,
    gstRatePercent: 18,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 153000,
    totalInvoiceINR: 1003000,
    eInvoiceStatus: "IRN_GENERATED",
    irnNumber: "4820a1f49b109e4f2081ab2094c9284192084c01928409182948192049182049",
    eWayBillNo: "182940192840",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8802",
    invoiceNumber: "BY/2026-27/08802",
    invoiceDate: "2026-08-27",
    customerName: "Infosys Technologies Ltd",
    customerGstin: "29AAACI4321F1ZX",
    recipientType: "B2B",
    posStateCode: "29",
    posStateName: "Karnataka",
    travelCategory: "Flights",
    sacCode: "996411",
    sacDescription: "Passenger transport services by air (Scheduled Economy)",
    taxableValueINR: 420000,
    gstRatePercent: 5,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 21000,
    totalInvoiceINR: 441000,
    eInvoiceStatus: "IRN_GENERATED",
    irnNumber: "9182bc4019284c019284091829481920491820494820a1f49b109e4f2081ab20",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8803",
    invoiceNumber: "BY/2026-27/08803",
    invoiceDate: "2026-08-27",
    customerName: "Radisson Blu Resort Goa",
    customerGstin: "30AABCR9912K1Z4",
    recipientType: "B2B",
    posStateCode: "30",
    posStateName: "Goa",
    travelCategory: "Hotels",
    sacCode: "996312",
    sacDescription: "Accommodation services in premium luxury hotel / resort",
    taxableValueINR: 310000,
    gstRatePercent: 18,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 55800,
    totalInvoiceINR: 365800,
    eInvoiceStatus: "IRN_GENERATED",
    irnNumber: "109e4f2081ab2094c9284192084c019284091829481920491820494820a1f49b",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8804",
    invoiceNumber: "BY/2026-27/08804",
    invoiceDate: "2026-08-26",
    customerName: "MakeMyTrip Partner Desk Delhi",
    customerGstin: "07AAACM9102L1ZQ",
    recipientType: "B2B",
    posStateCode: "07",
    posStateName: "Delhi",
    travelCategory: "Yatras",
    sacCode: "998555",
    sacDescription: "Helicopter pilgrimage yatra charter arrangement",
    taxableValueINR: 640000,
    gstRatePercent: 18,
    cgstINR: 57600,
    sgstINR: 57600,
    igstINR: 0,
    totalInvoiceINR: 755200,
    eInvoiceStatus: "IRN_GENERATED",
    irnNumber: "019284091829481920491820494820a1f49b109e4f2081ab2094c9284192084c",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8805",
    invoiceNumber: "BY/2026-27/08805",
    invoiceDate: "2026-08-25",
    customerName: "Vikramaditya Sharma",
    recipientType: "B2C_SMALL",
    posStateCode: "07",
    posStateName: "Delhi",
    travelCategory: "IRCTC Trains",
    sacCode: "996421",
    sacDescription: "Passenger railway transport reservation facilitator",
    taxableValueINR: 12400,
    gstRatePercent: 5,
    cgstINR: 310,
    sgstINR: 310,
    igstINR: 0,
    totalInvoiceINR: 13020,
    eInvoiceStatus: "NOT_APPLICABLE",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8806",
    invoiceNumber: "BY/2026-27/08806",
    invoiceDate: "2026-08-25",
    customerName: "Pooja Hegde & Family",
    recipientType: "B2C_SMALL",
    posStateCode: "29",
    posStateName: "Karnataka",
    travelCategory: "Buses",
    sacCode: "996422",
    sacDescription: "Scheduled intercity AC sleeper bus transport",
    taxableValueINR: 8800,
    gstRatePercent: 5,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 440,
    totalInvoiceINR: 9240,
    eInvoiceStatus: "NOT_APPLICABLE",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8807",
    invoiceNumber: "BY/2026-27/08807",
    invoiceDate: "2026-08-24",
    customerName: "Wipro Enterprises Corporate Fleet",
    customerGstin: "29AAACW1234D1Z8",
    recipientType: "B2B",
    posStateCode: "29",
    posStateName: "Karnataka",
    travelCategory: "Cabs",
    sacCode: "996413",
    sacDescription: "Chauffeur-driven electric intercity cab transport",
    taxableValueINR: 175000,
    gstRatePercent: 12,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 21000,
    totalInvoiceINR: 196000,
    eInvoiceStatus: "IRN_GENERATED",
    irnNumber: "481920491820494820a1f49b109e4f2081ab2094c9284192084c019284091829",
    filingStatus: "VALIDATED",
  },
  {
    invoiceId: "INV-2026-8808",
    invoiceNumber: "BY/2026-27/08808",
    invoiceDate: "2026-08-24",
    customerName: "Ananya Deshmukh",
    recipientType: "B2C_LARGE",
    posStateCode: "27",
    posStateName: "Maharashtra",
    travelCategory: "Flights",
    sacCode: "996412",
    sacDescription: "Premium Business Class charter flight Mumbai-Dubai",
    taxableValueINR: 285000,
    gstRatePercent: 12,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 34200,
    totalInvoiceINR: 319200,
    eInvoiceStatus: "NOT_APPLICABLE",
    filingStatus: "VALIDATED",
  },
];

// 4. E-Commerce TCS under Section 52 (GSTR-8 Data)
export const GSTR8_TCS_SUPPLIERS: Gstr8TcsSupplierRecord[] = [
  {
    supplierId: "SUP-PMS-101",
    partnerName: "Kedarnath Alpine Haven Lodge",
    partnerGstin: "05AAACK9981K1Z2",
    partnerType: "Lodge & PMS",
    stateCode: "05",
    grossSuppliesINR: 2450000,
    returnsINR: 95000,
    netTaxableSuppliesINR: 2355000,
    cgstTcsINR: 0,
    sgstTcsINR: 0,
    igstTcsINR: 23550, // 1%
    totalTcsINR: 23550,
    settlementMonth: "August 2026",
    status: "VERIFIED",
  },
  {
    supplierId: "SUP-BUS-204",
    partnerName: "Zingbus Intercity Express Fleet",
    partnerGstin: "07AABCG8192E1Z4",
    partnerType: "Bus Fleet Operator",
    stateCode: "07",
    grossSuppliesINR: 6800000,
    returnsINR: 280000,
    netTaxableSuppliesINR: 6520000,
    cgstTcsINR: 32600, // 0.5%
    sgstTcsINR: 32600, // 0.5%
    igstTcsINR: 0,
    totalTcsINR: 65200,
    settlementMonth: "August 2026",
    status: "VERIFIED",
  },
  {
    supplierId: "SUP-CAB-309",
    partnerName: "Mega Cabs Premier Fleet Delhi",
    partnerGstin: "07AAACM4491J1ZP",
    partnerType: "Cab Fleet Partner",
    stateCode: "07",
    grossSuppliesINR: 3400000,
    returnsINR: 140000,
    netTaxableSuppliesINR: 3260000,
    cgstTcsINR: 16300,
    sgstTcsINR: 16300,
    igstTcsINR: 0,
    totalTcsINR: 32600,
    settlementMonth: "August 2026",
    status: "VERIFIED",
  },
  {
    supplierId: "SUP-HTL-412",
    partnerName: "Fortview Palace Heritage Resort Jaipur",
    partnerGstin: "08AABCF1298P1Z8",
    partnerType: "Lodge & PMS",
    stateCode: "08",
    grossSuppliesINR: 4100000,
    returnsINR: 180000,
    netTaxableSuppliesINR: 3920000,
    cgstTcsINR: 0,
    sgstTcsINR: 0,
    igstTcsINR: 39200,
    totalTcsINR: 39200,
    settlementMonth: "August 2026",
    status: "VERIFIED",
  },
  {
    supplierId: "SUP-DHB-515",
    partnerName: "Gulshan Dhaba Highway Express Murthal",
    partnerGstin: "06AABCG9981K1Z9",
    partnerType: "Dhaba & Dining",
    stateCode: "06",
    grossSuppliesINR: 1250000,
    returnsINR: 20000,
    netTaxableSuppliesINR: 1230000,
    cgstTcsINR: 0,
    sgstTcsINR: 0,
    igstTcsINR: 12300,
    totalTcsINR: 12300,
    settlementMonth: "August 2026",
    status: "VERIFIED",
  },
];

// 5. GSTR-2B Input Tax Credit (ITC) Reconciliation Register
export const GSTR2B_ITC_RECORDS: Gstr2bItcReconciliationRecord[] = [
  {
    recordId: "ITC-26-001",
    supplierName: "Amazon Web Services India Pvt Ltd",
    supplierGstin: "07AABCA1294R1Z1",
    invoiceNumber: "AWS-IN-2026-9921",
    invoiceDate: "2026-08-05",
    taxableValueINR: 2400000,
    cgstINR: 216000,
    sgstINR: 216000,
    igstINR: 0,
    totalTaxINR: 432000,
    itcEligibility: "INPUT_SERVICES",
    reconciliationStatus: "MATCHED_100",
  },
  {
    recordId: "ITC-26-002",
    supplierName: "Google Cloud India Private Limited",
    supplierGstin: "07AABCG5512J1Z3",
    invoiceNumber: "GCP-INV-881920",
    invoiceDate: "2026-08-08",
    taxableValueINR: 1950000,
    cgstINR: 175500,
    sgstINR: 175500,
    igstINR: 0,
    totalTaxINR: 351000,
    itcEligibility: "INPUT_SERVICES",
    reconciliationStatus: "MATCHED_100",
  },
  {
    recordId: "ITC-26-003",
    supplierName: "Air India Regional Operations",
    supplierGstin: "07AAACA1991F1Z8",
    invoiceNumber: "AI-CORP-481920",
    invoiceDate: "2026-08-12",
    taxableValueINR: 1280000,
    cgstINR: 32000,
    sgstINR: 32000,
    igstINR: 0,
    totalTaxINR: 64000,
    itcEligibility: "INPUT_SERVICES",
    reconciliationStatus: "MATCHED_100",
  },
  {
    recordId: "ITC-26-004",
    supplierName: "Razorpay Software Private Limited",
    supplierGstin: "29AADCR4410K1ZX",
    invoiceNumber: "RZP-MDR-0826-10",
    invoiceDate: "2026-08-15",
    taxableValueINR: 890000,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 160200,
    totalTaxINR: 160200,
    itcEligibility: "INPUT_SERVICES",
    reconciliationStatus: "MATCHED_100",
  },
  {
    recordId: "ITC-26-005",
    supplierName: "Hotel Oberoi New Delhi (Corporate Executive Meet)",
    supplierGstin: "07AAACE0194Q1Z8",
    invoiceNumber: "OBR-DEL-26-781",
    invoiceDate: "2026-08-18",
    taxableValueINR: 450000,
    cgstINR: 40500,
    sgstINR: 40500,
    igstINR: 0,
    totalTaxINR: 81000,
    itcEligibility: "INELIGIBLE_SEC_17_5", // Food & outdoor catering blocked under 17(5)(b)
    reconciliationStatus: "MATCHED_100",
    varianceNotes: "Food & hospitality catering blocked under CGST Act Section 17(5)(b)(i)",
  },
  {
    recordId: "ITC-26-006",
    supplierName: "Twilio Telephony & WhatsApp Messaging Services",
    supplierGstin: "27AAACT9912K1Z5",
    invoiceNumber: "TWL-IN-0826",
    invoiceDate: "2026-08-20",
    taxableValueINR: 380000,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 68400,
    totalTaxINR: 68400,
    itcEligibility: "INPUT_SERVICES",
    reconciliationStatus: "VALUE_MISMATCH",
    varianceNotes: "Vendor reported ₹380,000 in GSTR-1, BharatYatra books recorded ₹375,000 (₹900 tax difference)",
  },
];

// 6. SAC & HSN Code Classification Matrix
export const SAC_TAX_MATRIX: SacSummaryItem[] = [
  {
    sacCode: "996411",
    description: "Passenger transport services by air (Domestic Economy)",
    category: "Flights",
    taxRatePercent: 5,
    totalInvoices: 1420,
    taxableValueINR: 32400000,
    cgstINR: 810000,
    sgstINR: 810000,
    igstINR: 0,
    totalTaxINR: 1620000,
  },
  {
    sacCode: "996412",
    description: "Passenger transport services by air (Domestic Business / Premium)",
    category: "Flights",
    taxRatePercent: 12,
    totalInvoices: 380,
    taxableValueINR: 14800000,
    cgstINR: 0,
    sgstINR: 0,
    igstINR: 1776000,
    totalTaxINR: 1776000,
  },
  {
    sacCode: "996311",
    description: "Hotel, Guest House, & Lodge accommodation < ₹7,500/night",
    category: "Hotels & Lodges",
    taxRatePercent: 12,
    totalInvoices: 820,
    taxableValueINR: 16200000,
    cgstINR: 486000,
    sgstINR: 486000,
    igstINR: 972000,
    totalTaxINR: 1944000,
  },
  {
    sacCode: "996312",
    description: "Luxury Hotel & Resort accommodation >= ₹7,500/night",
    category: "Hotels & Lodges",
    taxRatePercent: 18,
    totalInvoices: 260,
    taxableValueINR: 9800000,
    cgstINR: 294000,
    sgstINR: 294000,
    igstINR: 1176000,
    totalTaxINR: 1764000,
  },
  {
    sacCode: "996422",
    description: "Scheduled intercity AC passenger bus transport",
    category: "Buses",
    taxRatePercent: 5,
    totalInvoices: 590,
    taxableValueINR: 4900000,
    cgstINR: 122500,
    sgstINR: 122500,
    igstINR: 0,
    totalTaxINR: 245000,
  },
  {
    sacCode: "996413",
    description: "Non-scheduled passenger cab rental with chauffeur",
    category: "Cabs",
    taxRatePercent: 12,
    totalInvoices: 220,
    taxableValueINR: 3200000,
    cgstINR: 96000,
    sgstINR: 96000,
    igstINR: 192000,
    totalTaxINR: 384000,
  },
  {
    sacCode: "998555",
    description: "Tour operator, travel agency commission & tech convenience fee",
    category: "Corporate & Platform",
    taxRatePercent: 18,
    totalInvoices: 152,
    taxableValueINR: 3429000,
    cgstINR: 154305,
    sgstINR: 154305,
    igstINR: 308610,
    totalTaxINR: 617220,
  },
];

// 7. Electronic Cash Ledger PMT-06 Challans
export const PMT06_CHALLANS: Pmt06Challan[] = [
  {
    challanId: "CHL-26-0801",
    cpin: "260908129481",
    generationDate: "2026-09-08",
    expiryDate: "2026-09-23",
    periodLabel: "August 2026",
    igstTax: 1250000,
    cgstTax: 819850,
    sgstTax: 819850,
    totalChallanAmountINR: 2889700,
    paymentMode: "NEFT_RTGS",
    status: "AWAITING_PAYMENT",
    paymentBank: "State Bank of India (CPIN Virtual Account)",
  },
  {
    challanId: "CHL-26-0701",
    cpin: "260818391048",
    generationDate: "2026-08-18",
    expiryDate: "2026-09-02",
    periodLabel: "July 2026",
    igstTax: 1150000,
    cgstTax: 760000,
    sgstTax: 760000,
    totalChallanAmountINR: 2670000,
    paymentMode: "NET_BANKING",
    status: "PAID",
    cinNumber: "SBIN26081839104801",
    paymentBank: "HDFC Bank Corporate NetBanking",
    paymentDate: "2026-08-19 13:45",
  },
  {
    challanId: "CHL-26-0601",
    cpin: "260717281940",
    generationDate: "2026-07-17",
    expiryDate: "2026-08-01",
    periodLabel: "June 2026",
    igstTax: 1090000,
    cgstTax: 700000,
    sgstTax: 700000,
    totalChallanAmountINR: 2490000,
    paymentMode: "NET_BANKING",
    status: "PAID",
    cinNumber: "HDFC26071728194002",
    paymentBank: "HDFC Bank Corporate NetBanking",
    paymentDate: "2026-07-18 17:30",
  },
];
