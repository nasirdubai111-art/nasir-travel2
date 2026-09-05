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
];
