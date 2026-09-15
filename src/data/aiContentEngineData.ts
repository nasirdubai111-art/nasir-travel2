export interface AiMarketingTool {
  id: string;
  name: string;
  description: string;
  category: "Copywriting" | "SEO" | "Social" | "Email" | "Multi-lingual";
  samplePrompt: string;
  defaultOutput: string;
}

export const AI_CONTENT_TOOLS: AiMarketingTool[] = [
  {
    id: "TOOL-01",
    name: "Destination Bio & Luxury Itinerary Drafter",
    description: "Generates sensory-rich, culturally grounded travel overviews with day-wise schedules.",
    category: "Copywriting",
    samplePrompt: "Create a 3-day luxury itinerary for Manali & Solang Valley focusing on apple orchards and wooden cottages.",
    defaultOutput: "### Day 1: Whispering Pines & Cedar Chalets\nArrive in Old Manali via private 4x4 transfer. Settle into your heritage stone-and-timber cottage overlooking snow-crowned peaks of the Pir Panjal range.\n\n### Day 2: Solang Valley Skiing & High-Tea\nGlide down powdery nursery slopes with private instructors before retiring to a heated glass dome for spiced Himachali tea.\n\n### Day 3: Naggar Castle Art & Apple Orchard Walk\nExplore ancient Roerich art galleries and savor hand-churned trout delicacies.",
  },
  {
    id: "TOOL-02",
    name: "Viral Instagram / Reels Caption Generator",
    description: "High-engagement hooks, emoji pacing, and hashtag clusters tuned for India travel algorithms.",
    category: "Social",
    samplePrompt: "Write an Instagram reel caption for a romantic private houseboat cruise in Kumarakom.",
    defaultOutput: "POV: You traded city traffic for emerald backwaters and morning bird songs 🛶🌅\n\nNo alarm clocks. Just freshly tapped coconut water and the gentle rhythm of Kerala waters.\n\nSave this for your next monsoon honeymoon getaway! 🌴✨\n\n📍 Kumarakom Lake Sanctuary, Kerala\nBook directly via BharatYatra with instant PNR verification.\n\n#KeralaTravel #IncredibleIndia #KumarakomHouseboat #BharatYatra #LuxuryTravelIndia #MonsoonDiaries",
  },
  {
    id: "TOOL-03",
    name: "WhatsApp Automated Drip Copywriter",
    description: "Converts leads into direct booking conversions with pre-formatted WhatsApp bold and italic markdown.",
    category: "Email",
    samplePrompt: "Draft an abandoned cart recovery message for a Kashmir family trip valued at ₹1,20,000.",
    defaultOutput: "Namaste *Dr. Sharma*! 🙏\n\nYour *Kashmir Winter Snowfall Itinerary* (5 Nights / 6 Days) is temporarily saved in our priority system.\n\n❄️ *Exclusive Hold Status:* Your reserved cottage at *Khyber Gulmarg* will be released in *3 hours*.\n\n🎁 *Special VIP Privilege:* We've attached a *₹5,000 instant festival credit* valid till 11:59 PM today!\n\n👉 Tap here to confirm your private cab & chalet: bharatyatra.in/p/kashmir-hold\n\nOr reply *TALK* to connect with Priya, your personal holiday specialist.",
  },
  {
    id: "TOOL-04",
    name: "Multi-Lingual Indic Travel Translator (Hindi / Tamil / Bengali)",
    description: "Accurately localized travel marketing copy respecting cultural nuances and regional terminology.",
    category: "Multi-lingual",
    samplePrompt: "Translate our Kedarnath Helicopter booking banner into Hindi and Bengali.",
    defaultOutput: "🇮🇳 **हिन्दी (Hindi):**\n\"केदारनाथ एवं बद्रीनाथ जी की पावन यात्रा अब और भी सुलभ! भारतयात्रा वीआईपी हेलीकॉप्टर पास के साथ वरिष्ठ नागरिकों के लिए विशेष सुविधा और प्राथमिकता दर्शन। आज ही अपनी सीट आरक्षित करें।\"\n\n🇮🇳 **বাংলা (Bengali):**\n\"কেদারনাথ ও বদ্রীনাথের পবিত্র তীর্থযাত্রা এখন আরও সহজ! ভারতযাত্রা ভিআইপি হেলিকপ্টার পাসের সাথে প্রবীণ নাগরিকদের জন্য বিশেষ অগ্রাধিকার দর্শন। আজই বুকিং নিশ্চিত করুন।\"",
  },
  {
    id: "TOOL-05",
    name: "JSON-LD Travel Schema & SEO Meta Generator",
    description: "Generates rich snippet Schema markup for Google search results to achieve star ratings and FAQ dropdowns.",
    category: "SEO",
    samplePrompt: "Generate TouristTrip schema for Delhi to Agra Luxury Day Tour by Taj Express Cab.",
    defaultOutput: `{\n  "@context": "https://schema.org",\n  "@type": "TouristTrip",\n  "name": "Delhi to Agra Same-Day Taj Mahal Luxury Tour",\n  "description": "Private air-conditioned sedan, Yamuna Expressway toll included, certified English-speaking monument guide, and 5-star buffet lunch.",\n  "offers": {\n    "@type": "Offer",\n    "price": "4999",\n    "priceCurrency": "INR",\n    "availability": "https://schema.org/InStock"\n  },\n  "touristType": ["Family", "International Traveler", "Couples"],\n  "provider": {\n    "@type": "TravelAgency",\n    "name": "BharatYatra"\n  }\n}`,
  },
];
