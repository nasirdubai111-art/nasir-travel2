import React, { useState } from "react";
import { ServiceCategory, CityLocation, UserProfile, BookingItem, TravelOffer, PartnerCategory, RevenueStreamId } from "./types";
import {
  CITIES_DATABASE,
  INITIAL_USER_PROFILE,
  INITIAL_BOOKINGS,
  PROMO_OFFERS,
} from "./data/mockTravelData";

// Global Layout Components
import { Navbar } from "./components/Navbar";
import { MasterHome } from "./components/MasterHome";
import { LocationModal } from "./components/LocationModal";
import { ProfileModal } from "./components/ProfileModal";
import { SearchModal } from "./components/SearchModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { BookingModal } from "./components/BookingModal";
import { MyTripsModal } from "./components/MyTripsModal";
import { CompareModal } from "./components/CompareModal";
import { NotificationsModal } from "./components/NotificationsModal";
import { RewardsModal } from "./components/RewardsModal";
import { TripPlannerModal } from "./components/TripPlannerModal";
import { OffersModal } from "./components/OffersModal";
import { PartnerPortalModal } from "./components/PartnerPortalModal";
import { BusinessModelModal } from "./components/BusinessModelModal";
import { AdminPlatformModal } from "./components/AdminPlatformModal";
import { PaymentFinanceModal } from "./components/PaymentFinanceModal";
import { DestinationGuidesModal } from "./components/DestinationGuidesModal";
import { CustomerReviewsModal } from "./components/CustomerReviewsModal";
import { HelpSupportModal } from "./components/HelpSupportModal";
import { BusOperatorPortalModal } from "./components/BusOperatorPortalModal";
import { TourOperatorPortalModal } from "./components/tours/TourOperatorPortalModal";
import { AgentBackendDashboardModal } from "./components/agent/AgentBackendDashboardModal";
import { PilgrimageOperatorBackendModal } from "./components/yatra/PilgrimageOperatorBackendModal";
import { CentralBookingProfileModal } from "./components/CentralBookingProfileModal";
import { MultiTripPlanTemplate } from "./data/travelExperienceData";

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
  // Navigation & View State (ServiceCategory "all" is Master Home)
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
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isTripPlannerModalOpen, setIsTripPlannerModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isPartnerPortalOpen, setIsPartnerPortalOpen] = useState(false);
  const [partnerInitialCategory, setPartnerInitialCategory] = useState<PartnerCategory>("travel_agents");
  const [isBusinessModelModalOpen, setIsBusinessModelModalOpen] = useState(false);
  const [businessModelInitialStream, setBusinessModelInitialStream] = useState<RevenueStreamId>("booking_commissions");
  const [isAdminPlatformModalOpen, setIsAdminPlatformModalOpen] = useState(false);
  const [isPaymentFinanceModalOpen, setIsPaymentFinanceModalOpen] = useState(false);
  const [isDestinationGuidesModalOpen, setIsDestinationGuidesModalOpen] = useState(false);
  const [isCustomerReviewsModalOpen, setIsCustomerReviewsModalOpen] = useState(false);
  const [isHelpSupportModalOpen, setIsHelpSupportModalOpen] = useState(false);
  const [isBusOperatorPortalOpen, setIsBusOperatorPortalOpen] = useState(false);
  const [isTourOperatorPortalOpen, setIsTourOperatorPortalOpen] = useState(false);
  const [isTravelAgentBackendOpen, setIsTravelAgentBackendOpen] = useState(false);
  const [isPilgrimageOperatorBackendOpen, setIsPilgrimageOperatorBackendOpen] = useState(false);
  const [isCentralBookingProfileOpen, setIsCentralBookingProfileOpen] = useState(false);

  const handleOpenBusOperatorPortal = () => {
    setIsBusOperatorPortalOpen(true);
  };

  const handleOpenTourOperatorPortal = () => {
    setIsTourOperatorPortalOpen(true);
  };

  const handleOpenTravelAgentBackend = () => {
    setIsTravelAgentBackendOpen(true);
  };

  const handleOpenPilgrimageOperatorBackend = () => {
    setIsPilgrimageOperatorBackendOpen(true);
  };

  const handleOpenCentralBookingProfile = () => {
    setIsCentralBookingProfileOpen(true);
  };

  const handleOpenPartnerPortal = (category: PartnerCategory = "travel_agents") => {
    setPartnerInitialCategory(category);
    setIsPartnerPortalOpen(true);
  };

  const handleOpenBusinessModel = (stream: RevenueStreamId = "booking_commissions") => {
    setBusinessModelInitialStream(stream);
    setIsBusinessModelModalOpen(true);
  };

  const handleOpenAdminPlatform = () => {
    setIsAdminPlatformModalOpen(true);
  };

  const handleOpenPaymentFinance = () => {
    setIsPaymentFinanceModalOpen(true);
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
        onOpenRewards={() => setIsRewardsModalOpen(true)}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenPartnerPortal={() => handleOpenPartnerPortal("travel_agents")}
        onOpenBusOperatorPortal={handleOpenBusOperatorPortal}
        onOpenTourOperatorPortal={handleOpenTourOperatorPortal}
        onOpenTravelAgentBackend={handleOpenTravelAgentBackend}
        onOpenCentralBookingProfile={handleOpenCentralBookingProfile}
        onOpenAdminPlatform={handleOpenAdminPlatform}
        onOpenPaymentFinance={handleOpenPaymentFinance}
        onOpenDestinationGuides={handleOpenDestinationGuides}
        onOpenCustomerReviews={handleOpenCustomerReviews}
        onOpenHelpSupport={handleOpenHelpSupport}
        userProfile={userProfile}
        bookingCount={bookings.length}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeCategory === "all" && (
          <MasterHome
            currentLocation={currentLocation}
            onSelectCategory={setActiveCategory}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onInitiateBooking={handleInitiateBooking}
            onOpenCompare={() => setIsCompareModalOpen(true)}
            onOpenTripPlanner={() => setIsTripPlannerModalOpen(true)}
            onOpenRewards={() => setIsRewardsModalOpen(true)}
            onOpenOffers={() => setIsOffersModalOpen(true)}
            onOpenPartnerPortal={handleOpenPartnerPortal}
            onOpenAdminPlatform={handleOpenAdminPlatform}
            onOpenPaymentFinance={handleOpenPaymentFinance}
            onOpenDestinationGuides={handleOpenDestinationGuides}
            onOpenCustomerReviews={handleOpenCustomerReviews}
            onOpenHelpSupport={handleOpenHelpSupport}
          />
        )}

        {activeCategory === "flights" && (
          <FlightHome
            currentLocation={currentLocation}
            onBookFlight={(flight) => handleInitiateBooking(flight, "flights")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "trains" && (
          <TrainHome
            currentLocation={currentLocation}
            onBookTrain={(train) => handleInitiateBooking(train, "trains")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "buses" && (
          <BusHome
            currentLocation={currentLocation}
            onBookBus={(bus) => handleInitiateBooking(bus, "buses")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onOpenBusOperatorPortal={handleOpenBusOperatorPortal}
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
            onOpenPilgrimageOperatorBackend={handleOpenPilgrimageOperatorBackend}
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
            <button onClick={() => handleOpenPartnerPortal("travel_agents")} className="hover:text-indigo-400 transition-colors">
              Partner Hub
            </button>
            <span>•</span>
            <button onClick={handleOpenAdminPlatform} className="hover:text-amber-400 transition-colors">
              Admin Platform
            </button>
          </div>
        </div>
      </footer>

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
        onOpenPartnerPortal={() => handleOpenPartnerPortal("travel_agents")}
        onUpdatePreferredCurrency={(curr) => setUserProfile((p) => ({ ...p, preferredCurrency: curr }))}
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

      {/* Payments, GST Invoicing & Financial Settlement Modal */}
      <PaymentFinanceModal
        isOpen={isPaymentFinanceModalOpen}
        onClose={() => setIsPaymentFinanceModalOpen(false)}
        userProfile={userProfile}
      />

      {/* Global Universal Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
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
        onOpenRewards={() => setIsRewardsModalOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsNotificationsModalOpen(false);
        }}
      />

      {/* Rewards, Scratch Cards & YatraCoins Modal */}
      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        userProfile={userProfile}
        onAddMoney={handleAddMoney}
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

      {/* Partner Ecosystem (8 Core Platforms & 9 Capability Pillars) Modal */}
      <PartnerPortalModal
        isOpen={isPartnerPortalOpen}
        onClose={() => setIsPartnerPortalOpen(false)}
        initialCategory={partnerInitialCategory}
        onOpenBusinessModel={handleOpenBusinessModel}
      />

      {/* Business Model & Monetization Architecture Modal (9 Revenue Streams) */}
      <BusinessModelModal
        isOpen={isBusinessModelModalOpen}
        onClose={() => setIsBusinessModelModalOpen(false)}
        initialStream={businessModelInitialStream}
      />

      {/* Dedicated Bus Operator Operational Portal Modal */}
      <BusOperatorPortalModal
        isOpen={isBusOperatorPortalOpen}
        onClose={() => setIsBusOperatorPortalOpen(false)}
      />

      {/* Dedicated Tour Operator Operational & Financial Portal Modal */}
      <TourOperatorPortalModal
        isOpen={isTourOperatorPortalOpen}
        onClose={() => setIsTourOperatorPortalOpen(false)}
      />

      {/* Dedicated Travel Agent Enterprise Backend Dashboard Modal */}
      <AgentBackendDashboardModal
        isOpen={isTravelAgentBackendOpen}
        onClose={() => setIsTravelAgentBackendOpen(false)}
      />

      {/* Dedicated Pilgrimage Operator Enterprise Backend Dashboard Modal */}
      <PilgrimageOperatorBackendModal
        isOpen={isPilgrimageOperatorBackendOpen}
        onClose={() => setIsPilgrimageOperatorBackendOpen(false)}
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
    </div>
  );
}

export default App;
