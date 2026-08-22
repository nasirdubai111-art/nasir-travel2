export interface TempleDetail {
  id: string;
  name: string;
  hindiName: string;
  deity: string;
  location: string;
  state: string;
  circuit: "Char Dham" | "12 Jyotirlinga" | "Shaktipeeth" | "Divya Desam" | "Sanatan Sacred";
  significance: string;
  image: string;
  darshanTimings: {
    morning: string;
    evening: string;
    vipDarshanSlots: string[];
    specialAarti: string;
  };
  dressCode: string;
  prasadSpecialty: string;
  nearestAirport: string;
  nearestRailwayStation: string;
  specialAssistanceAvailable: string[];
}

export interface DetailedYatraPackage {
  id: string;
  title: string;
  hindiTitle: string;
  circuit: string;
  sacredDeity: string;
  duration: string;
  durationDays: number;
  durationNights: number;
  rating: number;
  reviewsCount: number;
  featuredImage: string;
  pricePerPerson: number;
  originalPrice: number;
  isHelicopterIncluded: boolean;
  isSeniorCitizenAssisted: boolean;
  vipDarshanPassesIncluded: boolean;
  satvikFood: boolean;
  inclusions: string[];
  routeCircuit: string;
  dayWiseSchedule: {
    day: number;
    title: string;
    poojaEvents: string[];
    haltLocation: string;
  }[];
  specialAssistanceOptions: {
    type: string;
    extraCost: number;
    description: string;
  }[];
}

export const TEMPLES_DATABASE: TempleDetail[] = [
  {
    id: "temple-kedarnath",
    name: "Shri Kedarnath Dham (Himalayan Jyotirlinga)",
    hindiName: "श्री केदारनाथ धाम",
    deity: "Lord Shiva (Sadashiva)",
    location: "Rudraprayag District, Garhwal Himalayas",
    state: "Uttarakhand",
    circuit: "Char Dham",
    significance: "Highest of the 12 Jyotirlingas, situated at 11,755 ft above sea level near Mandakini River.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
    darshanTimings: {
      morning: "05:00 AM – 01:30 PM (Maha Abhishek & Morning Pooja)",
      evening: "05:30 PM – 09:00 PM (Shringar Aarti & Shayana)",
      vipDarshanSlots: ["06:00 AM (VIP Abhishek)", "04:30 PM (Evening Fast-track)"],
      specialAarti: "Sandhya Shringar Aarti (07:00 PM)",
    },
    dressCode: "Modest traditional attire (Dhoti/Kurta for men, Saree/Salwar for women). Heavy woolens mandatory.",
    prasadSpecialty: "Dry fruit Panchamrit & Kedarnath Bhasma",
    nearestAirport: "Dehradun Jolly Grant Airport (DED) - 238 km",
    nearestRailwayStation: "Rishikesh (RKSH) / Haridwar (HW) - 225 km",
    specialAssistanceAvailable: ["Helicopter Shuttle (Phata/Guptkashi/Sirsi)", "Palki/Doli with 4 Porters", "Pony/Mule with Guide", "Emergency Oxygen Concentrators at Base"],
  },
  {
    id: "temple-kashi",
    name: "Shri Kashi Vishwanath Mandir & Dham",
    hindiName: "श्री काशी विश्वनाथ ज्योतिर्लिंग",
    deity: "Lord Shiva (Vishveshwara / Vishwanath)",
    location: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    circuit: "12 Jyotirlinga",
    significance: "The eternal spiritual capital of Sanatan Dharma where Ganga touches Lord Shiva's feet.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    darshanTimings: {
      morning: "03:00 AM – 11:00 AM (Mangla Aarti & Sugam Darshan)",
      evening: "12:00 PM – 11:00 PM (Bhog & Shringar Aarti)",
      vipDarshanSlots: ["03:00 AM (Mangla Aarti VIP)", "11:30 AM (Madhyahna Bhog VIP)", "07:00 PM (Sapta Rishi Aarti VIP)"],
      specialAarti: "Sapta Rishi Aarti & Shringar Aarti (07:00 PM)",
    },
    dressCode: "Traditional Dhoti Kurta mandatory for Sanctum Sanctorum Sparsh Darshan.",
    prasadSpecialty: "Kashi Vishwanath Peda & Rudraksha bead sanctified on Shivling",
    nearestAirport: "Varanasi Lal Bahadur Shastri Airport (VNS) - 24 km",
    nearestRailwayStation: "Varanasi Junction (BSB) - 4 km",
    specialAssistanceAvailable: ["Wheelchair through Corridor Gate #4", "Battery Buggy from Godowlia Crossing", "Senior Citizen Fast-track Sugam Lane"],
  },
  {
    id: "temple-ayodhya",
    name: "Shri Ram Janmabhoomi Mandir",
    hindiName: "श्री राम जन्मभूमि मंदिर",
    deity: "Bhagwan Shri Ram Lalla Virajman",
    location: "Ayodhya Dham",
    state: "Uttar Pradesh",
    circuit: "Sanatan Sacred",
    significance: "The sacred birthplace of Lord Rama on the banks of holy Sarayu river with grand Nagara temple architecture.",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80",
    darshanTimings: {
      morning: "06:30 AM – 12:00 PM (Shringar Aarti & General Darshan)",
      evening: "02:00 PM – 10:00 PM (Sandhya Aarti & Shayan Aarti)",
      vipDarshanSlots: ["06:30 AM (Shringar Aarti Token)", "07:30 PM (Sandhya Aarti Pass)"],
      specialAarti: "Mangla Aarti (04:30 AM), Shringar Aarti (06:30 AM), Sandhya Aarti (07:30 PM)",
    },
    dressCode: "Decent traditional Indian clothing.",
    prasadSpecialty: "Ayodhya Ram Mandir Elaichi Dana & Besan Laddu",
    nearestAirport: "Maharishi Valmiki International Airport Ayodhya (AYJ) - 8 km",
    nearestRailwayStation: "Ayodhya Dham Junction (AY) - 1.5 km",
    specialAssistanceAvailable: ["Free Wheelchairs & Ramp Pathway", "E-Cart service for elderly from Pilgrim Facilitation Centre", "Cloak room with digital biometric lockers"],
  },
  {
    id: "temple-tirupati",
    name: "Tirumala Tirupati Sri Venkateswara Swamy",
    hindiName: "तिरुमाला तिरुपति बालाजी",
    deity: "Lord Venkateswara (Govinda / Balaji)",
    location: "Tirumala Hills, Tirupati",
    state: "Andhra Pradesh",
    circuit: "Divya Desam",
    significance: "Kaliyuga Vaikuntham on Seven Sacred Seshachalam Hills, world's most visited sacred pilgrimage.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    darshanTimings: {
      morning: "03:00 AM – 12:00 PM (Suprabhatam & Seeghra Darshan)",
      evening: "12:00 PM – 11:30 PM (Sarva Darshan & Ekanta Seva)",
      vipDarshanSlots: ["09:00 AM (Special Entry Darshan ₹300)", "02:00 PM (Afternoon VIP Slot)"],
      specialAarti: "Suprabhatam (03:00 AM) & Tomala Seva (03:30 AM)",
    },
    dressCode: "Strict Traditional: Men in Dhoti/Veshti with Angavastram (No pants/jeans). Women in Saree/Half-saree.",
    prasadSpecialty: "World Heritage GI-Tagged Tirupati GI Laddu (Kalyanotsavam Laddu)",
    nearestAirport: "Tirupati Airport (TIR) - 38 km (Tirumala hill)",
    nearestRailwayStation: "Tirupati Main (TPTY) - 22 km",
    specialAssistanceAvailable: ["Dedicated Senior Citizen & Physically Challenged queue (Gate 2)", "Infant Parent special darshan (below 1 year)", "Battery buggies inside temple complex"],
  },
  {
    id: "temple-vaishnodevi",
    name: "Shri Mata Vaishno Devi Shrine",
    hindiName: "श्री माता वैष्णो देवी",
    deity: "Maha Kali, Maha Lakshmi, Maha Saraswati (Pindies)",
    location: "Trikuta Hills, Katra",
    state: "Jammu & Kashmir",
    circuit: "Shaktipeeth",
    significance: "Holy Natural Cave Shrine of Maa Vaishno Devi situated at 5,200 ft in the Trikuta mountains.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    darshanTimings: {
      morning: "05:00 AM – 12:00 Noon (Morning Divya Aarti)",
      evening: "04:00 PM – 10:00 PM (Evening Aarti at Holy Cave)",
      vipDarshanSlots: ["06:00 AM (Morning Aarti Pass)", "07:00 PM (Evening Aarti Pass)"],
      specialAarti: "Atka Aarti inside Holy Cave with live Bhajan by renowned singers",
    },
    dressCode: "Comfortable warm traditional/modest clothing suitable for trek.",
    prasadSpecialty: "Panch Mewa Prasad & Sacred Khazana Coin",
    nearestAirport: "Jammu Airport (IXJ) - 50 km",
    nearestRailwayStation: "Shri Mata Vaishno Devi Katra (SVDK) - 1.5 km",
    specialAssistanceAvailable: ["Katra to Sanjichhat Helicopter (5-min flight)", "Battery Car from Himkoti to Bhawan", "Palki with 4 trained Shrine Board Sahayaks", "Ropeway from Bhawan to Bhairon Temple"],
  },
];

export const DETAILED_YATRAS_DATABASE: DetailedYatraPackage[] = [
  {
    id: "yatra-chardham-helicopter",
    title: "Chardham VIP Heli Yatra: Yamunotri, Gangotri, Kedarnath & Badrinath",
    hindiTitle: "चारधाम वीआईपी हेलीकॉप्टर यात्रा (2026)",
    circuit: "Char Dham",
    sacredDeity: "Shri Hari Vishnu & Lord Shiva",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    durationNights: 4,
    rating: 4.98,
    reviewsCount: 890,
    featuredImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
    pricePerPerson: 185000,
    originalPrice: 215000,
    isHelicopterIncluded: true,
    isSeniorCitizenAssisted: true,
    vipDarshanPassesIncluded: true,
    satvikFood: true,
    inclusions: [
      "Dehradun Sahastradhara Helipad round-trip in 6-seater Bell/Airbus Helicopter",
      "4 Nights VIP Deluxe Accommodation at Kharsali, Harsil, Guptkashi & Badrinath",
      "All meals strictly Pure Vegetarian Satvik (Jain options on request)",
      "VIP Fast-Track Darshan passes at all 4 Dhams (No queue waiting)",
      "Palki/Pony at Yamunotri included",
      "Special Rudrabhishek Pooja at Kedarnath & Maha Abhishek at Badrinath included",
      "Dedicated Yatra Liaison Escort with medical first-aid & oxygen kits",
    ],
    routeCircuit: "Dehradun ➔ Yamunotri (Kharsali) ➔ Gangotri (Harsil) ➔ Kedarnath (Guptkashi) ➔ Badrinath ➔ Dehradun",
    dayWiseSchedule: [
      { day: 1, title: "Dehradun to Yamunotri Dham (Kharsali Helipad)", poojaEvents: ["Yamuna Ji Snan", "Yamunotri Temple Darshan with VIP Pass", "Shri Krishna Yamuna Aarti"], haltLocation: "Kalindi Luxury Resort Kharsali" },
      { day: 2, title: "Yamunotri to Gangotri Dham (Harsil Valley Helipad)", poojaEvents: ["Ganga Snan at Bhagirathi", "Gangotri Mandir Special Archana", "Evening Ganga Aarti"], haltLocation: "Harsil Valley Apple Orchard Resort" },
      { day: 3, title: "Gangotri to Kedarnath Dham (Shuttle to Mandir Helipad)", poojaEvents: ["Kedarnath Jyotirlinga Sparsh Darshan", "VIP Evening Shringar Aarti", "Shiva Sahasranama Chanting"], haltLocation: "Kedarnath Temple Colony Cottage" },
      { day: 4, title: "Kedarnath to Badrinath Dham (Maha Abhishek)", poojaEvents: ["Morning Abhishek of Badrivishal", "Mana Village - Last Indian Village & Vyas Gufa", "Tapt Kund holy bath"], haltLocation: "Sarovar Portico Badrinath" },
      { day: 5, title: "Badrinath to Dehradun Sahastradhara & Return", poojaEvents: ["Morning Vishnu Sahasranama Aarti", "Helicopter return to Dehradun", "Departure blessings"], haltLocation: "Dehradun Helipad Drop" },
    ],
    specialAssistanceOptions: [
      { type: "Portable Medical Oxygen Kit", extraCost: 0, description: "Complimentary medical oxygen canister per senior pilgrim" },
      { type: "Personal Escort Attendant", extraCost: 5000, description: "Dedicated assistant to carry personal bags and support walking" },
    ],
  },
  {
    id: "yatra-kashi-ayodhya-prayagraj",
    title: "Divya Sanatan Circuit: Kashi Vishwanath, Ayodhya Ram Mandir & Prayagraj Sangam",
    hindiTitle: "दिव्य काशी-अयोध्या-प्रयागराज संगम यात्रा",
    circuit: "Sanatan Sacred",
    sacredDeity: "Lord Shiva, Shri Ram & Holy Rivers",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    durationNights: 3,
    rating: 4.95,
    reviewsCount: 2340,
    featuredImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    pricePerPerson: 16999,
    originalPrice: 22000,
    isHelicopterIncluded: false,
    isSeniorCitizenAssisted: true,
    vipDarshanPassesIncluded: true,
    satvikFood: true,
    inclusions: [
      "3 Nights stay in 4-Star Satvik Hotels (Varanasi & Ayodhya)",
      "Daily Pure Vegetarian / Jain Breakfast and Thali Dinners",
      "Kashi Vishwanath Sugam VIP Fast-Track Darshan Pass",
      "Ayodhya Ram Lalla VIP Shringar Aarti Darshan Pass",
      "Private Boat for Triveni Sangam Holy Snan in Prayagraj with Purohit Sankalp",
      "Private AC Chauffeur in Toyota Innova for entire route",
    ],
    routeCircuit: "Varanasi ➔ Prayagraj Sangam ➔ Ayodhya Dham ➔ Varanasi",
    dayWiseSchedule: [
      { day: 1, title: "Arrival Varanasi & Evening Grand Ganga Aarti on Private Bajra", poojaEvents: ["Welcome at Varanasi Airport/Station", "Evening private boat for Dashashwamedh Maha Aarti", "Kashi Vishwanath Corridor walk"], haltLocation: "BrijRama Palace / Madhuvan Varanasi" },
      { day: 2, title: "Kashi Vishwanath VIP Darshan, Kal Bhairav & Sarnath", poojaEvents: ["06:00 AM VIP Sugam Darshan at Kashi Vishwanath Jyotirlinga", "Maa Annapurna & Kal Bhairav Darshan", "Sarnath Buddha Deer Park & Dhamek Stupa"], haltLocation: "Varanasi" },
      { day: 3, title: "Varanasi to Prayagraj Sangam Snan & Drive to Ayodhya", poojaEvents: ["Triveni Sangam (Ganga-Yamuna-Saraswati) Holy Dip with Purohit Sankalp", "Shri Bade Hanuman Mandir & Alopi Devi Shaktipeeth", "Drive to holy Ayodhya Dham"], haltLocation: "Ramayana Hotel Ayodhya" },
      { day: 4, title: "Ayodhya Ram Janmabhoomi VIP Darshan & Return", poojaEvents: ["Morning VIP Darshan at Grand Ram Mandir", "Hanuman Garhi & Kanak Bhawan visit", "Sarayu River Aarti & Departure transfer"], haltLocation: "Ayodhya / Varanasi Airport" },
    ],
    specialAssistanceOptions: [
      { type: "Wheelchair & Escort at Temple Corridors", extraCost: 1500, description: "Dedicated helper for elderly across all temple entries" },
      { type: "Personal Purohit for Rudrabhishek Pooja", extraCost: 2100, description: "Certified Kashi Vedic Shastri for customized family Sankalp" },
    ],
  },
];

export const DETAILED_TEMPLES = TEMPLES_DATABASE;
export const DETAILED_YATRAS = DETAILED_YATRAS_DATABASE;
export type DetailedTempleItem = TempleDetail;
