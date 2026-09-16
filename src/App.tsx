import React, { useState } from "react";
import { Home, Search, Ticket, Tag, User } from "lucide-react";
import { ServiceCategory, CityLocation, UserProfile, BookingItem, TravelOffer, PartnerCategory, RevenueStreamId } from "./types";
import {
  CITIES_DATABASE,
  INITIAL_USER_PROFILE,
  INITIAL_BOOKINGS,
  PROMO_OFFERS,
} from "./data/mockTravelData";

// Global Layout Components
import { Navbar } from "./components/Navbar";
import { LocationModal } from "./components/LocationModal";
import { ProfileModal } from "./components/ProfileModal";
import { SearchModal } from "./components/SearchModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { BookingModal } from "./components/BookingModal";
import { MyTripsModal } from "./components/MyTripsModal";
import { NotificationsModal } from "./components/NotificationsModal";
import { OffersModal } from "./components/OffersModal";
import { BusinessModelModal } from "./components/BusinessModelModal";
import { AdminPlatformModal } from "./components/AdminPlatformModal";
import { SuperDashboardModal } from "./components/SuperDashboardModal";
import { AiCrmMarketingSuiteModal } from "./components/crm/AiCrmMarketingSuiteModal";
import { PartnerSubscriptionPortalModal } from "./components/partner/PartnerSubscriptionPortalModal";
import { SmartRouteAlertBanner } from "./components/pricewatch/SmartRouteAlertBanner";
import { RoutePriceWatchModal } from "./components/pricewatch/RoutePriceWatchModal";
import { PNRLookupModal } from "./components/tickets/PNRLookupModal";
import { QRScannerModal } from "./components/QRScannerModal";

import { LandingPageMasterView } from "./components/landing/LandingPageMasterView";

// Dedicated Service Landing Components
import { FlightHome } from "./components/services/FlightHome";
import { TrainHome } from "./components/services/TrainHome";
import { BusHome } from "./components/services/BusHome";
import { HotelHome } from "./components/services/HotelHome";
import { LodgeHome } from "./components/services/LodgeHome";
import { ResortHome } from "./components/services/ResortHome";
import { HouseboatHome } from "./components/services/HouseboatHome";
import { TourHome } from "./components/services/TourHome";
import { YatraHome } from "./components/services/YatraHome";
import { CabHome } from "./components/services/CabHome";
import { DiningHome } from "./components/services/DiningHome";
import { CorporateHome } from "./components/services/CorporateHome";
import { TravelAgentPortal } from "./components/services/TravelAgentPortal";

export function App() {
  // Navigation & View State (Default category is 'all' for Explore Hub)
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("all");
  const [currentLocation, setCurrentLocation] = useState<CityLocation>(CITIES_DATABASE[0]); // New Delhi
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);

  // Modals & Drawers
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isMyTripsModalOpen, setIsMyTripsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isBusinessModelModalOpen, setIsBusinessModelModalOpen] = useState(false);
  const [businessModelInitialStream, setBusinessModelInitialStream] = useState<RevenueStreamId>("booking_commissions");
  const [isAdminPlatformModalOpen, setIsAdminPlatformModalOpen] = useState(false);
  const [isSuperDashboardOpen, setIsSuperDashboardOpen] = useState(false);
  const [superDashboardInitialOperator, setSuperDashboardInitialOperator] = useState("bus");
  const [isPartnerSubscriptionModalOpen, setIsPartnerSubscriptionModalOpen] = useState(false);
  const [isPriceWatchModalOpen, setIsPriceWatchModalOpen] = useState(false);
  const [isPNRPassModalOpen, setIsPNRPassModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const handleOpenPriceWatch = () => {
    setIsPriceWatchModalOpen(true);
  };

  const handleOpenPartnerSubscription = () => {
    setIsPartnerSubscriptionModalOpen(true);
  };

  const handleOpenSuperDashboard = (operatorId: string = "bus") => {
    setSuperDashboardInitialOperator(operatorId);
    setIsSuperDashboardOpen(true);
  };

  const handleOpenBusinessModel = (stream: RevenueStreamId = "booking_commissions") => {
    setBusinessModelInitialStream(stream);
    setIsBusinessModelModalOpen(true);
  };

  const handleOpenAdminPlatform = () => {
    setIsAdminPlatformModalOpen(true);
  };

  // Dedicated AI Automation & CRM Dashboard State (Admin-Only)
  const [isAiCrmModalOpen, setIsAiCrmModalOpen] = useState(false);

  // Booking Checkout State
  const [selectedBookingItem, setSelectedBookingItem] = useState<any>(null);
  const [bookingCategory, setBookingCategory] = useState<ServiceCategory>("flights");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Universal Booking Handler
  const handleInitiateBooking = (item: any, category: ServiceCategory) => {
    setSelectedBookingItem(item);
    setBookingCategory(category);
    setIsBookingModalOpen(true);
  };

  // Add confirmed booking to state & update wallet
  const handleConfirmBooking = (newBooking: BookingItem) => {
    setBookings((prev) => [newBooking, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - 200),
      yatraCoins: prev.yatraCoins + 100,
    }));
  };

  const handleAddMoney = (amount: number) => {
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
  };

  const handleCancelBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    const refundAmount = targetBooking ? targetBooking.amount : 0;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );

    if (refundAmount > 0) {
      setUserProfile((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + refundAmount,
      }));
    }
  };

  // Update recent searches in userProfile state
  const handleUpdateRecentSearches = (searches: string[]) => {
    setUserProfile((prev) => ({
      ...prev,
      recentSearches: searches.slice(0, 5),
    }));
  };

  const unreadNotificationsCount = 3;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col font-sans selection:bg-[#0B5ED7] selection:text-white">
      {/* Universal Ecosystem Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        onOpenMyTrips={() => setIsMyTripsModalOpen(true)}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenPriceWatch={handleOpenPriceWatch}
        onOpenAdminPlatform={handleOpenAdminPlatform}
        onOpenSuperDashboard={handleOpenSuperDashboard}
        onOpenPartnerSubscription={handleOpenPartnerSubscription}
        userProfile={userProfile}
        bookingCount={bookings.length}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-8">
        {activeCategory === "all" && (
          <LandingPageMasterView
            currentLocation={currentLocation.name}
            onSelectCategory={setActiveCategory}
            onInitiateBooking={handleInitiateBooking}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onOpenOffersModal={() => setIsOffersModalOpen(true)}
            onOpenPriceWatch={handleOpenPriceWatch}
          />
        )}

        {activeCategory === "flights" && (
          <FlightHome
            currentLocation={currentLocation}
            onBookFlight={(flight) => handleInitiateBooking(flight, "flights")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onOpenPriceWatch={handleOpenPriceWatch}
          />
        )}

        {activeCategory === "trains" && (
          <TrainHome
            currentLocation={currentLocation}
            onBookTrain={(train) => handleInitiateBooking(train, "trains")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onOpenPriceWatch={handleOpenPriceWatch}
          />
        )}

        {activeCategory === "buses" && (
          <BusHome
            currentLocation={currentLocation}
            onBookBus={(bus) => handleInitiateBooking(bus, "buses")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "hotels" && (
          <HotelHome
            currentLocation={currentLocation}
            onBookHotel={(hotel) => handleInitiateBooking(hotel, "hotels")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "lodges" && (
          <LodgeHome
            currentLocation={currentLocation}
            onBookLodge={(lodge) => handleInitiateBooking(lodge, "lodges")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "resorts" && (
          <ResortHome
            currentLocation={currentLocation}
            onBookResort={(resort) => handleInitiateBooking(resort, "resorts")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "houseboats" && (
          <HouseboatHome
            currentLocation={currentLocation}
            onBookHouseboat={(houseboat) => handleInitiateBooking(houseboat, "houseboats")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onAddBookingToState={handleConfirmBooking}
          />
        )}

        {activeCategory === "tours" && (
          <TourHome
            currentLocation={currentLocation}
            onBookTour={(tour) => handleInitiateBooking(tour, "tours")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "pilgrimage" && (
          <YatraHome
            currentLocation={currentLocation}
            onBookYatra={(yatra) => handleInitiateBooking(yatra, "pilgrimage")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onAddBookingToState={handleConfirmBooking}
          />
        )}

        {activeCategory === "cabs" && (
          <CabHome
            currentLocation={currentLocation}
            onBookCab={(cab) => handleInitiateBooking(cab, "cabs")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "dining" && (
          <DiningHome
            currentLocation={currentLocation}
            onBookDining={(dhaba) => handleInitiateBooking(dhaba, "dining")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "corporate" && (
          <CorporateHome
            currentLocation={currentLocation}
            onBookCorporate={(corpPlan) => handleInitiateBooking(corpPlan, "corporate")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "agent" && (
          <TravelAgentPortal
            onBookItem={(item) => handleInitiateBooking(item, item.serviceType || "flights")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}
      </main>

      {/* Multi-Column Professional Travel Footer */}
      <footer className="bg-[#111827] border-t border-slate-800 text-[#8A94A6] text-xs pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            {/* Column 1: Brand & Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0B5ED7] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
                  BY
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Bharat<span className="text-[#0B5ED7]">Yatra</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                India&apos;s unified multi-modal mobility platform integrating IRCTC rail bookings, domestic &amp; international flights, intercity bus networks, curated stays, and pilgrimage packages.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/20">IRCTC Authorized</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold border border-sky-500/20">DGCA &amp; AAI</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-amber-500/20">ISO 27001 Certified</span>
              </div>
            </div>

            {/* Column 2: Travel Services */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Travel Services</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveCategory("flights")} className="hover:text-white transition-colors cursor-pointer">
                    Domestic &amp; Global Flights
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory("trains")} className="hover:text-white transition-colors cursor-pointer">
                    IRCTC Train Bookings &amp; PNR
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory("buses")} className="hover:text-white transition-colors cursor-pointer">
                    State Roadways &amp; Luxury Buses
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory("hotels")} className="hover:text-white transition-colors cursor-pointer">
                    Verified Hotels &amp; Homestays
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory("pilgrimage")} className="hover:text-white transition-colors cursor-pointer">
                    Sacred Yatras &amp; Darshan Passes
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory("resorts")} className="hover:text-white transition-colors cursor-pointer">
                    Luxury Stays &amp; Safari Lodges
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform Tools */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Platform Features</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setIsAIDrawerOpen(true)} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    Maya AI Travel Concierge
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenPriceWatch} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    Price Drop Radar Alerts
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsOffersModalOpen(true)} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Seasonal Promo Passes
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsMyTripsModalOpen(true)} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    My Bookings &amp; Split Bills
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenPartnerSubscription} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Partner Network &amp; KYC
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust, Security & Console */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Trust &amp; Governance</h4>
              <p className="text-xs leading-relaxed text-slate-400 mb-3">
                Secure enterprise payment gateways supporting UPI, Net Banking, EMI, Section 194-O TDS automated reconciliation, and split ticketing.
              </p>
              <div className="space-y-2 text-xs">
                <div className="text-slate-400">
                  <span className="text-white font-semibold">Support:</span> 24x7 Priority Toll-Free Helpline
                </div>
                <div className="text-slate-400">
                  <span className="text-white font-semibold">Security:</span> 256-Bit SSL Encrypted
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleOpenAdminPlatform}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-bold transition-all text-[11px] cursor-pointer"
                  >
                    Admin Console
                  </button>
                  {handleOpenSuperDashboard && (
                    <button
                      onClick={() => handleOpenSuperDashboard()}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold transition-all text-[11px] cursor-pointer"
                    >
                      Super Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © 2026 BharatYatra Technologies Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Grievance Officer</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (Home / Search / Trips / Wallet / Profile) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 items-center text-center">
          {/* 1. Explore Hub */}
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeCategory === "all" ? "text-[#0B5ED7]" : "text-slate-500 hover:text-[#111827]"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Explore</span>
          </button>

          {/* 2. Search */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#0B5ED7] transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Search</span>
          </button>

          {/* 3. Trips */}
          <button
            onClick={() => setIsMyTripsModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#0B5ED7] transition-colors relative"
          >
            <div className="relative">
              <Ticket className="w-5 h-5" />
              {bookings.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#F59E0B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {bookings.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Trips</span>
          </button>

          {/* 4. Offers / Deals */}
          <button
            onClick={() => setIsOffersModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#0B5ED7] transition-colors"
          >
            <Tag className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] font-bold mt-0.5">Offers</span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#0B5ED7] transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </button>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          setIsLocationModalOpen(false);
        }}
      />

      {/* Profile & Loyalty Account Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        bookings={bookings}
        onAddMoney={handleAddMoney}
        onCancelBooking={handleCancelBooking}
        onUpdatePreferredCurrency={(curr) => setUserProfile((p) => ({ ...p, preferredCurrency: curr }))}
        onSelectSearchQuery={(queryText) => {
          setIsSearchModalOpen(true);
        }}
      />

      {/* Global Universal Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        currentLocation={currentLocation}
        userProfile={userProfile}
        onUpdateRecentSearches={handleUpdateRecentSearches}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsSearchModalOpen(false);
        }}
        onAskAI={(prompt) => {
          setIsSearchModalOpen(false);
          setIsAIDrawerOpen(true);
        }}
      />

      {/* Maya AI Travel Concierge Floating Drawer */}
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        currentLocation={currentLocation}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsAIDrawerOpen(false);
        }}
      />

      {/* Unified Fast Booking & Checkout Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        item={selectedBookingItem}
        serviceCategory={bookingCategory}
        userProfile={userProfile}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Unified My Trips & Digital Tickets Modal */}
      <MyTripsModal
        isOpen={isMyTripsModalOpen}
        onClose={() => setIsMyTripsModalOpen(false)}
        bookings={bookings}
        userProfile={userProfile}
        onCancelBooking={handleCancelBooking}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsMyTripsModalOpen(false);
        }}
      />

      {/* Real-time Travel Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onOpenMyTrips={() => setIsMyTripsModalOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsNotificationsModalOpen(false);
        }}
      />

      {/* Route Price Watch Radar Modal (Flights & Trains Price Drop Monitoring) */}
      <RoutePriceWatchModal
        isOpen={isPriceWatchModalOpen}
        onClose={() => setIsPriceWatchModalOpen(false)}
        onSelectRoute={(route) => {
          if (route.type === "flight") {
            setActiveCategory("flights");
          } else if (route.type === "train") {
            setActiveCategory("trains");
          }
          setIsPriceWatchModalOpen(false);
        }}
      />

      {/* Proactive Smart Route Alert Floating Banner (Search History Deals & Alternative Dates) */}
      <SmartRouteAlertBanner
        onOpenSmartAlertsModal={handleOpenPriceWatch}
        onApplyAlternativeDate={(routeType, date, originCode, destCode) => {
          if (routeType === "flight") {
            setActiveCategory("flights");
          } else if (routeType === "train") {
            setActiveCategory("trains");
          }
          window.dispatchEvent(
            new CustomEvent("bharatyatra:apply-alternative-date", {
              detail: { type: routeType, date, origin: originCode, dest: destCode },
            })
          );
        }}
      />


      {/* Offers & Coupons Hub Modal */}
      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => setIsOffersModalOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsOffersModalOpen(false);
        }}
      />

      {/* Business Model & Monetization Architecture Modal (9 Revenue Streams) */}
      <BusinessModelModal
        isOpen={isBusinessModelModalOpen}
        onClose={() => setIsBusinessModelModalOpen(false)}
        initialStream={businessModelInitialStream}
      />

      {/* Master Operations & Admin Platform Console Modal */}
      <AdminPlatformModal
        isOpen={isAdminPlatformModalOpen}
        onClose={() => setIsAdminPlatformModalOpen(false)}
        onOpenSuperDashboard={(operatorId) => {
          setIsAdminPlatformModalOpen(false);
          handleOpenSuperDashboard(operatorId);
        }}
        onOpenAiCrmSuite={() => {
          setIsAdminPlatformModalOpen(false);
          setIsAiCrmModalOpen(true);
        }}
      />

      {/* Standalone Separate AI Automation, WhatsApp CRM & Growth Suite Dashboard (Admin Only) */}
      <AiCrmMarketingSuiteModal
        isOpen={isAiCrmModalOpen}
        onClose={() => setIsAiCrmModalOpen(false)}
        onBackToAdminConsole={() => {
          setIsAiCrmModalOpen(false);
          setIsAdminPlatformModalOpen(true);
        }}
      />

      {/* India Travel Super Dashboard Modal (11 Operator Profiles & Strict Backend Separation) */}
      <SuperDashboardModal
        isOpen={isSuperDashboardOpen}
        onClose={() => setIsSuperDashboardOpen(false)}
        initialOperatorId={superDashboardInitialOperator}
        onOpenAdminPlatform={() => {
          setIsSuperDashboardOpen(false);
          setIsAdminPlatformModalOpen(true);
        }}
      />

      {/* Partner Subscription Plans & Commercial Models (Model A/B/C/D) Portal Modal */}
      <PartnerSubscriptionPortalModal
        isOpen={isPartnerSubscriptionModalOpen}
        onClose={() => setIsPartnerSubscriptionModalOpen(false)}
      />

      {/* PNR Barcode & QR Digital Pass Verification Modal */}
      <PNRLookupModal
        isOpen={isPNRPassModalOpen}
        onClose={() => setIsPNRPassModalOpen(false)}
        bookings={bookings}
        userProfile={userProfile}
        onOpenScanner={() => setIsScannerModalOpen(true)}
      />

      {/* Optical Barcode & QR Camera Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        bookings={bookings}
        userProfile={userProfile}
      />
    </div>
  );
}

export default App;
