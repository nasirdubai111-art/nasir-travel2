export interface ReelTemplate {
  id: string;
  title: string;
  category: string;
  aspectRatio: "9:16";
  durationSeconds: number;
  hookText: string;
  viralScore: number; // 0-100
  trendingAudio: string;
  viewsEstimated: string;
  scriptOutline: {
    timestamp: string;
    visualScene: string;
    overlayText: string;
    narration: string;
  }[];
}

export const REELS_TEMPLATES_DATA: ReelTemplate[] = [
  {
    id: "REEL-01",
    title: "Secret Floating Villa in Kerala Most Tourists Miss",
    category: "Houseboats & Resorts",
    aspectRatio: "9:16",
    durationSeconds: 22,
    hookText: "Stop booking ordinary hotels in Kerala until you see this! 🛶✨",
    viralScore: 97,
    trendingAudio: "Kerala Backwaters Chill Instrumental (Trending 42K reels)",
    viewsEstimated: "1.4M - 2.8M",
    scriptOutline: [
      {
        timestamp: "00:00 - 00:03",
        visualScene: "Aerial drone swoop down into emerald canal touching morning mist",
        overlayText: "POV: You found the secret Jacuzzi Houseboat in Alleppey 🌿",
        narration: "If you think Kerala is just regular boat tours, wait till you see this floating sanctuary.",
      },
      {
        timestamp: "00:04 - 00:10",
        visualScene: "Camera pans over master bedroom with glass ceiling and private jacuzzi",
        overlayText: "Glass roof + private chef onboard for ₹8,999/night 🍤",
        narration: "Private chef preparing fresh Karimeen Pollichathu, open-air jacuzzi, and uninterrupted sunset vibes.",
      },
      {
        timestamp: "00:11 - 00:18",
        visualScene: "Candlelit dinner deck under twilight stars on the lake",
        overlayText: "Direct booking with zero commission on BharatYatra App",
        narration: "Tag your favorite travel buddy who needs this peaceful escape right now.",
      },
      {
        timestamp: "00:19 - 00:22",
        visualScene: "BharatYatra phone mockup with verified PNR Pass & instant WhatsApp button",
        overlayText: "Comment 'KERALA' & our AI will DM you the exact secret location link! 📲",
        narration: "Download BharatYatra or click link in bio for instant verified availability.",
      },
    ],
  },
  {
    id: "REEL-02",
    title: "How to Do Char Dham by Helicopter Without Standing in Lines",
    category: "Yatra & Pilgrimage",
    aspectRatio: "9:16",
    durationSeconds: 26,
    hookText: "Do this ONE thing before taking your parents to Kedarnath! 🙏🚁",
    viralScore: 95,
    trendingAudio: "Namo Namo Ji Shankara (Sacred Acoustic Chants)",
    viewsEstimated: "850K - 1.9M",
    scriptOutline: [
      {
        timestamp: "00:00 - 00:04",
        visualScene: "Helicopter landing near snowy Kedarnath temple peaks with golden sunrise",
        overlayText: "Char Dham in 48 Hours: Complete VIP Guide for Senior Citizens 🚁",
        narration: "Taking elderly parents on Char Dham? Here is how to skip the 18km trek entirely.",
      },
      {
        timestamp: "00:05 - 00:14",
        visualScene: "Doctor checking oxygen levels in private heated waiting lounge",
        overlayText: "Medical oxygen + VIP Darshan lanyard included",
        narration: "BharatYatra Heli-pass gives priority gate entry, on-site medical doctors, and luxury Himalayan stays.",
      },
      {
        timestamp: "00:15 - 00:26",
        visualScene: "Emotional family receiving Prasad at Badrinath shrine",
        overlayText: "Seats filling fast for May-June 2026 batches",
        narration: "Bookings for the 2026 season are open on BharatYatra. Save this reel for your family planner!",
      },
    ],
  },
];
