export interface NotificationChannelMessage {
  id: string;
  channel: "whatsapp" | "sms" | "email" | "push";
  title: string;
  sender: string;
  preview: string;
  timestamp: string;
  pnr?: string;
  type: "booking_confirmed" | "payment_success" | "refund_credited" | "train_platform" | "flight_gate" | "price_drop" | "dhaba_ready";
  details: {
    serviceName: string;
    amount?: number;
    route?: string;
    time?: string;
    seatOrRoom?: string;
    platformOrGate?: string;
    refundAmount?: number;
    originalPrice?: number;
    newPrice?: number;
  };
  actions?: { label: string; actionType: string; url?: string }[];
}

export const NOTIFICATION_STREAM_DATA: NotificationChannelMessage[] = [
  {
    id: "NOTIF-WA-01",
    channel: "whatsapp",
    title: "BharatYatra Official Ticket Bot",
    sender: "BharatYatra Verified (+91 99000 88222)",
    preview: " Namaste Rajesh! Your Vande Bharat Express (22436) Executive Chair ticket is CONFIRMED. PNR: 284-9182736.",
    timestamp: "10 mins ago",
    pnr: "284-9182736",
    type: "booking_confirmed",
    details: {
      serviceName: "Vande Bharat Express (22436)",
      route: "New Delhi (NDLS) ➔ Varanasi (BSB)",
      time: "28 Aug 2026, 06:00 AM",
      seatOrRoom: "Coach E1, Seat 18 (Window View)",
      amount: 3240,
    },
    actions: [
      { label: " View Boarding Pass", actionType: "view_ticket" },
      { label: " Download PDF Tax Invoice", actionType: "download_pdf" },
      { label: " Live Train Platform Status", actionType: "track_train" },
      { label: " Pre-order Satvik Meal", actionType: "order_food" },
    ],
  },
  {
    id: "NOTIF-SMS-02",
    channel: "sms",
    title: "DLT Registered SMS",
    sender: "VK-BYATRA (Govt. DLT Portal)",
    preview: "BYATRA: Payment of Rs. 5,490 received for IndiGo 6E-2041 DEL-BOM. PNR: 6E-DEL-BOM-9102. Gate 34B, IGI T3. Happy Journey!",
    timestamp: "25 mins ago",
    pnr: "6E-DEL-BOM-9102",
    type: "payment_success",
    details: {
      serviceName: "IndiGo 6E-2041",
      route: "DEL ➔ BOM",
      time: "Today, 02:40 PM",
      seatOrRoom: "Seat 4F (Extra Legroom)",
      platformOrGate: "Terminal 3, Gate 34B",
      amount: 5490,
    },
  },
  {
    id: "NOTIF-PUSH-03",
    channel: "push",
    title: "Platform & Coach Position Alert",
    sender: "BharatYatra Live Travel Radar",
    preview: " Train 22436 arriving on Platform #16 at New Delhi Station in 35 mins. Coach E1 is near Engine Escalator.",
    timestamp: "45 mins ago",
    type: "train_platform",
    details: {
      serviceName: "Vande Bharat Express (22436)",
      platformOrGate: "Platform #16 (NDLS Paharganj side)",
      seatOrRoom: "Coach E1 Position #4 from Engine",
    },
    actions: [
      { label: "Open Station Navigation", actionType: "station_map" },
    ],
  },
  {
    id: "NOTIF-WA-04",
    channel: "whatsapp",
    title: "Highway Dhaba Express Pre-Order Ready",
    sender: "BharatYatra Highway Food (+91 99000 88222)",
    preview: " Amrik Sukhdev Murthal: Your Order #BY-8821 (Special Amritsari Kulcha & Sweet Lassi) is HOT & READY at Express Counter #3.",
    timestamp: "1 hr ago",
    type: "dhaba_ready",
    details: {
      serviceName: "Amrik Sukhdev Haveli (NH-44)",
      route: "Express Drive-Through Counter #3",
      amount: 480,
    },
    actions: [
      { label: "Show Digital Pickup Token", actionType: "pickup_token" },
    ],
  },
  {
    id: "NOTIF-EMAIL-05",
    channel: "email",
    title: "GST Tax Invoice & E-Ticket (IRN Generated)",
    sender: "billing@bharatyatra.in",
    preview: "Dear Traveler, thank you for booking with BharatYatra. Attached is your official GST Tax Invoice INV-2026-8812 with full 18% Input Tax Credit breakdown.",
    timestamp: "2 hrs ago",
    type: "payment_success",
    details: {
      serviceName: "ITC Grand Central Parel Corporate Stay",
      amount: 19800,
    },
    actions: [
      { label: "Download Formally Signed Invoice PDF", actionType: "download_pdf" },
    ],
  },
  {
    id: "NOTIF-PUSH-06",
    channel: "push",
    title: "Price Drop Alert: Delhi ➔ Srinagar Flights",
    sender: "BharatYatra Smart Price Watch",
    preview: " Fares dropped by 24% for your saved route! IndiGo & SpiceJet now starting at ₹3,890 (was ₹5,200).",
    timestamp: "3 hrs ago",
    type: "price_drop",
    details: {
      serviceName: "Delhi to Srinagar Non-stop",
      originalPrice: 5200,
      newPrice: 3890,
    },
    actions: [
      { label: "Book at Lowest Fare", actionType: "book_flight" },
    ],
  },
];
