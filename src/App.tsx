import React, { useState } from "react";
import { Home, Search, Tag, User } from "lucide-react";
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
import { SearchModal } from "./components/SearchModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { BookingModal } from "./components/BookingModal";
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
import { PilgrimageCustomerFunnelModal } from "./components/pilgrimage/PilgrimageCustomerFunnelModal";
import { PilgrimageAdminPipelineModal } from "./components/pilgrimage/PilgrimageAdminPipelineModal";
import { Footer, MobileNav } from "./components/common";
import { ParsedTravelIntent } from "./utils/aiIntentParser";

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
  // Bookings State (persisted to localStorage)
  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    try {
      const saved = localStorage.getItem("bharatyatra_bookings");
      if (saved) {
        const parsed: BookingItem[] = JSON.parse(saved);
        // If it only contains the old initial 3 mock bookings, wipe it clean as requested
        const isOldMockDefault =
          parsed.length === 3 &&
          parsed.some((b) => b.id === "BK-FL-8921") &&
          parsed.some((b) => b.id === "BK-TR-5540") &&
          parsed.some((b) => b.id === "BK-HT-1290");
        if (!isOldMockDefault) {
          return parsed;
        }
      }
    } catch (e) {}
    try {
      localStorage.removeItem("bharatyatra_bookings");
    } catch (e) {}
    return [];
  });

  // AI Intent Navigation Handler
  const handleExecuteTravelIntent = (intent: ParsedTravelIntent) => {
    if (intent.action === "open_offers") {
      setIsOffersModalOpen(true);
    } else if (intent.action === "open_partner") {
      setIsPartnerSubscriptionModalOpen(true);
    } else if (intent.action === "open_ai") {
      setIsAIDrawerOpen(true);
    } else if (intent.category) {
      setActiveCategory(intent.category);
    }
  };

  // Modals & Drawers
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isBusinessModelModalOpen, setIsBusinessModelModalOpen] = useState(false);
  const [businessModelInitialStream, setBusinessModelInitialStream] = useState<RevenueStreamId>("booking_commissions");
  const [isAdminPlatformModalOpen, setIsAdminPlatformModalOpen] = useState(false);
  const [isSuperDashboardOpen, setIsSuperDashboardOpen] = useState(false);
  const [superDashboardInitialOperator, setSuperDashboardInitialOperator] = useState("bus");
  const [superDashboardInitialSubView, setSuperDashboardInitialSubView] = useState<string | undefined>(undefined);
  const [isPartnerSubscriptionModalOpen, setIsPartnerSubscriptionModalOpen] = useState(false);
  const [isPriceWatchModalOpen, setIsPriceWatchModalOpen] = useState(false);
  const [isPNRPassModalOpen, setIsPNRPassModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isPilgrimageCustomerModalOpen, setIsPilgrimageCustomerModalOpen] = useState(false);
  const [isPilgrimageAdminModalOpen, setIsPilgrimageAdminModalOpen] = useState(false);

  const handleOpenPriceWatch = () => {
    setIsPriceWatchModalOpen(true);
  };

  const handleOpenPartnerSubscription = () => {
    setIsPartnerSubscriptionModalOpen(true);
  };

  const handleOpenSuperDashboard = (operatorId: string = "bus", subView?: string) => {
    setSuperDashboardInitialOperator(operatorId);
    setSuperDashboardInitialSubView(subView);
    setIsSuperDashboardOpen(true);
  };

  const handleOpenPilgrimageAdmin = () => {
    handleOpenSuperDashboard("pilgrimage", "pilgrimage_admin_pipeline");
  };

  const handleOpenPilgrimageCustomer = () => {
    handleOpenSuperDashboard("pilgrimage", "pilgrimage_yatra");
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
    setBookings((prev) => {
      const next = [newBooking, ...prev];
      try {
        localStorage.setItem("bharatyatra_bookings", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
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

    setBookings((prev) => {
      const next: BookingItem[] = prev.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b
      );
      try {
        localStorage.setItem("bharatyatra_bookings", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    if (refundAmount > 0) {
      setUserProfile((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + refundAmount,
      }));
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== bookingId);
      try {
        localStorage.setItem("bharatyatra_bookings", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleClearAllBookings = () => {
    setBookings([]);
    try {
      localStorage.removeItem("bharatyatra_bookings");
    } catch (e) {}
  };

  // Update recent searches in userProfile state
  const handleUpdateRecentSearches = (searches: string[]) => {
    setUserProfile((prev) => ({
      ...prev,
      recentSearches: searches.slice(0, 5),
    }));
  };

  const unreadNotificationsCount = 0;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B4332] flex flex-col font-sans selection:bg-[#1B4332] selection:text-white">
      {/* Universal Ecosystem Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenPriceWatch={handleOpenPriceWatch}
        onOpenAdminPlatform={handleOpenAdminPlatform}
        onOpenPilgrimageCustomer={handleOpenPilgrimageCustomer}
        onOpenPilgrimageAdmin={handleOpenPilgrimageAdmin}
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
            onOpenAIDrawer={(initialPrompt) => {
              setIsAIDrawerOpen(true);
            }}
            onExecuteIntent={handleExecuteTravelIntent}
            onOpenPartnerSubscription={handleOpenPartnerSubscription}
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
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        onOpenOffersModal={() => setIsOffersModalOpen(true)}
        onOpenPriceWatch={handleOpenPriceWatch}
        onOpenAdminPlatform={handleOpenAdminPlatform}
        onOpenPartnerSubscription={handleOpenPartnerSubscription}
      />

      {/* Mobile Fixed Bottom Navigation Bar (Home / Search / AI) */}
      <MobileNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        bookingCount={bookings.length}
      />

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

      {/* Real-time Travel Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
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
        onClose={() => {
          setIsSuperDashboardOpen(false);
          setSuperDashboardInitialSubView(undefined);
        }}
        initialOperatorId={superDashboardInitialOperator}
        initialSubView={superDashboardInitialSubView}
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

      {/* Pilgrimage Customer 8-Step Funnel Modal */}
      <PilgrimageCustomerFunnelModal
        isOpen={isPilgrimageCustomerModalOpen}
        onClose={() => setIsPilgrimageCustomerModalOpen(false)}
        onBookingCreated={handleConfirmBooking}
      />

      {/* Pilgrimage Admin 7-Step Management Pipeline Modal */}
      <PilgrimageAdminPipelineModal
        isOpen={isPilgrimageAdminModalOpen}
        onClose={() => setIsPilgrimageAdminModalOpen(false)}
      />
    </div>
  );
}

export default App;
