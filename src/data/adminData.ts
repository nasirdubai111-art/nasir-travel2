export interface AdminMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: string;
  color: string;
}

export interface LiveBookingRecord {
  id: string;
  pnr: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: "flights" | "trains" | "buses" | "hotels" | "resorts" | "tours" | "pilgrimage" | "cabs" | "dining" | "corporate";
  title: string;
  route: string;
  amount: number;
  convenienceFee: number;
  commissionEarned: number;
  taxAmount: number;
  paymentGateway: "Razorpay" | "PayU" | "Cashfree" | "UPI Direct" | "Corporate Credit";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  bookingStatus: "confirmed" | "ticket_issued" | "in_progress" | "cancelled" | "refund_processed";
  timestamp: string;
  device: "Android App" | "iOS App" | "Desktop Web" | "Mobile Web" | "Agent B2B Portal";
  city: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Kohinoor";
  walletBalance: number;
  yatraCoins: number;
  totalBookings: number;
  lifetimeValue: number;
  kycStatus: "verified" | "pending" | "unverified";
  accountStatus: "active" | "flagged" | "blocked";
  registeredDate: string;
  lastBookingDate: string;
}

export interface AgentRecord {
  id: string;
  agencyName: string;
  ownerName: string;
  iataNumber: string;
  irctcAgentId: string;
  gstin: string;
  city: string;
  state: string;
  creditLimit: number;
  creditUsed: number;
  walletBalance: number;
  monthlyGMV: number;
  commissionTier: "Gold (1.8%)" | "Platinum (2.5%)" | "Diamond (3.2%)";
  subAgentsCount: number;
  kycStatus: "approved" | "pending_review" | "suspended";
  rating: number;
}

export interface PartnerRecord {
  id: string;
  businessName: string;
  category: "Bus Fleet" | "Hotel Chain" | "Resort Property" | "Cab Fleet" | "Tour Operator" | "Highway Dhaba";
  ownerName: string;
  contactNumber: string;
  city: string;
  inventoryCount: number;
  totalBookingsMonth: number;
  payoutPending: number;
  commissionRate: string;
  slaScore: number;
  verificationStatus: "verified" | "under_inspection" | "blacklisted";
}

export interface SupportTicket {
  id: string;
  pnr: string;
  customerName: string;
  category: "Flight Reschedule" | "Train PNR Waitlist Refund" | "Hotel Check-in Issue" | "Dhaba Food Quality" | "Cab Driver No-show" | "Payment Failed Money Debited";
  priority: "urgent" | "high" | "medium" | "low";
  status: "open" | "assigned" | "resolved" | "escalated";
  assignedTo: string;
  createdTime: string;
  slaDeadline: string;
  lastMessage: string;
}

export interface AuditLog {
  id: string;
  adminUser: string;
  role: "Super Admin" | "Finance Officer" | "Ops Executive" | "Fraud Auditor";
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "warning" | "failed";
}

export interface ApiHealthMetric {
  service: string;
  provider: string;
  status: "operational" | "degraded" | "outage";
  latencyMs: number;
  uptime24h: number;
  errorRate: number;
  lastChecked: string;
}

export const ADMIN_STATS_DATA: AdminMetric[] = [
  {
    title: "Gross Merchandise Value (GMV)",
    value: "₹84.62 Cr",
    change: "+18.4% vs last month",
    isPositive: true,
    subtext: "Current Fiscal Run-rate ₹1,015 Cr",
    icon: "TrendingUp",
    color: "emerald",
  },
  {
    title: "Net Platform Revenue",
    value: "₹6.48 Cr",
    change: "+22.1% MoM",
    isPositive: true,
    subtext: "Commission + Fees + Markups",
    icon: "CreditCard",
    color: "indigo",
  },
  {
    title: "Confirmed Daily Bookings",
    value: "142,890",
    change: "+12.8% vs yesterday",
    isPositive: true,
    subtext: "99.82% Auto-confirmation Rate",
    icon: "Ticket",
    color: "amber",
  },
  {
    title: "Active B2B Agent Network",
    value: "18,450",
    change: "+640 new onboarded",
    isPositive: true,
    subtext: "Covering 480+ Tier-2/3/4 Towns",
    icon: "UserCheck",
    color: "blue",
  },
  {
    title: "Payment Gateway Success Rate",
    value: "99.41%",
    change: "+0.18% system health",
    isPositive: true,
    subtext: "Avg UPI Confirmation 1.2s",
    icon: "ShieldCheck",
    color: "emerald",
  },
  {
    title: "Active Support Tickets SLA",
    value: "96.8%",
    change: "Avg Resolution 4.2 mins",
    isPositive: true,
    subtext: "14 tickets under live triage",
    icon: "Headphones",
    color: "purple",
  },
];

export const LIVE_BOOKING_RECORDS: LiveBookingRecord[] = [
  {
    id: "BK-FL-8821",
    pnr: "6E-DEL-BOM-9102",
    customerName: "Rajesh K. Sharma",
    customerPhone: "+91 98112 45890",
    serviceCategory: "flights",
    title: "IndiGo 6E-2041 New Delhi to Mumbai",
    route: "DEL ➔ BOM",
    amount: 5490,
    convenienceFee: 249,
    commissionEarned: 180,
    taxAmount: 275,
    paymentGateway: "Razorpay",
    paymentStatus: "paid",
    bookingStatus: "ticket_issued",
    timestamp: "2 mins ago",
    device: "Android App",
    city: "New Delhi",
  },
  {
    id: "BK-TR-5542",
    pnr: "284-9182736",
    customerName: "Sunita Mahajan",
    customerPhone: "+91 94191 88321",
    serviceCategory: "trains",
    title: "Vande Bharat Express (22436) Executive Chair",
    route: "NDLS ➔ BSB (Varanasi)",
    amount: 3240,
    convenienceFee: 30,
    commissionEarned: 45,
    taxAmount: 162,
    paymentGateway: "UPI Direct",
    paymentStatus: "paid",
    bookingStatus: "ticket_issued",
    timestamp: "4 mins ago",
    device: "Desktop Web",
    city: "Varanasi",
  },
  {
    id: "BK-HT-1290",
    pnr: "ITC-MUM-4491",
    customerName: "Vikramaditya Rao",
    customerPhone: "+91 98450 12390",
    serviceCategory: "hotels",
    title: "ITC Grand Central Parel Mumbai (Luxury Suite)",
    route: "Mumbai (2 Nights)",
    amount: 19800,
    convenienceFee: 0,
    commissionEarned: 2376,
    taxAmount: 3564,
    paymentGateway: "Corporate Credit",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    timestamp: "7 mins ago",
    device: "Agent B2B Portal",
    city: "Mumbai",
  },
  {
    id: "BK-BS-9321",
    pnr: "SRS-BLR-GOA-71",
    customerName: "Arunachalam S.",
    customerPhone: "+91 97890 54321",
    serviceCategory: "buses",
    title: "SRS Travels Multi-Axle Volvo Sleeper",
    route: "Bengaluru ➔ Goa (Panaji)",
    amount: 1450,
    convenienceFee: 40,
    commissionEarned: 130,
    taxAmount: 72,
    paymentGateway: "PayU",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    timestamp: "11 mins ago",
    device: "Mobile Web",
    city: "Bengaluru",
  },
  {
    id: "BK-YA-7712",
    pnr: "CDY-HAR-KED-88",
    customerName: "Rameshwar Prasad Pandey",
    customerPhone: "+91 99350 77123",
    serviceCategory: "pilgrimage",
    title: "Kedarnath & Badrinath Helicopter Pilgrimage Package",
    route: "Dehradun ➔ Kedarnath ➔ Badrinath",
    amount: 72000,
    convenienceFee: 150,
    commissionEarned: 7200,
    taxAmount: 3600,
    paymentGateway: "Cashfree",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    timestamp: "16 mins ago",
    device: "Desktop Web",
    city: "Haridwar",
  },
  {
    id: "BK-CB-3391",
    pnr: "CAB-DEL-AGR-40",
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 98200 99451",
    serviceCategory: "cabs",
    title: "Outstation Sedan: Delhi Airport to Agra Taj Mahal",
    route: "IGI Airport ➔ Agra",
    amount: 3499,
    convenienceFee: 25,
    commissionEarned: 350,
    taxAmount: 175,
    paymentGateway: "UPI Direct",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    timestamp: "21 mins ago",
    device: "Android App",
    city: "New Delhi",
  },
  {
    id: "BK-DN-6610",
    pnr: "PNR-12301-MEAL",
    customerName: "Pooja Hegde",
    customerPhone: "+91 98860 11920",
    serviceCategory: "dining",
    title: "IRCTC Train Seat Delivery: Haldiram Special Thali",
    route: "Kanpur Central (Coach B4-42)",
    amount: 380,
    convenienceFee: 15,
    commissionEarned: 57,
    taxAmount: 19,
    paymentGateway: "UPI Direct",
    paymentStatus: "paid",
    bookingStatus: "ticket_issued",
    timestamp: "28 mins ago",
    device: "Android App",
    city: "Kanpur",
  },
];

export const CUSTOMER_DATABASE: CustomerRecord[] = [
  {
    id: "CUST-901",
    name: "Rajesh K. Sharma",
    email: "rajesh.sharma@tcs.com",
    phone: "+91 98112 45890",
    city: "New Delhi",
    loyaltyTier: "Kohinoor",
    walletBalance: 4850,
    yatraCoins: 6200,
    totalBookings: 42,
    lifetimeValue: 384500,
    kycStatus: "verified",
    accountStatus: "active",
    registeredDate: "12 Jan 2024",
    lastBookingDate: "Today",
  },
  {
    id: "CUST-902",
    name: "Priya V. Iyer",
    email: "priya.iyer@gmail.com",
    phone: "+91 98410 77621",
    city: "Chennai",
    loyaltyTier: "Platinum",
    walletBalance: 2400,
    yatraCoins: 3150,
    totalBookings: 28,
    lifetimeValue: 215000,
    kycStatus: "verified",
    accountStatus: "active",
    registeredDate: "05 Mar 2024",
    lastBookingDate: "Yesterday",
  },
  {
    id: "CUST-903",
    name: "Amitabh Sen",
    email: "amitabh.sen@wipro.com",
    phone: "+91 98300 44210",
    city: "Kolkata",
    loyaltyTier: "Gold",
    walletBalance: 1200,
    yatraCoins: 1800,
    totalBookings: 19,
    lifetimeValue: 142000,
    kycStatus: "verified",
    accountStatus: "active",
    registeredDate: "18 Jun 2024",
    lastBookingDate: "3 days ago",
  },
  {
    id: "CUST-904",
    name: "Gurpreet Singh Bhasin",
    email: "gurpreet.bhasin@outlook.com",
    phone: "+91 98765 12098",
    city: "Amritsar",
    loyaltyTier: "Silver",
    walletBalance: 850,
    yatraCoins: 950,
    totalBookings: 11,
    lifetimeValue: 68000,
    kycStatus: "verified",
    accountStatus: "active",
    registeredDate: "02 Sep 2024",
    lastBookingDate: "5 days ago",
  },
  {
    id: "CUST-905",
    name: "Dr. Arvind Kulkarni",
    email: "dr.kulkarni@apollohospitals.com",
    phone: "+91 98220 88912",
    city: "Pune",
    loyaltyTier: "Kohinoor",
    walletBalance: 9200,
    yatraCoins: 14800,
    totalBookings: 64,
    lifetimeValue: 592000,
    kycStatus: "verified",
    accountStatus: "active",
    registeredDate: "15 Oct 2023",
    lastBookingDate: "Today",
  },
];

export const AGENT_B2B_RECORDS: AgentRecord[] = [
  {
    id: "AGT-101",
    agencyName: "Shree Ganesh World Travels",
    ownerName: "Mahesh Chandra Agrawal",
    iataNumber: "IATA-1430981",
    irctcAgentId: "IRCTC-PA-7721",
    gstin: "07AAACG8812K1Z8",
    city: "New Delhi (Connaught Place)",
    state: "Delhi",
    creditLimit: 500000,
    creditUsed: 142000,
    walletBalance: 84500,
    monthlyGMV: 4850000,
    commissionTier: "Diamond (3.2%)",
    subAgentsCount: 14,
    kycStatus: "approved",
    rating: 4.9,
  },
  {
    id: "AGT-102",
    agencyName: "Venkateshwara Holiday Crafters",
    ownerName: "K. Subramaniam",
    iataNumber: "IATA-1498723",
    irctcAgentId: "IRCTC-PA-9932",
    gstin: "33AAECV9941M1ZF",
    city: "Tirupati",
    state: "Andhra Pradesh",
    creditLimit: 350000,
    creditUsed: 89000,
    walletBalance: 42000,
    monthlyGMV: 3120000,
    commissionTier: "Platinum (2.5%)",
    subAgentsCount: 8,
    kycStatus: "approved",
    rating: 4.8,
  },
  {
    id: "AGT-103",
    agencyName: "Kashi Vishwanath Yatra Sewa",
    ownerName: "Pandit Ramakant Tripathi",
    iataNumber: "IATA-Non-IATA",
    irctcAgentId: "IRCTC-PA-4410",
    gstin: "09AAKPT3321N1ZH",
    city: "Varanasi",
    state: "Uttar Pradesh",
    creditLimit: 200000,
    creditUsed: 45000,
    walletBalance: 31000,
    monthlyGMV: 1950000,
    commissionTier: "Gold (1.8%)",
    subAgentsCount: 5,
    kycStatus: "approved",
    rating: 4.9,
  },
];

export const PARTNER_ECOSYSTEM_RECORDS: PartnerRecord[] = [
  {
    id: "PTR-BUS-01",
    businessName: "SRS & VRL Luxury Intercity Fleets",
    category: "Bus Fleet",
    ownerName: "Anand Shankaran",
    contactNumber: "+91 80 2671 9000",
    city: "Bengaluru",
    inventoryCount: 420,
    totalBookingsMonth: 14800,
    payoutPending: 842000,
    commissionRate: "9.0% Flat",
    slaScore: 98.4,
    verificationStatus: "verified",
  },
  {
    id: "PTR-HTL-02",
    businessName: "Taj & Vivanta Heritage Palaces",
    category: "Hotel Chain",
    ownerName: "IHCL Group",
    contactNumber: "+91 22 6665 3366",
    city: "Mumbai / Jaipur",
    inventoryCount: 850,
    totalBookingsMonth: 6200,
    payoutPending: 3450000,
    commissionRate: "14.5% Net",
    slaScore: 99.6,
    verificationStatus: "verified",
  },
  {
    id: "PTR-DHB-03",
    businessName: "Murthal Haveli & Sukhdev Dhaba",
    category: "Highway Dhaba",
    ownerName: "Amrik Singh Sukhdev",
    contactNumber: "+91 130 247 5500",
    city: "Murthal (NH-44)",
    inventoryCount: 65,
    totalBookingsMonth: 29400,
    payoutPending: 198000,
    commissionRate: "12.0% on pre-orders",
    slaScore: 97.2,
    verificationStatus: "verified",
  },
  {
    id: "PTR-CAB-04",
    businessName: "Mega Cabs Outstation & EV Fleet",
    category: "Cab Fleet",
    ownerName: "Kunwar Deep Singh",
    contactNumber: "+91 11 4141 4141",
    city: "New Delhi / NCR",
    inventoryCount: 280,
    totalBookingsMonth: 9800,
    payoutPending: 420000,
    commissionRate: "10.0% Flat",
    slaScore: 96.8,
    verificationStatus: "verified",
  },
];

export const SUPPORT_TICKETS_QUEUE: SupportTicket[] = [
  {
    id: "TCK-8812",
    pnr: "6E-DEL-BOM-9102",
    customerName: "Rajesh K. Sharma",
    category: "Flight Reschedule",
    priority: "urgent",
    status: "assigned",
    assignedTo: "Kavita R. (Senior Travel Desk)",
    createdTime: "12 mins ago",
    slaDeadline: "18 mins remaining",
    lastMessage: "Customer requested next available 04:00 PM flight due to client meeting shift.",
  },
  {
    id: "TCK-8813",
    pnr: "284-9182736",
    customerName: "Pooja Hegde",
    category: "Payment Failed Money Debited",
    priority: "high",
    status: "open",
    assignedTo: "Auto-Reconciliation Engine",
    createdTime: "24 mins ago",
    slaDeadline: "36 mins remaining",
    lastMessage: "Bank UPI transaction debited ₹3,240, PNR generated automatically on retry.",
  },
  {
    id: "TCK-8814",
    pnr: "SRS-BLR-GOA-71",
    customerName: "Arunachalam S.",
    category: "Cab Driver No-show",
    priority: "medium",
    status: "resolved",
    assignedTo: "Rohan V.",
    createdTime: "1 hr ago",
    slaDeadline: "Completed in 8 mins",
    lastMessage: "Backup EV Sedan dispatched with ₹150 complimentary wallet cashback.",
  },
];

export const AUDIT_LOGS_STREAM: AuditLog[] = [
  {
    id: "AUD-4401",
    adminUser: "superadmin@bharatyatra.in",
    role: "Super Admin",
    action: "Surge pricing override disabled on Delhi-Varanasi Vande Bharat route",
    target: "Dynamic Pricing Engine",
    ipAddress: "103.21.144.12",
    timestamp: "10 mins ago",
    status: "success",
  },
  {
    id: "AUD-4402",
    adminUser: "finance.manager@bharatyatra.in",
    role: "Finance Officer",
    action: "Approved batch payout of ₹1.42 Cr to 284 Hotel & Bus Partners",
    target: "HDFC Escrow Payout API",
    ipAddress: "103.21.144.18",
    timestamp: "32 mins ago",
    status: "success",
  },
  {
    id: "AUD-4403",
    adminUser: "ops.lead@bharatyatra.in",
    role: "Ops Executive",
    action: "Updated IRCTC DLT SMS template for Tatkal confirmation alerts",
    target: "Notification Engine",
    ipAddress: "103.21.144.22",
    timestamp: "1 hr ago",
    status: "success",
  },
];

export const API_HEALTH_METRICS: ApiHealthMetric[] = [
  {
    service: "IRCTC Next-Gen Rail Engine",
    provider: "CRIS / Indian Railways API",
    status: "operational",
    latencyMs: 142,
    uptime24h: 99.94,
    errorRate: 0.02,
    lastChecked: "Just now",
  },
  {
    service: "Amadeus / Sabre Global GDS",
    provider: "Airline NDC & GDS Direct",
    status: "operational",
    latencyMs: 220,
    uptime24h: 99.88,
    errorRate: 0.04,
    lastChecked: "Just now",
  },
  {
    service: "Razorpay / Cashfree UPI Multi-switch",
    provider: "NPCI / Multi-Bank Gateway",
    status: "operational",
    latencyMs: 85,
    uptime24h: 99.98,
    errorRate: 0.01,
    lastChecked: "Just now",
  },
  {
    service: "WhatsApp Business Interactive API",
    provider: "Meta Cloud API / Karix",
    status: "operational",
    latencyMs: 110,
    uptime24h: 99.91,
    errorRate: 0.03,
    lastChecked: "Just now",
  },
];
