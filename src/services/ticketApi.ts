// src/services/ticketApi.ts
// Digital Boarding Passes, E-Tickets, QR & Barcode Generation API Service

import { apiClient } from "./apiClient";
import { ApiResponse, DigitalTicket } from "../types/api";
import { TicketBackendService } from "./ticketBackendService";

export const ticketApi = {
  // Get digital ticket by booking reference or ticket number
  async getTicket(identifier: string): Promise<ApiResponse<DigitalTicket | null>> {
    const res = await apiClient.get<DigitalTicket>(`/api/tickets/${identifier}`);
    if (res.success && res.data) return res;

    // Fallback to authoritative TicketBackendService ledger
    const verification = TicketBackendService.verifyTicket(identifier);
    if (verification.isValid && verification.ticket) {
      const t = verification.ticket;
      const b = verification.booking;
      const mapped: DigitalTicket = {
        ticketNumber: t.ticketNumber,
        pnrOrBookingRef: t.pnr,
        vertical: (b?.journeyDetails?.serviceType || "train").toLowerCase() as any,
        qrCodeData: t.qrVerificationToken,
        barcode: t.ticketNumber,
        passengerNames: b?.passengerDetails?.map((p) => p.name) || ["Confirmed Passenger"],
        departureFormatted: b?.journeyDetails ? `${b.journeyDetails.from} (${b.journeyDetails.boardingTime})` : "On Schedule",
        arrivalFormatted: b?.journeyDetails ? b.journeyDetails.to : "Destination",
        seatBerthSummary: b?.passengerDetails?.map((p) => p.seatNumber).join(", ") || "Confirmed",
        supportHelpline: "1800-BHARAT-24",
      };

      return {
        success: true,
        data: mapped,
        timestamp: new Date().toISOString(),
        source: "LOCAL_FALLBACK",
      };
    }

    return {
      success: false,
      error: "Ticket not found",
      data: null,
      timestamp: new Date().toISOString(),
    };
  },

  // Generate downloadable PDF ticket
  async generatePdfTicket(ticketNumber: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post(`/api/tickets/${ticketNumber}/download-pdf`);
  },

  // Validate QR code scan at gate / platform
  async validateQrScan(qrData: string): Promise<ApiResponse<{ valid: boolean; passengerName: string; seat: string }>> {
    const result = TicketBackendService.verifyTicket(qrData);
    if (result.isValid && result.ticket) {
      return {
        success: true,
        data: {
          valid: true,
          passengerName: result.booking?.passengerDetails[0]?.name || "Verified Traveler",
          seat: result.booking?.passengerDetails[0]?.seatNumber || "Confirmed",
        },
        timestamp: new Date().toISOString(),
        source: "LOCAL_FALLBACK",
      };
    }
    return apiClient.post("/api/tickets/validate-qr", { qrData });
  },
};

export default ticketApi;
