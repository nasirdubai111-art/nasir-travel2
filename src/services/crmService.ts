import {
  CrmLeadEntity,
  CustomerNoteEntity,
  CustomerActivityEntity,
  CustomerContactEntity,
  CustomerTagEntity,
  FollowUpEntity,
  CrmNotificationSettings,
  CrmAgentNotificationLog,
  LeadPriority,
} from "../types/crm";
import {
  INITIAL_CRM_LEADS,
  INITIAL_CUSTOMER_NOTES,
  INITIAL_CUSTOMER_ACTIVITIES,
  INITIAL_CUSTOMER_CONTACTS,
  INITIAL_CUSTOMER_TAGS,
  INITIAL_FOLLOW_UPS,
} from "../data/mockCrmData";

const STORAGE_KEYS = {
  LEADS: "bharatyatra_crm_leads_v1",
  NOTES: "bharatyatra_crm_notes_v1",
  ACTIVITIES: "bharatyatra_crm_activities_v1",
  CONTACTS: "bharatyatra_crm_contacts_v1",
  TAGS: "bharatyatra_crm_tags_v1",
  FOLLOW_UPS: "bharatyatra_crm_follow_ups_v1",
  SETTINGS: "bharatyatra_crm_settings_v1",
  AGENT_NOTIFICATIONS: "bharatyatra_crm_agent_notifications_v1",
};

export const DEFAULT_CRM_SETTINGS: CrmNotificationSettings = {
  agentEmailNotification: true,
  agentPushNotification: true,
  highPriorityCriteria: "high_or_urgent",
  emailSubjectTemplate: "⚡ [HIGH-PRIORITY LEAD] New Travel Inquiry Assigned: {customer_name} ({destination})",
  soundAlertEnabled: true,
  smsAlertFallback: false,
  updated_at: "2026-09-17 11:00",
};

export const INITIAL_AGENT_NOTIFICATIONS: CrmAgentNotificationLog[] = [
  {
    id: "NOTIF-9001",
    lead_id: "LEAD-1003",
    customer_name: "Rajeshwari Varma",
    destination: "Goa 5-Star Beachfront Leadership Summit",
    deal_value: 1450000,
    priority: "Urgent",
    assigned_to: "Vikram Rathore (Corporate MICE Desk)",
    agent_email: "vikram.rathore@bharatyatra.com",
    channel: "Both",
    status: "Delivered",
    subject: "⚡ [HIGH-PRIORITY LEAD] New Travel Inquiry Assigned: Rajeshwari Varma",
    preview_text: "Corporate MICE group inquiry from Tech Mahindra for 120 pax. High probability booking.",
    timestamp: "2026-09-15 11:01",
  },
  {
    id: "NOTIF-9002",
    lead_id: "LEAD-1001",
    customer_name: "Dr. Arvind Subramanian",
    destination: "Varanasi & Ayodhya VIP Yatra",
    deal_value: 185000,
    priority: "High",
    assigned_to: "Rahul Sharma (Sr. Yatra Specialist)",
    agent_email: "rahul.sharma@bharatyatra.com",
    channel: "Both",
    status: "Delivered",
    subject: "⚡ [HIGH-PRIORITY LEAD] New Travel Inquiry Assigned: Dr. Arvind Subramanian",
    preview_text: "VIP Senior Pilgrimage with helicopter darshan and private Pandit escort.",
    timestamp: "2026-09-12 09:31",
  },
];

export class CrmService {
  // --- LEADS ---
  static getLeads(): CrmLeadEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading CRM leads:", e);
    }
    return INITIAL_CRM_LEADS;
  }

  static saveLeads(leads: CrmLeadEntity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      this.dispatchUpdate("leads");
    } catch (e) {
      console.error("Error saving CRM leads:", e);
    }
  }

  static addLead(newLead: Omit<CrmLeadEntity, "lead_id" | "customer_id" | "created_at" | "updated_at">): CrmLeadEntity {
    const leads = this.getLeads();
    const nextIdNum = 1000 + leads.length + 1;
    const lead_id = `LEAD-${nextIdNum}`;
    const customer_id = `CUST-${5000 + nextIdNum}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    // Ensure priority exists
    const priority: LeadPriority =
      newLead.priority ||
      ((newLead.score ?? 0) >= 85 || (newLead.deal_value ?? 0) >= 150000 ? "High" : "Medium");

    const lead: CrmLeadEntity = {
      ...newLead,
      priority,
      lead_id,
      customer_id,
      created_at: now,
      updated_at: now,
    };

    const updated = [lead, ...leads];
    this.saveLeads(updated);

    // Also automatically create primary contact
    this.addContact({
      customer_id,
      full_name: lead.customer_name,
      phone: lead.customer_phone,
      email: lead.customer_email,
      designation_or_relation: "Primary Inquirer / Traveler",
      channel_preference: lead.source === "WhatsApp" ? "WhatsApp" : "Phone",
      is_primary: true,
      city: lead.city,
      verified: true,
    });

    // Log Activity
    this.addActivity({
      customer_id,
      lead_id,
      activity_type: "Inquiry Received",
      description: `New lead generated via ${lead.source} for ${lead.destination} (Est. ₹${lead.deal_value.toLocaleString("en-IN")})`,
      performed_by: "System / Inbound",
      channel: lead.source === "WhatsApp" ? "WhatsApp" : "App Web",
      badge_color: "emerald",
    });

    // Automated Agent Notification Dispatch for High-Priority Lead
    const settings = this.getSettings();
    const isHigh = this.isHighPriorityLead(lead, settings.highPriorityCriteria);

    if (isHigh && (settings.agentEmailNotification || settings.agentPushNotification)) {
      this.dispatchAutomatedAgentAlert(lead, settings);
    }

    return lead;
  }

  static updateLead(lead_id: string, updates: Partial<CrmLeadEntity>): CrmLeadEntity | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.lead_id === lead_id);
    if (index === -1) return null;

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updatedLead = { ...leads[index], ...updates, updated_at: now };
    leads[index] = updatedLead;
    this.saveLeads(leads);

    if (updates.status && updates.status !== leads[index].status) {
      this.addActivity({
        customer_id: updatedLead.customer_id,
        lead_id,
        activity_type: "Status Changed",
        description: `Lead status transitioned to "${updates.status}" by ${updates.assigned_to || updatedLead.assigned_to}`,
        performed_by: updates.assigned_to || updatedLead.assigned_to,
        badge_color: "blue",
      });
    }

    return updatedLead;
  }

  // --- CUSTOMER NOTES ---
  static getNotes(): CustomerNoteEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading CRM notes:", e);
    }
    return INITIAL_CUSTOMER_NOTES;
  }

  static saveNotes(notes: CustomerNoteEntity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      this.dispatchUpdate("notes");
    } catch (e) {
      console.error("Error saving CRM notes:", e);
    }
  }

  static addNote(newNote: Omit<CustomerNoteEntity, "id" | "created_at">): CustomerNoteEntity {
    const notes = this.getNotes();
    const id = `NOTE-${2000 + notes.length + 1}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const noteRecord: CustomerNoteEntity = {
      ...newNote,
      id,
      created_at: now,
    };

    const updated = [noteRecord, ...notes];
    this.saveNotes(updated);

    // Log Activity
    this.addActivity({
      customer_id: newNote.customer_id,
      lead_id: newNote.lead_id,
      activity_type: "Note Added",
      description: `Note [${newNote.note_type}] logged: "${newNote.note.substring(0, 70)}${newNote.note.length > 70 ? "..." : ""}"`,
      performed_by: newNote.created_by,
      badge_color: newNote.is_important ? "amber" : "slate",
    });

    return noteRecord;
  }

  static deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    this.saveNotes(notes);
  }

  static toggleNoteImportance(id: string): void {
    const notes = this.getNotes().map((n) =>
      n.id === id ? { ...n, is_important: !n.is_important } : n
    );
    this.saveNotes(notes);
  }

  // --- CUSTOMER ACTIVITIES ---
  static getActivities(): CustomerActivityEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading CRM activities:", e);
    }
    return INITIAL_CUSTOMER_ACTIVITIES;
  }

  static saveActivities(activities: CustomerActivityEntity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      this.dispatchUpdate("activities");
    } catch (e) {
      console.error("Error saving CRM activities:", e);
    }
  }

  static addActivity(
    newActivity: Omit<CustomerActivityEntity, "activity_id" | "timestamp">
  ): CustomerActivityEntity {
    const activities = this.getActivities();
    const activity_id = `ACT-${3000 + activities.length + 1}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const activity: CustomerActivityEntity = {
      ...newActivity,
      activity_id,
      timestamp: now,
    };

    const updated = [activity, ...activities];
    this.saveActivities(updated);
    return activity;
  }

  // --- CUSTOMER CONTACTS ---
  static getContacts(): CustomerContactEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading CRM contacts:", e);
    }
    return INITIAL_CUSTOMER_CONTACTS;
  }

  static saveContacts(contacts: CustomerContactEntity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      this.dispatchUpdate("contacts");
    } catch (e) {
      console.error("Error saving CRM contacts:", e);
    }
  }

  static addContact(
    newContact: Omit<CustomerContactEntity, "contact_id" | "created_at">
  ): CustomerContactEntity {
    const contacts = this.getContacts();
    const contact_id = `CONT-${4000 + contacts.length + 1}`;
    const now = new Date().toISOString().substring(0, 10);

    const contact: CustomerContactEntity = {
      ...newContact,
      contact_id,
      created_at: now,
    };

    const updated = [contact, ...contacts];
    this.saveContacts(updated);
    return contact;
  }

  static deleteContact(contact_id: string): void {
    const contacts = this.getContacts().filter((c) => c.contact_id !== contact_id);
    this.saveContacts(contacts);
  }

  // --- CUSTOMER TAGS ---
  static getTags(): CustomerTagEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading CRM tags:", e);
    }
    return INITIAL_CUSTOMER_TAGS;
  }

  static saveTags(tags: CustomerTagEntity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
      this.dispatchUpdate("tags");
    } catch (e) {
      console.error("Error saving CRM tags:", e);
    }
  }

  static addTag(newTag: Omit<CustomerTagEntity, "tag_id" | "created_at">): CustomerTagEntity {
    const tags = this.getTags();
    const tag_id = `TAG-${6000 + tags.length + 1}`;
    const now = new Date().toISOString().substring(0, 10);

    const tag: CustomerTagEntity = {
      ...newTag,
      tag_id,
      created_at: now,
    };

    const updated = [tag, ...tags];
    this.saveTags(updated);
    return tag;
  }

  static removeTag(tag_id: string): void {
    const tags = this.getTags().filter((t) => t.tag_id !== tag_id);
    this.saveTags(tags);
  }

  // --- FOLLOW UPS ---
  static getFollowUps(): FollowUpEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading CRM follow ups:", e);
    }
    return INITIAL_FOLLOW_UPS;
  }

  static saveFollowUps(followUps: FollowUpEntity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));
      this.dispatchUpdate("follow_ups");
    } catch (e) {
      console.error("Error saving CRM follow ups:", e);
    }
  }

  static addFollowUp(newFollowUp: Omit<FollowUpEntity, "follow_up_id" | "created_at">): FollowUpEntity {
    const followUps = this.getFollowUps();
    const follow_up_id = `FLW-${7000 + followUps.length + 1}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const followUp: FollowUpEntity = {
      ...newFollowUp,
      follow_up_id,
      created_at: now,
    };

    const updated = [followUp, ...followUps];
    this.saveFollowUps(updated);

    // Activity Log
    this.addActivity({
      customer_id: newFollowUp.customer_id,
      lead_id: newFollowUp.lead_id,
      activity_type: "Follow-up Scheduled",
      description: `Follow-up [${newFollowUp.priority} Priority]: "${newFollowUp.title}" assigned to ${newFollowUp.assigned_to}, due ${newFollowUp.due_date}`,
      performed_by: newFollowUp.assigned_to,
      badge_color: newFollowUp.priority === "Urgent" ? "rose" : "amber",
    });

    return followUp;
  }

  static updateFollowUp(follow_up_id: string, updates: Partial<FollowUpEntity>): FollowUpEntity | null {
    const followUps = this.getFollowUps();
    const index = followUps.findIndex((f) => f.follow_up_id === follow_up_id);
    if (index === -1) return null;

    const updated = { ...followUps[index], ...updates };
    followUps[index] = updated;
    this.saveFollowUps(followUps);
    return updated;
  }

  static markFollowUpComplete(follow_up_id: string): void {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    this.updateFollowUp(follow_up_id, {
      status: "Completed",
      completed_at: now,
    });
  }

  // --- CRM NOTIFICATION SETTINGS ---
  static getSettings(): CrmNotificationSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_CRM_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Error reading CRM settings:", e);
    }
    return DEFAULT_CRM_SETTINGS;
  }

  static saveSettings(settings: CrmNotificationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      this.dispatchUpdate("settings");
    } catch (e) {
      console.error("Error saving CRM settings:", e);
    }
  }

  // --- AGENT NOTIFICATIONS DISPATCH LOG ---
  static getAgentNotifications(): CrmAgentNotificationLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENT_NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading agent notifications:", e);
    }
    return INITIAL_AGENT_NOTIFICATIONS;
  }

  static saveAgentNotifications(notifications: CrmAgentNotificationLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENT_NOTIFICATIONS, JSON.stringify(notifications));
      this.dispatchUpdate("agent_notifications");
    } catch (e) {
      console.error("Error saving agent notifications:", e);
    }
  }

  static addAgentNotification(
    item: Omit<CrmAgentNotificationLog, "id" | "timestamp">
  ): CrmAgentNotificationLog {
    const notifs = this.getAgentNotifications();
    const id = `NOTIF-${9000 + notifs.length + 1}`;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newNotif: CrmAgentNotificationLog = { ...item, id, timestamp };
    const updated = [newNotif, ...notifs];
    this.saveAgentNotifications(updated);
    return newNotif;
  }

  static clearAgentNotifications(): void {
    this.saveAgentNotifications([]);
  }

  // --- HIGH PRIORITY DETECTION & AUTOMATED ALERT DISPATCH ---
  static isHighPriorityLead(
    lead: Partial<CrmLeadEntity>,
    criteria: CrmNotificationSettings["highPriorityCriteria"]
  ): boolean {
    const isExplicitHigh = lead.priority === "High" || lead.priority === "Urgent";
    if (isExplicitHigh) return true;

    switch (criteria) {
      case "score_80":
        return (lead.score ?? 0) >= 80;
      case "deal_value_150k":
        return (lead.deal_value ?? 0) >= 150000;
      case "any_lead":
        return true;
      case "high_or_urgent":
      default:
        return (lead.score ?? 0) >= 85 || (lead.deal_value ?? 0) >= 150000;
    }
  }

  static dispatchAutomatedAgentAlert(
    lead: CrmLeadEntity,
    settings: CrmNotificationSettings,
    isSimulated = false
  ): CrmAgentNotificationLog {
    const agentNamePart = lead.assigned_to
      .split(" ")[0]
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const agent_email = `${agentNamePart || "agent"}@bharatyatra.com`;

    let channel: "Email" | "Push Notification" | "Both" = "Both";
    if (settings.agentEmailNotification && settings.agentPushNotification) {
      channel = "Both";
    } else if (settings.agentEmailNotification) {
      channel = "Email";
    } else {
      channel = "Push Notification";
    }

    const formattedDeal = `₹${(lead.deal_value || 0).toLocaleString("en-IN")}`;
    const subject = `⚡ [HIGH-PRIORITY LEAD ALERT] ${lead.customer_name} • ${lead.destination}`;
    const preview_text = `Assigned to ${lead.assigned_to}. Destination: ${lead.destination} (${formattedDeal}). Contact: ${lead.customer_phone} / ${lead.customer_email || "N/A"}. Priority: ${lead.priority || "High"}.`;

    const notificationRecord = this.addAgentNotification({
      lead_id: lead.lead_id,
      customer_name: lead.customer_name,
      destination: lead.destination,
      deal_value: lead.deal_value,
      priority: lead.priority || "High",
      assigned_to: lead.assigned_to,
      agent_email,
      channel,
      status: isSimulated ? "Simulated" : "Delivered",
      subject,
      preview_text,
    });

    // Activity log for relational CRM stream
    this.addActivity({
      customer_id: lead.customer_id,
      lead_id: lead.lead_id,
      activity_type: "Agent Notified",
      description: `Automated ${channel} notification dispatched to assigned agent ${lead.assigned_to} (${agent_email}) for ${lead.priority || "High"} priority lead`,
      performed_by: "CRM Automation Engine",
      channel: settings.agentEmailNotification ? "Email" : "System Automation",
      badge_color: "purple",
    });

    // In-app audible chime
    if (settings.agentPushNotification && settings.soundAlertEnabled) {
      this.playChimeSound();
    }

    // Web Notification API (if supported and granted)
    if (settings.agentPushNotification) {
      this.showBrowserPushNotification(
        `🚨 High-Priority Lead: ${lead.customer_name}`,
        `${lead.destination} (${formattedDeal}) assigned to ${lead.assigned_to}`
      );
    }

    // Dispatch custom in-app broadcast event
    window.dispatchEvent(
      new CustomEvent("bharatyatra:crm-agent-alert", {
        detail: {
          lead,
          notification: notificationRecord,
          settings,
          isSimulated,
          timestamp: Date.now(),
        },
      })
    );

    return notificationRecord;
  }

  static playChimeSound(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignore if autoplay restricted
    }
  }

  static showBrowserPushNotification(title: string, body: string): void {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icon.png",
        });
      }
    } catch {
      // Ignored
    }
  }

  // --- RESET TO DEFAULTS ---
  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.TAGS);
    localStorage.removeItem(STORAGE_KEYS.FOLLOW_UPS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.AGENT_NOTIFICATIONS);
    this.dispatchUpdate("all");
  }

  private static dispatchUpdate(entity: string): void {
    window.dispatchEvent(
      new CustomEvent("bharatyatra:crm-updated", {
        detail: { entity, timestamp: Date.now() },
      })
    );
  }
}
