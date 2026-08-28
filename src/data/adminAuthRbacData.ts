export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "marketing_director" | "performance_ads_lead" | "reels_content_creator" | "seo_lead" | "budget_controller";
  roleLabel: string;
  department: "Marketing" | "Executive" | "Growth & Ads" | "Creative Studio" | "SEO & Organic";
  avatar: string;
  phone: string;
  status: "active" | "invited" | "suspended";
  lastLogin: string;
  twoFactorEnabled: boolean;
  permissions: string[];
}

export interface AdminSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActive: string;
  status: "active" | "expired" | "revoked";
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: "CAMPAIGN_CREATED" | "BUDGET_UPDATED" | "API_KEY_ROTATED" | "REEL_SCHEDULED" | "SEO_META_SAVED" | "APPROVAL_GRANTED" | "USER_INVITED" | "LOGIN_SUCCESS" | "MFA_VERIFIED";
  category: "Google Ads" | "Meta Ads" | "FB Reels" | "IG Reels" | "SEO Engine" | "Security & RBAC" | "Budget Control";
  details: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
}

export interface ApiCredential {
  id: string;
  serviceName: string;
  category: "Advertising" | "AI Engine" | "Analytics & SEO" | "Social & Messaging";
  keyLabel: string;
  maskedKey: string;
  fullKeyValue: string;
  status: "CONNECTED" | "NEEDS_ROTATION" | "EXPIRED" | "SANDBOX";
  lastRotated: string;
  expiresInDays: number;
  environment: "Production (Zero-Trust)" | "Staging";
  scopes: string[];
}

export interface MarketingBudgetRule {
  id: string;
  channel: "Google Ads" | "Meta Ads (FB/IG)" | "Reels Production & Influencer" | "SEO & Content Syndication" | "WhatsApp Marketing";
  monthlyCapINR: number;
  currentSpendINR: number;
  dailyCapINR: number;
  alertThresholdPercent: number;
  autoPauseOnOverspend: boolean;
  approvalRequiredAboveINR: number;
  allocatedPercentage: number;
}

export interface CampaignApprovalRequest {
  id: string;
  campaignName: string;
  channel: "Google Ads" | "Meta Ads" | "Facebook Reel" | "Instagram Reel" | "SEO Mass Update";
  requestedBy: string;
  requesterRole: string;
  requestedAt: string;
  budgetRequestedINR: number;
  targetLaunchDate: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  assetPreviewUrl?: string;
}

export const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: "ADM-001",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@bharatyatra.ai",
    role: "super_admin",
    roleLabel: "Super Admin & Enterprise Officer",
    department: "Executive",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98200 11223",
    status: "active",
    lastLogin: "Just now (Active Session)",
    twoFactorEnabled: true,
    permissions: ["all", "google_ads", "meta_ads", "fb_reels", "ig_reels", "seo", "budget", "approvals", "credentials", "rbac_users", "audit_logs"],
  },
  {
    id: "ADM-002",
    name: "Ananya Sharma",
    email: "ananya.sharma@bharatyatra.ai",
    role: "marketing_director",
    roleLabel: "Head of Marketing & Growth",
    department: "Marketing",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98111 44556",
    status: "active",
    lastLogin: "18 mins ago",
    twoFactorEnabled: true,
    permissions: ["google_ads", "meta_ads", "fb_reels", "ig_reels", "seo", "budget", "approvals", "audit_logs"],
  },
  {
    id: "ADM-003",
    name: "Sameer Kapoor",
    email: "sameer.ads@bharatyatra.ai",
    role: "performance_ads_lead",
    roleLabel: "Senior Performance Ads Specialist",
    department: "Growth & Ads",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98330 77889",
    status: "active",
    lastLogin: "1 hour ago",
    twoFactorEnabled: true,
    permissions: ["google_ads", "meta_ads", "budget", "audit_logs"],
  },
  {
    id: "ADM-004",
    name: "Rhea Sen",
    email: "rhea.reels@bharatyatra.ai",
    role: "reels_content_creator",
    roleLabel: "Viral Short-Form Content Producer",
    department: "Creative Studio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "+91 99201 33221",
    status: "active",
    lastLogin: "3 hours ago",
    twoFactorEnabled: true,
    permissions: ["fb_reels", "ig_reels"],
  },
  {
    id: "ADM-005",
    name: "Priya Sundaram",
    email: "priya.seo@bharatyatra.ai",
    role: "seo_lead",
    roleLabel: "Principal Technical SEO Lead",
    department: "SEO & Organic",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    phone: "+91 94440 12345",
    status: "active",
    lastLogin: "Yesterday",
    twoFactorEnabled: true,
    permissions: ["seo", "audit_logs"],
  },
  {
    id: "ADM-006",
    name: "Deepak Mehra",
    email: "deepak.finance@bharatyatra.ai",
    role: "budget_controller",
    roleLabel: "VP Financial Planning & ROI Controller",
    department: "Executive",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    phone: "+91 99100 88990",
    status: "active",
    lastLogin: "2 days ago",
    twoFactorEnabled: true,
    permissions: ["budget", "approvals", "audit_logs"],
  },
];

export const INITIAL_ADMIN_SESSIONS: AdminSession[] = [
  {
    id: "SESS-901",
    userId: "ADM-001",
    userName: "Vikram Malhotra",
    userRole: "Super Admin",
    ipAddress: "103.21.144.92",
    location: "Mumbai, India (HQ Gateway)",
    device: "MacBook Pro M3 Max",
    browser: "Chrome 128.0 (Enterprise Encrypted)",
    loginTime: "2026-08-28 08:30:15",
    lastActive: "Just now",
    status: "active",
  },
  {
    id: "SESS-902",
    userId: "ADM-002",
    userName: "Ananya Sharma",
    userRole: "Marketing Director",
    ipAddress: "103.44.22.18",
    location: "New Delhi, India (Connaught Hub)",
    device: "MacBook Air M2",
    browser: "Safari 17.5",
    loginTime: "2026-08-28 09:12:44",
    lastActive: "18 mins ago",
    status: "active",
  },
  {
    id: "SESS-903",
    userId: "ADM-003",
    userName: "Sameer Kapoor",
    userRole: "Performance Ads Lead",
    ipAddress: "49.36.120.55",
    location: "Bengaluru, India (Indiranagar)",
    device: "Dell Precision 5570",
    browser: "Chrome 128.0",
    loginTime: "2026-08-28 08:45:00",
    lastActive: "1 hour ago",
    status: "active",
  },
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "LOG-4491",
    timestamp: "2026-08-28 09:40:12",
    userId: "ADM-001",
    userName: "Vikram Malhotra",
    userRole: "Super Admin",
    action: "APPROVAL_GRANTED",
    category: "Budget Control",
    details: "Approved ₹4.5L monthly Google Search Diwali Advance Booking campaign.",
    ipAddress: "103.21.144.92",
    status: "SUCCESS",
  },
  {
    id: "LOG-4490",
    timestamp: "2026-08-28 09:15:30",
    userId: "ADM-003",
    userName: "Sameer Kapoor",
    userRole: "Performance Ads Lead",
    action: "CAMPAIGN_CREATED",
    category: "Google Ads",
    details: "Created PMax Campaign 'PMax_Kedarnath_Helicopter_Luxury_Q3' with ₹1.2L budget.",
    ipAddress: "49.36.120.55",
    status: "SUCCESS",
  },
  {
    id: "LOG-4489",
    timestamp: "2026-08-28 08:50:22",
    userId: "ADM-004",
    userName: "Rhea Sen",
    userRole: "Reels Content Creator",
    action: "REEL_SCHEDULED",
    category: "IG Reels",
    details: "Scheduled Instagram Reel '5 Hidden Goa Cliffside Cafes' for publishing on Friday 7:30 PM.",
    ipAddress: "103.21.144.92",
    status: "SUCCESS",
  },
  {
    id: "LOG-4488",
    timestamp: "2026-08-27 18:22:45",
    userId: "ADM-005",
    userName: "Priya Sundaram",
    userRole: "SEO Lead",
    action: "SEO_META_SAVED",
    category: "SEO Engine",
    details: "Updated schema markup & H1 headers for 45 Vande Bharat Sleeper train booking routes.",
    ipAddress: "94.44.01.23",
    status: "SUCCESS",
  },
  {
    id: "LOG-4487",
    timestamp: "2026-08-27 16:10:00",
    userId: "ADM-001",
    userName: "Vikram Malhotra",
    userRole: "Super Admin",
    action: "API_KEY_ROTATED",
    category: "Security & RBAC",
    details: "Rotated Meta Graph API Production Access Token (SHA-256 HMAC Verified).",
    ipAddress: "103.21.144.92",
    status: "SUCCESS",
  },
];

export const INITIAL_API_CREDENTIALS: ApiCredential[] = [
  {
    id: "KEY-GADS-01",
    serviceName: "Google Ads API Developer Token",
    category: "Advertising",
    keyLabel: "BY-GADS-PROD-MCC-8841",
    maskedKey: "AIzaSyD_gAds99********************3XbQ",
    fullKeyValue: "AIzaSyD_gAds998144208571829402837483XbQ",
    status: "CONNECTED",
    lastRotated: "2026-08-15",
    expiresInDays: 78,
    environment: "Production (Zero-Trust)",
    scopes: ["https://www.googleapis.com/auth/adwords", "https://www.googleapis.com/auth/analytics.readonly"],
  },
  {
    id: "KEY-META-02",
    serviceName: "Meta Graph API (Facebook & Instagram Ads)",
    category: "Advertising",
    keyLabel: "META-BIZ-MGR-APP-TOKEN-771",
    maskedKey: "EAABwzL9ZA*****************************4kAZD",
    fullKeyValue: "EAABwzL9ZA48102837482910384758392018274kAZD",
    status: "CONNECTED",
    lastRotated: "2026-08-27",
    expiresInDays: 59,
    environment: "Production (Zero-Trust)",
    scopes: ["ads_management", "ads_read", "pages_read_engagement", "instagram_basic", "instagram_content_publish"],
  },
  {
    id: "KEY-META-PIXEL-03",
    serviceName: "Meta Pixel & Conversions API (CAPI)",
    category: "Advertising",
    keyLabel: "PIXEL-ID-8849102847",
    maskedKey: "8849102847******",
    fullKeyValue: "8849102847192847",
    status: "CONNECTED",
    lastRotated: "2026-07-10",
    expiresInDays: 140,
    environment: "Production (Zero-Trust)",
    scopes: ["events_delivery", "offline_conversions"],
  },
  {
    id: "KEY-GEMINI-04",
    serviceName: "Gemini 2.5 Flash / AI Ad Generator",
    category: "AI Engine",
    keyLabel: "SERVER-SIDE-GEMINI-TOKEN",
    maskedKey: "AIzaSyC***************************4m9Q",
    fullKeyValue: "AIzaSyC9981028475839201948572910384m9Q",
    status: "CONNECTED",
    lastRotated: "2026-08-01",
    expiresInDays: 180,
    environment: "Production (Zero-Trust)",
    scopes: ["generateContent", "embeddings", "interactions"],
  },
  {
    id: "KEY-SEO-05",
    serviceName: "Google Search Console & Semrush API",
    category: "Analytics & SEO",
    keyLabel: "GSC-SEMRUSH-DATA-PIPELINE",
    maskedKey: "sec_gsc_99182*******************98Za",
    fullKeyValue: "sec_gsc_9918273849501827465928198Za",
    status: "CONNECTED",
    lastRotated: "2026-06-20",
    expiresInDays: 32,
    environment: "Production (Zero-Trust)",
    scopes: ["searchconsole.readonly", "urltesting.mobilefriendly"],
  },
  {
    id: "KEY-WA-06",
    serviceName: "WhatsApp Cloud Business Platform API",
    category: "Social & Messaging",
    keyLabel: "WA-CLOUD-META-PROD-WABA",
    maskedKey: "EAAK74j******************************11Xp",
    fullKeyValue: "EAAK74j981028475839201948572019485711Xp",
    status: "CONNECTED",
    lastRotated: "2026-08-10",
    expiresInDays: 45,
    environment: "Production (Zero-Trust)",
    scopes: ["whatsapp_business_messaging", "whatsapp_business_management"],
  },
];

export const INITIAL_BUDGET_RULES: MarketingBudgetRule[] = [
  {
    id: "BUD-01",
    channel: "Google Ads",
    monthlyCapINR: 1200000,
    currentSpendINR: 845000,
    dailyCapINR: 40000,
    alertThresholdPercent: 85,
    autoPauseOnOverspend: true,
    approvalRequiredAboveINR: 100000,
    allocatedPercentage: 42,
  },
  {
    id: "BUD-02",
    channel: "Meta Ads (FB/IG)",
    monthlyCapINR: 950000,
    currentSpendINR: 620000,
    dailyCapINR: 32000,
    alertThresholdPercent: 80,
    autoPauseOnOverspend: true,
    approvalRequiredAboveINR: 75000,
    allocatedPercentage: 33,
  },
  {
    id: "BUD-03",
    channel: "Reels Production & Influencer",
    monthlyCapINR: 350000,
    currentSpendINR: 210000,
    dailyCapINR: 15000,
    alertThresholdPercent: 90,
    autoPauseOnOverspend: false,
    approvalRequiredAboveINR: 50000,
    allocatedPercentage: 12,
  },
  {
    id: "BUD-04",
    channel: "SEO & Content Syndication",
    monthlyCapINR: 200000,
    currentSpendINR: 145000,
    dailyCapINR: 8000,
    alertThresholdPercent: 85,
    autoPauseOnOverspend: false,
    approvalRequiredAboveINR: 40000,
    allocatedPercentage: 7,
  },
  {
    id: "BUD-05",
    channel: "WhatsApp Marketing",
    monthlyCapINR: 180000,
    currentSpendINR: 112000,
    dailyCapINR: 6000,
    alertThresholdPercent: 80,
    autoPauseOnOverspend: true,
    approvalRequiredAboveINR: 30000,
    allocatedPercentage: 6,
  },
];

export const INITIAL_APPROVAL_REQUESTS: CampaignApprovalRequest[] = [
  {
    id: "REQ-771",
    campaignName: "Google Search - Festive Dussehra Flight Sale",
    channel: "Google Ads",
    requestedBy: "Sameer Kapoor",
    requesterRole: "Performance Ads Lead",
    requestedAt: "2026-08-28 09:10",
    budgetRequestedINR: 350000,
    targetLaunchDate: "2026-09-05",
    status: "PENDING_APPROVAL",
    reviewNotes: "Awaiting approval for daily bid cap of ₹2,500 on Delhi-Goa and Mumbai-Kashmir flights.",
  },
  {
    id: "REQ-772",
    campaignName: "Meta Reel Ads - Luxury Houseboat Alleppey Promo",
    channel: "Meta Ads",
    requestedBy: "Ananya Sharma",
    requesterRole: "Head of Marketing",
    requestedAt: "2026-08-27 15:30",
    budgetRequestedINR: 180000,
    targetLaunchDate: "2026-09-01",
    status: "APPROVED",
    reviewedBy: "Vikram Malhotra",
    reviewedAt: "2026-08-27 18:00",
    reviewNotes: "Approved with ROAS target benchmark set at minimum 5.5x.",
  },
  {
    id: "REQ-773",
    campaignName: "Instagram Reel - Char Dham Helicopter VIP Express",
    channel: "Instagram Reel",
    requestedBy: "Rhea Sen",
    requesterRole: "Reels Content Creator",
    requestedAt: "2026-08-26 11:20",
    budgetRequestedINR: 65000,
    targetLaunchDate: "2026-08-29",
    status: "APPROVED",
    reviewedBy: "Ananya Sharma",
    reviewedAt: "2026-08-26 14:00",
    reviewNotes: "Viral hook checked and approved.",
  },
];
