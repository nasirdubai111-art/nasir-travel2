import React, { useState } from "react";
import {
  X,
  Tent,
  Building2,
  Calendar,
  DollarSign,
  Camera,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  FileText,
  Download,
  Star,
  MessageSquare,
  Sparkles,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  CreditCard,
  Layers,
  Award,
} from "lucide-react";
import {
  LodgePartnerProfile,
  LodgePMSRoomType,
  LodgeBookingRecord,
  LodgeSettlementInvoice,
  LodgePMSReview,
  ListingPlanTier,
} from "../../types";
import {
  SAMPLE_LODGE_PROFILES,
  LODGE_LIVE_BOOKINGS,
  LODGE_SETTLEMENT_INVOICES,
  LODGE_GUEST_REVIEWS,
} from "../../data/lodgePMSData";
import { PARTNER_LISTING_PLANS } from "../../data/dynamicCommissionData";

interface LodgePartnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LodgeTab =
  | "overview"
  | "onboarding_profile"
  | "room_inventory"
  | "tariff_calendar"
  | "bookings_pms"
  | "cancellation_rules"
  | "commissions_settlement"
  | "reviews_ratings"
  | "listing_plan";

export function LodgePartnerPortalModal({ isOpen, onClose }: LodgePartnerPortalModalProps) {
  const [profile, setProfile] = useState<LodgePartnerProfile>(SAMPLE_LODGE_PROFILES[0]);
  const [bookings, setBookings] = useState<LodgeBookingRecord[]>(LODGE_LIVE_BOOKINGS);
  const [invoices, setInvoices] = useState<LodgeSettlementInvoice[]>(LODGE_SETTLEMENT_INVOICES);
  const [reviews, setReviews] = useState<LodgePMSReview[]>(LODGE_GUEST_REVIEWS);
  const [activeTab, setActiveTab] = useState<LodgeTab>("overview");
  
  // Quick host reply state
  const [replyText, setReplyText] = useState("");
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New room modal state
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState<Partial<LodgePMSRoomType>>({
    name: "Luxury Forest Machan Suite",
    category: "Riverfront Machan",
    maxOccupancy: 2,
    bedType: "King Bed",
    view: "Riverside Forest View",
    basePricePerNight: 7500,
    totalRooms: 4,
    availableRooms: 4,
    mealInclusions: "All Meals (Satvik/Jungle Buffet)",
    amenities: ["River Deck", "AC", "Attached Bath", "Forest Guide"],
    photos: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"],
  });

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddRoom = () => {
    if (!newRoomData.name) return;
    const created: LodgePMSRoomType = {
      id: `room-${Date.now()}`,
      lodgeId: profile.id,
      name: newRoomData.name || "Custom Room",
      category: newRoomData.category as any || "Deluxe Forest Cottage",
      maxOccupancy: newRoomData.maxOccupancy || 2,
      bedType: newRoomData.bedType || "King Bed",
      view: newRoomData.view || "Forest View",
      basePricePerNight: newRoomData.basePricePerNight || 5000,
      seasonalTariff: {
        monsoonOffSeason: (newRoomData.basePricePerNight || 5000) * 0.7,
        regularSeason: newRoomData.basePricePerNight || 5000,
        winterWildlifePeak: (newRoomData.basePricePerNight || 5000) * 1.35,
        festiveDiwaliNewYearSurge: (newRoomData.basePricePerNight || 5000) * 1.7,
      },
      totalRooms: newRoomData.totalRooms || 2,
      availableRooms: newRoomData.availableRooms || 2,
      amenities: newRoomData.amenities || ["Air Conditioning", "Private Verandah"],
      photos: newRoomData.photos || ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"],
      mealInclusions: newRoomData.mealInclusions as any || "All Meals (Satvik/Jungle Buffet)",
    };

    setProfile((prev) => ({
      ...prev,
      rooms: [...prev.rooms, created],
    }));

    setShowAddRoom(false);
    showToast("New Room Category & Inventory created successfully!");
  };

  const handleHostReplySubmit = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, hostReply: replyText } : r))
    );
    setReplyText("");
    setActiveReviewId(null);
    showToast("Host response published to public listing!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
        
        {/* ========================================================================= */}
        {/* HEADER: LODGE PARTNER PMS & PROPERTY CONSOLE */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-teal-950 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Tent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                  Lodge Host PMS &amp; Extranet
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Forest Partner ({profile.listingPlan.toUpperCase()} Plan)</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">{profile.lodgeName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {toastMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* PMS Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: "overview", label: "Property Dashboard", icon: Building2 },
            { id: "onboarding_profile", label: "Profile & KYC", icon: ShieldCheck },
            { id: "room_inventory", label: "Room Types & Inventory", icon: Tent, count: profile.rooms.length },
            { id: "tariff_calendar", label: "Dynamic Tariff & Calendar", icon: Calendar },
            { id: "bookings_pms", label: "Guest Bookings", icon: Users, count: bookings.length },
            { id: "cancellation_rules", label: "Cancellation Policy", icon: Clock },
            { id: "commissions_settlement", label: "Commission & Invoices", icon: DollarSign, count: invoices.length },
            { id: "reviews_ratings", label: "Guest Reviews", icon: Star, count: reviews.length },
            { id: "listing_plan", label: "Listing Plan", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 font-bold text-xs sm:text-xs md:text-sm flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-amber-700 text-amber-900 bg-amber-50/50"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">August Realized Revenue</span>
                <div className="text-2xl font-black text-slate-900">₹3,99,500</div>
                <p className="text-[10px] text-emerald-600 font-bold">↑ 24% vs last month</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">Occupancy Rate</span>
                <div className="text-2xl font-black text-amber-700">78.4%</div>
                <p className="text-[10px] text-slate-500">14 of 18 Rooms Occupied</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">Agreed Take Rate</span>
                <div className="text-2xl font-black text-slate-900">{profile.commissionRatePercent}%</div>
                <p className="text-[10px] text-slate-500">T+1 Automated RTGS Payout</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">Guest Rating</span>
                <div className="flex items-center gap-1 text-2xl font-black text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{profile.rating}</span>
                </div>
                <p className="text-[10px] text-slate-500">{profile.totalReviews} Verified Stays</p>
              </div>
            </div>

            {/* Quick Property Snapshot */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base">{profile.lodgeName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{profile.address}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-700">
                    Forest License: {profile.forestPermitLicense}
                  </span>
                </div>
              </div>

              {/* Photos row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {profile.photos.map((photo, i) => (
                  <div key={i} className="h-28 rounded-2xl overflow-hidden shadow-xs">
                    <img src={photo} alt="Property" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                Featured Eco-Facilities &amp; Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.amenities.map((am, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ONBOARDING & PROFILE */}
        {/* ========================================================================= */}
        {activeTab === "onboarding_profile" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base">Lodge Information &amp; Legal Verification</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Lodge / Property Name</label>
                  <input
                    type="text"
                    value={profile.lodgeName}
                    onChange={(e) => setProfile({ ...profile, lodgeName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination &amp; Zone</label>
                  <input
                    type="text"
                    value={profile.destination}
                    onChange={(e) => setProfile({ ...profile, destination: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Host / Property Owner Name</label>
                  <input
                    type="text"
                    value={profile.hostName}
                    onChange={(e) => setProfile({ ...profile, hostName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Host Phone</label>
                  <input
                    type="text"
                    value={profile.hostPhone}
                    onChange={(e) => setProfile({ ...profile, hostPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={profile.gstNumber}
                    onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">State Forest Department License</label>
                  <input
                    type="text"
                    value={profile.forestPermitLicense}
                    onChange={(e) => setProfile({ ...profile, forestPermitLicense: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Check-in / Check-out policy */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Standard Check-In Time</label>
                  <input
                    type="text"
                    value={profile.checkInTime}
                    onChange={(e) => setProfile({ ...profile, checkInTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Standard Check-Out Time</label>
                  <input
                    type="text"
                    value={profile.checkOutTime}
                    onChange={(e) => setProfile({ ...profile, checkOutTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => showToast("Lodge Profile & KYC Details Updated Successfully!")}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs shadow-md"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ROOM TYPES & INVENTORY */}
        {/* ========================================================================= */}
        {activeTab === "room_inventory" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">Configured Room Inventory</h3>
                <p className="text-xs text-slate-500">Manage cottages, machans, safari tents, and room allocations.</p>
              </div>
              <button
                onClick={() => setShowAddRoom(true)}
                className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-black flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room Type</span>
              </button>
            </div>

            {/* Room cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                        {room.category}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1">{room.name}</h4>
                      <p className="text-xs text-slate-500">{room.view} • {room.bedType}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-900">₹{room.basePricePerNight.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block">/ night</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Total Inventory</span>
                      <strong className="text-slate-800">{room.totalRooms} Rooms</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Available</span>
                      <strong className="text-emerald-700">{room.availableRooms} Rooms</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Inclusions</span>
                      <strong className="text-slate-800 text-[10px]">{room.mealInclusions.split(" ")[0]}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((am, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Room Modal Inline */}
            {showAddRoom && (
              <div className="p-5 bg-amber-50/70 rounded-3xl border border-amber-200 space-y-4 animate-in slide-in-from-top">
                <h4 className="font-black text-amber-950 text-sm">Create New Room Inventory</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Room Category Name</label>
                    <input
                      type="text"
                      value={newRoomData.name}
                      onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Price / Night (INR)</label>
                    <input
                      type="number"
                      value={newRoomData.basePricePerNight}
                      onChange={(e) => setNewRoomData({ ...newRoomData, basePricePerNight: parseInt(e.target.value, 10) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Room Count</label>
                    <input
                      type="number"
                      value={newRoomData.totalRooms}
                      onChange={(e) => setNewRoomData({ ...newRoomData, totalRooms: parseInt(e.target.value, 10) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddRoom(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRoom}
                    className="px-5 py-2 rounded-xl bg-amber-900 text-white text-xs font-black shadow-md"
                  >
                    Save &amp; Publish Room
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DYNAMIC TARIFF & CALENDAR */}
        {/* ========================================================================= */}
        {activeTab === "tariff_calendar" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base">Seasonal Dynamic Tariff Configurator</h3>
              <p className="text-xs text-slate-500">
                Automate seasonal price surges for Wildlife Peak (Oct–Apr) and Festive dates (Diwali/New Year).
              </p>

              <div className="space-y-4">
                {profile.rooms.map((room) => (
                  <div key={room.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-sm">{room.name}</span>
                      <span className="text-xs font-bold text-amber-800">Base: ₹{room.basePricePerNight}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Monsoon Off-Season</span>
                        <strong className="text-emerald-700 text-sm">₹{room.seasonalTariff.monsoonOffSeason}</strong>
                        <span className="text-[9px] text-slate-400 block mt-0.5">-30% discount</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Regular Season</span>
                        <strong className="text-slate-800 text-sm">₹{room.seasonalTariff.regularSeason}</strong>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Standard rate</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Winter Wildlife Peak</span>
                        <strong className="text-amber-700 text-sm">₹{room.seasonalTariff.winterWildlifePeak}</strong>
                        <span className="text-[9px] text-amber-600 block mt-0.5">+35% surge</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Festive / New Year</span>
                        <strong className="text-rose-700 text-sm">₹{room.seasonalTariff.festiveDiwaliNewYearSurge}</strong>
                        <span className="text-[9px] text-rose-600 block mt-0.5">+70% surge</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: GUEST BOOKINGS PMS */}
        {/* ========================================================================= */}
        {activeTab === "bookings_pms" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-base">Guest Arrival &amp; Check-In Register</h3>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm">{b.guestName}</h4>
                        <span className="text-xs font-mono text-slate-400">({b.bookingRef})</span>
                      </div>
                      <p className="text-xs text-slate-500">{b.guestPhone} • {b.guestEmail}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        b.stayStatus === "CHECKED_IN"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.stayStatus === "UPCOMING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {b.stayStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Dates &amp; Stay</span>
                      <strong className="text-slate-800">{b.checkInDate} to {b.checkOutDate} ({b.nightsCount}N)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Room Booked</span>
                      <strong className="text-slate-800">{b.roomTypeName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Gross Booking</span>
                      <strong className="text-slate-900 font-black">₹{b.grossAmount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Net Payout to Host</span>
                      <strong className="text-emerald-700 font-black">₹{b.netPayoutAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  {b.specialRequests && (
                    <p className="text-xs bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200">
                      <strong>Special Request:</strong> {b.specialRequests}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CANCELLATION RULES */}
        {/* ========================================================================= */}
        {activeTab === "cancellation_rules" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base">Lodge Cancellation Rules &amp; Penalty Matrix</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Free Cancellation Window (Hours Before Check-In)
                  </label>
                  <input
                    type="number"
                    value={profile.cancellationRules.freeCancellationHoursBeforeCheckIn}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        cancellationRules: {
                          ...profile.cancellationRules,
                          freeCancellationHoursBeforeCheckIn: parseInt(e.target.value, 10),
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Late Cancellation Retention Fee (%)
                  </label>
                  <input
                    type="number"
                    value={profile.cancellationRules.cancellationChargePercentWithinWindow}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        cancellationRules: {
                          ...profile.cancellationRules,
                          cancellationChargePercentWithinWindow: parseInt(e.target.value, 10),
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Public Guest Policy Description
                </label>
                <textarea
                  rows={3}
                  value={profile.cancellationRules.policyDescription}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      cancellationRules: {
                        ...profile.cancellationRules,
                        policyDescription: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => showToast("Cancellation rules updated successfully!")}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 text-white font-bold text-xs shadow-md"
                >
                  Save Policy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: COMMISSIONS & SETTLEMENT INVOICES */}
        {/* ========================================================================= */}
        {activeTab === "commissions_settlement" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Commission math breakdown card */}
            <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-3xl p-6 text-white space-y-4">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                Direct Transparent Settlement
              </span>
              <h3 className="text-lg font-black">Commission &amp; Statutory TDS Math</h3>
              <p className="text-xs text-slate-300">
                Formula: Net Host Transfer = Gross Booking GMV - {profile.commissionRatePercent}% Commission - 1% TDS (Sec 194-O).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Platform Take-Rate</span>
                  <strong className="text-amber-300 text-base">{profile.commissionRatePercent}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">TDS Sec 194-O</span>
                  <strong className="text-white text-base">1.0%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">GST on Commission</span>
                  <strong className="text-white text-base">18.0%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Payout Cycle</span>
                  <strong className="text-emerald-400 text-base">T+1 Automated</strong>
                </div>
              </div>
            </div>

            {/* Invoices list */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-black text-slate-900 text-base">GST Settlement Tax Invoices &amp; RTGS Records</h4>

              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-800" />
                        <strong className="text-slate-900 font-black">{inv.invoiceNumber}</strong>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-slate-500">{inv.period} • Payout UTR: {inv.utrNumber}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Net Transferred</span>
                        <strong className="text-emerald-700 font-black text-sm">
                          ₹{inv.netSettlementTransferred.toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <button
                        onClick={() => showToast(`Downloading GST Tax Invoice ${inv.invoiceNumber} PDF...`)}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: GUEST REVIEWS & RATINGS */}
        {/* ========================================================================= */}
        {activeTab === "reviews_ratings" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-base">Verified Guest Reviews &amp; Host Responses</h3>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{rev.guestName}</span>
                        <span className="text-xs text-slate-400">({rev.guestCity})</span>
                      </div>
                      <span className="text-xs text-slate-500">Stayed in {rev.roomStayed} • {rev.stayDate}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-lg text-amber-800 font-black text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <h5 className="font-bold text-slate-900 text-xs">&ldquo;{rev.reviewTitle}&rdquo;</h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{rev.reviewText}</p>

                  {/* Host Reply */}
                  {rev.hostReply ? (
                    <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 text-xs space-y-1">
                      <span className="font-black text-amber-950 text-[10px] uppercase">
                        Host Response ({profile.hostName}):
                      </span>
                      <p className="text-slate-800">{rev.hostReply}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      {activeReviewId === rev.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a warm, professional reply from the lodge management..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setActiveReviewId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleHostReplySubmit(rev.id)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-900"
                            >
                              Post Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveReviewId(rev.id);
                            setReplyText("");
                          }}
                          className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply to Guest Review</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: LISTING PLAN UPGRADE */}
        {/* ========================================================================= */}
        {activeTab === "listing_plan" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                Partner Subscription Plans
              </span>
              <h3 className="text-xl font-black text-slate-900">Choose Your Lodge Listing Plan</h3>
              <p className="text-xs text-slate-500">
                Unlock top search placement, promotional banners, instant hot WhatsApp leads, and dedicated key account managers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PARTNER_LISTING_PLANS.map((plan) => {
                const isCurrent = profile.listingPlan === plan.tier;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                      isCurrent
                        ? "bg-amber-50/50 border-amber-700 shadow-md ring-2 ring-amber-700/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm">{plan.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-100 text-slate-700">
                          {plan.badge}
                        </span>
                      </div>

                      <div className="text-2xl font-black text-slate-900">
                        {plan.priceMonthlyINR === 0 ? "Free" : `₹${plan.priceMonthlyINR.toLocaleString()}`}
                        {plan.priceMonthlyINR > 0 && <span className="text-xs font-normal text-slate-400"> / month</span>}
                      </div>

                      <p className="text-xs text-slate-600">{plan.description}</p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfile({ ...profile, listingPlan: plan.tier });
                        showToast(`Lodge Listing Plan updated to ${plan.name}!`);
                      }}
                      className={`w-full py-2.5 rounded-xl font-black text-xs shadow-sm transition-all ${
                        isCurrent
                          ? "bg-amber-900 text-white cursor-default"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {isCurrent ? "Active Plan" : "Upgrade to Plan"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
