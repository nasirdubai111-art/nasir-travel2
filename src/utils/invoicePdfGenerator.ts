import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { BookingItem, UserProfile } from "../types";

export interface InvoiceTaxBreakdown {
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  insuranceFee: number;
  platformFee: number;
  discount: number;
  totalAmount: number;
  sacCode: string;
  gstRatePercent: number;
}

export function computeBookingTaxBreakdown(booking: BookingItem): InvoiceTaxBreakdown {
  const total = Number(booking.amount || booking.amountPaid || 0);
  // Standard travel services (SAC 996411 for passenger transport = 5% or 12%, hotels = 12%/18%)
  const isHotelOrResort = booking.serviceType === "hotels" || booking.serviceType === "resorts" || booking.serviceType === "lodges" || booking.serviceType === "houseboats";
  const sacCode = isHotelOrResort ? "996311" : "996411";
  
  // 12% total GST (6% CGST + 6% SGST) standard for pre-booked transport & budget hospitality
  const gstRatePercent = 12;
  const baseAmount = Math.round(total / (1 + gstRatePercent / 100));
  const totalGst = total - baseAmount;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;
  const igst = 0;
  const insuranceFee = 0; // Complimentary IRDAI protection
  const platformFee = 0; // Zero convenience fee promotion
  const discount = 0;

  return {
    baseAmount,
    cgst,
    sgst,
    igst,
    insuranceFee,
    platformFee,
    discount,
    totalAmount: total,
    sacCode,
    gstRatePercent,
  };
}

/**
 * Transforms an invoice representation into a downloadable PDF document using html2canvas & jsPDF.
 * Captures all financial breakdown details (taxable base, CGST, SGST, fees, net amount, settlement).
 */
export async function downloadBookingInvoicePDF(
  booking: BookingItem,
  userProfile: UserProfile,
  sourceElement?: HTMLElement | null
): Promise<string> {
  const pnr = booking.pnr || `BY-${booking.id.slice(-6).toUpperCase()}`;
  const invoiceNumber = booking.invoiceNumber || `INV-2026-${booking.id.slice(-4).toUpperCase()}`;
  const breakdown = computeBookingTaxBreakdown(booking);
  
  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const travelDateFormatted = booking.date || "Immediate Departure";
  const seatInfo = booking.seatInfo || booking.seatOrRoomInfo || "Confirmed Seat(s)";
  const passengerCount = booking.passengers || booking.passengersCount || 1;
  const paymentMode = booking.paymentSummary?.paymentMode || "UPI / BharatYatra Wallet";
  const rrn = booking.paymentSummary?.rbiRrn || `6238${Math.floor(10000000 + Math.random() * 90000000)}`;

  // Form structured Gate Check-In & Verification Payload
  const qrPayload = JSON.stringify({
    app: "BharatYatra SuperApp",
    version: "2.4",
    pnr,
    passenger: userProfile.name || "Valued Yatri",
    phone: userProfile.phone || "+91 98765 43210",
    service: booking.title,
    category: booking.serviceType,
    date: travelDateFormatted,
    departure: booking.time || "06:00 AM",
    seat: seatInfo,
    passengersCount: passengerCount,
    status: "CONFIRMED",
    amount: breakdown.totalAmount,
    gateToken: `GP-${pnr}-${booking.id.slice(-4).toUpperCase()}`,
    authSignature: `BY-VERIFIED-${Math.abs(pnr.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
    verifiedTimestamp: new Date().toISOString(),
  });

  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error generating QR for PDF:", err);
  }

  // Create clean, self-contained container for pixel-perfect PDF rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "780px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#0f172a";
  container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  container.style.padding = "28px";
  container.style.boxSizing = "border-box";
  container.style.zIndex = "-1000";

  container.innerHTML = `
    <div style="border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
      <!-- Header with Branding & Invoice Tag -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 22px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; background: #4338ca; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 14px; font-weight: 800;">BY</span>
            BharatYatra SuperApp
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 6px; line-height: 1.5;">
            <strong>BharatYatra Travel &amp; Mobility Technologies Pvt. Ltd.</strong><br />
            Corporate HQ: Level 7, DLF Cyber City, Sector 24, Gurugram, Haryana - 122002<br />
            GSTIN: <strong style="color: #0f172a; font-family: monospace;">07AAACB4410R1ZP</strong> • CIN: U63040DL2024PTC129481<br />
            State: Haryana (06) • Nature of Supply: Interstate E-Commerce Mobility &amp; Travel
          </div>
        </div>
        
        <div style="text-align: right;">
          <div style="display: inline-block; background: #ecfdf5; border: 1px solid #10b981; color: #065f46; font-size: 10px; font-weight: 800; padding: 2px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 4px;">
            ORIGINAL TAX INVOICE
          </div>
          <div style="font-size: 18px; font-weight: 800; color: #4338ca; letter-spacing: -0.5px;">TAX INVOICE</div>
          <div style="font-size: 11px; color: #334155; margin-top: 2px;"><strong>Invoice No:</strong> <span style="font-family: monospace; font-weight: 700;">${invoiceNumber}</span></div>
          <div style="font-size: 11px; color: #334155;"><strong>Date of Issue:</strong> ${issueDate}</div>
          <div style="font-size: 11px; color: #4338ca;"><strong>PNR / Booking Ref:</strong> <span style="font-family: monospace; font-weight: 800;">${pnr}</span></div>
        </div>
      </div>

      <!-- Two-Column Meta: Customer & Booking Summary -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        <!-- Billed To Box -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 11px; line-height: 1.6;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">
            Billed To (Passenger / Customer Profile)
          </div>
          <div><strong>Customer Name:</strong> ${userProfile.name || "Valued Yatri"}</div>
          <div><strong>Mobile:</strong> ${userProfile.phone || "+91 98765 43210"}</div>
          <div><strong>Email:</strong> ${userProfile.email || "passenger@bharatyatra.in"}</div>
          <div><strong>Place of Supply:</strong> India (State Code: 07)</div>
          ${userProfile.gstNumber ? `<div><strong>Customer GSTIN:</strong> <span style="font-family: monospace;">${userProfile.gstNumber}</span></div>` : ""}
          <div style="margin-top: 6px; display: inline-flex; align-items: center; gap: 4px; color: #166534; background: #dcfce7; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700;">
            ✓ Aadhaar / DigiLocker KYC Verified
          </div>
        </div>

        <!-- Booking Details Box -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 11px; line-height: 1.6;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">
            Trip &amp; Itinerary Details
          </div>
          <div><strong>Service Category:</strong> <span style="text-transform: uppercase; font-weight: 700; color: #4338ca;">${booking.serviceType || "TRAVEL"}</span></div>
          <div><strong>Service Item:</strong> <strong style="color: #0f172a;">${booking.title}</strong></div>
          <div><strong>Route / Stay:</strong> ${booking.subtitle || "Standard Journey"}</div>
          <div><strong>Travel Date &amp; Time:</strong> ${travelDateFormatted} ${booking.time ? `• ${booking.time}` : ""}</div>
          <div><strong>Seat / Berth / Room:</strong> <span style="font-weight: 700; color: #1d4ed8;">${seatInfo}</span> (${passengerCount} Pax)</div>
        </div>
      </div>

      <!-- Itemized Tax Breakdown Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
        <thead>
          <tr style="background: #0f172a; color: #ffffff;">
            <th style="padding: 10px 12px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 10px; border-top-left-radius: 6px;">Service Description</th>
            <th style="padding: 10px 12px; text-align: center; font-weight: 700; text-transform: uppercase; font-size: 10px;">SAC Code</th>
            <th style="padding: 10px 12px; text-align: center; font-weight: 700; text-transform: uppercase; font-size: 10px;">Qty / Units</th>
            <th style="padding: 10px 12px; text-align: right; font-weight: 700; text-transform: uppercase; font-size: 10px; border-top-right-radius: 6px;">Taxable Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e2e8f0; background: #ffffff;">
            <td style="padding: 10px 12px;">
              <strong>${booking.title} (Base Fare)</strong><br />
              <span style="color: #64748b; font-size: 10px;">${booking.subtitle || ""} • PNR: ${pnr}</span>
            </td>
            <td style="padding: 10px 12px; text-align: center; font-family: monospace;">${breakdown.sacCode}</td>
            <td style="padding: 10px 12px; text-align: center;">${passengerCount} Pax</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 700;">₹${breakdown.baseAmount.toLocaleString("en-IN")}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
            <td style="padding: 8px 12px;">
              <strong>Central GST (CGST @ ${(breakdown.gstRatePercent / 2).toFixed(1)}%)</strong><br />
              <span style="color: #64748b; font-size: 10px;">Statutory tax on passenger mobility</span>
            </td>
            <td style="padding: 8px 12px; text-align: center; font-family: monospace;">${breakdown.sacCode}</td>
            <td style="padding: 8px 12px; text-align: center;">Govt Tax</td>
            <td style="padding: 8px 12px; text-align: right; font-weight: 600;">₹${breakdown.cgst.toLocaleString("en-IN")}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0; background: #ffffff;">
            <td style="padding: 8px 12px;">
              <strong>State GST (SGST @ ${(breakdown.gstRatePercent / 2).toFixed(1)}%)</strong><br />
              <span style="color: #64748b; font-size: 10px;">Statutory state revenue compliance</span>
            </td>
            <td style="padding: 8px 12px; text-align: center; font-family: monospace;">${breakdown.sacCode}</td>
            <td style="padding: 8px 12px; text-align: center;">Govt Tax</td>
            <td style="padding: 8px 12px; text-align: right; font-weight: 600;">₹${breakdown.sgst.toLocaleString("en-IN")}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
            <td style="padding: 8px 12px;">
              <strong>IRDAI Passenger Travel &amp; Bag Protection</strong><br />
              <span style="color: #64748b; font-size: 10px;">Comprehensive transit insurance coverage</span>
            </td>
            <td style="padding: 8px 12px; text-align: center; font-family: monospace;">997132</td>
            <td style="padding: 8px 12px; text-align: center;">${passengerCount} Pax</td>
            <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #16a34a;">₹0 (Free)</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0; background: #ffffff;">
            <td style="padding: 8px 12px;">
              <strong>Platform Facilitation &amp; Escrow Security</strong><br />
              <span style="color: #64748b; font-size: 10px;">Zero convenience fee guarantee</span>
            </td>
            <td style="padding: 8px 12px; text-align: center; font-family: monospace;">998311</td>
            <td style="padding: 8px 12px; text-align: center;">1 Session</td>
            <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #16a34a;">₹0 (Zero Fee)</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals Box & Summary Alignment -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div style="max-width: 380px; font-size: 10px; color: #64748b; line-height: 1.5;">
          <strong>Amount in Words:</strong><br />
          <span style="text-transform: capitalize; font-weight: 600; color: #334155;">Indian Rupees ${breakdown.totalAmount.toLocaleString("en-IN")} Only</span>
          <div style="margin-top: 8px; padding: 8px; background: #f1f5f9; border-radius: 6px; border-left: 3px solid #4338ca;">
            <strong>Input Tax Credit (ITC) Declaration:</strong><br />
            This computer-generated document conforms with Section 31 of CGST Act 2017. B2B recipients may claim eligible input tax credit in GSTR-2B.
          </div>
        </div>

        <div style="width: 290px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 12px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #475569;">
            <span>Taxable Base Fare:</span>
            <strong style="color: #0f172a;">₹${breakdown.baseAmount.toLocaleString("en-IN")}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #475569;">
            <span>Central GST (CGST 6%):</span>
            <strong style="color: #0f172a;">₹${breakdown.cgst.toLocaleString("en-IN")}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #475569;">
            <span>State GST (SGST 6%):</span>
            <strong style="color: #0f172a;">₹${breakdown.sgst.toLocaleString("en-IN")}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #475569;">
            <span>Convenience &amp; Platform Fee:</span>
            <strong style="color: #16a34a;">₹0.00</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 6px; font-size: 14px; font-weight: 900; color: #0f172a;">
            <span>Total Gross Paid:</span>
            <span style="color: #15803d;">₹${breakdown.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <!-- Payment Settlement & Fast Gate Check-In QR Verification Stamp -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; gap: 16px; font-size: 11px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <div style="font-weight: 800; color: #166534; font-size: 12px; background: #dcfce7; border: 1px solid #86efac; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
              ✓ Payment Verified &amp; Settled
            </div>
            <div style="border: 1px dashed #4338ca; background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
              Fast Gate Pass Enabled
            </div>
          </div>
          <div style="color: #334155; font-size: 10px; margin-top: 4px; line-height: 1.5;">
            <strong>Payment Mode:</strong> ${paymentMode} • <strong>RBI RRN:</strong> <span style="font-family: monospace;">${rrn}</span><br />
            <strong>Digital Gate Token:</strong> <span style="font-family: monospace; font-weight: 700; color: #4338ca;">GP-${pnr}-${booking.id.slice(-4).toUpperCase()}</span><br />
            <strong>Scan Guidance:</strong> Present this dynamic QR at Station Automated Gates, Flight Check-In Kiosks, or Hotel Concierge for swift biometric/KYC validation.
          </div>
        </div>
        ${qrCodeDataUrl ? `
          <div style="text-align: center; background: #ffffff; padding: 6px; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <img src="${qrCodeDataUrl}" alt="Dynamic Check-In QR" style="width: 80px; height: 80px; display: block;" />
            <div style="font-size: 8px; font-weight: 800; color: #4338ca; font-family: monospace; margin-top: 2px;">
              PNR: ${pnr}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Footer & Disclaimer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8;">
        <div>
          Official e-Invoice generated via BharatYatra Unified Core API.<br />
          No physical signature required under Information Technology Act, 2000.
        </div>
        <div style="text-align: right; color: #64748b;">
          <strong>BharatYatra 24x7 Priority Support</strong><br />
          support@bharatyatra.in • Toll-Free: 1800-200-YATRA
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 780,
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 Dimensions: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 190; // margin 10mm on left and right
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10; // 10mm top margin

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, "FAST");

    // In case content exceeds single page
    heightLeft -= (pageHeight - 20);
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= (pageHeight - 20);
    }

    const filename = `Tax_Invoice_${pnr}_BharatYatra.pdf`;
    pdf.save(filename);

    return filename;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

