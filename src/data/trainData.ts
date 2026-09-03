export interface RailwayStation {
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  platforms: number;
}

export interface TrainCoachClass {
  classCode: "1A" | "2A" | "3A" | "3E" | "SL" | "CC" | "EC" | "EA" | "Vistadome";
  className: string;
  price: number;
  tatkalPrice: number;
  availableSeats: number;
  status: string; // e.g. "AVAILABLE-0042", "RAC 14", "WL 3"
  confirmProbability: number; // e.g. 96 (%)
  foodIncluded: boolean;
  freeCancellation: boolean;
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform: string;
  currentStatus?: "departed" | "current" | "upcoming";
  actualTime?: string;
  delayMinutes?: number;
}

export interface TrainBerthSeatItem {
  id: string; // e.g., "C2-14", "B1-23"
  coach: string; // "C1", "C2", "C3", "EC1", "B1", "B2", "A1", "H1"
  seatNumber: number;
  berthType: "WINDOW" | "MIDDLE" | "AISLE" | "LOWER" | "UPPER" | "SIDE_LOWER" | "SIDE_UPPER" | "CABIN";
  deckOrBay: number;
  isAvailable: boolean;
  isLadiesReserved?: boolean;
  isSeniorCitizenPriority?: boolean;
  priceDelta?: number;
}

export const GENERATE_TRAIN_COACH_MATRIX = (
  classCode: string,
  coachId: string
): TrainBerthSeatItem[] => {
  const seats: TrainBerthSeatItem[] = [];

  if (classCode === "CC") {
    // 3x2 Seater layout (Rows 1 to 14, 70 seats)
    // Seats per row: 1(W), 2(M), 3(A), 4(A), 5(W)
    for (let r = 1; r <= 14; r++) {
      const base = (r - 1) * 5;
      const rowSeats: { num: number; type: "WINDOW" | "MIDDLE" | "AISLE" }[] = [
        { num: base + 1, type: "WINDOW" },
        { num: base + 2, type: "MIDDLE" },
        { num: base + 3, type: "AISLE" },
        { num: base + 4, type: "AISLE" },
        { num: base + 5, type: "WINDOW" },
      ];

      rowSeats.forEach((item) => {
        const isOccupied = (item.num % 4 === 0) || item.num === 7 || item.num === 19 || item.num === 33 || item.num === 42;
        const isLadies = item.num <= 10 && item.type === "WINDOW";
        seats.push({
          id: `${coachId}-${item.num}`,
          coach: coachId,
          seatNumber: item.num,
          berthType: item.type,
          deckOrBay: r,
          isAvailable: !isOccupied,
          isLadiesReserved: isLadies,
          priceDelta: item.type === "WINDOW" ? 0 : 0,
        });
      });
    }
  } else if (classCode === "EC" || classCode === "EA") {
    // Executive 2x2 Seater layout (Rows 1 to 12, 48 seats)
    // Seats per row: 1(W), 2(A), 3(A), 4(W)
    for (let r = 1; r <= 12; r++) {
      const base = (r - 1) * 4;
      const rowSeats: { num: number; type: "WINDOW" | "AISLE" }[] = [
        { num: base + 1, type: "WINDOW" },
        { num: base + 2, type: "AISLE" },
        { num: base + 3, type: "AISLE" },
        { num: base + 4, type: "WINDOW" },
      ];

      rowSeats.forEach((item) => {
        const isOccupied = (item.num % 5 === 0) || item.num === 3 || item.num === 11 || item.num === 27;
        seats.push({
          id: `${coachId}-${item.num}`,
          coach: coachId,
          seatNumber: item.num,
          berthType: item.type,
          deckOrBay: r,
          isAvailable: !isOccupied,
          priceDelta: 0,
        });
      });
    }
  } else if (classCode === "3A" || classCode === "3E" || classCode === "SL") {
    // 8-Berth Sleeper/3AC Bays (Bays 1 to 8, 64 berths)
    // 1: LB, 2: MB, 3: UB, 4: LB, 5: MB, 6: UB, 7: SL, 8: SU
    for (let bay = 1; bay <= 8; bay++) {
      const base = (bay - 1) * 8;
      const bayBerths: { num: number; type: "LOWER" | "MIDDLE" | "UPPER" | "SIDE_LOWER" | "SIDE_UPPER" }[] = [
        { num: base + 1, type: "LOWER" },
        { num: base + 2, type: "MIDDLE" },
        { num: base + 3, type: "UPPER" },
        { num: base + 4, type: "LOWER" },
        { num: base + 5, type: "MIDDLE" },
        { num: base + 6, type: "UPPER" },
        { num: base + 7, type: "SIDE_LOWER" },
        { num: base + 8, type: "SIDE_UPPER" },
      ];

      bayBerths.forEach((item) => {
        const isOccupied = item.num === 2 || item.num === 5 || item.num === 12 || item.num === 18 || item.num === 29 || item.num === 44 || item.num === 53;
        const isSenior = item.type === "LOWER" && item.num <= 16;
        seats.push({
          id: `${coachId}-${item.num}`,
          coach: coachId,
          seatNumber: item.num,
          berthType: item.type,
          deckOrBay: bay,
          isAvailable: !isOccupied,
          isSeniorCitizenPriority: isSenior,
        });
      });
    }
  } else if (classCode === "2A") {
    // 6-Berth 2AC Bays (Bays 1 to 8, 48 berths)
    // 1: LB, 2: UB, 3: LB, 4: UB, 5: SL, 6: SU
    for (let bay = 1; bay <= 8; bay++) {
      const base = (bay - 1) * 6;
      const bayBerths: { num: number; type: "LOWER" | "UPPER" | "SIDE_LOWER" | "SIDE_UPPER" }[] = [
        { num: base + 1, type: "LOWER" },
        { num: base + 2, type: "UPPER" },
        { num: base + 3, type: "LOWER" },
        { num: base + 4, type: "UPPER" },
        { num: base + 5, type: "SIDE_LOWER" },
        { num: base + 6, type: "SIDE_UPPER" },
      ];

      bayBerths.forEach((item) => {
        const isOccupied = item.num === 3 || item.num === 8 || item.num === 15 || item.num === 22 || item.num === 37;
        seats.push({
          id: `${coachId}-${item.num}`,
          coach: coachId,
          seatNumber: item.num,
          berthType: item.type,
          deckOrBay: bay,
          isAvailable: !isOccupied,
        });
      });
    }
  } else {
    // 1A First AC (Cabins A-E, 20 berths)
    for (let cabin = 1; cabin <= 5; cabin++) {
      const base = (cabin - 1) * 4;
      const cabinBerths: { num: number; type: "CABIN" }[] = [
        { num: base + 1, type: "CABIN" },
        { num: base + 2, type: "CABIN" },
        { num: base + 3, type: "CABIN" },
        { num: base + 4, type: "CABIN" },
      ];

      cabinBerths.forEach((item) => {
        const isOccupied = item.num === 2 || item.num === 7 || item.num === 14;
        seats.push({
          id: `${coachId}-${item.num}`,
          coach: coachId,
          seatNumber: item.num,
          berthType: item.type,
          deckOrBay: cabin,
          isAvailable: !isOccupied,
        });
      });
    }
  }

  return seats;
};

export interface DetailedTrainItem {
  id: string;
  trainNumber: string;
  trainName: string;
  hindiName?: string;
  trainType: "Vande Bharat" | "Rajdhani" | "Shatabdi" | "Duronto" | "Superfast" | "Amrit Bharat" | "Tejas";
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  distanceKm: number;
  avgSpeedKmh: number;
  isVandeBharat: boolean;
  isPantryAvailable: boolean;
  cleanlinessRating: number;
  punctualityRating: number;
  classes: TrainCoachClass[];
  routeStops: TrainStop[];
  currentRunningStatus: {
    lastStation: string;
    lastUpdated: string;
    delayMinutes: number;
    currentSpeedKmh: number;
    nextStation: string;
    nextStationPlatform: string;
    estimatedArrival: string;
    statusText: string;
  };
}

export const RAILWAY_STATIONS_DATABASE: RailwayStation[] = [
  { code: "NDLS", name: "New Delhi Railway Station", city: "New Delhi", state: "Delhi", zone: "NR", platforms: 16 },
  { code: "NZM", name: "Hazrat Nizamuddin", city: "New Delhi", state: "Delhi", zone: "NR", platforms: 7 },
  { code: "DLI", name: "Old Delhi Junction", city: "Delhi", state: "Delhi", zone: "NR", platforms: 16 },
  { code: "ANVT", name: "Anand Vihar Terminal", city: "New Delhi", state: "Delhi", zone: "NR", platforms: 7 },
  { code: "BSB", name: "Varanasi Junction (Cantonment)", city: "Varanasi", state: "Uttar Pradesh", zone: "NER", platforms: 9 },
  { code: "DDU", name: "Pt. Deen Dayal Upadhyaya Jn", city: "Varanasi / Mughalsarai", state: "Uttar Pradesh", zone: "ECR", platforms: 8 },
  { code: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", city: "Mumbai", state: "Maharashtra", zone: "CR", platforms: 18 },
  { code: "MMCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", zone: "WR", platforms: 5 },
  { code: "BDTS", name: "Bandra Terminus", city: "Mumbai", state: "Maharashtra", zone: "WR", platforms: 7 },
  { code: "SBC", name: "KSR Bengaluru City Junction", city: "Bengaluru", state: "Karnataka", zone: "SWR", platforms: 10 },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru", state: "Karnataka", zone: "SWR", platforms: 6 },
  { code: "MAS", name: "MGR Chennai Central", city: "Chennai", state: "Tamil Nadu", zone: "SR", platforms: 12 },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", zone: "ER", platforms: 23 },
  { code: "SDAH", name: "Sealdah", city: "Kolkata", state: "West Bengal", zone: "ER", platforms: 21 },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad", state: "Gujarat", zone: "WR", platforms: 12 },
  { code: "HYB", name: "Hyderabad Deccan (Nampally)", city: "Hyderabad", state: "Telangana", zone: "SCR", platforms: 6 },
  { code: "SC", name: "Secunderabad Junction", city: "Hyderabad", state: "Telangana", zone: "SCR", platforms: 10 },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur", state: "Rajasthan", zone: "NWR", platforms: 7 },
  { code: "AY", name: "Ayodhya Dham Junction", city: "Ayodhya", state: "Uttar Pradesh", zone: "NR", platforms: 6 },
  { code: "SVDK", name: "Shri Mata Vaishno Devi Katra", city: "Katra", state: "Jammu & Kashmir", zone: "NR", platforms: 5 },
  { code: "PURI", name: "Puri Terminus", city: "Puri", state: "Odisha", zone: "ECoR", platforms: 8 },
  { code: "MAO", name: "Madgaon Junction (Goa)", city: "Goa", state: "Goa", zone: "KR", platforms: 4 },
];

export const DETAILED_TRAINS_DATABASE: DetailedTrainItem[] = [
  {
    id: "train-22436",
    trainNumber: "22436",
    trainName: "Varanasi Vande Bharat Express",
    hindiName: "वाराणसी वन्दे भारत एक्सप्रेस",
    trainType: "Vande Bharat",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "BSB",
    toStationName: "Varanasi Jn",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    duration: "8h 00m",
    runningDays: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"],
    distanceKm: 759,
    avgSpeedKmh: 95,
    isVandeBharat: true,
    isPantryAvailable: true,
    cleanlinessRating: 4.9,
    punctualityRating: 4.8,
    classes: [
      { classCode: "CC", className: "AC Chair Car", price: 1750, tatkalPrice: 2150, availableSeats: 48, status: "AVAILABLE-0048", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
      { classCode: "EC", className: "Executive Chair Car", price: 3300, tatkalPrice: 3850, availableSeats: 12, status: "AVAILABLE-0012", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
    ],
    routeStops: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "--", departureTime: "06:00 AM", haltMinutes: 0, distanceKm: 0, day: 1, platform: "16", currentStatus: "departed" },
      { stationCode: "CNB", stationName: "Kanpur Central", arrivalTime: "10:08 AM", departureTime: "10:10 AM", haltMinutes: 2, distanceKm: 440, day: 1, platform: "5", currentStatus: "departed" },
      { stationCode: "PRYJ", stationName: "Prayagraj Jn", arrivalTime: "12:08 PM", departureTime: "12:10 PM", haltMinutes: 2, distanceKm: 635, day: 1, platform: "6", currentStatus: "current", actualTime: "12:12 PM", delayMinutes: 2 },
      { stationCode: "BSB", stationName: "Varanasi Jn", arrivalTime: "02:00 PM", departureTime: "--", haltMinutes: 0, distanceKm: 759, day: 1, platform: "1", currentStatus: "upcoming" },
    ],
    currentRunningStatus: {
      lastStation: "Prayagraj Jn (Departed +2m)",
      lastUpdated: "2 mins ago via GPS",
      delayMinutes: 2,
      currentSpeedKmh: 130,
      nextStation: "Varanasi Jn (Final Destination)",
      nextStationPlatform: "PF #1",
      estimatedArrival: "02:02 PM (Nearly On Time)",
      statusText: "Running smoothly at 130 km/h on Prayagraj-Varanasi high-speed corridor.",
    },
  },
  {
    id: "train-22440",
    trainNumber: "22440",
    trainName: "Vande Bharat Express (Katra)",
    hindiName: "कटरा वन्दे भारत एक्सप्रेस",
    trainType: "Vande Bharat",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "SVDK",
    toStationName: "Shri Mata Vaishno Devi Katra",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    duration: "8h 00m",
    runningDays: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
    distanceKm: 655,
    avgSpeedKmh: 82,
    isVandeBharat: true,
    isPantryAvailable: true,
    cleanlinessRating: 4.9,
    punctualityRating: 4.9,
    classes: [
      { classCode: "CC", className: "AC Chair Car", price: 1630, tatkalPrice: 1980, availableSeats: 32, status: "AVAILABLE-0032", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
      { classCode: "EC", className: "Executive Chair Car", price: 3015, tatkalPrice: 3450, availableSeats: 6, status: "AVAILABLE-0006", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
    ],
    routeStops: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "--", departureTime: "06:00 AM", haltMinutes: 0, distanceKm: 0, day: 1, platform: "16", currentStatus: "departed" },
      { stationCode: "UMB", stationName: "Ambala Cantt", arrivalTime: "08:10 AM", departureTime: "08:12 AM", haltMinutes: 2, distanceKm: 199, day: 1, platform: "7", currentStatus: "departed" },
      { stationCode: "LDH", stationName: "Ludhiana Jn", arrivalTime: "09:19 AM", departureTime: "09:21 AM", haltMinutes: 2, distanceKm: 312, day: 1, platform: "2", currentStatus: "departed" },
      { stationCode: "JAT", stationName: "Jammu Tawi", arrivalTime: "12:38 PM", departureTime: "12:40 PM", haltMinutes: 2, distanceKm: 577, day: 1, platform: "1", currentStatus: "current" },
      { stationCode: "SVDK", stationName: "Shri Mata Vaishno Devi Katra", arrivalTime: "02:00 PM", departureTime: "--", haltMinutes: 0, distanceKm: 655, day: 1, platform: "3", currentStatus: "upcoming" },
    ],
    currentRunningStatus: {
      lastStation: "Jammu Tawi (Arrived on time)",
      lastUpdated: "Just now via Railway Telemetry",
      delayMinutes: 0,
      currentSpeedKmh: 75,
      nextStation: "Shri Mata Vaishno Devi Katra",
      nextStationPlatform: "PF #3",
      estimatedArrival: "02:00 PM (Right on time)",
      statusText: "Entering Udhampur-Katra scenic tunnel section.",
    },
  },
  {
    id: "train-12952",
    trainNumber: "12952",
    trainName: "Mumbai Rajdhani Express",
    hindiName: "मुंबई राजधानी एक्सप्रेस",
    trainType: "Rajdhani",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "MMCT",
    toStationName: "Mumbai Central",
    departureTime: "04:55 PM",
    arrivalTime: "08:35 AM",
    duration: "15h 40m",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    distanceKm: 1384,
    avgSpeedKmh: 88,
    isVandeBharat: false,
    isPantryAvailable: true,
    cleanlinessRating: 4.8,
    punctualityRating: 4.7,
    classes: [
      { classCode: "3A", className: "3 Tier AC", price: 2850, tatkalPrice: 3250, availableSeats: 18, status: "AVAILABLE-0018", confirmProbability: 98, foodIncluded: true, freeCancellation: true },
      { classCode: "2A", className: "2 Tier AC", price: 4100, tatkalPrice: 4600, availableSeats: 8, status: "AVAILABLE-0008", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
      { classCode: "1A", className: "First AC (Coupe/Cabin)", price: 5400, tatkalPrice: 5900, availableSeats: 4, status: "AVAILABLE-0004", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
    ],
    routeStops: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "--", departureTime: "04:55 PM", haltMinutes: 0, distanceKm: 0, day: 1, platform: "3", currentStatus: "departed" },
      { stationCode: "KOTA", stationName: "Kota Jn", arrivalTime: "09:30 PM", departureTime: "09:40 PM", haltMinutes: 10, distanceKm: 465, day: 1, platform: "1", currentStatus: "departed" },
      { stationCode: "RTM", stationName: "Ratlam Jn", arrivalTime: "01:05 AM", departureTime: "01:07 AM", haltMinutes: 2, distanceKm: 732, day: 2, platform: "4", currentStatus: "departed" },
      { stationCode: "BRC", stationName: "Vadodara Jn", arrivalTime: "04:18 AM", departureTime: "04:28 AM", haltMinutes: 10, distanceKm: 992, day: 2, platform: "1", currentStatus: "current" },
      { stationCode: "ST", stationName: "Surat", arrivalTime: "05:53 AM", departureTime: "05:58 AM", haltMinutes: 5, distanceKm: 1122, day: 2, platform: "2", currentStatus: "upcoming" },
      { stationCode: "BVI", stationName: "Borivali", arrivalTime: "08:05 AM", departureTime: "08:07 AM", haltMinutes: 2, distanceKm: 1355, day: 2, platform: "7", currentStatus: "upcoming" },
      { stationCode: "MMCT", stationName: "Mumbai Central", arrivalTime: "08:35 AM", departureTime: "--", haltMinutes: 0, distanceKm: 1384, day: 2, platform: "1", currentStatus: "upcoming" },
    ],
    currentRunningStatus: {
      lastStation: "Vadodara Jn (Departed on time)",
      lastUpdated: "5 mins ago",
      delayMinutes: 0,
      currentSpeedKmh: 110,
      nextStation: "Surat",
      nextStationPlatform: "PF #2",
      estimatedArrival: "05:53 AM (On Time)",
      statusText: "Approaching Surat Junction. Breakfast orders being prepared.",
    },
  },
  {
    id: "train-12002",
    trainNumber: "12002",
    trainName: "Bhopal Shatabdi Express",
    hindiName: "भोपाल शताब्दी एक्सप्रेस",
    trainType: "Shatabdi",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "AGC",
    toStationName: "Agra Cantt",
    departureTime: "06:00 AM",
    arrivalTime: "07:50 AM",
    duration: "1h 50m",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    distanceKm: 195,
    avgSpeedKmh: 106,
    isVandeBharat: false,
    isPantryAvailable: true,
    cleanlinessRating: 4.7,
    punctualityRating: 4.9,
    classes: [
      { classCode: "CC", className: "AC Chair Car", price: 680, tatkalPrice: 850, availableSeats: 112, status: "AVAILABLE-0112", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
      { classCode: "EC", className: "Executive Chair Car", price: 1350, tatkalPrice: 1600, availableSeats: 24, status: "AVAILABLE-0024", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
      { classCode: "EA", className: "Anubhuti Luxury Coach", price: 1650, tatkalPrice: 1950, availableSeats: 8, status: "AVAILABLE-0008", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
    ],
    routeStops: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "--", departureTime: "06:00 AM", haltMinutes: 0, distanceKm: 0, day: 1, platform: "1", currentStatus: "departed" },
      { stationCode: "MTJ", stationName: "Mathura Jn", arrivalTime: "07:19 AM", departureTime: "07:20 AM", haltMinutes: 1, distanceKm: 141, day: 1, platform: "1", currentStatus: "departed" },
      { stationCode: "AGC", stationName: "Agra Cantt", arrivalTime: "07:50 AM", departureTime: "--", haltMinutes: 0, distanceKm: 195, day: 1, platform: "1", currentStatus: "upcoming" },
    ],
    currentRunningStatus: {
      lastStation: "Mathura Jn (Departed)",
      lastUpdated: "1 min ago",
      delayMinutes: 0,
      currentSpeedKmh: 145,
      nextStation: "Agra Cantt",
      nextStationPlatform: "PF #1",
      estimatedArrival: "07:50 AM (Right on time)",
      statusText: "Cruising at top speed 145 km/h on Palwal-Mathura stretch.",
    },
  },
  {
    id: "train-12302",
    trainNumber: "12302",
    trainName: "Howrah Rajdhani Express (via Gaya)",
    hindiName: "हावड़ा राजधानी एक्सप्रेस",
    trainType: "Rajdhani",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "HWH",
    toStationName: "Howrah Jn",
    departureTime: "04:50 PM",
    arrivalTime: "09:55 AM",
    duration: "17h 05m",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Sat", "Sun"],
    distanceKm: 1451,
    avgSpeedKmh: 85,
    isVandeBharat: false,
    isPantryAvailable: true,
    cleanlinessRating: 4.8,
    punctualityRating: 4.8,
    classes: [
      { classCode: "3A", className: "3 Tier AC", price: 2980, tatkalPrice: 3380, availableSeats: 14, status: "AVAILABLE-0014", confirmProbability: 95, foodIncluded: true, freeCancellation: true },
      { classCode: "2A", className: "2 Tier AC", price: 4280, tatkalPrice: 4780, availableSeats: 6, status: "AVAILABLE-0006", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
      { classCode: "1A", className: "First AC", price: 5650, tatkalPrice: 6150, availableSeats: 2, status: "AVAILABLE-0002", confirmProbability: 100, foodIncluded: true, freeCancellation: true },
    ],
    routeStops: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "--", departureTime: "04:50 PM", haltMinutes: 0, distanceKm: 0, day: 1, platform: "10", currentStatus: "departed" },
      { stationCode: "CNB", stationName: "Kanpur Central", arrivalTime: "09:32 PM", departureTime: "09:37 PM", haltMinutes: 5, distanceKm: 440, day: 1, platform: "4", currentStatus: "departed" },
      { stationCode: "DDU", stationName: "Pt DD Upadhyaya Jn", arrivalTime: "12:48 AM", departureTime: "12:58 AM", haltMinutes: 10, distanceKm: 787, day: 2, platform: "2", currentStatus: "departed" },
      { stationCode: "GAYA", stationName: "Gaya Jn", arrivalTime: "03:10 AM", departureTime: "03:13 AM", haltMinutes: 3, distanceKm: 992, day: 2, platform: "1", currentStatus: "departed" },
      { stationCode: "DHN", stationName: "Dhanbad Jn", arrivalTime: "05:55 AM", departureTime: "06:00 AM", haltMinutes: 5, distanceKm: 1193, day: 2, platform: "1", currentStatus: "current" },
      { stationCode: "ASN", stationName: "Asansol Jn", arrivalTime: "06:54 AM", departureTime: "06:56 AM", haltMinutes: 2, distanceKm: 1251, day: 2, platform: "5", currentStatus: "upcoming" },
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "09:55 AM", departureTime: "--", haltMinutes: 0, distanceKm: 1451, day: 2, platform: "9", currentStatus: "upcoming" },
    ],
    currentRunningStatus: {
      lastStation: "Dhanbad Jn",
      lastUpdated: "3 mins ago",
      delayMinutes: 5,
      currentSpeedKmh: 98,
      nextStation: "Asansol Jn",
      nextStationPlatform: "PF #5",
      estimatedArrival: "07:00 AM (+4m)",
      statusText: "Running with slight 4m delay after Dhanbad.",
    },
  },
  {
    id: "train-12430",
    trainNumber: "12430",
    trainName: "New Delhi - Lucknow AC Superfast",
    hindiName: "नई दिल्ली - लखनऊ एसी सुपरफास्ट",
    trainType: "Superfast",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "LKO",
    toStationName: "Lucknow Charbagh",
    departureTime: "11:25 PM",
    arrivalTime: "07:10 AM",
    duration: "7h 45m",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    distanceKm: 492,
    avgSpeedKmh: 64,
    isVandeBharat: false,
    isPantryAvailable: true,
    cleanlinessRating: 4.6,
    punctualityRating: 4.7,
    classes: [
      { classCode: "3E", className: "3 AC Economy", price: 790, tatkalPrice: 990, availableSeats: 56, status: "AVAILABLE-0056", confirmProbability: 100, foodIncluded: false, freeCancellation: true },
      { classCode: "3A", className: "3 Tier AC", price: 890, tatkalPrice: 1090, availableSeats: 28, status: "AVAILABLE-0028", confirmProbability: 99, foodIncluded: false, freeCancellation: true },
      { classCode: "2A", className: "2 Tier AC", price: 1250, tatkalPrice: 1520, availableSeats: 10, status: "AVAILABLE-0010", confirmProbability: 100, foodIncluded: false, freeCancellation: true },
      { classCode: "1A", className: "First AC", price: 2100, tatkalPrice: 2450, availableSeats: 4, status: "AVAILABLE-0004", confirmProbability: 100, foodIncluded: false, freeCancellation: true },
    ],
    routeStops: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "--", departureTime: "11:25 PM", haltMinutes: 0, distanceKm: 0, day: 1, platform: "9", currentStatus: "upcoming" },
      { stationCode: "GZB", stationName: "Ghaziabad", arrivalTime: "12:08 AM", departureTime: "12:10 AM", haltMinutes: 2, distanceKm: 25, day: 2, platform: "1", currentStatus: "upcoming" },
      { stationCode: "MB", stationName: "Moradabad", arrivalTime: "02:12 AM", departureTime: "02:18 AM", haltMinutes: 6, distanceKm: 166, day: 2, platform: "1", currentStatus: "upcoming" },
      { stationCode: "BE", stationName: "Bareilly Jn", arrivalTime: "03:40 AM", departureTime: "03:42 AM", haltMinutes: 2, distanceKm: 256, day: 2, platform: "1", currentStatus: "upcoming" },
      { stationCode: "LKO", stationName: "Lucknow Charbagh", arrivalTime: "07:10 AM", departureTime: "--", haltMinutes: 0, distanceKm: 492, day: 2, platform: "1", currentStatus: "upcoming" },
    ],
    currentRunningStatus: {
      lastStation: "Scheduled Departure 11:25 PM from NDLS",
      lastUpdated: "Station Display",
      delayMinutes: 0,
      currentSpeedKmh: 0,
      nextStation: "Ghaziabad Jn",
      nextStationPlatform: "PF #1",
      estimatedArrival: "12:08 AM",
      statusText: "Train rakes positioned at PF #9 New Delhi. Charting completed.",
    },
  }
];

export const IRCTC_REFUND_RULES = [
  {
    ticketType: "Confirmed (AC Classes)",
    cancellationWindow: "> 48 Hours before departure",
    deduction: "Flat ₹240 (1A/EC), ₹200 (2A), ₹180 (3A/3E/CC), ₹120 (SL) + GST",
    refundPercentage: "92-95%",
  },
  {
    ticketType: "Confirmed (All Classes)",
    cancellationWindow: "Between 48 to 12 Hours before departure",
    deduction: "25% of Base Fare subject to minimum flat cancellation fee",
    refundPercentage: "75%",
  },
  {
    ticketType: "Confirmed (All Classes)",
    cancellationWindow: "Between 12 to 4 Hours before departure (or Charting)",
    deduction: "50% of Base Fare",
    refundPercentage: "50%",
  },
  {
    ticketType: "RAC / Waitlist (WL)",
    cancellationWindow: "Up to 30 mins before departure",
    deduction: "Flat ₹60 Clerkage charge only",
    refundPercentage: "98% (Full Refund minus ₹60)",
  },
  {
    ticketType: "Tatkal Confirmed",
    cancellationWindow: "Anytime",
    deduction: "Non-refundable (except if train cancelled by Railways or >3h late)",
    refundPercentage: "0% (100% on train cancellation)",
  },
];

export const DETAILED_TRAINS = DETAILED_TRAINS_DATABASE;
