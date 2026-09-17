export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type LeadSource =
  | "WhatsApp"
  | "Meta Ads"
  | "Google Search"
  | "Organic SEO"
  | "Direct App"
  | "Telesales"
  | "Partner Portal"
  | "Referral";

export type NoteType =
  | "Call Summary"
  | "WhatsApp Interaction"
  | "Travel Preference"
  | "Budget & Quotation"
  | "Special Requirement"
  | "Payment & Billing"
  | "Complaint / Escalation"
  | "Internal Memo";

export type ActivityType =
  | "Inquiry Received"
  | "Outbound Call"
  | "WhatsApp Sent"
  | "Quotation Shared"
  | "Itinerary Downloaded"
  | "Payment Link Clicked"
  | "Deposit Received"
  | "Follow-up Scheduled"
  | "Status Changed"
  | "Note Added"
  | "Tag Assigned"
  | "Agent Notified";

export type FollowUpPriority = "Urgent" | "High" | "Medium" | "Low";

export type LeadPriority = "Urgent" | "High" | "Medium" | "Low";

export type FollowUpStatus = "Pending" | "Completed" | "Overdue" | "Rescheduled";

export interface CrmLeadEntity {
  lead_id: string; // e.g. "LEAD-1001"
  customer_id: string; // e.g. "CUST-5001"
  source: LeadSource;
  status: LeadStatus;
  assigned_to: string; // e.g. "Rahul Sharma"
  priority?: LeadPriority;
  
  // Contextual Travel Package details
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  city: string;
  destination: string;
  category: "Flights" | "Trains" | "Buses" | "Hotels" | "Resorts" | "Tours" | "Pilgrimage";
  deal_value: number; // in INR
  created_at: string;
  updated_at: string;
  score: number; // 0 - 100 Lead Quality
}

export interface CustomerNoteEntity {
  id: string;
  customer_id: string;
  lead_id: string;
  note: string;
  note_type: NoteType;
  is_important: boolean;
  created_by: string; // Agent / Admin who authored note
  created_at: string;
}

export interface CustomerActivityEntity {
  activity_id: string;
  customer_id: string;
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  performed_by: string;
  timestamp: string;
  channel?: "Phone" | "WhatsApp" | "Email" | "App Web" | "System Automation";
  badge_color?: string;
}

export interface CustomerContactEntity {
  contact_id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  email: string;
  designation_or_relation: string; // e.g. "Primary Traveler", "Spouse / Co-traveler", "Corporate Travel Desk", "Accountant"
  channel_preference: "WhatsApp" | "Phone" | "Email" | "SMS";
  is_primary: boolean;
  city: string;
  state?: string;
  verified: boolean;
  created_at: string;
}

export interface CustomerTagEntity {
  tag_id: string;
  customer_id: string;
  tag_name: string; // e.g. "VIP Platinum", "Spiritual Yatra", "HNI", "Corporate MICE"
  color: string; // Tailwind color token or hex
  category: "Segment" | "Spending Tier" | "Travel Preference" | "Urgency" | "Behavioral";
  added_by: string;
  created_at: string;
}

export interface FollowUpEntity {
  follow_up_id: string;
  lead_id: string;
  customer_id: string;
  title: string;
  due_date: string; // ISO or YYYY-MM-DD HH:mm
  priority: FollowUpPriority;
  status: FollowUpStatus;
  assigned_to: string;
  notes: string;
  reminder_channel?: "WhatsApp Alert" | "Email Reminder" | "SMS" | "Push Notification";
  completed_at?: string;
  created_at: string;
}

export type CrmSubSection =
  | "dashboard"
  | "leads"
  | "customer_notes"
  | "customer_activities"
  | "customer_contacts"
  | "customer_tags"
  | "follow_ups"
  | "crm_settings";

export interface CrmNotificationSettings {
  /**
   * Toggle automated email notifications for assigned agents whenever a new high-priority lead is created.
   */
  agentEmailNotification: boolean;
  /**
   * Toggle automated push notifications for assigned agents whenever a new high-priority lead is created.
   */
  agentPushNotification: boolean;

  /** Criteria for determining a high-priority lead */
  highPriorityCriteria: "high_or_urgent" | "score_80" | "deal_value_150k" | "any_lead";

  /** Custom email subject template */
  emailSubjectTemplate: string;

  /** Enable sound chime on new high-priority lead push alert */
  soundAlertEnabled: boolean;

  /** Fallback SMS alert for assigned agent */
  smsAlertFallback: boolean;

  /** System last updated timestamp */
  updated_at: string;
}

export interface CrmAgentNotificationLog {
  id: string;
  lead_id: string;
  customer_name: string;
  destination: string;
  deal_value: number;
  priority: LeadPriority;
  assigned_to: string;
  agent_email: string;
  channel: "Email" | "Push Notification" | "Both";
  status: "Delivered" | "Dispatched" | "Simulated";
  subject: string;
  preview_text: string;
  timestamp: string;
}
