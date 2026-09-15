export interface CrmLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  destination: string;
  category: string; // 'Flights' | 'Hotels' | 'Yatra' | 'Houseboats' | 'Resorts' | 'Buses' | 'Cabs'
  stage: "NEW_LEAD" | "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
  dealValue: number; // in INR
  aiScore: number; // 0-100
  intent: "HIGH" | "MEDIUM" | "LOW";
  assignedAgent: string;
  lastContacted: string;
  source: "WhatsApp Cloud" | "Meta Ad" | "Google Search" | "Organic SEO" | "Direct App" | "Telesales";
  notes: string;
}

export interface WhatsAppChatThread {
  id: string;
  leadId: string;
  customerName: string;
  phone: string;
  avatarUrl: string;
  categoryInterest: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  verified: boolean;
  status: "ACTIVE" | "PENDING_AGENT" | "BOT_AUTOMATED" | "RESOLVED";
  messages: {
    id: string;
    sender: "CUSTOMER" | "BOT" | "AGENT";
    text: string;
    timestamp: string;
    status: "sent" | "delivered" | "read";
    mediaUrl?: string;
    interactiveType?: "button_reply" | "list_selection";
  }[];
}

export interface AutomationDripFlow {
  id: string;
  title: string;
  triggerEvent: string;
  channel: "WhatsApp" | "Email" | "SMS" | "Omnichannel";
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  enrolledCount: number;
  openRate: number; // %
  conversionRate: number; // %
  revenueGenerated: number;
  steps: {
    stepNumber: number;
    delay: string;
    actionType: "SEND_WHATSAPP_TEMPLATE" | "SEND_DISCOUNT_VOUCHER" | "NOTIFY_AGENT_CALL" | "SEND_ITINERARY_PDF";
    previewText: string;
  }[];
}

export const CRM_LEADS_DATA: CrmLead[] = [
  {
    id: "LEAD-901",
    name: "Dr. Arvind Subramanian",
    phone: "+91 98401 23456",
    email: "arvind.subramanian@apollo.org",
    city: "Chennai",
    destination: "Kashmir Great Lakes & Gulmarg",
    category: "Resorts",
    stage: "NEGOTIATION",
    dealValue: 245000,
    aiScore: 96,
    intent: "HIGH",
    assignedAgent: "Priya Sharma",
    lastContacted: "10 mins ago",
    source: "WhatsApp Cloud",
    notes: "High net-worth family group (6 pax). Requested 5-star ski chalet + private heli-transfer.",
  },
  {
    id: "LEAD-902",
    name: "Meera & Siddharth Deshmukh",
    phone: "+91 98200 87654",
    email: "meera.deshmukh@tcs.com",
    city: "Mumbai",
    destination: "Alleppey Backwaters & Kumarakom",
    category: "Houseboats",
    stage: "PROPOSAL_SENT",
    dealValue: 180000,
    aiScore: 92,
    intent: "HIGH",
    assignedAgent: "Rohit Varma",
    lastContacted: "42 mins ago",
    source: "Meta Ad",
    notes: "Honeymoon couple. Interested in Luxury 2-bedroom Jacuzzi Houseboat + Ayurvedic spa resort.",
  },
  {
    id: "LEAD-903",
    name: "Col. Jagjit Singh (Retd.)",
    phone: "+91 94170 54321",
    email: "jagjit.singh.defence@gmail.com",
    city: "Chandigarh",
    destination: "Char Dham Yatra by Helicopter",
    category: "Yatra",
    stage: "QUALIFIED",
    dealValue: 480000,
    aiScore: 89,
    intent: "HIGH",
    assignedAgent: "Amit Joshi",
    lastContacted: "2 hours ago",
    source: "Google Search",
    notes: "Elderly parents pilgrimage package. VIP Darshan passes & priority medical escort requested.",
  },
  {
    id: "LEAD-904",
    name: "Vikram Rathore",
    phone: "+91 99280 11223",
    email: "vikram@rathoretextiles.in",
    city: "Jaipur",
    destination: "Goa B2B Annual Leadership Offsite",
    category: "Hotels",
    stage: "NEW_LEAD",
    dealValue: 650000,
    aiScore: 85,
    intent: "MEDIUM",
    assignedAgent: "Ananya Sen",
    lastContacted: "3 hours ago",
    source: "Telesales",
    notes: "Corporate retreat for 35 sales executives. Needs banquet hall + beachside dinner banquet.",
  },
  {
    id: "LEAD-905",
    name: "Ankita Banik",
    phone: "+91 98302 99887",
    email: "ankita.banik@iitkgp.ac.in",
    city: "Kolkata",
    destination: "Varanasi Ganga Aarti & Sarnath",
    category: "Tours",
    stage: "CLOSED_WON",
    dealValue: 64000,
    aiScore: 98,
    intent: "HIGH",
    assignedAgent: "Amit Joshi",
    lastContacted: "Yesterday",
    source: "Organic SEO",
    notes: "Booking confirmed via Razorpay Split. Private boat ride at Subah-e-Banaras booked.",
  },
  {
    id: "LEAD-906",
    name: "Karan Johar Group (Film Crew)",
    phone: "+91 98190 44556",
    email: "logistics@dharmafilms.in",
    city: "Mumbai",
    destination: "Leh-Ladakh Monastery & Pangong",
    category: "Cabs",
    stage: "NEGOTIATION",
    dealValue: 320000,
    aiScore: 94,
    intent: "HIGH",
    assignedAgent: "Priya Sharma",
    lastContacted: "4 hours ago",
    source: "Direct App",
    notes: "Requires 4 dedicated 4x4 Toyota Fortuners with oxygen cylinders for 8 days.",
  },
  {
    id: "LEAD-907",
    name: "Sunil Agarwal",
    phone: "+91 93310 77665",
    email: "sunil.agarwal@vedanta.res",
    city: "Bhubaneswar",
    destination: "Puri Jagannath VIP Darshan",
    category: "Yatra",
    stage: "CLOSED_WON",
    dealValue: 88000,
    aiScore: 95,
    intent: "HIGH",
    assignedAgent: "Amit Joshi",
    lastContacted: "1 day ago",
    source: "WhatsApp Cloud",
    notes: "Full payment received. Panda assistance and Mahaprasad delivery scheduled.",
  },
  {
    id: "LEAD-908",
    name: "Rhea Chawla",
    phone: "+91 98100 22334",
    email: "rhea.chawla@deloitte.com",
    city: "Gurugram",
    destination: "Andaman Scuba & Havelock Resort",
    category: "Resorts",
    stage: "PROPOSAL_SENT",
    dealValue: 145000,
    aiScore: 88,
    intent: "MEDIUM",
    assignedAgent: "Rohit Varma",
    lastContacted: "5 hours ago",
    source: "Meta Ad",
    notes: "Sent Beach Villa quotation with Makruzz catamaran tickets and PADI dive session.",
  },
];

export const WHATSAPP_THREADS_DATA: WhatsAppChatThread[] = [
  {
    id: "WA-TH-01",
    leadId: "LEAD-901",
    customerName: "Dr. Arvind Subramanian",
    phone: "+91 98401 23456",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    categoryInterest: "Gulmarg Luxury Resort + Heli Ski",
    unreadCount: 1,
    lastMessage: "Can we lock the Khyber Presidential Suite for 24-28 Dec?",
    lastTimestamp: "10:14 AM",
    verified: true,
    status: "ACTIVE",
    messages: [
      {
        id: "msg-101",
        sender: "BOT",
        text: "Namaste Dr. Subramanian! Welcome to BharatYatra Luxury Desk. We received your request for Gulmarg winter ski expedition.",
        timestamp: "09:45 AM",
        status: "read",
      },
      {
        id: "msg-102",
        sender: "CUSTOMER",
        text: "Yes, we are a family of 6. Need heated chalets and private ski instructors.",
        timestamp: "09:48 AM",
        status: "read",
      },
      {
        id: "msg-103",
        sender: "AGENT",
        text: "I have reserved the premier 3-bedroom Himalayan Chalet option with private fireplace and 24/7 butler.",
        timestamp: "10:02 AM",
        status: "read",
      },
      {
        id: "msg-104",
        sender: "CUSTOMER",
        text: "Can we lock the Khyber Presidential Suite for 24-28 Dec?",
        timestamp: "10:14 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "WA-TH-02",
    leadId: "LEAD-902",
    customerName: "Meera Deshmukh",
    phone: "+91 98200 87654",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    categoryInterest: "Alleppey Jacuzzi Houseboat",
    unreadCount: 0,
    lastMessage: "Thanks for the video preview! The chef menu looks fantastic.",
    lastTimestamp: "09:30 AM",
    verified: true,
    status: "BOT_AUTOMATED",
    messages: [
      {
        id: "msg-201",
        sender: "BOT",
        text: "Hello Meera! Here is the live walkthrough video of our Ultra-Luxury Kettuvalam Houseboat.",
        timestamp: "09:15 AM",
        status: "read",
        mediaUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "msg-202",
        sender: "CUSTOMER",
        text: "Thanks for the video preview! The chef menu looks fantastic.",
        timestamp: "09:30 AM",
        status: "read",
      },
    ],
  },
  {
    id: "WA-TH-03",
    leadId: "LEAD-903",
    customerName: "Col. Jagjit Singh",
    phone: "+91 94170 54321",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    categoryInterest: "Char Dham Helicopter Package",
    unreadCount: 2,
    lastMessage: "Is medical oxygen cylinder provided at Kedarnath base?",
    lastTimestamp: "08:50 AM",
    verified: true,
    status: "PENDING_AGENT",
    messages: [
      {
        id: "msg-301",
        sender: "CUSTOMER",
        text: "Good morning. We are reviewing the Dehradun helipad departure schedule.",
        timestamp: "08:42 AM",
        status: "read",
      },
      {
        id: "msg-302",
        sender: "CUSTOMER",
        text: "Is medical oxygen cylinder provided at Kedarnath base?",
        timestamp: "08:50 AM",
        status: "delivered",
      },
    ],
  },
];

export const AUTOMATION_DRIP_FLOWS_DATA: AutomationDripFlow[] = [
  {
    id: "FLOW-01",
    title: "Abandoned Flight / Hotel Cart Re-engagement",
    triggerEvent: "User drops off at checkout page after 15 minutes",
    channel: "WhatsApp",
    status: "ACTIVE",
    enrolledCount: 4210,
    openRate: 88.4,
    conversionRate: 14.8,
    revenueGenerated: 1845000,
    steps: [
      {
        stepNumber: 1,
        delay: "+15 minutes",
        actionType: "SEND_WHATSAPP_TEMPLATE",
        previewText: "Hi {{name}}, your itinerary to {{destination}} is on hold for 2 hours. Tap below to resume with 5% off.",
      },
      {
        stepNumber: 2,
        delay: "+2 hours",
        actionType: "SEND_DISCOUNT_VOUCHER",
        previewText: "Exclusive Promo: Use CODE 'BHARATFLY500' to save ₹500 before midnight.",
      },
      {
        stepNumber: 3,
        delay: "+24 hours",
        actionType: "NOTIFY_AGENT_CALL",
        previewText: "Trigger outbound telesales callback request if cart value > ₹25,000.",
      },
    ],
  },
  {
    id: "FLOW-02",
    title: "Post-Booking VIP Concierge & Upsell",
    triggerEvent: "Booking status changes to CONFIRMED",
    channel: "Omnichannel",
    status: "ACTIVE",
    enrolledCount: 12940,
    openRate: 94.2,
    conversionRate: 28.5,
    revenueGenerated: 4280000,
    steps: [
      {
        stepNumber: 1,
        delay: "Immediate (T=0)",
        actionType: "SEND_ITINERARY_PDF",
        previewText: "Send official PDF PNR Pass with Dynamic QR Code and Google Calendar Sync link via WhatsApp & Email.",
      },
      {
        stepNumber: 2,
        delay: "24h before travel",
        actionType: "SEND_WHATSAPP_TEMPLATE",
        previewText: "Airport cab pickup reminder + option to pre-book verified airport electric taxi with zero surge.",
      },
      {
        stepNumber: 3,
        delay: "Day of check-in",
        actionType: "SEND_DISCOUNT_VOUCHER",
        previewText: "Curated dining coupon: 15% off at heritage partner restaurants near your hotel.",
      },
    ],
  },
  {
    id: "FLOW-03",
    title: "Pilgrimage Yatra Pre-Departure Health Checklist",
    triggerEvent: "User books Yatra category (Amarnath/Char Dham/Vaishno Devi)",
    channel: "WhatsApp",
    status: "ACTIVE",
    enrolledCount: 3820,
    openRate: 96.1,
    conversionRate: 41.2,
    revenueGenerated: 920000,
    steps: [
      {
        stepNumber: 1,
        delay: "Immediate",
        actionType: "SEND_WHATSAPP_TEMPLATE",
        previewText: "Yatra Medical Certificate guidelines & mandatory biometric registration links.",
      },
      {
        stepNumber: 2,
        delay: "3 days prior",
        actionType: "SEND_ITINERARY_PDF",
        previewText: "Interactive packing checklist PDF & altitude acclimatization protocols.",
      },
    ],
  },
];
