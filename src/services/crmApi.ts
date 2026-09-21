// src/services/crmApi.ts
// Customer 360 CRM, High-Priority Leads & Support Tickets API Service

import { apiClient } from "./apiClient";
import { ApiResponse, CRMLeadOrTicket } from "../types/api";
import { CrmService } from "./crmService";

export const crmApi = {
  // Get CRM leads
  async getLeads(): Promise<ApiResponse<CRMLeadOrTicket[]>> {
    const res = await apiClient.get<CRMLeadOrTicket[]>("/api/crm/leads");
    if (res.success && res.data && res.data.length > 0) return res;

    // Bridge with existing CrmService
    const localLeads = CrmService.getLeads();
    const mapped: CRMLeadOrTicket[] = localLeads.map((lead) => ({
      ticketId: lead.lead_id,
      customerName: lead.customer_name,
      contactNumber: lead.customer_phone,
      subject: `Travel Inquiry for ${lead.destination || "Pilgrimage"} (${lead.category || "Transit"})`,
      category: lead.category || "General",
      priority: (lead.priority ? lead.priority.toUpperCase() : "MEDIUM") as any,
      status: (lead.status === "Closed Won" ? "RESOLVED" : lead.status === "Closed Lost" ? "RESOLVED" : "IN_PROGRESS") as any,
      createdAt: lead.created_at,
    }));

    return {
      success: true,
      data: mapped,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Create lead or support ticket
  async createTicket(ticket: {
    customerName: string;
    contactNumber: string;
    subject: string;
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  }): Promise<ApiResponse<CRMLeadOrTicket>> {
    const res = await apiClient.post<CRMLeadOrTicket>("/api/crm/tickets", ticket);
    if (res.success && res.data) return res;

    const newTicket: CRMLeadOrTicket = {
      ticketId: `tkt-${Date.now()}`,
      ...ticket,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: newTicket,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Add agent note to customer profile
  async addCustomerNote(customerId: string, noteText: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/crm/customers/${customerId}/notes`, { noteText });
  },
};

export default crmApi;
