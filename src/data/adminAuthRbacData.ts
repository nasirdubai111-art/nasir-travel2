export interface AdminUserRole {
  roleId: string;
  roleName: string;
  color: string;
  description: string;
  assignedUsersCount: number;
  permissions: {
    canViewDeals: boolean;
    canEditDeals: boolean;
    canSendWhatsApp: boolean;
    canManageAdsBudget: boolean;
    canEditSeoBackend: boolean;
    canAccessAuditLogs: boolean;
    canDisburseCommission: boolean;
  };
}

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  ipAddress: string;
  sha256Checksum: string;
  status: "VERIFIED_SECURE" | "FLAGGED_ANOMALY" | "MFA_CONFIRMED";
}

export const ADMIN_RBAC_ROLES: AdminUserRole[] = [
  {
    roleId: "SUPER_ADMIN",
    roleName: "Super Admin / Executive Director",
    color: "emerald",
    description: "Full master governance across all 13 travel verticals, financial routing, and growth controls.",
    assignedUsersCount: 3,
    permissions: {
      canViewDeals: true,
      canEditDeals: true,
      canSendWhatsApp: true,
      canManageAdsBudget: true,
      canEditSeoBackend: true,
      canAccessAuditLogs: true,
      canDisburseCommission: true,
    },
  },
  {
    roleId: "GROWTH_LEAD",
    roleName: "Growth & Performance Marketing Lead",
    color: "purple",
    description: "Manages Meta CAPI, Google Ads PMax budgets, Reels studio, and omnichannel automation drips.",
    assignedUsersCount: 5,
    permissions: {
      canViewDeals: true,
      canEditDeals: true,
      canSendWhatsApp: true,
      canManageAdsBudget: true,
      canEditSeoBackend: true,
      canAccessAuditLogs: false,
      canDisburseCommission: false,
    },
  },
  {
    roleId: "CRM_AGENT",
    roleName: "WhatsApp Concierge & Telesales Specialist",
    color: "cyan",
    description: "Responds to live customer inquiries, updates deal stages, and issues booking quotations.",
    assignedUsersCount: 18,
    permissions: {
      canViewDeals: true,
      canEditDeals: true,
      canSendWhatsApp: true,
      canManageAdsBudget: false,
      canEditSeoBackend: false,
      canAccessAuditLogs: false,
      canDisburseCommission: false,
    },
  },
];

export const SECURITY_AUDIT_LOGS: SecurityAuditRecord[] = [
  {
    id: "AUD-801",
    timestamp: "2026-09-15 01:10:22 UTC",
    actor: "system_cron@bharatyatra.internal",
    role: "AUTOMATION_DAEMON",
    action: "DISBURSE_SPLIT_PAYMENT",
    resource: "RAZORPAY_ROUTE_BATCH_992",
    ipAddress: "10.128.0.42 (VPC Private)",
    sha256Checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "VERIFIED_SECURE",
  },
  {
    id: "AUD-802",
    timestamp: "2026-09-15 01:04:18 UTC",
    actor: "priya.sharma@bharatyatra.in",
    role: "GROWTH_LEAD",
    action: "AD_BUDGET_REALLOCATION",
    resource: "META_CAMPAIGN_CAMP-FB-01 (+₹10,000/day)",
    ipAddress: "152.57.12.19 (Mumbai Office)",
    sha256Checksum: "a6c5f78b94321ddae8472910faecb273461298453412aafe0238129374829103",
    status: "MFA_CONFIRMED",
  },
  {
    id: "AUD-803",
    timestamp: "2026-09-15 00:58:45 UTC",
    actor: "amit.joshi@bharatyatra.in",
    role: "CRM_AGENT",
    action: "CLOSE_WON_DEAL",
    resource: "CRM_LEAD_LEAD-905 (₹64,000 Varanasi Ganga Aarti)",
    ipAddress: "106.210.45.88 (Varanasi Node)",
    sha256Checksum: "7829104819284721903829104829103829103847291048291038291048291038",
    status: "VERIFIED_SECURE",
  },
];
