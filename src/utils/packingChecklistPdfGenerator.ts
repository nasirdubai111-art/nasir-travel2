import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { BookingItem } from "../types";
import { PackingCategoryType, PackingItem } from "../components/PackingChecklistModal";

export interface PackingPdfOptions {
  includeOnlyUnpacked?: boolean;
  filterCategory?: PackingCategoryType | "all";
}

const CATEGORY_TITLES: Record<PackingCategoryType, { title: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  documents: {
    title: "Essential Documents & ID",
    icon: "📄",
    color: "#1e40af",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  clothing: {
    title: "Clothing & Wearables",
    icon: "👕",
    color: "#047857",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  electronics: {
    title: "Electronics & Gadgets",
    icon: "🔌",
    color: "#6d28d9",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
  },
  toiletries: {
    title: "Toiletries & Grooming",
    icon: "🧴",
    color: "#b45309",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  medications: {
    title: "Health & First Aid Medications",
    icon: "💊",
    color: "#b91c1c",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  custom: {
    title: "Custom & Journey Gear",
    icon: "🎒",
    color: "#0f766e",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
  },
};

const CATEGORY_ORDER: PackingCategoryType[] = [
  "documents",
  "clothing",
  "electronics",
  "toiletries",
  "medications",
  "custom",
];

/**
 * Generates a clean, high-resolution, print-ready PDF checklist formatted for standard A4 paper.
 */
export async function downloadPackingChecklistPDF(
  booking: BookingItem,
  items: PackingItem[],
  options: PackingPdfOptions = {}
): Promise<string> {
  const pnr = booking.pnr || `BY-${booking.id.slice(-6).toUpperCase()}`;
  const totalItems = items.length;
  const packedCount = items.filter((i) => i.packed).length;
  const percent = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;
  const essentialItemsCount = items.filter((i) => i.essential).length;
  const essentialPackedCount = items.filter((i) => i.essential && i.packed).length;

  const generatedDateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generate lightweight offline QR code with trip metadata
  const qrDataPayload = JSON.stringify({
    type: "BHARATYATRA_PACKING_LIST",
    trip: booking.title,
    pnr,
    service: booking.serviceType,
    date: booking.date || "Upcoming",
    itemsCount: totalItems,
    packed: packedCount,
    readyPercent: `${percent}%`,
    generated: new Date().toISOString(),
  });

  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(qrDataPayload, {
      width: 140,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Failed to generate QR code for packing PDF:", err);
  }

  // Filter items if specific category requested
  let displayItems = items;
  if (options.filterCategory && options.filterCategory !== "all") {
    displayItems = displayItems.filter((i) => i.category === options.filterCategory);
  }
  if (options.includeOnlyUnpacked) {
    displayItems = displayItems.filter((i) => !i.packed);
  }

  // Group items by category and subcategory
  const groupedCategories: {
    category: PackingCategoryType;
    info: (typeof CATEGORY_TITLES)[PackingCategoryType];
    subcategories: { subcategory: string; items: PackingItem[] }[];
    totalCount: number;
    packedCount: number;
  }[] = [];

  CATEGORY_ORDER.forEach((catId) => {
    const catItems = displayItems.filter((i) => i.category === catId);
    if (catItems.length === 0) return;

    const subMap: Record<string, PackingItem[]> = {};
    catItems.forEach((it) => {
      const sub = it.subcategory || "General Essentials";
      if (!subMap[sub]) subMap[sub] = [];
      subMap[sub].push(it);
    });

    const subcategories = Object.entries(subMap).map(([subcategory, subItems]) => ({
      subcategory,
      items: subItems,
    }));

    groupedCategories.push({
      category: catId,
      info: CATEGORY_TITLES[catId] || {
        title: catId,
        icon: "📦",
        color: "#334155",
        bgColor: "#f8fafc",
        borderColor: "#cbd5e1",
      },
      subcategories,
      totalCount: catItems.length,
      packedCount: catItems.filter((i) => i.packed).length,
    });
  });

  // Create isolated DOM node for PDF rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "820px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#0f172a";
  container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  container.style.padding = "24px 32px";
  container.style.boxSizing = "border-box";
  container.style.zIndex = "-1000";

  // Build HTML document
  container.innerHTML = `
    <div style="background: #ffffff; color: #0f172a; width: 100%;">
      <!-- Top Header Brand & Trip Details -->
      <div style="border-bottom: 2px solid #1e293b; padding-bottom: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #4338ca; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 13px; font-weight: 900; letter-spacing: 0.5px;">BY</span>
            <span style="font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">BharatYatra SuperApp</span>
            <span style="background: #e0e7ff; color: #3730a3; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; text-transform: uppercase; margin-left: 4px;">
              Print-Ready Packing Checklist
            </span>
          </div>
          
          <div style="margin-top: 8px;">
            <div style="font-size: 16px; font-weight: 800; color: #0f172a;">
              ${escapeHtml(booking.title)}
            </div>
            <div style="font-size: 11px; color: #475569; margin-top: 3px; display: flex; gap: 12px; font-weight: 500;">
              <span><strong>Travel Date:</strong> ${escapeHtml(booking.date || "Scheduled Departure")}</span>
              <span>•</span>
              <span><strong>PNR / Ref:</strong> <span style="font-family: monospace; font-weight: 700; color: #4338ca;">${escapeHtml(pnr)}</span></span>
              <span>•</span>
              <span><strong>Category:</strong> ${escapeHtml(booking.serviceType.toUpperCase())}</span>
              <span>•</span>
              <span><strong>Passengers:</strong> ${booking.passengers || 1}</span>
            </div>
          </div>
        </div>

        <div style="text-align: right; display: flex; align-items: center; gap: 12px;">
          ${
            qrDataUrl
              ? `<div style="text-align: center;">
                  <img src="${qrDataUrl}" alt="Trip QR" style="width: 58px; height: 58px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 2px; background: #ffffff;" />
                  <div style="font-size: 8px; color: #64748b; font-weight: 700; margin-top: 2px;">SCAN TRIP</div>
                </div>`
              : ""
          }
        </div>
      </div>

      <!-- Packing Status & Summary Highlights Ribbon -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div>
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px;">Overall Readiness</div>
            <div style="font-size: 15px; font-weight: 900; color: ${percent === 100 ? "#059669" : "#4338ca"};">
              ${packedCount} / ${totalItems} Packed (${percent}%)
            </div>
          </div>

          <div style="width: 130px; height: 8px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${percent}%; height: 100%; background: ${percent === 100 ? "#10b981" : "#4f46e5"}; border-radius: 9999px;"></div>
          </div>

          <div style="border-left: 1px solid #cbd5e1; padding-left: 14px;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px;">Essential Items</div>
            <div style="font-size: 13px; font-weight: 800; color: ${essentialPackedCount === essentialItemsCount ? "#059669" : "#b45309"};">
              ${essentialPackedCount} / ${essentialItemsCount} Essential Secured
            </div>
          </div>
        </div>

        <div style="text-align: right; font-size: 10px; color: #64748b;">
          <div><strong>Printed:</strong> ${generatedDateStr}</div>
          <div>Offline Travelers Travel Document</div>
        </div>
      </div>

      <!-- Category Sections Grid / Column Flow -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${groupedCategories
          .map((group) => {
            return `
            <div style="border: 1px solid ${group.info.borderColor}; border-radius: 12px; overflow: hidden; background: #ffffff; page-break-inside: avoid; break-inside: avoid;">
              <!-- Category Header -->
              <div style="background: ${group.info.bgColor}; border-bottom: 1px solid ${group.info.borderColor}; padding: 7px 14px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 14px;">${group.info.icon}</span>
                  <span style="font-size: 13px; font-weight: 800; color: ${group.info.color};">
                    ${group.info.title}
                  </span>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: ${group.info.color}; background: #ffffff; border: 1px solid ${group.info.borderColor}; padding: 1px 7px; border-radius: 9999px;">
                  ${group.packedCount} / ${group.totalCount} packed
                </span>
              </div>

              <!-- Subcategories & Item Rows -->
              <div style="padding: 10px 14px;">
                ${group.subcategories
                  .map((sub, sIdx) => {
                    return `
                    <div style="${sIdx > 0 ? "margin-top: 10px; pt-2; border-top: 1px dashed #e2e8f0;" : ""}">
                      <div style="font-size: 10.5px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 6px; display: flex; align-items: center; gap: 5px;">
                        <span>📁</span>
                        <span>${escapeHtml(sub.subcategory)}</span>
                        <span style="font-size: 9.5px; font-weight: normal; color: #94a3b8;">(${sub.items.length} items)</span>
                      </div>

                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 12px;">
                        ${sub.items
                          .map((item) => {
                            const isPacked = item.packed;
                            return `
                            <div style="display: flex; align-items: flex-start; gap: 7px; padding: 4px 6px; border-radius: 6px; background: ${isPacked ? "#f8fafc" : "#ffffff"}; border: 1px solid ${isPacked ? "#e2e8f0" : "#f1f5f9"};">
                              <div style="width: 14px; height: 14px; border: 1.5px solid ${isPacked ? "#059669" : "#64748b"}; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #ffffff; background: ${isPacked ? "#059669" : "#ffffff"}; margin-top: 1px; shrink: 0;">
                                ${isPacked ? "✓" : ""}
                              </div>
                              <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                                  <span style="font-size: 11px; font-weight: ${item.essential ? "700" : "500"}; color: ${isPacked ? "#334155" : "#0f172a"}; ${isPacked ? "text-decoration: line-through; opacity: 0.85;" : ""}">
                                    ${escapeHtml(item.name)}
                                  </span>
                                  ${
                                    item.essential
                                      ? `<span style="font-size: 8.5px; font-weight: 800; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; padding: 0.5px 4px; border-radius: 3px; text-transform: uppercase;">
                                          Essential
                                        </span>`
                                      : ""
                                  }
                                </div>
                                ${
                                  item.notes
                                    ? `<div style="font-size: 9.5px; color: #64748b; margin-top: 1px; font-style: italic;">
                                        Tip: ${escapeHtml(item.notes)}
                                      </div>`
                                    : ""
                                }
                              </div>
                            </div>
                            `;
                          })
                          .join("")}
                      </div>
                    </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
            `;
          })
          .join("")}
      </div>

      <!-- Offline Travel Notes & Bag Rules -->
      <div style="margin-top: 16px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; background: #fafafa; font-size: 9.5px; color: #475569; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; break-inside: avoid;">
        <div>
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">⚡ Lithium Batteries & Tech</div>
          Power banks and spare lithium batteries must remain in <strong>Carry-On cabin baggage only</strong> (Never in check-in).
        </div>
        <div>
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">🧴 Liquids & Gels (LAGs)</div>
          Liquids in cabin luggage must not exceed <strong>100ml containers</strong> placed in a clear transparent bag.
        </div>
        <div>
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">📄 Original IDs & Vouchers</div>
          Always carry original Govt ID (Passport/Aadhaar) along with printed reservation vouchers & permit copies.
        </div>
      </div>

      <!-- Document Footer -->
      <div style="margin-top: 14px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8;">
        <div>
          Official Packing Checklist • Generated via BharatYatra Unified Travel Suite
        </div>
        <div>
          24x7 Traveler Helpline: support@bharatyatra.in • 1800-200-YATRA
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
      windowWidth: 820,
    });

    const imgData = canvas.toDataURL("image/png");

    // Standard A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 194; // Left/right margins of 8mm
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 8; // Top margin of 8mm

    pdf.addImage(imgData, "PNG", 8, position, imgWidth, imgHeight, undefined, "FAST");

    heightLeft -= (pageHeight - 16);
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 8;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 8, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= (pageHeight - 16);
    }

    const sanitizedTitle = booking.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 24);
    const filename = `Packing_Checklist_${pnr}_${sanitizedTitle}.pdf`;
    pdf.save(filename);

    return filename;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
