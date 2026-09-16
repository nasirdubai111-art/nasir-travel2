// Historical GSTR Filing Records, Filing Deadlines & Reconciliation Variance Dataset

export interface GstrSubmissionRecord {
  id: string;
  arn: string; // Statutory Acknowledgment Reference Number
  returnType: "GSTR-1" | "GSTR-2" | "GSTR-3B" | "GSTR-8 TCS";
  periodId: string; // e.g. "2026-07"
  periodLabel: string; // e.g. "July 2026"
  submissionDate: string; // e.g. "2026-08-10 16:42 IST"
  statutoryDueDate: string; // e.g. "2026-08-11"
  status: "FILED_VERIFIED" | "PROCESSED_NO_ERROR" | "EVC_AUTHENTICATED" | "PENDING_PORTAL_ACK";
  grossTurnoverINR: number;
  taxableValueINR: number;
  totalTaxINR: number;
  cgstINR: number;
  sgstINR: number;
  igstINR: number;
  itcClaimedINR?: number;
  tcsDeductedINR?: number;
  invoicesCount: number;
  digitalSignatureRef: string; // SHA256 of DSC / EVC token
  authorizedSignatory: string;
  gstin: string;
  stateName: string;
  filingMode: "GSTN_API_V2" | "OFFLINE_JSON" | "EVC_OTP";
  ackSlipUrl?: string;
  notes: string;
}

export interface GstrDeadlineItem {
  id: string;
  returnType: "GSTR-1" | "GSTR-2B" | "GSTR-3B" | "GSTR-8" | "GSTR-9";
  returnName: string;
  applicablePeriod: string;
  dueDate: string; // YYYY-MM-DD
  statutorySection: string;
  status: "FILED" | "UPCOMING" | "URGENT" | "OVERDUE";
  isReconciled: boolean;
  reconciliationScore: number; // 0 - 100
  expectedTaxINR: number;
  ledgerTaxINR: number;
  varianceINR: number;
  description: string;
}

export interface MonthlyReconciliationVariance {
  month: string;
  periodId: string;
  taxCollectedExpectedINR: number; // calculated from booking transactions * SAC rate
  taxRecordedLedgerINR: number;   // recorded in internal ledger entries
  taxFiledPortalINR: number;       // declared on GSTR-1 / GSTR-3B return
  varianceINR: number;             // taxCollected - taxFiled
  varianceRatePercent: number;
  reconciliationStatus: "FULLY_RECONCILED" | "VARIANCE_DETECTED" | "PENDING_AUDIT";
  ledgerEntriesCount: number;
  discrepancyCount: number;
  auditNotes: string;
}

export const GSTR_DEADLINES: GstrDeadlineItem[] = [
  {
    id: "dl-gstr1-aug",
    returnType: "GSTR-1",
    returnName: "Outward Supplies Return (Monthly)",
    applicablePeriod: "August 2026",
    dueDate: "2026-09-11",
    statutorySection: "Section 37, CGST Act / Rule 59",
    status: "URGENT",
    isReconciled: false,
    reconciliationScore: 94.2,
    expectedTaxINR: 5892400,
    ledgerTaxINR: 5887200,
    varianceINR: 5200, // discrepancy between expected booking tax and ledger entries
    description: "Upload B2B invoices (Table 4), B2CL, B2CS retail supplies, and SAC summary.",
  },
  {
    id: "dl-gstr8-aug",
    returnType: "GSTR-8",
    returnName: "E-Commerce Operator TCS Statement (Sec 52)",
    applicablePeriod: "August 2026",
    dueDate: "2026-09-10",
    statutorySection: "Section 52(4), CGST Act",
    status: "URGENT",
    isReconciled: true,
    reconciliationScore: 100.0,
    expectedTaxINR: 194500,
    ledgerTaxINR: 194500,
    varianceINR: 0,
    description: "1.0% TCS deduction reporting for 142 marketplace hospitality and fleet partners.",
  },
  {
    id: "dl-gstr2b-aug",
    returnType: "GSTR-2B",
    returnName: "Auto-Drafted ITC Statement Finalization",
    applicablePeriod: "August 2026",
    dueDate: "2026-09-14",
    statutorySection: "Rule 60(7), CGST Rules",
    status: "UPCOMING",
    isReconciled: false,
    reconciliationScore: 98.7,
    expectedTaxINR: 2975000,
    ledgerTaxINR: 2981500,
    varianceINR: -6500,
    description: "Locking vendor ITC eligibility from Air India, Indigo, Taj Hotels, and AWS India.",
  },
  {
    id: "dl-gstr3b-aug",
    returnType: "GSTR-3B",
    returnName: "Monthly Summary Return & Tax Payment",
    applicablePeriod: "August 2026",
    dueDate: "2026-09-20",
    statutorySection: "Section 39, CGST Act / Rule 61",
    status: "UPCOMING",
    isReconciled: false,
    reconciliationScore: 92.5,
    expectedTaxINR: 2889000,
    ledgerTaxINR: 2889000,
    varianceINR: 0,
    description: "Cash liability settlement via PMT-06 electronic cash ledger offset.",
  },
  {
    id: "dl-gstr9-fy25",
    returnType: "GSTR-9",
    returnName: "Annual Statutory Reconciliation Return",
    applicablePeriod: "FY 2025-26",
    dueDate: "2026-12-31",
    statutorySection: "Section 44, CGST Act",
    status: "UPCOMING",
    isReconciled: true,
    reconciliationScore: 100.0,
    expectedTaxINR: 64200000,
    ledgerTaxINR: 64200000,
    varianceINR: 0,
    description: "Audited annual accounts reconciliation statement with Table 9 tax paid vs payable.",
  },
];

export const MONTHLY_RECONCILIATION_VARIANCES: MonthlyReconciliationVariance[] = [
  {
    month: "Mar 2026",
    periodId: "2026-03",
    taxCollectedExpectedINR: 4820000,
    taxRecordedLedgerINR: 4820000,
    taxFiledPortalINR: 4820000,
    varianceINR: 0,
    varianceRatePercent: 0.0,
    reconciliationStatus: "FULLY_RECONCILED",
    ledgerEntriesCount: 2410,
    discrepancyCount: 0,
    auditNotes: "100% matched with GSTN portal ARN AA0703260018491. Zero discrepancy.",
  },
  {
    month: "Apr 2026",
    periodId: "2026-04",
    taxCollectedExpectedINR: 5120000,
    taxRecordedLedgerINR: 5120000,
    taxFiledPortalINR: 5120000,
    varianceINR: 0,
    varianceRatePercent: 0.0,
    reconciliationStatus: "FULLY_RECONCILED",
    ledgerEntriesCount: 2560,
    discrepancyCount: 0,
    auditNotes: "Filed via EVC OTP. All B2B & B2C vouchers fully reconciled.",
  },
  {
    month: "May 2026",
    periodId: "2026-05",
    taxCollectedExpectedINR: 5460000,
    taxRecordedLedgerINR: 5456500,
    taxFiledPortalINR: 5456500,
    varianceINR: 3500,
    varianceRatePercent: 0.06,
    reconciliationStatus: "VARIANCE_DETECTED",
    ledgerEntriesCount: 2712,
    discrepancyCount: 2,
    auditNotes: "Minor rounding delta in 2 Tatkal train surcharge vouchers resolved in June.",
  },
  {
    month: "Jun 2026",
    periodId: "2026-06",
    taxCollectedExpectedINR: 5680000,
    taxRecordedLedgerINR: 5680000,
    taxFiledPortalINR: 5680000,
    varianceINR: 0,
    varianceRatePercent: 0.0,
    reconciliationStatus: "FULLY_RECONCILED",
    ledgerEntriesCount: 2840,
    discrepancyCount: 0,
    auditNotes: "Mid-year quarterly compliance audit completed. DSC digitally signed.",
  },
  {
    month: "Jul 2026",
    periodId: "2026-07",
    taxCollectedExpectedINR: 5740000,
    taxRecordedLedgerINR: 5740000,
    taxFiledPortalINR: 5740000,
    varianceINR: 0,
    varianceRatePercent: 0.0,
    reconciliationStatus: "FULLY_RECONCILED",
    ledgerEntriesCount: 2905,
    discrepancyCount: 0,
    auditNotes: "Filed on 2026-08-10 with ARN AA0707260029184. Perfect match.",
  },
  {
    month: "Aug 2026 (Current)",
    periodId: "2026-08",
    taxCollectedExpectedINR: 5892400,
    taxRecordedLedgerINR: 5887200,
    taxFiledPortalINR: 5887200, // Pending current filing reconciliation
    varianceINR: 5200, // Discrepancy detected!
    varianceRatePercent: 0.09,
    reconciliationStatus: "VARIANCE_DETECTED",
    ledgerEntriesCount: 3042,
    discrepancyCount: 3,
    auditNotes: "Expected tax from 3 corporate split-payments has a ₹5,200 timing difference with outward ledger.",
  },
];

export const HISTORICAL_GSTR_SUBMISSIONS: GstrSubmissionRecord[] = [
  {
    id: "sub-gstr1-2026-07",
    arn: "AA0707260029184",
    returnType: "GSTR-1",
    periodId: "2026-07",
    periodLabel: "July 2026",
    submissionDate: "2026-08-10 16:42 IST",
    statutoryDueDate: "2026-08-11",
    status: "FILED_VERIFIED",
    grossTurnoverINR: 67450000,
    taxableValueINR: 58900000,
    totalTaxINR: 5740000,
    cgstINR: 1980000,
    sgstINR: 1980000,
    igstINR: 1780000,
    invoicesCount: 2905,
    digitalSignatureRef: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "GSTN_API_V2",
    notes: "Filed 1 day before due date. All 428 B2B invoices generated valid NIC IRN numbers.",
  },
  {
    id: "sub-gstr2-2026-07",
    arn: "AA0707260031892",
    returnType: "GSTR-2",
    periodId: "2026-07",
    periodLabel: "July 2026",
    submissionDate: "2026-08-13 14:15 IST",
    statutoryDueDate: "2026-08-15",
    status: "PROCESSED_NO_ERROR",
    grossTurnoverINR: 34120000,
    taxableValueINR: 28900000,
    totalTaxINR: 2915000,
    cgstINR: 985000,
    sgstINR: 985000,
    igstINR: 945000,
    itcClaimedINR: 2915000,
    invoicesCount: 684,
    digitalSignatureRef: "SHA256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "OFFLINE_JSON",
    notes: "GSTR-2 Inward register matched with GSTR-2B auto-drafted statement at 99.1% match score.",
  },
  {
    id: "sub-gstr3b-2026-07",
    arn: "AA0707260049210",
    returnType: "GSTR-3B",
    periodId: "2026-07",
    periodLabel: "July 2026",
    submissionDate: "2026-08-19 11:20 IST",
    statutoryDueDate: "2026-08-20",
    status: "FILED_VERIFIED",
    grossTurnoverINR: 67450000,
    taxableValueINR: 58900000,
    totalTaxINR: 5740000,
    cgstINR: 1980000,
    sgstINR: 1980000,
    igstINR: 1780000,
    itcClaimedINR: 2915000,
    invoicesCount: 2905,
    digitalSignatureRef: "SHA256:3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "EVC_OTP",
    notes: "Net cash tax ₹28,25,000 paid via PMT-06 challan CIN 07260819001429 on HDFC Bank.",
  },
  {
    id: "sub-gstr8-2026-07",
    arn: "AA0707260018902",
    returnType: "GSTR-8 TCS",
    periodId: "2026-07",
    periodLabel: "July 2026",
    submissionDate: "2026-08-09 18:30 IST",
    statutoryDueDate: "2026-08-10",
    status: "FILED_VERIFIED",
    grossTurnoverINR: 18900000,
    taxableValueINR: 18900000,
    totalTaxINR: 189000,
    cgstINR: 47250,
    sgstINR: 47250,
    igstINR: 94500,
    tcsDeductedINR: 189000,
    invoicesCount: 138,
    digitalSignatureRef: "SHA256:2c624232cdd221771294dfbb310aca000a0df6ec8b6604b7242137ff304e144f",
    authorizedSignatory: "Sunita Verma (Head of Merchant Settlements)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "GSTN_API_V2",
    notes: "TCS credited to 138 registered hotel and cab operators under Section 52(3).",
  },
  {
    id: "sub-gstr1-2026-06",
    arn: "AA0706260081729",
    returnType: "GSTR-1",
    periodId: "2026-06",
    periodLabel: "June 2026",
    submissionDate: "2026-07-10 15:10 IST",
    statutoryDueDate: "2026-07-11",
    status: "FILED_VERIFIED",
    grossTurnoverINR: 65100000,
    taxableValueINR: 56800000,
    totalTaxINR: 5680000,
    cgstINR: 1960000,
    sgstINR: 1960000,
    igstINR: 1760000,
    invoicesCount: 2840,
    digitalSignatureRef: "SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "GSTN_API_V2",
    notes: "Quarter 1 closing return. Reconciliation completed with 100% precision.",
  },
  {
    id: "sub-gstr2-2026-06",
    arn: "AA0706260089201",
    returnType: "GSTR-2",
    periodId: "2026-06",
    periodLabel: "June 2026",
    submissionDate: "2026-07-14 12:40 IST",
    statutoryDueDate: "2026-07-15",
    status: "PROCESSED_NO_ERROR",
    grossTurnoverINR: 32800000,
    taxableValueINR: 27950000,
    totalTaxINR: 2810000,
    cgstINR: 955000,
    sgstINR: 955000,
    igstINR: 900000,
    itcClaimedINR: 2810000,
    invoicesCount: 650,
    digitalSignatureRef: "SHA256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "OFFLINE_JSON",
    notes: "Vendor inward purchase register accepted with zero debit notes outstanding.",
  },
  {
    id: "sub-gstr1-2026-05",
    arn: "AA0705260074218",
    returnType: "GSTR-1",
    periodId: "2026-05",
    periodLabel: "May 2026",
    submissionDate: "2026-06-10 17:05 IST",
    statutoryDueDate: "2026-06-11",
    status: "FILED_VERIFIED",
    grossTurnoverINR: 62900000,
    taxableValueINR: 54600000,
    totalTaxINR: 5456500,
    cgstINR: 1885000,
    sgstINR: 1885000,
    igstINR: 1686500,
    invoicesCount: 2712,
    digitalSignatureRef: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "GSTN_API_V2",
    notes: "May Summer Travel peak supplies. E-invoicing B2B compliance rate: 100%.",
  },
  {
    id: "sub-gstr2-2026-05",
    arn: "AA0705260078103",
    returnType: "GSTR-2",
    periodId: "2026-05",
    periodLabel: "May 2026",
    submissionDate: "2026-06-14 11:30 IST",
    statutoryDueDate: "2026-06-15",
    status: "PROCESSED_NO_ERROR",
    grossTurnoverINR: 31200000,
    taxableValueINR: 26800000,
    totalTaxINR: 2710000,
    cgstINR: 920000,
    sgstINR: 920000,
    igstINR: 870000,
    itcClaimedINR: 2710000,
    invoicesCount: 622,
    digitalSignatureRef: "SHA256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "OFFLINE_JSON",
    notes: "All major aviation suppliers (Air India, IndiGo) ITC verified.",
  },
  {
    id: "sub-gstr1-2026-04",
    arn: "AA0704260062319",
    returnType: "GSTR-1",
    periodId: "2026-04",
    periodLabel: "April 2026",
    submissionDate: "2026-05-10 14:22 IST",
    statutoryDueDate: "2026-05-11",
    status: "FILED_VERIFIED",
    grossTurnoverINR: 59100000,
    taxableValueINR: 51200000,
    totalTaxINR: 5120000,
    cgstINR: 1770000,
    sgstINR: 1770000,
    igstINR: 1580000,
    invoicesCount: 2560,
    digitalSignatureRef: "SHA256:185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "GSTN_API_V2",
    notes: "Start of FY 2026-27 outward supply return filed on time without any delay penalties.",
  },
  {
    id: "sub-gstr2-2026-04",
    arn: "AA0704260069412",
    returnType: "GSTR-2",
    periodId: "2026-04",
    periodLabel: "April 2026",
    submissionDate: "2026-05-13 16:50 IST",
    statutoryDueDate: "2026-05-15",
    status: "PROCESSED_NO_ERROR",
    grossTurnoverINR: 29800000,
    taxableValueINR: 25500000,
    totalTaxINR: 2580000,
    cgstINR: 875000,
    sgstINR: 875000,
    igstINR: 830000,
    itcClaimedINR: 2580000,
    invoicesCount: 590,
    digitalSignatureRef: "SHA256:3639c7a7dd3f349f7e754546a3666016ad6ef8e082ff644317b13bbc0e8268f4",
    authorizedSignatory: "Rajesh Kumar Sharma (VP Taxation & Regulatory)",
    gstin: "07AABCB1421R1Z8",
    stateName: "Delhi (Headquarters)",
    filingMode: "OFFLINE_JSON",
    notes: "ITC matched 100% with GSTR-2B generated by GSTN on 14th April.",
  },
];
