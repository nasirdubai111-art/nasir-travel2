import { BookingItem, UserProfile } from "../types";
import { computeBookingTaxBreakdown } from "./invoicePdfGenerator";

export interface ExpenseExportOptions {
  filterName?: string;
  companyName?: string;
  corporateGstin?: string;
  costCenter?: string;
  employeeId?: string;
}

export interface ExpenseReconciliationSummary {
  totalTrips: number;
  totalBaseTaxable: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalGstInputCredit: number;
  totalGrossSpend: number;
  currency: string;
}

/**
 * Escapes a cell value according to RFC 4180 CSV standard
 */
function escapeCsvValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If string contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Maps service category into standard Corporate General Ledger / Accounting Categories
 */
export function getCorporateExpenseCategory(serviceType?: string): string {
  switch (serviceType) {
    case "flights":
      return "Travel - Domestic Airfare (SAC 996411)";
    case "trains":
      return "Travel - Rail & Transit (SAC 996411)";
    case "buses":
      return "Travel - Intercity Road Transit (SAC 996411)";
    case "hotels":
    case "resorts":
    case "houseboats":
    case "lodges":
      return "Lodging & Accommodations (SAC 996311)";
    case "cabs":
      return "Local Ground Transportation (SAC 996412)";
    case "dining":
      return "Business Meals & Entertainment (SAC 996331)";
    case "tours":
    case "pilgrimage":
      return "Corporate Offsite & Group Travel (SAC 998555)";
    default:
      return "General Business Travel Expense";
  }
}

/**
 * Computes financial summary totals for reconciliation preview
 */
export function computeExpenseSummary(bookings: BookingItem[]): ExpenseReconciliationSummary {
  let totalBaseTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let totalGrossSpend = 0;

  bookings.forEach((b) => {
    const tax = computeBookingTaxBreakdown(b);
    totalBaseTaxable += tax.baseAmount;
    totalCgst += tax.cgst;
    totalSgst += tax.sgst;
    totalIgst += tax.igst;
    totalGrossSpend += tax.totalAmount;
  });

  return {
    totalTrips: bookings.length,
    totalBaseTaxable,
    totalCgst,
    totalSgst,
    totalIgst,
    totalGstInputCredit: totalCgst + totalSgst + totalIgst,
    totalGrossSpend,
    currency: "INR",
  };
}

/**
 * Generates formatted CSV string for corporate expense reports
 */
export function generateCorporateExpenseCSV(
  bookings: BookingItem[],
  userProfile: UserProfile,
  options: ExpenseExportOptions = {}
): string {
  const companyName = options.companyName || userProfile.companyName || userProfile.b2bCorporateDetails?.companyName || "Corporate Client";
  const corporateGstin = options.corporateGstin || userProfile.gstNumber || userProfile.b2bCorporateDetails?.gstNumber || "27AABCB2212P1Z0";
  const costCenter = options.costCenter || "CC-INDIA-TRAVEL";
  const employeeId = options.employeeId || "EMP-" + ((userProfile.name || "BYT").slice(0, 3).toUpperCase()) + "-889";

  const headers = [
    "Expense ID",
    "Booking PNR",
    "Tax Invoice No",
    "Travel / Service Date",
    "Booking Status",
    "Service Category",
    "GL Account / Expense Class",
    "Title / Description",
    "Sector / Route / Property",
    "Seat / Room / Unit Details",
    "Passenger / Traveler Name",
    "Employee ID",
    "Pax Count",
    "Currency",
    "Taxable Base Amount (INR)",
    "CGST Amount (INR)",
    "SGST Amount (INR)",
    "IGST Amount (INR)",
    "Total GST Tax (INR)",
    "GST Rate (%)",
    "SAC / HSN Code",
    "Vendor GSTIN",
    "Corporate GSTIN (Input Credit)",
    "Company / Entity",
    "Cost Center",
    "Payment Mode",
    "Reconciliation Status",
  ];

  const rows: string[][] = [];

  let sumTaxable = 0;
  let sumCgst = 0;
  let sumSgst = 0;
  let sumIgst = 0;
  let sumTotalGst = 0;
  let sumGross = 0;

  bookings.forEach((booking, idx) => {
    const tax = computeBookingTaxBreakdown(booking);
    const pnr = booking.pnr || `BY-${booking.id.slice(-6).toUpperCase()}`;
    const invoiceNo = booking.invoiceNumber || `INV-2026-${booking.id.slice(-4).toUpperCase()}`;
    const expenseId = `EXP-${idx + 1001}`;
    const glCategory = getCorporateExpenseCategory(booking.serviceType);
    const vendorGstin = "07AABCB1421R1Z8"; // BharatYatra Official Travel GSTIN
    const paxName = userProfile.name || "Corporate Traveler";
    const paymentMode = booking.paymentDetails?.method || "Corporate Card / B2B Settlement";
    const reconStatus = booking.status === "completed" ? "Ready for Expense Settlement" : booking.status === "cancelled" ? "Refunded / Reversal" : "Pre-travel Advance / Active";

    sumTaxable += tax.baseAmount;
    sumCgst += tax.cgst;
    sumSgst += tax.sgst;
    sumIgst += tax.igst;
    sumTotalGst += (tax.cgst + tax.sgst + tax.igst);
    sumGross += tax.totalAmount;

    rows.push([
      expenseId,
      pnr,
      invoiceNo,
      booking.date || "2026-08-28",
      booking.status.toUpperCase(),
      booking.serviceType ? booking.serviceType.toUpperCase() : "TRAVEL",
      glCategory,
      booking.title || "Travel Service",
      booking.subtitle || booking.route || "Domestic India",
      booking.seatInfo || "Confirmed",
      paxName,
      employeeId,
      String(booking.passengers || 1),
      "INR",
      tax.baseAmount.toFixed(2),
      tax.cgst.toFixed(2),
      tax.sgst.toFixed(2),
      tax.igst.toFixed(2),
      (tax.cgst + tax.sgst + tax.igst).toFixed(2),
      `${tax.gstRatePercent}%`,
      tax.sacCode,
      vendorGstin,
      corporateGstin,
      companyName,
      costCenter,
      paymentMode,
      reconStatus,
    ]);
  });

  // Summary row at the bottom for instant Excel total reconciliation
  const summaryRow = [
    "TOTALS",
    `${bookings.length} Bookings`,
    "-",
    "-",
    "-",
    "-",
    "-",
    "Consolidated Expense Reconciliation",
    "-",
    "-",
    "-",
    "-",
    "-",
    "INR",
    sumTaxable.toFixed(2),
    sumCgst.toFixed(2),
    sumSgst.toFixed(2),
    sumIgst.toFixed(2),
    sumTotalGst.toFixed(2),
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "Gross Spend: INR " + sumGross.toFixed(2),
    "VERIFIED",
  ];

  const headerLine = headers.map(escapeCsvValue).join(",");
  const dataLines = rows.map((r) => r.map(escapeCsvValue).join(","));
  const summaryLine = summaryRow.map(escapeCsvValue).join(",");

  return [headerLine, ...dataLines, summaryLine].join("\r\n");
}

/**
 * Triggers the browser download of the corporate expense CSV file with UTF-8 BOM
 */
export function downloadCorporateExpenseCSV(
  bookings: BookingItem[],
  userProfile: UserProfile,
  options: ExpenseExportOptions = {}
): { filename: string; count: number; totalAmount: number } {
  const csvContent = generateCorporateExpenseCSV(bookings, userProfile, options);
  
  // Prepend UTF-8 BOM (\uFEFF) so Excel and spreadsheet tools open Indian Rupee characters and Unicode properly
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const filterSuffix = options.filterName ? `_${options.filterName.replace(/\s+/g, "_")}` : "";
  const filename = `BharatYatra_Corporate_Expense_Reconciliation_${dateStr}${filterSuffix}.csv`;

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  const totalAmount = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  return {
    filename,
    count: bookings.length,
    totalAmount,
  };
}
