import React, { useState } from "react";
import {
  X,
  User,
  Users,
  ShieldCheck,
  CreditCard,
  Building2,
  Armchair,
  Luggage,
  UtensilsCrossed,
  Sparkles,
  Info,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  Plane,
  FileText,
} from "lucide-react";
import { FlightExtendedDeal, FlightFareTier, FLIGHT_FARE_TIERS } from "../../data/flightData";
import { FlightSeatSelectionModal } from "./FlightSeatSelectionModal";
import { FlightAddonsModal, FlightAddonsSelection } from "./FlightAddonsModal";
import { FlightFareRulesModal } from "./FlightFareRulesModal";
import { FlightConfirmationModal } from "./FlightConfirmationModal";

export interface PassengerFormData {
  id: string;
  type: "adult" | "child" | "infant";
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  frequentFlyerAirline?: string;
  frequentFlyerNumber?: string;
  wheelchair: boolean;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  nationality?: string;
}

interface FlightBookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightExtendedDeal;
  selectedTierId: "saver" | "flexi" | "superflex" | "business";
  initialPassengerCount?: number;
  onBookingSuccess?: (bookingDetails: any) => void;
}

export function FlightBookingCheckoutModal({
  isOpen,
  onClose,
  flight,
  selectedTierId,
  initialPassengerCount = 1,
  onBookingSuccess,
}: FlightBookingCheckoutModalProps) {
  // Active Fare Tier
  const [currentTier, setCurrentTier] = useState<FlightFareTier>(() =>
    FLIGHT_FARE_TIERS.find((t) => t.id === selectedTierId) || FLIGHT_FARE_TIERS[0]
  );

  // Passengers
  const [passengerCount, setPassengerCount] = useState(initialPassengerCount);
  const [passengers, setPassengers] = useState<PassengerFormData[]>([
    {
      id: "p-1",
      type: "adult",
      title: "Mr",
      firstName: "Vikram",
      lastName: "Malhotra",
      gender: "Male",
      dob: "1990-05-14",
      frequentFlyerAirline: "IndiGo 6E Rewards",
      frequentFlyerNumber: "6E-9920144",
      wheelchair: false,
      passportNumber: flight.isInternational ? "Z4829104" : "",
      passportExpiry: flight.isInternational ? "2031-10-20" : "",
      passportCountry: "India",
      nationality: "Indian",
    },
  ]);

  // Contact Information
  const [contactEmail, setContactEmail] = useState("vikram.malhotra@gmail.com");
  const [contactPhone, setContactPhone] = useState("9876543210");
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // GST Information
  const [useGST, setUseGST] = useState(false);
  const [gstNumber, setGstNumber] = useState("07AAAAA0000A1Z5");
  const [companyName, setCompanyName] = useState("Malhotra Tech Solutions Pvt Ltd");

  // Seats & Addons Selections
  const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>({});
  const [seatCost, setSeatCost] = useState(0);

  const [addonsSelection, setAddonsSelection] = useState<FlightAddonsSelection>({
    selectedMeals: {},
    selectedAddonIds: ["addon-zero-cancel"],
  });
  const [addonsCost, setAddonsCost] = useState(249); // Digit refund protection by default

  // Promo Code
  const [promoCode, setPromoCode] = useState("HDFCFLY");
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(1500);

  // Payment Method
  const [paymentMode, setPaymentMode] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");

  // Child Modals
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [isFareRulesOpen, setIsFareRulesOpen] = useState(false);
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false);

  // Booking Result
  const [confirmedPNR, setConfirmedPNR] = useState("");
  const [confirmedTicketNum, setConfirmedTicketNum] = useState("");

  if (!isOpen) return null;

  // Add/Remove Passenger
  const handlePassengerCountChange = (newCount: number) => {
    if (newCount < 1 || newCount > 6) return;
    setPassengerCount(newCount);

    if (newCount > passengers.length) {
      const newP: PassengerFormData[] = [...passengers];
      for (let i = passengers.length; i < newCount; i++) {
        newP.push({
          id: `p-${i + 1}`,
          type: "adult",
          title: "Mr",
          firstName: "",
          lastName: "",
          gender: "Male",
          dob: "1995-01-01",
          wheelchair: false,
          passportNumber: "",
          passportExpiry: "",
          passportCountry: "India",
          nationality: "Indian",
        });
      }
      setPassengers(newP);
    } else {
      setPassengers(passengers.slice(0, newCount));
    }
  };

  const updatePassenger = (index: number, field: keyof PassengerFormData, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  // Pricing calculations
  const basePricePerPassenger = flight.price + currentTier.priceDelta;
  const totalBasePrice = basePricePerPassenger * passengerCount;
  const taxesAndGst = Math.round(totalBasePrice * 0.05); // 5% statutory taxes/UDF
  const subTotal = totalBasePrice + taxesAndGst + seatCost + addonsCost;
  const finalPayable = Math.max(0, subTotal - (promoApplied ? promoDiscount : 0));

  const passengerNamesList = passengers.map(
    (p, i) => `${p.title} ${p.firstName || `Passenger ${i + 1}`} ${p.lastName}`.trim()
  );

  const handleCompleteBooking = () => {
    // Generate official-looking Indian PNR e.g. "BY" + random chars
    const pnrCode = "BY" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketNo = "312-" + Math.floor(1000000000 + Math.random() * 9000000000);
    setConfirmedPNR(pnrCode);
    setConfirmedTicketNum(ticketNo);

    if (onBookingSuccess) {
      onBookingSuccess({
        pnr: pnrCode,
        ticketNo,
        flight,
        passengers,
        tier: currentTier.name,
        finalPayable,
      });
    }

    setIsConfirmedModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-mono font-bold">
                  {flight.airline} • {flight.flightNumber}
                </span>
                <span className="text-xs text-sky-200 font-semibold">
                  {flight.fromCode} ➔ {flight.toCode} • Non-stop
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <Plane className="w-5 h-5 text-sky-400" />
                <span>Complete Your Flight Booking</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Details (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Fare Families Comparison Switcher */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-sky-600" />
                    <span>Fare Class &amp; Benefits</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsFareRulesOpen(true)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Detailed Fare Rules</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {FLIGHT_FARE_TIERS.map((tier) => {
                    const isSelected = currentTier.id === tier.id;
                    const tierPrice = flight.price + tier.priceDelta;

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setCurrentTier(tier)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-sky-600 bg-sky-50 shadow-xs ring-2 ring-sky-600/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900">{tier.name}</span>
                            {tier.badge && (
                              <span className="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-black">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{tier.tagline}</p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <span className="text-xs font-black text-slate-900">
                            ₹{tierPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[9px] text-slate-400 block">{tier.dateChangeFee}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Seat & Addons Quick Action Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsSeatModalOpen(true)}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <Armchair className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Select Seats</h4>
                      <p className="text-[11px] text-slate-500">
                        {Object.keys(selectedSeats).length > 0
                          ? `Assigned: ${Object.values(selectedSeats).join(", ")} (+₹${seatCost})`
                          : "Window, Aisle & Extra Legroom XL"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddonsModalOpen(true)}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Meals &amp; Add-ons</h4>
                      <p className="text-[11px] text-slate-500">
                        {Object.keys(addonsSelection.selectedMeals).length > 0 || addonsSelection.selectedBaggageId
                          ? `Active Add-ons (+₹${addonsCost})`
                          : "Gourmet meals, extra luggage & lounge"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* 3. Traveller Manifest Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>Traveller Details ({passengerCount} Passenger{passengerCount > 1 ? "s" : ""})</span>
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400 font-medium">Count:</span>
                    {[1, 2, 3, 4].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => handlePassengerCountChange(cnt)}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-colors ${
                          passengerCount === cnt
                            ? "bg-sky-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form per passenger */}
                <div className="space-y-4">
                  {passengers.map((p, idx) => (
                    <div
                      key={p.id}
                      className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-slate-50/50"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                          Passenger {idx + 1} ({idx === 0 ? "Primary Traveller" : "Adult"})
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-600 flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={p.wheelchair}
                              onChange={(e) => updatePassenger(idx, "wheelchair", e.target.checked)}
                              className="rounded text-sky-600 focus:ring-sky-500"
                            />
                            <span>Require Wheelchair</span>
                          </label>
                        </div>
                      </div>

                      {/* Name Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Title</label>
                          <select
                            value={p.title}
                            onChange={(e) => updatePassenger(idx, "title", e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                          >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                          </select>
                        </div>

                        <div className="sm:col-span-5">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            First &amp; Middle Name (as on Govt ID)
                          </label>
                          <input
                            type="text"
                            value={p.firstName}
                            onChange={(e) => updatePassenger(idx, "firstName", e.target.value)}
                            placeholder="e.g. Vikram"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div className="sm:col-span-5">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={p.lastName}
                            onChange={(e) => updatePassenger(idx, "lastName", e.target.value)}
                            placeholder="e.g. Malhotra"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                      </div>

                      {/* Frequent Flyer & Gender */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Gender</label>
                          <select
                            value={p.gender}
                            onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Frequent Flyer Program (Optional)
                          </label>
                          <select
                            value={p.frequentFlyerAirline || ""}
                            onChange={(e) => updatePassenger(idx, "frequentFlyerAirline", e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                          >
                            <option value="">None / Select Airline</option>
                            <option value="Air India Flying Returns">Air India Flying Returns</option>
                            <option value="Club Vistara">Club Vistara</option>
                            <option value="IndiGo 6E Rewards">IndiGo 6E Rewards</option>
                            <option value="Emirates Skywards">Emirates Skywards</option>
                            <option value="Singapore KrisFlyer">Singapore KrisFlyer</option>
                          </select>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Membership Number
                          </label>
                          <input
                            type="text"
                            value={p.frequentFlyerNumber || ""}
                            onChange={(e) => updatePassenger(idx, "frequentFlyerNumber", e.target.value)}
                            placeholder="e.g. 6E-9920144"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                      </div>

                      {/* International Flight Passport Fields */}
                      {flight.isInternational && (
                        <div className="pt-2 border-t border-dashed border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-4">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              Passport Number
                            </label>
                            <input
                              type="text"
                              value={p.passportNumber || ""}
                              onChange={(e) => updatePassenger(idx, "passportNumber", e.target.value)}
                              placeholder="e.g. Z4829104"
                              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-white"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              Passport Expiry Date
                            </label>
                            <input
                              type="date"
                              value={p.passportExpiry || ""}
                              onChange={(e) => updatePassenger(idx, "passportExpiry", e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              Issuing Country / Nationality
                            </label>
                            <input
                              type="text"
                              value={p.nationality || "Indian"}
                              onChange={(e) => updatePassenger(idx, "nationality", e.target.value)}
                              placeholder="e.g. Indian"
                              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Contact Information & GST */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>Primary Contact &amp; GST Invoicing</span>
                </h3>

                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-[10px] text-slate-400">E-Ticket PDF and PNR will be sent here</span>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mobile Number</label>
                      <div className="flex gap-2">
                        <span className="p-2.5 rounded-xl border border-slate-300 bg-slate-100 font-bold text-xs text-slate-600">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">For SMS gate updates &amp; web check-in links</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <label className="text-xs text-slate-700 font-semibold flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsappUpdates}
                        onChange={(e) => setWhatsappUpdates(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Send flight updates, gate changes &amp; boarding pass on WhatsApp</span>
                    </label>
                  </div>

                  {/* GST Details for Corporate Input Tax Credit */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <label className="text-xs text-slate-900 font-bold flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useGST}
                        onChange={(e) => setUseGST(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span>Add Company GSTIN for 18% Input Tax Credit</span>
                    </label>

                    {useGST && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">GSTIN Number</label>
                          <input
                            type="text"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                            placeholder="07AAAAA0000A1Z5"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company Legal Name</label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Company Pvt Ltd"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Payment (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Flight Summary Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-sky-400" />
                    <span className="font-bold text-sm">{flight.airline}</span>
                  </div>
                  <span className="font-mono text-xs text-sky-300">{flight.flightNumber}</span>
                </div>

                <div className="flex items-center justify-between text-center">
                  <div className="text-left">
                    <span className="text-2xl font-black font-mono">{flight.fromCode}</span>
                    <p className="text-xs text-slate-400">{flight.departTime}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{flight.duration}</span>
                    <div className="w-16 h-0.5 bg-slate-700 mx-auto" />
                    <span className="text-[9px] text-emerald-400 font-bold">{flight.stops}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono">{flight.toCode}</span>
                    <p className="text-xs text-slate-400">{flight.arriveTime}</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Class:</span>
                  <span className="font-bold text-sky-300">{currentTier.name}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Fare Breakdown</h4>

                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare ({passengerCount} × ₹{basePricePerPassenger.toLocaleString("en-IN")})</span>
                    <span className="font-bold text-slate-900">₹{totalBasePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statutory Taxes, Fees &amp; UDF</span>
                    <span className="font-bold text-slate-900">₹{taxesAndGst.toLocaleString("en-IN")}</span>
                  </div>

                  {seatCost > 0 && (
                    <div className="flex justify-between text-sky-700">
                      <span>Seat Selection Fee</span>
                      <span className="font-bold">+₹{seatCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {addonsCost > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>In-Flight Meals &amp; Add-ons</span>
                      <span className="font-bold">+₹{addonsCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo (HDFCFLY)</span>
                      <span>-₹{promoDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo code (e.g. HDFCFLY)"
                      className="flex-1 p-2 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPromoApplied(true);
                        setPromoDiscount(1500);
                      }}
                      className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-slate-900">
                  <span className="font-bold text-sm">Total Payable</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{finalPayable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Payment Method</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "upi", label: "Instant UPI (GPay/PhonePe)", badge: "₹0 Fee" },
                    { id: "card", label: "Credit/Debit Card", badge: "Extra Points" },
                    { id: "netbanking", label: "Net Banking", badge: "All Banks" },
                    { id: "wallet", label: "BharatYatra Wallet", badge: "Instant" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMode(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === m.id
                          ? "border-sky-600 bg-sky-50 text-sky-900 font-bold ring-1 ring-sky-600"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-extrabold text-[11px]">{m.label}</div>
                      <span className="text-[9px] text-slate-400 block">{m.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Confirm Button */}
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Pay ₹{finalPayable.toLocaleString("en-IN")} &amp; Issue Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted &amp; IATA Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Child Modals */}
      {isSeatModalOpen && (
        <FlightSeatSelectionModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          flight={flight}
          passengerNames={passengerNamesList}
          selectedSeats={selectedSeats}
          onConfirmSeats={(seats, cost) => {
            setSelectedSeats(seats);
            setSeatCost(cost);
          }}
        />
      )}

      {isAddonsModalOpen && (
        <FlightAddonsModal
          isOpen={isAddonsModalOpen}
          onClose={() => setIsAddonsModalOpen(false)}
          flight={flight}
          passengerNames={passengerNamesList}
          initialSelection={addonsSelection}
          onConfirmAddons={(addons, cost) => {
            setAddonsSelection(addons);
            setAddonsCost(cost);
          }}
        />
      )}

      {isFareRulesOpen && (
        <FlightFareRulesModal
          isOpen={isFareRulesOpen}
          onClose={() => setIsFareRulesOpen(false)}
          flight={flight}
          selectedTier={currentTier.id}
        />
      )}

      {isConfirmedModalOpen && (
        <FlightConfirmationModal
          isOpen={isConfirmedModalOpen}
          onClose={() => {
            setIsConfirmedModalOpen(false);
            onClose();
          }}
          flight={flight}
          pnr={confirmedPNR}
          ticketNumber={confirmedTicketNum}
          bookingDate="2026-08-28"
          travellers={passengers.map((p, idx) => ({
            name: `${p.title} ${p.firstName} ${p.lastName}`,
            type: p.type === "adult" ? "Adult" : p.type === "child" ? "Child" : "Infant",
            seat: selectedSeats[idx] || "Auto-assigned",
            meal: addonsSelection.selectedMeals[idx] ? "Special Meal Included" : "Standard",
            baggage: addonsSelection.selectedBaggageId ? "Extra Baggage Tagged" : "15 kg Included",
          }))}
          fareTier={currentTier.name}
          totalPaid={finalPayable}
          paymentMode={paymentMode.toUpperCase()}
          onTrackStatus={() => {
            setIsConfirmedModalOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
