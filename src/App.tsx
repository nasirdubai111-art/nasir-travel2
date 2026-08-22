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
import { MultiTripPlanTemplate } from "./data/travelExperienceData";

// Dedicated Service Landing Components
import { FlightHome } from "./components/services/FlightHome";
import { TrainHome } from "./components/services/TrainHome";
import { BusHome } from "./components/services/BusHome";
import { HotelHome } from "./components/services/HotelHome";
import { ResortHome } from "./components/services/ResortHome";
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
  const [adminInitialTab, setAdminInitialTab] = useState<any>("dashboard");
  const [isPaymentFinanceModalOpen, setIsPaymentFinanceModalOpen] = useState(false);
  const [isDestinationGuidesModalOpen, setIsDestinationGuidesModalOpen] = useState(false);

  const handleOpenPartnerPortal = (category: PartnerCategory = "travel_agents") => {
    setPartnerInitialCategory(category);
    setIsPartnerPortalOpen(true);
  };

  const handleOpenBusinessModel = (stream: RevenueStreamId = "booking_commissions") => {
    setBusinessModelInitialStream(stream);
    setIsBusinessModelModalOpen(true);
  };

  const handleOpenAdminPlatform = (tab: any = "dashboard") => {
    setAdminInitialTab(tab);
    setIsAdminPlatformModalOpen(true);
  };

  const handleOpenPaymentFinance = () => {
    setIsPaymentFinanceModalOpen(true);
  };

  const handleOpenDestinationGuides = () => {
    setIsDestinationGuidesModalOpen(true);
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
    const newBooking: BookingItem = {
      id: `BY-PKG-${Date.now()}`,
      serviceType: "tours",
      title: pkg.title,
      subtitle: `${pkg.destination} • Complete Multi-Service Package`,
      date: "28 Aug 2026",
      time: "06:00 AM",
      status: "confirmed",
      pnr: `BYPKG${Math.floor(100000 + Math.random() * 900000)}`,
      amount: pkg.discountedPackagePrice,
      passengers: 2,
      seatInfo: "All-Inclusive Journey (Transit + Hotel + Cab + Guide)",
      invoiceNumber: `INV-PKG-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    handleConfirmBooking(newBooking);
    setIsMyTripsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Universal Navbar */}
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
        onOpenBusinessModel={() => handleOpenBusinessModel("booking_commissions")}
        userProfile={userProfile}
        bookingCount={bookings.filter((b) => b.status === "upcoming" || b.status === "confirmed").length}
        unreadNotificationsCount={2}
      />

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-12">
        {/* Render View according to active category */}
        {activeCategory === "all" && (
          <MasterHome
            currentLocation={currentLocation}
            onSelectCategory={setActiveCategory}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            onOpenCompare={() => setIsCompareModalOpen(true)}
            onOpenTripPlanner={() => setIsTripPlannerModalOpen(true)}
            onOpenRewards={() => setIsRewardsModalOpen(true)}
            onOpenMyTrips={() => setIsMyTripsModalOpen(true)}
            onOpenOffers={() => setIsOffersModalOpen(true)}
            onOpenPartnerPortal={handleOpenPartnerPortal}
            onOpenBusinessModel={handleOpenBusinessModel}
            onSelectOffer={(offer: TravelOffer) => {
              setActiveCategory(offer.category === "all" ? "flights" : offer.category);
            }}
            onQuickBookItem={handleInitiateBooking}
            userProfile={userProfile}
          />
        )}

        {activeCategory === "flights" && (
          <FlightHome
            currentLocation={currentLocation}
            onBookFlight={(fl) => handleInitiateBooking(fl, "flights")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "trains" && (
          <TrainHome
            currentLocation={currentLocation}
            onBookTrain={(tr, cls) =>
              handleInitiateBooking(
                {
                  ...tr,
                  price: cls.price,
                  seatInfo: `${cls.name} (${cls.code}) - ${cls.availability}`,
                },
                "trains"
              )
            }
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
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
            onBookHotel={(ht) => handleInitiateBooking(ht, "hotels")}
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
            onBookDining={(din) => handleInitiateBooking(din, "dining")}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "corporate" && (
          <CorporateHome
            currentLocation={currentLocation}
            onBookCorporate={(corp) =>
              handleInitiateBooking(
                {
                  title: `Corporate Desk - ${corp.tier}`,
                  subtitle: `${corp.employeeCount} • ${corp.gstSavingRate}`,
                  price: 0,
                  seatInfo: "Enterprise Account Activated",
                },
                "corporate"
              )
            }
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}

        {activeCategory === "agent" && (
          <TravelAgentPortal
            onBookItem={(item) => handleConfirmBooking(item)}
            onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
          />
        )}
      </main>

      {/* Modals & Slide-ins */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        bookings={bookings}
        onAddMoney={handleAddMoney}
        onCancelBooking={handleCancelBooking}
        onOpenPartnerPortal={() => handleOpenPartnerPortal("travel_agents")}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectCategory={setActiveCategory}
        onAskAI={() => {
          setIsAIDrawerOpen(true);
        }}
      />

      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        currentLocation={currentLocation}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

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
    </div>
  );
}

export default App;
