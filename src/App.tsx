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
import { CompareModal } from "./components/CompareModal";
import { NotificationsModal } from "./components/NotificationsModal";
import { TripPlannerModal } from "./components/TripPlannerModal";
import { OffersModal } from "./components/OffersModal";
import { BusinessModelModal } from "./components/BusinessModelModal";
import { AdminPlatformModal } from "./components/AdminPlatformModal";
import { DestinationGuidesModal } from "./components/DestinationGuidesModal";
import { CustomerReviewsModal } from "./components/CustomerReviewsModal";
import { HelpSupportModal } from "./components/HelpSupportModal";
import { CentralBookingProfileModal } from "./components/CentralBookingProfileModal";
import { SuperDashboardModal } from "./components/SuperDashboardModal";
import { RazorpayDashboardModal } from "./components/RazorpayDashboardModal";
import { PartnerSubscriptionPortalModal } from "./components/partner/PartnerSubscriptionPortalModal";
import { ApiArchitectureExplorerModal } from "./components/ApiArchitectureExplorerModal";
import { AiCrmMarketingSuiteModal } from "./components/crm/AiCrmMarketingSuiteModal";
import { SimulatedPushNotificationBanner } from "./components/pricewatch/SimulatedPushNotificationBanner";
import { SmartRouteAlertBanner } from "./components/pricewatch/SmartRouteAlertBanner";
import { RoutePriceWatchModal } from "./components/pricewatch/RoutePriceWatchModal";
import { MultiTripPlanTemplate } from "./data/travelExperienceData";
import { CalendarTimingsModal } from "./components/calendar/CalendarTimingsModal";
import { CalendarServiceType } from "./types";

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
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isTripPlannerModalOpen, setIsTripPlannerModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isBusinessModelModalOpen, setIsBusinessModelModalOpen] = useState(false);
  const [businessModelInitialStream, setBusinessModelInitialStream] = useState<RevenueStreamId>("booking_commissions");
  const [isAdminPlatformModalOpen, setIsAdminPlatformModalOpen] = useState(false);
  const [isDestinationGuidesModalOpen, setIsDestinationGuidesModalOpen] = useState(false);
  const [isCustomerReviewsModalOpen, setIsCustomerReviewsModalOpen] = useState(false);
  const [isHelpSupportModalOpen, setIsHelpSupportModalOpen] = useState(false);
  const [isCentralBookingProfileOpen, setIsCentralBookingProfileOpen] = useState(false);
  const [isSuperDashboardOpen, setIsSuperDashboardOpen] = useState(false);
  const [superDashboardInitialOperator, setSuperDashboardInitialOperator] = useState("bus");
  const [isRazorpayDashboardOpen, setIsRazorpayDashboardOpen] = useState(false);
  const [isPartnerSubscriptionModalOpen, setIsPartnerSubscriptionModalOpen] = useState(false);
  const [isApiArchitectureExplorerOpen, setIsApiArchitectureExplorerOpen] = useState(false);
  const [isAiCrmMarketingSuiteOpen, setIsAiCrmMarketingSuiteOpen] = useState(false);
  const [isPriceWatchModalOpen, setIsPriceWatchModalOpen] = useState(false);
  const [isCalendarTimingsModalOpen, setIsCalendarTimingsModalOpen] = useState(false);
  const [calendarModalInitialService, setCalendarModalInitialService] = useState<CalendarServiceType>("flights");

  const handleOpenCalendarTimings = (service: CalendarServiceType = "flights") => {
    setCalendarModalInitialService(service);
    setIsCalendarTimingsModalOpen(true);
  };

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

  const handleOpenCentralBookingProfile = () => {
    setIsCentralBookingProfileOpen(true);
  };

  const handleOpenBusinessModel = (stream: RevenueStreamId = "booking_commissions") => {
    setBusinessModelInitialStream(stream);
    setIsBusinessModelModalOpen(true);
  };

  const handleOpenAdminPlatform = () => {
    setIsAdminPlatformModalOpen(true);
  };

  const handleOpenDestinationGuides = () => {
    setIsDestinationGuidesModalOpen(true);
  };

  const handleOpenCustomerReviews = () => {
    setIsCustomerReviewsModalOpen(true);
  };

  const handleOpenHelpSupport = () => {
    setIsHelpSupportModalOpen(true);
  };

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

  const handleBookCompletePackage = (pkg: MultiTripPlanTemplate) => {
    const packageCost = pkg.discountedPackagePrice || pkg.totalEstimatedPrice || 24999;
    const newBooking: BookingItem = {
      id: `BK-PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: "tours",
      title: pkg.title,
      subtitle: `${pkg.duration} • ${pkg.destination}`,
      date: "01 Sep 2026",
      time: "Full Journey Package",
      status: "confirmed",
      pnr: `PKG-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: packageCost,
      passengers: 2,
      seatInfo: "Inclusive: Flights, Vande Bharat, 5★ Heritage Hotels & Private Cab",
      invoiceNumber: `INV-PKG-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      yatraCoins: prev.yatraCoins + 500,
    }));
    setIsTripPlannerModalOpen(false);
    setIsMyTripsModalOpen(true);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
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
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenTripPlanner={() => setIsTripPlannerModalOpen(true)}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenPriceWatch={handleOpenPriceWatch}
        onOpenCentralBookingProfile={handleOpenCentralBookingProfile}
        onOpenAdminPlatform={handleOpenAdminPlatform}
        onOpenDestinationGuides={handleOpenDestinationGuides}
        onOpenCustomerReviews={handleOpenCustomerReviews}
        onOpenHelpSupport={handleOpenHelpSupport}
        onOpenSuperDashboard={handleOpenSuperDashboard}
        onOpenRazorpayDashboard={() => setIsRazorpayDashboardOpen(true)}
        onOpenPartnerSubscription={handleOpenPartnerSubscription}
        onOpenApiArchitectureExplorer={() => setIsApiArchitectureExplorerOpen(true)}
        onOpenAiCrmMarketingSuite={() => setIsAiCrmMarketingSuiteOpen(true)}
        onOpenCalendarTimings={handleOpenCalendarTimings}
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
            onOpenCustomerReviews={handleOpenCustomerReviews}
            onOpenHelpSupport={handleOpenHelpSupport}
            onOpenTripPlanner={() => setIsTripPlannerModalOpen(true)}
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
              BY
            </div>
            <span className="font-bold text-white">BharatYatra Super App</span>
            <span>• Verified Partner of IRCTC, AAI, State Roadways &amp; Luxury Hospitality</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>© 2026 BharatYatra Technologies Pvt. Ltd.</span>
            <span>•</span>
            <button onClick={handleOpenCustomerReviews} className="hover:text-amber-400 transition-colors">
              Verified Reviews
            </button>
            <span>•</span>
            <button onClick={handleOpenHelpSupport} className="hover:text-sky-400 transition-colors">
              24x7 Helpdesk &amp; SOS
            </button>
            <span>•</span>
            <button onClick={handleOpenAdminPlatform} className="hover:text-amber-400 transition-colors">
              Admin Platform
            </button>
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
              activeCategory === "all" ? "text-[#0B5ED7]" : "text-slate-500 hover:text-[#172033]"
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
                <span className="absolute -top-1 -right-2 bg-[#FF8A00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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

      {/* Customer Reviews & Ratings Modal */}
      <CustomerReviewsModal
        isOpen={isCustomerReviewsModalOpen}
        onClose={() => setIsCustomerReviewsModalOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsCustomerReviewsModalOpen(false);
        }}
      />

      {/* Customer 24x7 Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpSupportModalOpen}
        onClose={() => setIsHelpSupportModalOpen(false)}
        onOpenAIDrawer={() => {
          setIsHelpSupportModalOpen(false);
          setIsAIDrawerOpen(true);
        }}
      />

      {/* Master Operations & Admin Console Modal */}
      <AdminPlatformModal
        isOpen={isAdminPlatformModalOpen}
        onClose={() => setIsAdminPlatformModalOpen(false)}
      />

      {/* Destination Guides Modal */}
      <DestinationGuidesModal
        isOpen={isDestinationGuidesModalOpen}
        onClose={() => setIsDestinationGuidesModalOpen(false)}
        onBookBundle={(bundle, cat) => handleInitiateBooking(bundle, cat)}
      />

      {/* Global Universal Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        currentLocation={currentLocation}
        userProfile={userProfile}
        onUpdateRecentSearches={handleUpdateRecentSearches}
        onOpenCalendarTimings={(service) => handleOpenCalendarTimings((service as any) || "flights")}
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

      {/* Multi-Modal Journey Comparison Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsCompareModalOpen(false);
        }}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
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
        onOpenPriceWatch={handleOpenPriceWatch}
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

      {/* Simulated Floating Push Notification Banner (Global Listener for Price Drop Events) */}
      <SimulatedPushNotificationBanner
        onOpenWatchModal={handleOpenPriceWatch}
        onBookRoute={(alert) => {
          if (alert.routeType === "flight") {
            setActiveCategory("flights");
          } else if (alert.routeType === "train") {
            setActiveCategory("trains");
          }
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


      {/* Multi-Service Journey Planner Modal */}
      <TripPlannerModal
        isOpen={isTripPlannerModalOpen}
        onClose={() => setIsTripPlannerModalOpen(false)}
        onBookCompletePackage={handleBookCompletePackage}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
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

      {/* Unified Customer Central Booking Profile Modal (11 Travel Services) */}
      <CentralBookingProfileModal
        isOpen={isCentralBookingProfileOpen}
        onClose={() => setIsCentralBookingProfileOpen(false)}
        onSelectService={(cat) => {
          setActiveCategory(cat as any);
          setIsCentralBookingProfileOpen(false);
        }}
      />

      {/* Admin Platform Control & Dynamic Commissions / Escrow Modal */}
      <AdminPlatformModal
        isOpen={isAdminPlatformModalOpen}
        onClose={() => setIsAdminPlatformModalOpen(false)}
      />

      {/* Destination Guides Modal */}
      <DestinationGuidesModal
        isOpen={isDestinationGuidesModalOpen}
        onClose={() => setIsDestinationGuidesModalOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsDestinationGuidesModalOpen(false);
        }}
      />

      {/* Customer Reviews & Feedback Modal */}
      <CustomerReviewsModal
        isOpen={isCustomerReviewsModalOpen}
        onClose={() => setIsCustomerReviewsModalOpen(false)}
      />

      {/* Help & Support / 24x7 Travel Emergency Modal */}
      <HelpSupportModal
        isOpen={isHelpSupportModalOpen}
        onClose={() => setIsHelpSupportModalOpen(false)}
      />

      {/* India Travel Super Dashboard Modal (11 Operator Profiles & Strict Backend Separation) */}
      <SuperDashboardModal
        isOpen={isSuperDashboardOpen}
        onClose={() => setIsSuperDashboardOpen(false)}
        initialOperatorId={superDashboardInitialOperator}
      />

      {/* Razorpay Gateway Operations Hub & Reconciliation Center */}
      <RazorpayDashboardModal
        isOpen={isRazorpayDashboardOpen}
        onClose={() => setIsRazorpayDashboardOpen(false)}
      />

      {/* Partner Subscription Plans & Commercial Models (Model A/B/C/D) Portal Modal */}
      <PartnerSubscriptionPortalModal
        isOpen={isPartnerSubscriptionModalOpen}
        onClose={() => setIsPartnerSubscriptionModalOpen(false)}
      />

      {/* Enterprise API Gateway & Architecture Explorer (10 Isolated Modules) */}
      <ApiArchitectureExplorerModal
        isOpen={isApiArchitectureExplorerOpen}
        onClose={() => setIsApiArchitectureExplorerOpen(false)}
      />

      {/* AI Automation, Email & WhatsApp CRM, SEO, Paid Ads & Lead Gen Suite (12 Modules) */}
      <AiCrmMarketingSuiteModal
        isOpen={isAiCrmMarketingSuiteOpen}
        onClose={() => setIsAiCrmMarketingSuiteOpen(false)}
      />

      {/* Universal Calendar & Timings Engine Modal */}
      <CalendarTimingsModal
        isOpen={isCalendarTimingsModalOpen}
        onClose={() => setIsCalendarTimingsModalOpen(false)}
        initialServiceType={calendarModalInitialService}
      />
    </div>
  );
}

export default App;
