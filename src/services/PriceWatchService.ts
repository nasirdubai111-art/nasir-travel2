import {
  WatchedRoute,
  PriceDropAlertEvent,
  PriceWatchTransportType,
  RoutePriceForecast,
  ForecastRecommendation,
  DayForecastPoint,
  SearchHistoryItem,
  SmartRouteAlert,
  AlternativeDateOption,
  SmartSavingsTag,
} from "../types";

const STORAGE_KEY = "bharatyatra_watched_routes_v1";
const ALERTS_STORAGE_KEY = "bharatyatra_price_alerts_history_v1";
const SEARCH_HISTORY_STORAGE_KEY = "bharatyatra_travel_search_history_v1";
const DISMISSED_SMART_ALERTS_KEY = "bharatyatra_smart_alerts_dismissed_v1";

// Seed data with realistic Indian flight and train routes
export const INITIAL_WATCHED_ROUTES: WatchedRoute[] = [
  {
    id: "pw-flight-del-bom",
    type: "flight",
    originCode: "DEL",
    originName: "Indira Gandhi International Airport",
    originCity: "New Delhi",
    destinationCode: "BOM",
    destinationName: "Chhatrapati Shivaji Maharaj International",
    destinationCity: "Mumbai",
    journeyDate: "2026-08-28",
    carrierName: "IndiGo 6E-2041",
    serviceNumber: "6E-2041",
    travelClass: "Economy",
    basePrice: 4880,
    currentPrice: 4880,
    lowestPriceSeen: 4880,
    highestPriceSeen: 5490,
    targetDropPercent: 10,
    notificationChannels: ["push", "whatsapp", "email"],
    isActive: true,
    alertTriggered: false,
    createdAt: "2026-08-24T10:30:00.000Z",
    lastCheckedAt: "2026-08-26T02:00:00.000Z",
    priceHistory: [
      { timestamp: "2026-08-24 10:30", price: 4880, note: "Tracking started at ₹4,880" },
      { timestamp: "2026-08-25 14:00", price: 5120, note: "Demand surge +5%" },
      { timestamp: "2026-08-26 02:00", price: 4880, note: "Base fare steady" },
    ],
  },
  {
    id: "pw-train-ndls-bsb",
    type: "train",
    originCode: "NDLS",
    originName: "New Delhi Railway Station",
    originCity: "New Delhi",
    destinationCode: "BSB",
    destinationName: "Varanasi Junction",
    destinationCity: "Varanasi",
    journeyDate: "2026-08-29",
    carrierName: "Vande Bharat Express (22436)",
    serviceNumber: "22436",
    travelClass: "Executive Chair Car (EC)",
    basePrice: 2450,
    currentPrice: 2450,
    lowestPriceSeen: 2450,
    highestPriceSeen: 2750,
    targetDropPercent: 10,
    notificationChannels: ["push", "sms"],
    isActive: true,
    alertTriggered: false,
    createdAt: "2026-08-24T11:00:00.000Z",
    lastCheckedAt: "2026-08-26T02:00:00.000Z",
    priceHistory: [
      { timestamp: "2026-08-24 11:00", price: 2450, note: "Tracking started at ₹2,450" },
      { timestamp: "2026-08-25 18:30", price: 2450, note: "Tatkal quota opening soon" },
    ],
  },
  {
    id: "pw-flight-blr-gox",
    type: "flight",
    originCode: "BLR",
    originName: "Kempegowda International Airport",
    originCity: "Bengaluru",
    destinationCode: "GOX",
    destinationName: "Manohar International Airport (Mopa)",
    destinationCity: "Goa (Mopa)",
    journeyDate: "2026-09-02",
    carrierName: "Akasa Air QP-1322",
    serviceNumber: "QP-1322",
    travelClass: "Economy",
    basePrice: 3499,
    currentPrice: 3499,
    lowestPriceSeen: 3499,
    highestPriceSeen: 4199,
    targetDropPercent: 10,
    notificationChannels: ["push", "whatsapp"],
    isActive: true,
    alertTriggered: false,
    createdAt: "2026-08-25T08:15:00.000Z",
    lastCheckedAt: "2026-08-26T02:00:00.000Z",
    priceHistory: [
      { timestamp: "2026-08-25 08:15", price: 3499, note: "Tracking started at ₹3,499" },
    ],
  },
  {
    id: "pw-train-mmct-ndls",
    type: "train",
    originCode: "MMCT",
    originName: "Mumbai Central",
    originCity: "Mumbai",
    destinationCode: "NDLS",
    destinationName: "New Delhi Railway Station",
    destinationCity: "New Delhi",
    journeyDate: "2026-09-05",
    carrierName: "Mumbai Rajdhani Express (12952)",
    serviceNumber: "12952",
    travelClass: "AC 2 Tier (2A)",
    basePrice: 3890,
    currentPrice: 3890,
    lowestPriceSeen: 3890,
    highestPriceSeen: 4200,
    targetDropPercent: 12,
    notificationChannels: ["push", "email"],
    isActive: true,
    alertTriggered: false,
    createdAt: "2026-08-25T15:40:00.000Z",
    lastCheckedAt: "2026-08-26T02:00:00.000Z",
    priceHistory: [
      { timestamp: "2026-08-25 15:40", price: 3890, note: "Tracking started at ₹3,890" },
    ],
  },
];

export const INITIAL_SEARCH_HISTORY: SearchHistoryItem[] = [
  {
    id: "search-hist-del-bom-flight",
    type: "flight",
    originCode: "DEL",
    originCity: "New Delhi",
    destinationCode: "BOM",
    destinationCity: "Mumbai",
    searchedDate: "2026-08-28", // Friday (Peak)
    currentPrice: 4880,
    carrierName: "IndiGo 6E-2041",
    timestamp: "2026-08-26 09:15",
  },
  {
    id: "search-hist-blr-goi-flight",
    type: "flight",
    originCode: "BLR",
    originCity: "Bengaluru",
    destinationCode: "GOI",
    destinationCity: "Goa",
    searchedDate: "2026-08-29", // Saturday (Weekend Peak)
    currentPrice: 5350,
    carrierName: "Air India AI-582",
    timestamp: "2026-08-26 08:40",
  },
  {
    id: "search-hist-ndls-bsb-train",
    type: "train",
    originCode: "NDLS",
    originCity: "New Delhi",
    destinationCode: "BSB",
    destinationCity: "Varanasi",
    searchedDate: "2026-08-28", // Friday (Weekend Rush)
    currentPrice: 1850,
    carrierName: "Vande Bharat Express (22436)",
    timestamp: "2026-08-25 18:20",
  },
  {
    id: "search-hist-bom-dxb-flight",
    type: "flight",
    originCode: "BOM",
    originCity: "Mumbai",
    destinationCode: "DXB",
    destinationCity: "Dubai",
    searchedDate: "2026-09-04", // Friday (International Weekend Peak)
    currentPrice: 16800,
    carrierName: "Emirates EK-501",
    timestamp: "2026-08-25 12:10",
  },
  {
    id: "search-hist-ccu-maa-flight",
    type: "flight",
    originCode: "CCU",
    originCity: "Kolkata",
    destinationCode: "MAA",
    destinationCity: "Chennai",
    searchedDate: "2026-08-30", // Sunday (Surge)
    currentPrice: 6200,
    carrierName: "SpiceJet SG-322",
    timestamp: "2026-08-24 15:45",
  },
];

type PriceWatchListener = (routes: WatchedRoute[], latestAlert?: PriceDropAlertEvent) => void;

class PriceWatchServiceClass {
  private routes: WatchedRoute[] = [];
  private alertHistory: PriceDropAlertEvent[] = [];
  private searchHistory: SearchHistoryItem[] = [];
  private dismissedSmartAlertIds: Set<string> = new Set();
  private listeners: Set<PriceWatchListener> = new Set();
  private isChecking: boolean = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.routes = JSON.parse(stored);
      } else {
        this.routes = INITIAL_WATCHED_ROUTES;
        this.saveToStorage();
      }

      const storedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (storedAlerts) {
        this.alertHistory = JSON.parse(storedAlerts);
      }

      const storedSearch = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      if (storedSearch) {
        this.searchHistory = JSON.parse(storedSearch);
      } else {
        this.searchHistory = INITIAL_SEARCH_HISTORY;
        localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(this.searchHistory));
      }

      const storedDismissed = localStorage.getItem(DISMISSED_SMART_ALERTS_KEY);
      if (storedDismissed) {
        this.dismissedSmartAlertIds = new Set(JSON.parse(storedDismissed));
      }
    } catch {
      this.routes = INITIAL_WATCHED_ROUTES;
      this.searchHistory = INITIAL_SEARCH_HISTORY;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.routes));
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(this.alertHistory));
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(this.searchHistory));
      localStorage.setItem(
        DISMISSED_SMART_ALERTS_KEY,
        JSON.stringify(Array.from(this.dismissedSmartAlertIds))
      );
    } catch (e) {
      console.warn("Unable to save price watch data to localStorage:", e);
    }
  }

  public getRoutes(): WatchedRoute[] {
    return [...this.routes];
  }

  public getWatchedRoutes(): WatchedRoute[] {
    return [...this.routes];
  }

  public getAlertHistory(): PriceDropAlertEvent[] {
    return [...this.alertHistory];
  }

  public subscribe(listener: PriceWatchListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(latestAlert?: PriceDropAlertEvent) {
    this.saveToStorage();
    this.listeners.forEach((listener) => {
      try {
        listener([...this.routes], latestAlert);
      } catch (err) {
        console.error("Error notifying price watch listener:", err);
      }
    });

    if (latestAlert) {
      // Dispatch browser custom event for in-app floating banner
      window.dispatchEvent(
        new CustomEvent("bharatyatra:price-drop", { detail: latestAlert })
      );
    }
  }

  // Play subtle notification chime safely via Web Audio API
  public playNotificationChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.12); // A5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, now); // A4
      osc2.frequency.setValueAtTime(659.25, now + 0.12); // E5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      // Audio context might be restricted before interaction; safe to ignore
    }
  }

  // Trigger simulated push notification (Native Web Push + In-App Event)
  public triggerSimulatedPush(alert: PriceDropAlertEvent) {
    this.playNotificationChime();

    // Check if HTML5 Notification permission is granted
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(alert.title, {
          body: `${alert.message}\nSaved: ₹${alert.savedAmount.toLocaleString("en-IN")}`,
          icon: "/favicon.ico",
          tag: `price-drop-${alert.routeId}`,
        });
      } catch {
        // Fallback handled by in-app floating banner
      }
    }
  }

  // Request browser notification permission if not yet requested
  public async requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }
    if (Notification.permission === "granted") {
      return "granted";
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return "denied";
    }
  }

  // Add a new route to watch
  public addWatchedRoute(params: {
    type: PriceWatchTransportType;
    originCode: string;
    originName: string;
    originCity: string;
    destinationCode: string;
    destinationName: string;
    destinationCity: string;
    journeyDate: string;
    carrierName?: string;
    serviceNumber?: string;
    travelClass?: string;
    basePrice: number;
    targetDropPercent?: number;
    notificationChannels?: Array<"push" | "whatsapp" | "email" | "sms">;
  }): WatchedRoute {
    const newRoute: WatchedRoute = {
      id: `pw-${params.type}-${params.originCode.toLowerCase()}-${params.destinationCode.toLowerCase()}-${Date.now().toString(36)}`,
      type: params.type,
      originCode: params.originCode.toUpperCase(),
      originName: params.originName,
      originCity: params.originCity,
      destinationCode: params.destinationCode.toUpperCase(),
      destinationName: params.destinationName,
      destinationCity: params.destinationCity,
      journeyDate: params.journeyDate,
      carrierName: params.carrierName || (params.type === "flight" ? "Direct Flight" : "Express Train"),
      serviceNumber: params.serviceNumber,
      travelClass: params.travelClass || (params.type === "flight" ? "Economy" : "3A AC"),
      basePrice: params.basePrice,
      currentPrice: params.basePrice,
      lowestPriceSeen: params.basePrice,
      highestPriceSeen: params.basePrice,
      targetDropPercent: params.targetDropPercent || 10,
      notificationChannels: params.notificationChannels || ["push", "whatsapp"],
      isActive: true,
      alertTriggered: false,
      createdAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      priceHistory: [
        {
          timestamp: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          price: params.basePrice,
          note: `Tracking initiated at ₹${params.basePrice.toLocaleString("en-IN")}`,
        },
      ],
    };

    this.routes = [newRoute, ...this.routes];
    this.notifyListeners();
    return newRoute;
  }

  // Remove watched route
  public removeWatchedRoute(id: string) {
    this.routes = this.routes.filter((r) => r.id !== id);
    this.notifyListeners();
  }

  // Toggle active state
  public toggleRouteActive(id: string) {
    this.routes = this.routes.map((r) => {
      if (r.id === id) {
        return { ...r, isActive: !r.isActive };
      }
      return r;
    });
    this.notifyListeners();
  }

  // Update target threshold %
  public updateThreshold(id: string, targetDropPercent: number) {
    this.routes = this.routes.map((r) => {
      if (r.id === id) {
        return { ...r, targetDropPercent };
      }
      return r;
    });
    this.notifyListeners();
  }

  // Update arbitrary watched route properties
  public updateWatchedRoute(id: string, updates: Partial<WatchedRoute>) {
    this.routes = this.routes.map((r) => {
      if (r.id === id) {
        return { ...r, ...updates };
      }
      return r;
    });
    this.notifyListeners();
  }

  // Simulate a price drop for a specific route (e.g. 10%, 15%, 20%, 25%)
  public simulatePriceDrop(routeId: string, dropPercentage: number = 14): { route: WatchedRoute; alert: PriceDropAlertEvent } | null {
    const target = this.routes.find((r) => r.id === routeId);
    if (!target) return null;

    const actualPercent = Math.max(10, Math.min(50, dropPercentage));
    const savedAmount = Math.round((target.basePrice * actualPercent) / 100);
    const newPrice = Math.max(499, target.basePrice - savedAmount);
    const timeString = new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const alertEvent: PriceDropAlertEvent = {
      id: `alert-drop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      routeId: target.id,
      routeType: target.type,
      originCode: target.originCode,
      destinationCode: target.destinationCode,
      originCity: target.originCity,
      destinationCity: target.destinationCity,
      carrierName: target.carrierName || (target.type === "flight" ? "Flight" : "Train"),
      journeyDate: target.journeyDate,
      originalPrice: target.basePrice,
      currentPrice: newPrice,
      dropPercent: actualPercent,
      savedAmount,
      timestamp: timeString,
      channel: "push",
      title: `⚡ ${actualPercent}% Price Drop Alert: ${target.originCode} ➔ ${target.destinationCode}`,
      message: `${target.carrierName || "Fare"} dropped from ₹${target.basePrice.toLocaleString("en-IN")} to ₹${newPrice.toLocaleString("en-IN")}! Instant savings of ₹${savedAmount.toLocaleString("en-IN")}.`,
      actionUrl: target.type === "flight" ? "#flights" : "#trains",
    };

    const updatedRoute: WatchedRoute = {
      ...target,
      currentPrice: newPrice,
      lowestPriceSeen: Math.min(target.lowestPriceSeen, newPrice),
      alertTriggered: true,
      lastCheckedAt: new Date().toISOString(),
      lastAlertDetails: {
        alertTimestamp: timeString,
        dropPercent: actualPercent,
        savedAmount,
        oldPrice: target.basePrice,
        newPrice,
      },
      priceHistory: [
        ...target.priceHistory,
        {
          timestamp: timeString,
          price: newPrice,
          note: `📉 ${actualPercent}% Price Drop detected! (Saved ₹${savedAmount})`,
          percentChange: -actualPercent,
        },
      ],
    };

    this.routes = this.routes.map((r) => (r.id === routeId ? updatedRoute : r));
    this.alertHistory = [alertEvent, ...this.alertHistory];

    this.triggerSimulatedPush(alertEvent);
    this.notifyListeners(alertEvent);

    return { route: updatedRoute, alert: alertEvent };
  }

  // Simulate scanning all active routes and triggering realistic price fluctuations
  public simulateLiveScan(): { updatedCount: number; alerts: PriceDropAlertEvent[] } {
    const alerts: PriceDropAlertEvent[] = [];
    const timeString = new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    this.routes = this.routes.map((r, idx) => {
      if (!r.isActive) return r;

      // 50% chance of a significant drop (10% to 22%), otherwise minor fluctuation
      const shouldDropSignificantly = idx === 0 || Math.random() > 0.45;
      let newPrice = r.currentPrice;
      let note = "Fare refreshed";
      let dropPercent = 0;

      if (shouldDropSignificantly) {
        dropPercent = Math.floor(10 + Math.random() * 14); // 10% to 23%
        const savedAmount = Math.round((r.basePrice * dropPercent) / 100);
        newPrice = Math.max(499, r.basePrice - savedAmount);
        note = `📉 Live Drop ${dropPercent}% off (Save ₹${savedAmount})`;

        if (dropPercent >= (r.targetDropPercent || 10)) {
          const alert: PriceDropAlertEvent = {
            id: `alert-scan-${Date.now()}-${r.id}`,
            routeId: r.id,
            routeType: r.type,
            originCode: r.originCode,
            destinationCode: r.destinationCode,
            originCity: r.originCity,
            destinationCity: r.destinationCity,
            carrierName: r.carrierName || "Fare",
            journeyDate: r.journeyDate,
            originalPrice: r.basePrice,
            currentPrice: newPrice,
            dropPercent,
            savedAmount,
            timestamp: timeString,
            channel: "push",
            title: `⚡ ${dropPercent}% Price Drop on ${r.originCode} ➔ ${r.destinationCode}`,
            message: `${r.carrierName} is now ₹${newPrice.toLocaleString("en-IN")} (was ₹${r.basePrice.toLocaleString("en-IN")})!`,
            actionUrl: r.type === "flight" ? "#flights" : "#trains",
          };
          alerts.push(alert);
        }
      } else {
        // Minor ±2-4% fluctuation
        const changePercent = Math.floor(Math.random() * 6) - 3;
        newPrice = Math.round(r.basePrice * (1 + changePercent / 100));
        note = `Routine radar ping: ₹${newPrice}`;
      }

      return {
        ...r,
        currentPrice: newPrice,
        lowestPriceSeen: Math.min(r.lowestPriceSeen, newPrice),
        highestPriceSeen: Math.max(r.highestPriceSeen, newPrice),
        lastCheckedAt: new Date().toISOString(),
        alertTriggered: alerts.some((a) => a.routeId === r.id) || r.alertTriggered,
        priceHistory: [
          ...r.priceHistory.slice(-10),
          {
            timestamp: timeString,
            price: newPrice,
            note,
            percentChange: dropPercent ? -dropPercent : undefined,
          },
        ],
      };
    });

    if (alerts.length > 0) {
      this.alertHistory = [...alerts, ...this.alertHistory];
      // Trigger push for first alert
      this.triggerSimulatedPush(alerts[0]);
    }

    this.notifyListeners(alerts[0]);
    return { updatedCount: this.routes.length, alerts };
  }

  // Reset a route price back to baseline
  public resetRoutePrice(routeId: string) {
    this.routes = this.routes.map((r) => {
      if (r.id === routeId) {
        return {
          ...r,
          currentPrice: r.basePrice,
          alertTriggered: false,
          lastCheckedAt: new Date().toISOString(),
          priceHistory: [
            ...r.priceHistory,
            {
              timestamp: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
              price: r.basePrice,
              note: "Reset to base fare",
            },
          ],
        };
      }
      return r;
    });
    this.notifyListeners();
  }

  // =========================================================================
  // PRICE FORECAST ENGINE (7-Day Trend Prediction & Historical Signals)
  // =========================================================================
  public getRouteForecast(route: WatchedRoute): RoutePriceForecast {
    const now = new Date("2026-08-26T02:45:00Z");
    const journey = new Date(route.journeyDate);
    const diffDays = Math.max(1, Math.ceil((journey.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const prices = [
      route.basePrice,
      route.currentPrice,
      route.lowestPriceSeen,
      route.highestPriceSeen,
      ...route.priceHistory.map((p) => p.price),
    ].filter((p) => typeof p === "number" && p > 0);

    const histMin = Math.min(...prices);
    const histMax = Math.max(...prices);
    const histAvg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    const isFlight = route.type === "flight";
    const currentPrice = route.currentPrice;
    const isCurrentAtFloor = currentPrice <= histMin * 1.03;
    const isCurrentAtCeiling = currentPrice >= histMax * 0.95;

    let recommendation: ForecastRecommendation = "buy_now";
    let recommendationTitle = "";
    let recommendationBadge = "";
    let confidenceScore = 85;
    let predictedTrend: "rising" | "falling" | "stable" = "rising";
    let predicted7DayChangePercent = 12;
    let volatilityLevel: "Low" | "Medium" | "High" = "Medium";
    let bestBookingWindowSummary = "";
    const keyHistoricalSignals: RoutePriceForecast["keyHistoricalSignals"] = [];

    if (isFlight) {
      if (diffDays <= 3) {
        // Last minute surge
        recommendation = "buy_now";
        recommendationTitle = "Likely to Surge (+18% to +30%)";
        recommendationBadge = "Strong Buy • Fast Exhaustion";
        confidenceScore = 92;
        predictedTrend = "rising";
        predicted7DayChangePercent = 24;
        volatilityLevel = "High";
        bestBookingWindowSummary = "Book within next 6–12 hours before final fare bucket lock.";

        keyHistoricalSignals.push(
          {
            title: "T-Minus 72h Yield Management",
            description: "Airlines automatically bump unsold seat inventory to higher revenue buckets 72h prior to departure.",
            impact: "warning",
            iconType: "flame",
          },
          {
            title: "Historical Route Volatility",
            description: `On ${route.originCode} ➔ ${route.destinationCode}, average last-minute jump is +₹${Math.round(currentPrice * 0.22).toLocaleString("en-IN")}.`,
            impact: "warning",
            iconType: "trending",
          },
          {
            title: "Current vs 30-Day High",
            description: `Current fare (₹${currentPrice.toLocaleString("en-IN")}) is within range of standard departures.`,
            impact: "positive",
            iconType: "ticket",
          }
        );
      } else if (diffDays <= 10) {
        // Medium close window
        if (isCurrentAtFloor || currentPrice <= route.basePrice) {
          recommendation = "buy_now";
          recommendationTitle = "Likely to Rise (+8% to +15%)";
          recommendationBadge = "Good Value • Buy Recommended";
          confidenceScore = 87;
          predictedTrend = "rising";
          predicted7DayChangePercent = 14;
          volatilityLevel = "Medium";
          bestBookingWindowSummary = "Current fare is near the 30-day floor. Lock in within 24 hours.";

          keyHistoricalSignals.push(
            {
              title: "30-Day Historical Low Match",
              description: `Current price is near historical lowest recorded (₹${histMin.toLocaleString("en-IN")}). Risk of drop is under 12%.`,
              impact: "positive",
              iconType: "shield",
            },
            {
              title: "Prime Booking Window Closing",
              description: "Airlines start step-ladder fare adjustments 7-10 days before flight date.",
              impact: "warning",
              iconType: "clock",
            }
          );
        } else {
          recommendation = "wait_for_drop";
          recommendationTitle = "Likely to Dip (-6% to -12%)";
          recommendationBadge = "Wait & Watch • Drop Expected";
          confidenceScore = 78;
          predictedTrend = "falling";
          predicted7DayChangePercent = -9;
          volatilityLevel = "Medium";
          bestBookingWindowSummary = "Wait for mid-week airline promotional repricing (Wed/Thu).";

          keyHistoricalSignals.push(
            {
              title: "Mid-Week Fare Re-alignment",
              description: "Historical data shows carrier repricing typically dips prices 8-12% on Wednesday/Thursday mornings.",
              impact: "positive",
              iconType: "calendar",
            },
            {
              title: "Current Fare Elevated",
              description: `Current price is ${Math.round(((currentPrice - histMin) / histMin) * 100)}% above recent 30-day floor of ₹${histMin.toLocaleString("en-IN")}.`,
              impact: "warning",
              iconType: "trending",
            }
          );
        }
      } else {
        // Far window (11+ days)
        if (isCurrentAtFloor) {
          recommendation = "buy_now";
          recommendationTitle = "Exceptional Early-Bird Deal";
          recommendationBadge = "Flash Low • Lock Now";
          confidenceScore = 89;
          predictedTrend = "rising";
          predicted7DayChangePercent = 16;
          volatilityLevel = "Low";
          bestBookingWindowSummary = "Early bird inventory is at minimum floor. Prices won't drop further.";

          keyHistoricalSignals.push(
            {
              title: "Lowest Historical Tier",
              description: `Fare matches lowest 5th percentile for ${route.carrierName || "flights"} on this route.`,
              impact: "positive",
              iconType: "shield",
            }
          );
        } else {
          recommendation = "wait_for_drop";
          recommendationTitle = "Likely to Fluctuate / Drop (-5% to -10%)";
          recommendationBadge = "Wait • Sale Window Ahead";
          confidenceScore = 74;
          predictedTrend = "falling";
          predicted7DayChangePercent = -7;
          volatilityLevel = "Low";
          bestBookingWindowSummary = "Early window allows waiting for tactical weekend flash discounts.";

          keyHistoricalSignals.push(
            {
              title: "Advance Purchase Curve",
              description: "More than 10 days out; airlines typically introduce promotional buckets to stimulate bookings.",
              impact: "neutral",
              iconType: "calendar",
            }
          );
        }
      }
    } else {
      // TRAIN FORECAST
      if (diffDays <= 2) {
        recommendation = "buy_now";
        recommendationTitle = "Chart Preparation Window (Surge / Exhaustion)";
        recommendationBadge = "Urgent • Tatkal & Premium Quota";
        confidenceScore = 95;
        predictedTrend = "rising";
        predicted7DayChangePercent = 20;
        volatilityLevel = "High";
        bestBookingWindowSummary = "Book instantly before quota conversion and premium tatkal flexi-fares trigger.";

        keyHistoricalSignals.push(
          {
            title: "IRCTC Dynamic Flexi-Fare Rule",
            description: "Flexi-fare on Rajdhani/Vande Bharat steps up 10% for every 10% blocks booked (max 1.5x base fare).",
            impact: "warning",
            iconType: "flame",
          },
          {
            title: "Tatkal & Waiting List Surge",
            description: "General allocation exhausted. Remaining premium tatkal seats will command maximum surcharge.",
            impact: "warning",
            iconType: "ticket",
          }
        );
      } else if (diffDays <= 7) {
        recommendation = "buy_now";
        recommendationTitle = "Likely to Rise (+10% Flexi-Tier)";
        recommendationBadge = "Buy Now • Berths Filling";
        confidenceScore = 86;
        predictedTrend = "rising";
        predicted7DayChangePercent = 10;
        volatilityLevel = "Medium";
        bestBookingWindowSummary = "Book before flexi-fare threshold is crossed in next 24-48 hours.";

        keyHistoricalSignals.push(
          {
            title: "High Demand Velocity",
            description: "Average booking speed on this express route is 45 berths/day over the last 72 hours.",
            impact: "warning",
            iconType: "trending",
          },
          {
            title: "Historical Fare Floor",
            description: `Current ₹${currentPrice.toLocaleString("en-IN")} is standard base rate with zero flexi penalty.`,
            impact: "positive",
            iconType: "shield",
          }
        );
      } else {
        recommendation = "fair_price";
        recommendationTitle = "Stable IRCTC Standard Tariff";
        recommendationBadge = "Stable Rate • Normal Booking";
        confidenceScore = 80;
        predictedTrend = "stable";
        predicted7DayChangePercent = 0;
        volatilityLevel = "Low";
        bestBookingWindowSummary = "Fares are fixed by IRCTC distance slab; no immediate surge expected.";

        keyHistoricalSignals.push(
          {
            title: "Fixed Tariff Window",
            description: "Advance reservation period is open with regular quota availability.",
            impact: "positive",
            iconType: "shield",
          }
        );
      }
    }

    // Generate 7-Day Day-by-Day Forecast Trajectory
    const dailyTrajectory: DayForecastPoint[] = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Trend trajectory curve
    for (let i = 1; i <= 7; i++) {
      const forecastDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = weekdays[forecastDate.getDay()];
      const dayNum = forecastDate.getDate();
      const monthName = months[forecastDate.getMonth()];
      const dayLabel = `${dayName}, ${dayNum} ${monthName}`;

      let changeFactor = 0;
      let dayNote = "";
      let trend: "up" | "down" | "flat" = "flat";

      if (predictedTrend === "rising") {
        const step = (predicted7DayChangePercent / 7) * i;
        changeFactor = step;
        trend = "up";
        if (i === 1) dayNote = "Steady inventory check";
        else if (i === 3) dayNote = "Fare bucket step-up (+6%)";
        else if (i === 5) dayNote = "Weekend travel rush premium";
        else if (i === 7) dayNote = "Peak surge / last available bucket";
      } else if (predictedTrend === "falling") {
        if (i <= 3) {
          changeFactor = -(predicted7DayChangePercent * (i / 4));
          trend = "down";
          dayNote = "Mid-week fare adjustment expected";
        } else {
          changeFactor = -predicted7DayChangePercent + (i - 3) * 1.5;
          trend = "up";
          dayNote = "Rebound toward weekend";
        }
      } else {
        changeFactor = Math.sin(i) * 1.5;
        trend = "flat";
        dayNote = "Standard seasonal tariff";
      }

      const predictedPrice = Math.round(currentPrice * (1 + changeFactor / 100));
      const margin = Math.round(predictedPrice * 0.04);

      dailyTrajectory.push({
        dayOffset: i,
        dayLabel,
        predictedPrice,
        minRange: predictedPrice - margin,
        maxRange: predictedPrice + margin,
        trend,
        changePercent: Math.round(changeFactor),
        note: dayNote,
      });
    }

    const allProj = dailyTrajectory.map((d) => d.predictedPrice);
    const minProj = Math.min(...allProj, currentPrice);
    const maxProj = Math.max(...allProj, currentPrice);
    const mostLikely = Math.round(allProj.reduce((a, b) => a + b, 0) / allProj.length);

    return {
      routeId: route.id,
      recommendation,
      recommendationTitle,
      recommendationBadge,
      confidenceScore,
      predictedTrend,
      predicted7DayChangePercent,
      currentPrice,
      historicalLowestPrice: histMin,
      historicalHighestPrice: histMax,
      historicalAveragePrice: histAvg,
      expected7DayRange: {
        min: minProj,
        max: maxProj,
        mostLikely,
      },
      volatilityLevel,
      bestBookingWindowSummary,
      keyHistoricalSignals,
      dailyTrajectory,
      lastCalculatedAt: new Date().toISOString(),
    };
  }

  // =========================================================================
  // SEARCH HISTORY & SMART ROUTE ALERT ENGINE
  // =========================================================================

  public getSearchHistory(): SearchHistoryItem[] {
    return [...this.searchHistory];
  }

  public recordSearch(
    item: Omit<SearchHistoryItem, "id" | "timestamp">
  ): SearchHistoryItem {
    const existingIndex = this.searchHistory.findIndex(
      (s) =>
        s.type === item.type &&
        s.originCode.toUpperCase() === item.originCode.toUpperCase() &&
        s.destinationCode.toUpperCase() === item.destinationCode.toUpperCase() &&
        s.searchedDate === item.searchedDate
    );

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    let recordedItem: SearchHistoryItem;

    if (existingIndex >= 0) {
      recordedItem = {
        ...this.searchHistory[existingIndex],
        ...item,
        timestamp: nowStr,
      };
      this.searchHistory[existingIndex] = recordedItem;
    } else {
      recordedItem = {
        id: `search-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...item,
        timestamp: nowStr,
      };
      this.searchHistory.unshift(recordedItem);
      if (this.searchHistory.length > 25) {
        this.searchHistory = this.searchHistory.slice(0, 25);
      }
    }

    this.saveToStorage();
    this.notifyListeners();

    // Check if this new search yields a high-value smart route alert (savings >= 18%)
    const alert = this.computeSmartAlertForSearch(recordedItem);
    if (alert && alert.maxSavingsPercent >= 18 && !this.dismissedSmartAlertIds.has(alert.id)) {
      this.dispatchSmartRouteNotification(alert);
    }

    window.dispatchEvent(
      new CustomEvent("bharatyatra:search-history-updated", {
        detail: { search: recordedItem, all: this.searchHistory },
      })
    );

    return recordedItem;
  }

  public removeSearchItem(id: string) {
    this.searchHistory = this.searchHistory.filter((s) => s.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  public clearSearchHistory() {
    this.searchHistory = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  public resetSearchHistoryToDefault() {
    this.searchHistory = INITIAL_SEARCH_HISTORY;
    this.saveToStorage();
    this.notifyListeners();
  }

  // Generate alternative date price options (+/- 3 days)
  public generateAlternativeDates(
    originCode: string,
    destinationCode: string,
    searchedDateStr: string,
    currentPrice: number,
    type: PriceWatchTransportType = "flight",
    carrierName?: string
  ): AlternativeDateOption[] {
    const baseDate = new Date(searchedDateStr || "2026-08-28");
    if (isNaN(baseDate.getTime())) {
      return [];
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullDayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const options: AlternativeDateOption[] = [];

    // Evaluate -3 to +3 days
    for (let offset = -3; offset <= 3; offset++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + offset);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const isoDate = `${yyyy}-${mm}-${dd}`;
      const dayOfWeekIdx = d.getDay();
      const dayOfWeek = fullDayNames[dayOfWeekIdx];
      const formattedDate = `${dayNames[dayOfWeekIdx]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;

      // Date pricing heuristic based on day of week and offset
      let modifier = 0;
      let reason = "Standard scheduled tariff";

      if (offset === 0) {
        modifier = 0;
        reason = "Searched Date Tariff";
      } else {
        // Evaluate day of week characteristics
        if (dayOfWeekIdx === 2) {
          // Tuesday: Off-peak mid-week lowest tariff
          modifier = type === "flight" ? -0.28 : -0.22;
          reason = "Mid-week off-peak dip • Lowest fare bucket";
        } else if (dayOfWeekIdx === 3) {
          // Wednesday: Mid-week low tariff
          modifier = type === "flight" ? -0.25 : -0.18;
          reason = "Mid-week discount • Low business rush";
        } else if (dayOfWeekIdx === 4) {
          // Thursday: Shoulder day
          modifier = type === "flight" ? -0.14 : -0.10;
          reason = "Pre-weekend shoulder saver fare";
        } else if (dayOfWeekIdx === 1) {
          // Monday: Post-weekend normalization
          modifier = type === "flight" ? -0.12 : -0.08;
          reason = "Monday non-peak afternoon window";
        } else if (dayOfWeekIdx === 5) {
          // Friday: Weekend rush peak
          modifier = type === "flight" ? +0.24 : +0.18;
          reason = "Friday evening weekend rush surcharge";
        } else if (dayOfWeekIdx === 0) {
          // Sunday: Return rush peak
          modifier = type === "flight" ? +0.28 : +0.20;
          reason = "Sunday prime return surge demand";
        } else if (dayOfWeekIdx === 6) {
          // Saturday: Mid weekend
          modifier = type === "flight" ? +0.06 : +0.04;
          reason = "Saturday regular leisure tariff";
        }

        // Additional offset penalty for dates closer than 2 days
        if (offset < 0 && Math.abs(offset) > 2) {
          modifier -= 0.04; // Early flight bonus
        }
      }

      const calculatedPrice = Math.max(
        type === "flight" ? 2200 : 650,
        Math.round(currentPrice * (1 + modifier))
      );

      const savingsAmount = currentPrice - calculatedPrice;
      const savingsPercent = Math.round((savingsAmount / currentPrice) * 100);

      let status: AlternativeDateOption["status"] = "same";
      if (offset === 0) {
        status = "same";
      } else if (savingsPercent >= 15) {
        status = "cheaper";
      } else if (savingsPercent > 0) {
        status = "cheaper";
      } else if (savingsPercent < -10) {
        status = "peak";
      } else {
        status = "higher";
      }

      options.push({
        date: isoDate,
        formattedDate,
        dayOfWeek,
        dayOffset: offset,
        price: calculatedPrice,
        savingsAmount: Math.max(0, savingsAmount),
        savingsPercent: Math.max(0, savingsPercent),
        status,
        reason,
        carrierName: carrierName || (type === "flight" ? "IndiGo / Air India" : "IRCTC Express"),
        isSearchedDate: offset === 0,
      });
    }

    // Mark the cheapest date
    let minPrice = Infinity;
    options.forEach((opt) => {
      if (opt.price < minPrice) {
        minPrice = opt.price;
      }
    });

    options.forEach((opt) => {
      if (opt.price === minPrice && opt.dayOffset !== 0) {
        opt.status = "cheapest";
      }
    });

    return options;
  }

  // Compute a single smart route alert for a search item
  public computeSmartAlertForSearch(search: SearchHistoryItem): SmartRouteAlert | null {
    const alternativeDates = this.generateAlternativeDates(
      search.originCode,
      search.destinationCode,
      search.searchedDate,
      search.currentPrice,
      search.type,
      search.carrierName
    );

    if (!alternativeDates || alternativeDates.length === 0) return null;

    // Find best alternative date with highest savings
    const bestAlternative = [...alternativeDates].sort(
      (a, b) => b.savingsAmount - a.savingsAmount
    )[0];

    if (!bestAlternative || bestAlternative.savingsAmount <= 0 || bestAlternative.isSearchedDate) {
      return null;
    }

    // Format searched date
    const sDate = new Date(search.searchedDate);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const searchedFormattedDate = !isNaN(sDate.getTime())
      ? `${dayNames[sDate.getDay()]}, ${sDate.getDate()} ${monthNames[sDate.getMonth()]}`
      : search.searchedDate;

    // Classify savings tag and generate smart descriptive messaging
    let savingsTag: SmartSavingsTag = "midweek_dip";
    let alertBadge = `Save ₹${bestAlternative.savingsAmount.toLocaleString("en-IN")} (-${bestAlternative.savingsPercent}%)`;
    let alertTitle = `Smart Date Alert: Switch to ${bestAlternative.formattedDate}`;
    let alertDescription = `Fly on ${bestAlternative.formattedDate} instead of ${searchedFormattedDate} to drop fare from ₹${search.currentPrice.toLocaleString("en-IN")} to ₹${bestAlternative.price.toLocaleString("en-IN")}.`;

    if (bestAlternative.dayOfWeek === "Tuesday" || bestAlternative.dayOfWeek === "Wednesday") {
      savingsTag = "midweek_dip";
      alertTitle = `💡 Mid-Week Fare Dip Detected (${bestAlternative.dayOfWeek})`;
      alertDescription = `Departing on ${bestAlternative.formattedDate} avoids peak weekend airline pricing, saving ₹${bestAlternative.savingsAmount.toLocaleString("en-IN")} (${bestAlternative.savingsPercent}% lower).`;
    } else if (bestAlternative.dayOffset < 0) {
      savingsTag = "weekend_avoidance";
      alertTitle = `🔥 Avoid Peak Rush: Travel ${Math.abs(bestAlternative.dayOffset)} days earlier`;
      alertDescription = `Switching departure to ${bestAlternative.formattedDate} unlocks low-tier fare seats and saves ₹${bestAlternative.savingsAmount.toLocaleString("en-IN")}.`;
    } else if (search.type === "train") {
      savingsTag = "tatkal_alternative";
      alertTitle = `🚄 Non-Flexi Train Tariff Available on ${bestAlternative.formattedDate}`;
      alertDescription = `IRCTC base quota open at standard non-dynamic rates. Save ₹${bestAlternative.savingsAmount.toLocaleString("en-IN")} vs high-demand surge dates.`;
    }

    const alertId = `smart-alert-${search.id}-${bestAlternative.date}`;

    return {
      id: alertId,
      searchId: search.id,
      routeType: search.type,
      originCode: search.originCode,
      originCity: search.originCity,
      destinationCode: search.destinationCode,
      destinationCity: search.destinationCity,
      searchedDate: search.searchedDate,
      searchedFormattedDate,
      searchedPrice: search.currentPrice,
      carrierName: search.carrierName || (search.type === "flight" ? "IndiGo" : "IRCTC"),
      bestAlternativeDate: bestAlternative,
      alternativeDates,
      maxSavingsAmount: bestAlternative.savingsAmount,
      maxSavingsPercent: bestAlternative.savingsPercent,
      savingsTag,
      alertBadge,
      alertTitle,
      alertDescription,
      confidenceScore: 88 + Math.min(10, Math.floor(bestAlternative.savingsPercent / 3)),
      isActive: true,
      timestamp: search.timestamp || new Date().toISOString(),
    };
  }

  // Get all smart route alerts computed across user's search history
  public getSmartRouteAlerts(): SmartRouteAlert[] {
    const alerts: SmartRouteAlert[] = [];

    for (const search of this.searchHistory) {
      const alert = this.computeSmartAlertForSearch(search);
      if (alert && alert.maxSavingsAmount >= 300) {
        // Check if dismissed
        if (!this.dismissedSmartAlertIds.has(alert.id)) {
          alerts.push(alert);
        }
      }
    }

    // Sort by largest savings amount first
    return alerts.sort((a, b) => b.maxSavingsAmount - a.maxSavingsAmount);
  }

  public dismissSmartAlert(id: string) {
    this.dismissedSmartAlertIds.add(id);
    this.saveToStorage();
    this.notifyListeners();
  }

  public restoreSmartAlerts() {
    this.dismissedSmartAlertIds.clear();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Dispatch proactive notification for smart route alert
  public dispatchSmartRouteNotification(alert: SmartRouteAlert) {
    this.playNotificationChime();
    window.dispatchEvent(
      new CustomEvent("bharatyatra:smart-route-alert", { detail: alert })
    );
  }

  // Simulate proactive discovery of a high-value alternative date
  public simulateSmartAlertDiscovery(
    type: PriceWatchTransportType = "flight"
  ): SmartRouteAlert {
    const defaultSearch: SearchHistoryItem =
      type === "flight"
        ? {
            id: `sim-search-${Date.now()}`,
            type: "flight",
            originCode: "DEL",
            originCity: "New Delhi",
            destinationCode: "BOM",
            destinationCity: "Mumbai",
            searchedDate: "2026-08-28", // Friday
            currentPrice: 5200,
            carrierName: "IndiGo 6E-2041",
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          }
        : {
            id: `sim-search-${Date.now()}`,
            type: "train",
            originCode: "NDLS",
            originCity: "New Delhi",
            destinationCode: "BSB",
            destinationCity: "Varanasi",
            searchedDate: "2026-08-28", // Friday
            currentPrice: 1980,
            carrierName: "Vande Bharat Express (22436)",
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          };

    this.recordSearch(defaultSearch);
    const alert = this.computeSmartAlertForSearch(defaultSearch)!;
    this.dispatchSmartRouteNotification(alert);
    return alert;
  }
}

export const PriceWatchService = new PriceWatchServiceClass();
