import React, { useState } from "react";
import {
  TreePine,
  Search,
  Info,
  Bed,
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  FileText,
  X,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Flame,
  Compass,
  Star,
  MapPin,
  Download,
} from "lucide-react";
import { LodgeEntity, LodgeBookingEntity } from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

interface LodgeFunnelRelationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedLodgeId?: string;
  currentUserId?: string;
}

const FUNNEL_STEPS = [
  { step: 1, label: "Search", icon: Search },
  { step: 2, label: "Details", icon: Info },
  { step: 3, label: "Select Room", icon: Bed },
  { step: 4, label: "Check-in/Out", icon: Calendar },
  { step: 5, label: "Guest Details", icon: Users },
  { step: 6, label: "Payment", icon: CreditCard },
  { step: 7, label: "Confirmation", icon: CheckCircle2 },
  { step: 8, label: "Ticket/Invoice", icon: FileText },
];

export const LodgeFunnelRelationalModal: React.FC<LodgeFunnelRelationalModalProps> = ({
  isOpen,
  onClose,
  preSelectedLodgeId,
  currentUserId = "usr-auth-arjun-505",
}) => {
  const [lodges, setLodges] = useState<LodgeEntity[]>(travelVerticalsService.getLodges());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLodgeId, setSelectedLodgeId] = useState<string>(
    preSelectedLodgeId || (lodges[0]?.lodge_id ?? "")
  );

  const selectedLodge = lodges.find((l) => l.lodge_id === selectedLodgeId) || lodges[0];

  // Funnel Form State
  const [selectedRoomId, setSelectedRoomId] = useState(selectedLodge?.rooms[0]?.room_id || "");
  const [checkInDate, setCheckInDate] = useState("2026-09-25");
  const [checkOutDate, setCheckOutDate] = useState("2026-09-27");
  const [nights, setNights] = useState(2);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  const [guestName, setGuestName] = useState("Arjun Singhania");
  const [guestEmail, setGuestEmail] = useState("arjun.singhania@delhi-invest.com");
  const [guestPhone, setGuestPhone] = useState("+91 98101 22899");
  const [guestGovId, setGuestGovId] = useState("Aadhaar XXXX-9912");

  const [paymentGateway, setPaymentGateway] = useState("UPI Instant (Zero Surcharge)");
  const [createdBooking, setCreatedBooking] = useState<LodgeBookingEntity | null>(null);

  if (!isOpen) return null;

  const chosenRoom = selectedLodge?.rooms.find((r) => r.room_id === selectedRoomId) || selectedLodge?.rooms[0];
  const baseAmount = (chosenRoom?.price_per_night || 6800) * nights;
  const taxAmount = Math.round(baseAmount * 0.12); // 12% eco-lodge tax
  const totalAmount = baseAmount + taxAmount;

  const filteredLodges = lodges.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExecutePayment = () => {
    if (!selectedLodge || !chosenRoom) return;

    const booking = travelVerticalsService.createLodgeBooking({
      lodge_id: selectedLodge.lodge_id,
      customer_id: currentUserId,
      customer_name: guestName,
      customer_email: guestEmail,
      customer_phone: guestPhone,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      nights,
      selected_room_id: chosenRoom.room_id,
      selected_room_name: chosenRoom.room_name,
      rooms_count: 1,
      guests_count: { adults: adultsCount, children: childrenCount },
      guest_details: [
        {
          full_name: guestName,
          age: 36,
          gender: "Male",
          gov_id: guestGovId,
        },
      ],
      base_amount: baseAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    });

    setCreatedBooking(booking);
    setCurrentStep(7); // Advance to Confirmation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <TreePine className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Lodge 8-Step Customer Funnel
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  auth.users ──► lodge_bookings (lodge_id) ──► lodge
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Eco Lodges, Wildlife Safari Tents &amp; Mountain Chalets
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Step Interactive Progress Stepper */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {FUNNEL_STEPS.map((stepItem, idx) => {
              const Icon = stepItem.icon;
              const isPassed = currentStep > stepItem.step;
              const isCurrent = currentStep === stepItem.step;
              return (
                <div key={stepItem.step} className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => {
                      if (stepItem.step <= 6 || (stepItem.step >= 7 && createdBooking)) {
                        setCurrentStep(stepItem.step);
                      }
                    }}
                    disabled={stepItem.step >= 7 && !createdBooking}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isCurrent
                        ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                        : isPassed
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-900 text-slate-500 border border-slate-800 opacity-60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{stepItem.step}. {stepItem.label}</span>
                  </button>
                  {idx < FUNNEL_STEPS.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body Based on Current Step */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Search */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Step 1: Search &amp; Filter Lodges</h3>
                  <p className="text-xs text-slate-400">Discover tiger sanctuary eco-reserves and Himalayan stone chalets.</p>
                </div>
                <div className="relative w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search national park or state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLodges.map((l) => (
                  <div
                    key={l.lodge_id}
                    onClick={() => {
                      setSelectedLodgeId(l.lodge_id);
                      setSelectedRoomId(l.rooms[0]?.room_id || "");
                    }}
                    className={`p-4 rounded-3xl border cursor-pointer transition ${
                      selectedLodge?.lodge_id === l.lodge_id
                        ? "bg-emerald-950/30 border-emerald-500/70 ring-1 ring-emerald-500/40"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400">
                        {l.lodge_id}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {l.rating}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base">{l.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {l.destination} • {l.region}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900 text-xs">
                      <span className="text-slate-400 font-medium">Starting from ₹{l.starting_price}/night</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLodgeId(l.lodge_id);
                          setCurrentStep(2);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {currentStep === 2 && selectedLodge && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      Step 2: Lodge Overview &amp; Specifications
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {selectedLodge.lodge_id}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{selectedLodge.name}</h3>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-2"
                >
                  <span>Select Room (Step 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed text-sm">{selectedLodge.overview}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Lodge Type</span>
                    <span className="font-bold text-white">{selectedLodge.lodge_type}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Campfire &amp; Bonfire</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {selectedLodge.bonfire_available ? "Nightly Included" : "On Request"}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Safari Assistance</span>
                    <span className="font-bold text-emerald-400">
                      {selectedLodge.safari_assistance ? "Gypsy Permit Desk" : "Self Arranged"}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Senior Naturalist</span>
                    <span className="font-bold text-white">{selectedLodge.manager_name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Select Room */}
          {currentStep === 3 && selectedLodge && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Step 3: Select Room / Chalet Type</h3>
                  <p className="text-xs text-slate-400">Choose your nature-view accommodation category.</p>
                </div>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-2"
                >
                  <span>Proceed to Dates (Step 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLodge.rooms.map((rm) => (
                  <div
                    key={rm.room_id}
                    onClick={() => setSelectedRoomId(rm.room_id)}
                    className={`p-5 rounded-3xl border cursor-pointer transition ${
                      selectedRoomId === rm.room_id
                        ? "bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/50"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{rm.room_type}</span>
                      <span className="text-sm font-black text-white">
                        ₹{rm.price_per_night.toLocaleString("en-IN")}/night
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base">{rm.room_name}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Capacity: Up to {rm.capacity} Guests • {rm.available_inventory} units left
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {rm.features.map((f, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Check-in / Out Dates */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Step 4: Check-in / Check-out Dates</h3>
                  <p className="text-xs text-slate-400">Configure your duration of stay.</p>
                </div>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-2"
                >
                  <span>Guest Details (Step 5)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 max-w-xl mx-auto text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Nights Count</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Adults</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Children</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Guest Details */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Step 5: Guest Details (Auth Customer Manifest)</h3>
                  <p className="text-xs text-slate-400">Authenticated user: {currentUserId}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-2"
                >
                  <span>Proceed to Payment (Step 6)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 max-w-xl mx-auto text-xs">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Govt ID (Aadhaar / Passport)</label>
                  <input
                    type="text"
                    value={guestGovId}
                    onChange={(e) => setGuestGovId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Payment */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Step 6: Payment Authorization</h3>
                  <p className="text-xs text-slate-400">Review invoice breakdown and authorize payment.</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 max-w-xl mx-auto text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>{chosenRoom?.room_name} ({nights} nights)</span>
                    <span className="font-mono">₹{baseAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Eco-Tourism GST (12%)</span>
                    <span className="font-mono">₹{taxAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-sm">
                    <span>Total Amount Payable</span>
                    <span className="font-mono text-emerald-400">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={paymentGateway}
                    onChange={(e) => setPaymentGateway(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="UPI Instant (Zero Surcharge)">UPI Instant (Zero Surcharge)</option>
                    <option value="HDFC Corporate NetBanking">HDFC Corporate NetBanking</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                  </select>
                </div>

                <button
                  onClick={handleExecutePayment}
                  className="w-full py-3 rounded-2xl font-black text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize ₹{totalAmount.toLocaleString("en-IN")} &amp; Confirm Booking</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Booking Confirmation */}
          {currentStep === 7 && createdBooking && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-5 text-center max-w-lg mx-auto animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Relational record created in <span className="font-mono text-emerald-400">lodge_bookings</span> table.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="text-emerald-400 font-bold">{createdBooking.booking_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Number:</span>
                  <span className="text-slate-300">{createdBooking.ticket_invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lodge ID:</span>
                  <span className="text-slate-300">{createdBooking.lodge_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer ID:</span>
                  <span className="text-slate-300">{createdBooking.customer_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="text-amber-400 font-bold">₹{createdBooking.total_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(8)}
                className="w-full py-3 rounded-2xl font-black text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Ticket &amp; Tax Invoice (Step 8)</span>
              </button>
            </div>
          )}

          {/* STEP 8: Ticket / Invoice */}
          {currentStep === 8 && createdBooking && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 max-w-xl mx-auto animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Official Tax Invoice &amp; Lodge Entry Voucher
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{createdBooking.ticket_invoice_number}</h3>
                </div>
                <div className="p-2 rounded-2xl bg-white text-slate-950">
                  <QrCode className="w-10 h-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Primary Guest</span>
                  <span className="text-white font-bold">{createdBooking.customer_name}</span>
                  <span className="text-slate-400 block text-[11px]">{createdBooking.customer_phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Dates of Stay</span>
                  <span className="text-white font-bold">
                    {createdBooking.check_in_date} ➔ {createdBooking.check_out_date}
                  </span>
                  <span className="text-slate-400 block text-[11px]">({createdBooking.nights} Nights)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Room Allocated</span>
                  <span className="text-white font-bold">{createdBooking.selected_room_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Verification</span>
                  <span className="text-emerald-400 font-bold uppercase">PAID IN FULL</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Total Tax Invoice Value:</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  ₹{createdBooking.total_amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Start New Search
                </button>
                <button
                  onClick={() => alert(`Downloaded invoice ${createdBooking.ticket_invoice_number} to your device!`)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Voucher PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
