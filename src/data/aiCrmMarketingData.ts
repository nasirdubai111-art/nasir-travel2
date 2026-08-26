export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: "Google Ads" | "Meta Ads" | "SEO Organic" | "WhatsApp" | "Website Form" | "Referral" | "CSV Import";
  stage: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  dealValue: number;
  aiScore: number; // 0 - 100
  qualification: "High Intent (BANT Qualified)" | "Warm Lead" | "Information Seeker" | "Unqualified";
  assignedRep: string;
  assignedRepAvatar: string;
  createdAt: string;
  lastContacted: string;
  nextFollowUp: string;
  tags: string[];
  notes: string[];
  aiRecommendation: string;
  verified: boolean;
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  status: "active" | "scheduled" | "draft" | "completed";
  audience: string;
  recipientsCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  sentDate: string;
  type: "newsletter" | "promo" | "drip_sequence" | "booking_reengagement";
}

export interface WhatsAppConversation {
  id: string;
  contactName: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  assignedAgent: string;
  status: "open" | "pending" | "resolved";
  isAiBotActive: boolean;
  messages: {
    id: string;
    sender: "user" | "agent" | "ai_bot";
    text: string;
    time: string;
    status: "sent" | "delivered" | "read";
  }[];
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  status: "APPROVED" | "PENDING" | "REJECTED";
  language: string;
  bodyText: string;
  buttonText?: string;
}

export interface SeoKeyword {
  id: string;
  keyword: string;
  currentRank: number;
  previousRank: number;
  searchVolume: number;
  difficulty: "Easy" | "Medium" | "Hard";
  intent: "Commercial" | "Transactional" | "Informational";
  targetUrl: string;
  aiOptimizationTip: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: "Google Ads" | "Meta Ads" | "LinkedIn" | "Travel Network";
  status: "active" | "paused" | "completed";
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  roas: number;
  utmCampaign: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  runsCount: number;
  successRate: number;
  aiOptimized: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "marketing_lead" | "sales_lead" | "seo_specialist";
  roleLabel: string;
  avatar: string;
  permissions: string[];
}

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "adm-1",
    name: "Vikram Malhotra",
    email: "vikram@yatra.ai",
    role: "super_admin",
    roleLabel: "Super Admin & Enterprise Controller",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    permissions: ["all", "ai_automation", "email", "whatsapp", "crm_sales", "seo", "marketing", "leads", "csv_tools", "analytics", "backend_security", "admin_management", "integrations"],
  },
  {
    id: "adm-2",
    name: "Ananya Sharma",
    email: "ananya.mktg@yatra.ai",
    role: "marketing_lead",
    roleLabel: "Digital Marketing & Growth Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    permissions: ["ai_automation", "email", "whatsapp", "marketing", "leads", "csv_tools", "analytics"],
  },
  {
    id: "adm-3",
    name: "Rajesh Kulkarni",
    email: "rajesh.sales@yatra.ai",
    role: "sales_lead",
    roleLabel: "Chief Commercial Officer & Sales Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    permissions: ["ai_automation", "crm_sales", "whatsapp", "leads", "csv_tools", "analytics"],
  },
  {
    id: "adm-4",
    name: "Priya Sundaram",
    email: "priya.seo@yatra.ai",
    role: "seo_specialist",
    roleLabel: "Technical SEO & Organic Acquisition Lead",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    permissions: ["seo", "marketing", "analytics", "csv_tools"],
  },
];

export const INITIAL_LEADS: CrmLead[] = [
  {
    id: "LEAD-10491",
    name: "Aditya Singhania",
    email: "aditya.s@tcs-consulting.com",
    phone: "+91 98201 44521",
    company: "TCS Enterprise Consulting",
    source: "Google Ads",
    stage: "proposal",
    dealValue: 485000,
    aiScore: 94,
    qualification: "High Intent (BANT Qualified)",
    assignedRep: "Rajesh Kulkarni",
    assignedRepAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    createdAt: "2026-08-20",
    lastContacted: "2026-08-25",
    nextFollowUp: "2026-08-27 (10:00 AM)",
    tags: ["Corporate Account", "Annual Flights & Stays", "High Value"],
    notes: ["Needs GST reconciliation for 45 monthly executives.", "Requested 12% corporate bulk credit terms."],
    aiRecommendation: "Send customized corporate GST travel tier proposal with ₹40k loyalty wallet credit bonus.",
    verified: true,
  },
  {
    id: "LEAD-10492",
    name: "Meera Krishnan",
    email: "meera.k@chennaitech.io",
    phone: "+91 94440 88219",
    company: "Chennai Tech Ventures",
    source: "WhatsApp",
    stage: "qualified",
    dealValue: 240000,
    aiScore: 88,
    qualification: "High Intent (BANT Qualified)",
    assignedRep: "Kavita Rao",
    assignedRepAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
    createdAt: "2026-08-22",
    lastContacted: "2026-08-24",
    nextFollowUp: "2026-08-26 (03:30 PM)",
    tags: ["Yatra Pilgrimage Group", "Varanasi VIP", "Char Dham"],
    notes: ["Inquiring for 18 seniors VIP helicopter passes to Kedarnath and Badrinath."],
    aiRecommendation: "Offer Kedarnath helipad priority slot + 4-Star heated cottage bundle.",
    verified: true,
  },
  {
    id: "LEAD-10493",
    name: "Rohan Varma",
    email: "rohan@varma-hospitality.com",
    phone: "+91 98110 55112",
    company: "Varma Resort Group",
    source: "SEO Organic",
    stage: "negotiation",
    dealValue: 720000,
    aiScore: 91,
    qualification: "High Intent (BANT Qualified)",
    assignedRep: "Rajesh Kulkarni",
    assignedRepAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    createdAt: "2026-08-18",
    lastContacted: "2026-08-25",
    nextFollowUp: "2026-08-28 (11:00 AM)",
    tags: ["B2B API Integration", "Luxury Houseboats", "Goa Stays"],
    notes: ["Integrating direct channel manager API for 8 boutique properties."],
    aiRecommendation: "Highlight 0% gateway commission promo for first 60 days to close this week.",
    verified: true,
  },
  {
    id: "LEAD-10494",
    name: "Dr. Sunita Deshmukh",
    email: "dr.sunita@puneortho.org",
    phone: "+91 98220 99410",
    company: "Maharashtra Medical Council",
    source: "Meta Ads",
    stage: "contacted",
    dealValue: 180000,
    aiScore: 76,
    qualification: "Warm Lead",
    assignedRep: "Kavita Rao",
    assignedRepAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
    createdAt: "2026-08-24",
    lastContacted: "2026-08-25",
    nextFollowUp: "2026-08-27 (02:00 PM)",
    tags: ["Medical Conference", "Kerala Stays", "Group Flights"],
    notes: ["Planning 3-day delegate retreat in Munnar with banquet."],
    aiRecommendation: "Send interactive PDF brochure for spice plantation wellness retreat.",
    verified: true,
  },
  {
    id: "LEAD-10495",
    name: "Harshavardhan Reddy",
    email: "reddy@hyderabad-infra.in",
    phone: "+91 99890 33411",
    company: "Deccan Infrastructure Ltd",
    source: "Website Form",
    stage: "new",
    dealValue: 350000,
    aiScore: 82,
    qualification: "High Intent (BANT Qualified)",
    assignedRep: "Amitabh Sen",
    assignedRepAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    createdAt: "2026-08-26",
    lastContacted: "Not Contacted",
    nextFollowUp: "2026-08-26 (Within 1 hr)",
    tags: ["Executive Fleet", "Intercity Cabs", "Monthly Retainer"],
    notes: ["Needs dedicated luxury EV cabs for senior management Hyderabad airport commute."],
    aiRecommendation: "Trigger automated instant WhatsApp greeting & schedule discovery call.",
    verified: true,
  },
  {
    id: "LEAD-10496",
    name: "Pooja Hegde",
    email: "pooja.h@blore-events.co",
    phone: "+91 97410 77209",
    company: "Bliss Destination Weddings",
    source: "Referral",
    stage: "won",
    dealValue: 1250000,
    aiScore: 99,
    qualification: "High Intent (BANT Qualified)",
    assignedRep: "Rajesh Kulkarni",
    assignedRepAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    createdAt: "2026-08-10",
    lastContacted: "2026-08-23",
    nextFollowUp: "2026-09-01 (Check-in)",
    tags: ["Destination Wedding", "Udaipur Palace", "Charter Flights"],
    notes: ["Advance deposit received ₹4.5L via NEFT.", "Confirmed 65 rooms at Lake Pichola."],
    aiRecommendation: "Enroll in VIP Concierge automated flight delay alert loop.",
    verified: true,
  },
];

export const INITIAL_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: "CAM-EM-101",
    title: "Diwali Corporate Travel Early-Bird Perk 2026",
    subject: "✨ Claim 18% Corporate GST Credits + ₹10,000 Group Travel Vouchers",
    status: "active",
    audience: "Corporate CXOs & Admin Managers (3,420 contacts)",
    recipientsCount: 3420,
    openRate: 44.8,
    clickRate: 18.2,
    bounceRate: 0.9,
    sentDate: "2026-08-24",
    type: "promo",
  },
  {
    id: "CAM-EM-102",
    title: "Autumn Char Dham & Jyotirlinga VIP Sugam Yatra",
    subject: "🚩 Sugam Darshan Passes & Kedarnath Heli-Seats Now Open",
    status: "active",
    audience: "Pilgrimage Enthusiasts & Senior Travelers (8,900 contacts)",
    recipientsCount: 8900,
    openRate: 52.1,
    clickRate: 24.6,
    bounceRate: 1.2,
    sentDate: "2026-08-22",
    type: "newsletter",
  },
  {
    id: "CAM-EM-103",
    title: "Abandoned Booking Recovery (Automated Drip)",
    subject: "✈️ Complete your flight to Bengaluru — your fare is locked for 4 hrs",
    status: "active",
    audience: "Triggered Real-Time Dropoffs (Past 24h)",
    recipientsCount: 1240,
    openRate: 63.4,
    clickRate: 31.8,
    bounceRate: 0.4,
    sentDate: "Ongoing Drip",
    type: "drip_sequence",
  },
  {
    id: "CAM-EM-104",
    title: "Winter Goa & Kerala Luxury Houseboat Stays",
    subject: "🌴 Private Pool Villas & Backwater Cruises at Exclusive Member Rates",
    status: "scheduled",
    audience: "High LTV Leisure Travelers (5,150 contacts)",
    recipientsCount: 5150,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    sentDate: "2026-08-29 (Scheduled)",
    type: "promo",
  },
];

export const INITIAL_WHATSAPP_CHATS: WhatsAppConversation[] = [
  {
    id: "WA-CHAT-1",
    contactName: "Vikrant Chauhan (CEO, FinEdge)",
    phone: "+91 98200 11984",
    lastMessage: "Can you send the GST proforma invoice for the 12 Mumbai-Delhi flights?",
    timestamp: "10:14 AM",
    unreadCount: 1,
    assignedAgent: "Rajesh Kulkarni",
    status: "open",
    isAiBotActive: false,
    messages: [
      { id: "m1", sender: "user", text: "Hi, need corporate booking for 12 execs to Delhi on Sep 4.", time: "09:45 AM", status: "read" },
      { id: "m2", sender: "ai_bot", text: "Hello Vikrant! We have reserved 12 Vistara Premium Economy seats. Total fare: ₹98,400 with 18% GST input credit eligible.", time: "09:46 AM", status: "read" },
      { id: "m3", sender: "user", text: "Can you send the GST proforma invoice for the 12 Mumbai-Delhi flights?", time: "10:14 AM", status: "read" },
    ],
  },
  {
    id: "WA-CHAT-2",
    contactName: "Sunita Iyer (Varanasi Yatra)",
    phone: "+91 94430 77123",
    lastMessage: "Thank you! The VIP Sugam passes QR codes are working on my phone.",
    timestamp: "09:30 AM",
    unreadCount: 0,
    assignedAgent: "Kavita Rao",
    status: "resolved",
    isAiBotActive: true,
    messages: [
      { id: "m1", sender: "user", text: "Where do we show our Kashi Vishwanath Sugam Darshan QR code?", time: "09:20 AM", status: "read" },
      { id: "m2", sender: "ai_bot", text: "Namaste Sunita ji! Please proceed to Gate No. 4 (Chhattadwar). Security will scan your verified digital pass.", time: "09:21 AM", status: "read" },
      { id: "m3", sender: "user", text: "Thank you! The VIP Sugam passes QR codes are working on my phone.", time: "09:30 AM", status: "read" },
    ],
  },
  {
    id: "WA-CHAT-3",
    contactName: "Kunal Bansal (Goa Vacation)",
    phone: "+91 98199 44332",
    lastMessage: "Does the Candolim beach resort package include private airport cab pickup?",
    timestamp: "Yesterday",
    unreadCount: 0,
    assignedAgent: "Amitabh Sen",
    status: "open",
    isAiBotActive: true,
    messages: [
      { id: "m1", sender: "user", text: "Does the Candolim beach resort package include private airport cab pickup?", time: "Yesterday 06:12 PM", status: "read" },
      { id: "m2", sender: "ai_bot", text: "Yes Kunal! All 4-Star luxury resort bookings on our platform include complimentary AC sedan airport pickup with flight delay tracking.", time: "Yesterday 06:13 PM", status: "read" },
    ],
  },
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "tpl_booking_conf_v2",
    name: "unified_booking_confirmation_v2",
    category: "UTILITY",
    status: "APPROVED",
    language: "en_US",
    bodyText: "✈️ Booking Confirmed! Your PNR is {{1}} for {{2}}. Download your boarding pass and GST invoice below.",
    buttonText: "View Digital Ticket",
  },
  {
    id: "tpl_lead_instant_nurture",
    name: "ai_instant_lead_response",
    category: "MARKETING",
    status: "APPROVED",
    language: "en_US",
    bodyText: "Namaste {{1}}! We received your travel enquiry for {{2}}. Our AI Travel Specialist has created an exclusive custom itinerary.",
    buttonText: "Open Custom Itinerary",
  },
  {
    id: "tpl_yatra_sugam_pass",
    name: "pilgrimage_sugam_darshan_pass",
    category: "UTILITY",
    status: "APPROVED",
    language: "en_US",
    bodyText: "🚩 Har Har Mahadev {{1}}! Your official VIP Sugam Darshan pass for {{2}} is confirmed for Slot {{3}}.",
    buttonText: "Download Gate Pass",
  },
];

export const INITIAL_SEO_KEYWORDS: SeoKeyword[] = [
  {
    id: "SEO-KW-1",
    keyword: "kedarnath helicopter booking 2026",
    currentRank: 1,
    previousRank: 3,
    searchVolume: 165000,
    difficulty: "Medium",
    intent: "Transactional",
    targetUrl: "https://yatra.ai/pilgrimage/kedarnath-heli",
    aiOptimizationTip: "Add updated 2026 DGCA biometric pass guidelines in H2 to maintain #1 snippet.",
  },
  {
    id: "SEO-KW-2",
    keyword: "corporate travel gst input invoice online",
    currentRank: 2,
    previousRank: 4,
    searchVolume: 42000,
    difficulty: "Easy",
    intent: "Commercial",
    targetUrl: "https://yatra.ai/corporate/gst-reconciliation",
    aiOptimizationTip: "Include downloadable sample RFC 4180 CSV schema table for faster rich snippet indexing.",
  },
  {
    id: "SEO-KW-3",
    keyword: "luxury kerala houseboat booking alleppey",
    currentRank: 3,
    previousRank: 2,
    searchVolume: 89000,
    difficulty: "Medium",
    intent: "Transactional",
    targetUrl: "https://yatra.ai/houseboats/alleppey-luxury",
    aiOptimizationTip: "Improve mobile Core Web Vitals LCP by preloading WebP 360 virtual cabin tour images.",
  },
  {
    id: "SEO-KW-4",
    keyword: "vande bharat express ticket booking instant",
    currentRank: 4,
    previousRank: 6,
    searchVolume: 320000,
    difficulty: "Hard",
    intent: "Transactional",
    targetUrl: "https://yatra.ai/trains/vande-bharat",
    aiOptimizationTip: "Embed live seat availability widget schema (JSON-LD Reservation) to show real-time badges.",
  },
  {
    id: "SEO-KW-5",
    keyword: "kashi vishwanath sugam darshan booking online",
    currentRank: 1,
    previousRank: 1,
    searchVolume: 110000,
    difficulty: "Medium",
    intent: "Transactional",
    targetUrl: "https://yatra.ai/pilgrimage/varanasi-sugam",
    aiOptimizationTip: "Dominating featured snippet and voice search query with 99.4% intent accuracy.",
  },
];

export const INITIAL_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "MKT-CAMP-01",
    name: "Google Search — Corporate Travel & GST Savings",
    platform: "Google Ads",
    status: "active",
    budget: 150000,
    spend: 112400,
    impressions: 245000,
    clicks: 14820,
    conversions: 890,
    cpa: 126.29,
    roas: 6.8,
    utmCampaign: "corp_gst_search_q3",
  },
  {
    id: "MKT-CAMP-02",
    name: "Meta Reels — Luxury Stays & Weekend Villas",
    platform: "Meta Ads",
    status: "active",
    budget: 120000,
    spend: 94500,
    impressions: 890000,
    clicks: 31200,
    conversions: 1240,
    cpa: 76.2,
    roas: 5.4,
    utmCampaign: "meta_reels_luxury_villas",
  },
  {
    id: "MKT-CAMP-03",
    name: "LinkedIn B2B — Corporate Travel Desk Outreach",
    platform: "LinkedIn",
    status: "active",
    budget: 80000,
    spend: 61000,
    impressions: 98000,
    clicks: 3450,
    conversions: 210,
    cpa: 290.47,
    roas: 8.2,
    utmCampaign: "linkedin_cxo_travel_desk",
  },
  {
    id: "MKT-CAMP-04",
    name: "Google Performance Max — Kedarnath & Varanasi Yatras",
    platform: "Google Ads",
    status: "active",
    budget: 200000,
    spend: 184000,
    impressions: 1420000,
    clicks: 68400,
    conversions: 3890,
    cpa: 47.3,
    roas: 9.6,
    utmCampaign: "pmax_sacred_yatras_2026",
  },
];

export const INITIAL_AUTOMATION_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: "WF-01",
    name: "Instant AI Lead Scoring & Priority Rep Assignment",
    trigger: "New Lead Ingested (Any Source)",
    condition: "AI Score >= 80 (High Intent)",
    action: "Assign to Senior Sales Lead + Dispatch WhatsApp Greeting within 45s",
    isActive: true,
    runsCount: 1428,
    successRate: 99.2,
    aiOptimized: true,
  },
  {
    id: "WF-02",
    name: "High Value B2B Corporate Nurturing Drip",
    trigger: "Lead Stage = 'Proposal Sent'",
    condition: "Deal Value > ₹2,00,000 AND No Reply after 48h",
    action: "Send AI-crafted GST savings breakdown + Schedule Calendar slot",
    isActive: true,
    runsCount: 382,
    successRate: 98.6,
    aiOptimized: true,
  },
  {
    id: "WF-03",
    name: "Pilgrimage Yatra Sugam Pass Reminder & Weather Alert",
    trigger: "Yatra Booking Confirmed",
    condition: "T-24 Hours before Darshan Slot",
    action: "Send WhatsApp Gate QR + Live Himalayan Altitude Weather Update",
    isActive: true,
    runsCount: 5620,
    successRate: 99.8,
    aiOptimized: true,
  },
  {
    id: "WF-04",
    name: "Abandoned Search Cart Win-Back Sequence",
    trigger: "Search Checkout Incomplete",
    condition: "Cart Abandoned for 30 mins",
    action: "Send Email with 5% Instant Promo Code + Lock Seat Price for 2 hrs",
    isActive: true,
    runsCount: 2940,
    successRate: 97.4,
    aiOptimized: true,
  },
];

export const INTEGRATION_SERVICES = [
  {
    id: "svc_gemini",
    name: "Google Gemini 2.5 Enterprise AI",
    category: "AI & Automation",
    status: "CONNECTED",
    endpoint: "https://generativelanguage.googleapis.com/v1beta",
    features: ["Predictive Lead Scoring", "Smart WhatsApp Bot", "Content Generation", "SEO Optimization"],
    ping: "42ms",
    secured: true,
  },
  {
    id: "svc_whatsapp",
    name: "WhatsApp Cloud Business API (Meta)",
    category: "Messaging & CRM",
    status: "CONNECTED",
    endpoint: "https://graph.facebook.com/v21.0",
    features: ["Interactive Messages", "Template Webhooks", "Broadcast Delivery", "Agent Handoff"],
    ping: "78ms",
    secured: true,
  },
  {
    id: "svc_email",
    name: "SendGrid / AWS SES Enterprise Mail Relay",
    category: "Email Marketing",
    status: "CONNECTED",
    endpoint: "https://api.sendgrid.com/v3/mail/send",
    features: ["High Deliverability", "Drip Scheduling", "Real-time Webhook Open/Click Tracking"],
    ping: "65ms",
    secured: true,
  },
  {
    id: "svc_google_ads",
    name: "Google Ads & Analytics 4 API",
    category: "Digital Marketing",
    status: "CONNECTED",
    endpoint: "https://googleads.googleapis.com/v17",
    features: ["Conversions Upload", "CPA Sync", "ROAS Automation", "Audience Sync"],
    ping: "92ms",
    secured: true,
  },
  {
    id: "svc_meta_ads",
    name: "Meta Ads Graph API (Facebook & Instagram)",
    category: "Digital Marketing",
    status: "CONNECTED",
    endpoint: "https://graph.facebook.com/v21.0/act_campaigns",
    features: ["Lead Gen Webhooks", "Custom Audiences", "Instant Retargeting"],
    ping: "84ms",
    secured: true,
  },
  {
    id: "svc_seo",
    name: "Google Search Console & Organic Rank Crawler",
    category: "SEO & Content",
    status: "CONNECTED",
    endpoint: "https://searchconsole.googleapis.com/v1",
    features: ["Daily Keyword Ranking", "Core Web Vitals Telemetry", "Indexation Status"],
    ping: "110ms",
    secured: true,
  },
];
