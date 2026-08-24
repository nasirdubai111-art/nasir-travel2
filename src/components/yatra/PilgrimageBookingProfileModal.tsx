import React, { useState } from "react";
import {
  X,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  Phone,
  Mail,
  Heart,
  Flame,
  Building2,
  Bus,
  Car,
  UtensilsCrossed,
  Tag,
  FileText,
  UserCheck,
  ArrowRight,
  Zap,
} from "lucide-react";
import {
  PilgrimageYatraPackage,
  PilgrimMemberDetail,
  PilgrimageBookingRecord,
  BookingItem,
} from "../../types";

interface PilgrimageBookingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PilgrimageYatraPackage | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function PilgrimageBookingProfileModal({
  isOpen,
  onClose,
  selectedPackage,
  onBookingSuccess,
}: PilgrimageBookingProfileModalProps) {
  if (!isOpen || !selectedPackage) return null;

  const [step, setStep] = useState<"details" | "pilgrims" | "addons" | "payment" | "confirmed">("details");

  // Step 1: Batch & Departure
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    selectedPackage.departureDates[0]?.id || "batch-1"
  );
  const [departurePoint, setDeparturePoint] = useState<string>(
    selectedPackage.destinationsCovered[0] || "Dehradun / Rishikesh Base"
  );
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [seniorCount, setSeniorCount] = useState<number>(1);

  // Step 2: Pilgrim Details
  const [leadName, setLeadName] = useState("Dr. Vikramaditya Joshi");
  const [leadPhone, setLeadPhone] = useState("+91 98230 45678");
  const [leadEmail, setLeadEmail] = useState("dr.v.joshi@rubyhall.com");
  const [leadAddress, setLeadAddress] = useState("402, Shanti Kunj, Bhandarkar Road, Pune, MH");
  const [emergencyName, setEmergencyName] = useState("Amit Joshi (Brother)");
  const [emergencyRelation, setEmergencyRelation] = useState("Brother");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98230 99881");

  const totalPilgrims = Math.max(1, adultsCount + childrenCount + seniorCount);

  // Dynamic Pilgrims List
  const [pilgrims, setPilgrims] = useState<PilgrimMemberDetail[]>([
    {
      id: "p-1",
      fullName: "Dr. Vikramaditya Joshi",
      age: 48,
      gender: "male",
      isSeniorCitizen: false,
      idType: "Aadhaar",
      idNumber: "XXXX-XXXX-9104",
      medicalFitnessCertified: true,
      specialRequirements: "None",
    },
    {
      id: "p-2",
      fullName: "Smt. Anuradha Joshi",
      age: 45,
      gender: "female",
      isSeniorCitizen: false,
      idType: "Aadhaar",
      idNumber: "XXXX-XXXX-4421",
      medicalFitnessCertified: true,
      specialRequirements: "Pure Jain / Vrat food preference",
    },
    {
      id: "p-3",
      fullName: "Shri Mahadev Joshi (Father)",
      age: 74,
      gender: "male",
      isSeniorCitizen: true,
      idType: "Aadhaar",
      idNumber: "XXXX-XXXX-1189",
      medicalFitnessCertified: true,
      specialRequirements: "Wheelchair assistance & oxygen support on trek",
    },
  ]);

  // Step 3: Tiers & Add-ons
  const [accommodationTier, setAccommodationTier] = useState<
    "Standard Dharamshala" | "Deluxe 3-Star Hotel" | "VIP Heritage Resort"
  >("Deluxe 3-Star Hotel");
  const [transportMode, setTransportMode] = useState<
    "AC Volvo Coach" | "Tempo Traveller" | "Private Innova Crysta" | "Helicopter VIP Shuttle"
  >(selectedPackage.transportDetails.mode.includes("Helicopter") ? "Helicopter VIP Shuttle" : "Private Innova Crysta");

  const [addOns, setAddOns] = useState({
    vipDarshanPass: true,
    personalPurohitPooja: true,
    palkiPonyArrangement: seniorCount > 0,
    sattvicMealPlanFull: true,
    oxygenKit: selectedPackage.circuitCategory === "Char Dham",
    sacredPrasadDeliveryHome: true,
    roomUpgrade: false,
  });

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CREDIT_DEBIT_CARD" | "NET_BANKING" | "WALLET">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<PilgrimageBookingRecord | null>(null);

  const selectedBatch =
    selectedPackage.departureDates.find((b) => b.id === selectedBatchId) ||
    selectedPackage.departureDates[0];

  // Price calculations
  const baseRate = selectedBatch?.batchPricePerPerson || selectedPackage.basePricePerPerson;
  const baseTotal = baseRate * totalPilgrims;

  const accommodationUpgradeFee =
    accommodationTier === "VIP Heritage Resort" ? 6000 * totalPilgrims : accommodationTier === "Deluxe 3-Star Hotel" ? 2500 * totalPilgrims : 0;

  const transportFee =
    transportMode === "Helicopter VIP Shuttle" ? 15000 * totalPilgrims : transportMode === "Private Innova Crysta" ? 3500 * totalPilgrims : 0;

  const addOnsTotal =
    (addOns.vipDarshanPass ? 1500 * totalPilgrims : 0) +
    (addOns.personalPurohitPooja ? 2100 : 0) +
    (addOns.palkiPonyArrangement ? 4500 * Math.max(1, seniorCount) : 0) +
    (addOns.oxygenKit ? 1200 * totalPilgrims : 0) +
    (addOns.sacredPrasadDeliveryHome ? 750 : 0) +
    (addOns.roomUpgrade ? 4000 : 0);

  const gstTaxes = Math.round((baseTotal + accommodationUpgradeFee + transportFee + addOnsTotal) * 0.05);
  const platformFee = 399;
  const totalPayable = Math.max(0, baseTotal + accommodationUpgradeFee + transportFee + addOnsTotal + gstTaxes + platformFee - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "SANATANVIP" || code === "BHARATYATRA10") {
      const discount = Math.round(baseTotal * 0.08);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else if (code === "OMNAMAHSHIVAY") {
      setDiscountAmount(2500);
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code. Try SANATANVIP or OMNAMAHSHIVAY");
    }
  };

  const handlePilgrimChange = (index: number, field: keyof PilgrimMemberDetail, val: any) => {
    const updated = [...pilgrims];
    if (!updated[index]) {
      updated[index] = {
        id: `p-${index + 1}`,
        fullName: "",
        age: 30,
        gender: "male",
        isSeniorCitizen: false,
        idType: "Aadhaar",
        idNumber: "",
        medicalFitnessCertified: true,
      };
    }
    updated[index] = { ...updated[index], [field]: val };
    if (field === "age") {
      updated[index].isSeniorCitizen = Number(val) >= 60;
    }
    setPilgrims(updated);
  };

  const handleConfirmAndPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const bookingId = `bk-yatra-${Date.now().toString().slice(-6)}`;
      const pnrNum = `YATRA-${selectedPackage.circuitCategory.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newBookingRecord: PilgrimageBookingRecord = {
        id: bookingId,
        bookingRef: `BY-YATRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        pnrNumber: pnrNum,
        operatorId: selectedPackage.operatorId,
        packageId: selectedPackage.id,
        packageName: selectedPackage.title,
        circuit: selectedPackage.circuitCategory,
        departureDate: selectedBatch?.date || "2026-09-12",
        returnDate: selectedBatch?.returnDate || "2026-09-16",
        departurePoint: departurePoint,
        leadPilgrim: {
          name: leadName,
          phone: leadPhone,
          email: leadEmail,
          address: leadAddress,
          city: "Pune",
          state: "Maharashtra",
        },
        emergencyContact: {
          name: emergencyName,
          relation: emergencyRelation,
          phone: emergencyPhone,
        },
        pilgrims: pilgrims.slice(0, totalPilgrims),
        adultsCount,
        childrenCount,
        seniorCount,
        totalPilgrims,
        selectedAccommodationTier: accommodationTier,
        selectedTransportMode: transportMode,
        addOnsSelected: addOns,
        fareBreakdown: {
          baseFare: baseTotal,
          travellerCharges: 0,
          accommodationCharge: accommodationUpgradeFee,
          transportCharge: transportFee,
          mealsCharge: 0,
          addOnsTotal,
          gstTaxes,
          platformFee,
          discountAmount,
          couponCodeApplied: couponApplied ? couponCode.toUpperCase() : undefined,
          totalPayable,
        },
        paymentDetails: {
          paymentMethod,
          transactionId: `${paymentMethod}-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          paidAt: new Date().toISOString().replace("T", " ").slice(0, 16),
          status: "PAID",
        },
        status: "CONFIRMED",
        voucherUrl: `https://bharatyatra.in/vouchers/${pnrNum}.pdf`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pnrNum}-CONFIRMED-BY`,
        gstInvoiceNumber: `INV-DY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        issuedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        assignedGuide: "Acharya Somnath Shastri (+91 98971 88201)",
        assignedVehicle: `${transportMode} (Allocated Fleet Desk)`,
        assignedRoom: `${accommodationTier} Allocated`,
      };

      setConfirmedRecord(newBookingRecord);
      setStep("confirmed");

      // Sync to Central Booking State / My Trips
      const bookingItemForApp: BookingItem = {
        id: bookingId,
        serviceType: "pilgrimage",
        serviceCategory: "pilgrimage",
        title: selectedPackage.title,
        subtitle: `${selectedPackage.circuitCategory} • ${selectedPackage.duration}`,
        provider: selectedPackage.operatorName,
        providerLogo: selectedPackage.featuredImage,
        fromLocation: departurePoint,
        toLocation: selectedPackage.destinationsCovered.join(", "),
        date: selectedBatch?.date || "2026-09-12",
        returnDate: selectedBatch?.returnDate || "2026-09-16",
        time: "06:00 AM Departure",
        status: "confirmed",
        pnr: pnrNum,
        bookingRef: newBookingRecord.bookingRef,
        amount: totalPayable,
        amountPaid: totalPayable,
        passengers: totalPilgrims,
        passengersCount: totalPilgrims,
        seatOrRoomInfo: `${accommodationTier} • ${transportMode}`,
        qrCodeUrl: newBookingRecord.qrCodeUrl,
        invoiceNumber: newBookingRecord.gstInvoiceNumber,
        passengerDetailsList: pilgrims.slice(0, totalPilgrims).map((p) => ({
          name: p.fullName || "Pilgrim",
          age: p.age,
          gender: p.gender,
          seat: p.seatOrRoomAllocation || "Assigned",
          idNumber: p.idNumber,
          category: p.isSeniorCitizen ? "Senior Citizen" : "Adult",
        })),
        paymentSummary: {
          baseFare: baseTotal,
          taxesAndGst: gstTaxes,
          convenienceFee: platformFee,
          discountApplied: discountAmount,
          totalAmount: totalPayable,
          paymentMode: paymentMethod,
          paymentStatus: "PAID",
          transactionRef: newBookingRecord.paymentDetails.transactionId,
          paidAt: newBookingRecord.paymentDetails.paidAt,
        },
        gstInvoice: {
          invoiceNumber: newBookingRecord.gstInvoiceNumber,
          gstin: "05AABCD9812K1ZT",
          legalEntity: selectedPackage.operatorName,
          sacCode: "998555",
          date: newBookingRecord.issuedAt,
          taxableAmount: totalPayable - gstTaxes,
          cgst: Math.round(gstTaxes / 2),
          sgst: Math.round(gstTaxes / 2),
          igst: 0,
          totalInvoiceAmount: totalPayable,
        },
      };

      onBookingSuccess(bookingItemForApp);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-amber-300/60 my-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-yellow-950 to-stone-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-extrabold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Sacred Pilgrimage Booking Desk</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
              ✓ Shrine Trust Verified
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">{selectedPackage.title}</h2>
          <p className="text-xs text-amber-200/90 mt-1 flex items-center gap-2 flex-wrap">
            <span>By {selectedPackage.operatorName}</span>
            <span>•</span>
            <span className="text-amber-300 font-bold">{selectedPackage.duration}</span>
            <span>•</span>
            <span>Deity: {selectedPackage.sacredDeity}</span>
          </p>

          {/* Stepper Bar */}
          {step !== "confirmed" && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-amber-500/20 text-xs">
              <div
                onClick={() => setStep("details")}
                className={`cursor-pointer flex items-center gap-1.5 font-bold ${
                  step === "details" ? "text-amber-400" : "text-slate-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span className="hidden sm:inline">1. Dates &amp; Count</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div
                onClick={() => setStep("pilgrims")}
                className={`cursor-pointer flex items-center gap-1.5 font-bold ${
                  step === "pilgrims" ? "text-amber-400" : "text-slate-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span className="hidden sm:inline">2. Pilgrim Manifest</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div
                onClick={() => setStep("addons")}
                className={`cursor-pointer flex items-center gap-1.5 font-bold ${
                  step === "addons" ? "text-amber-400" : "text-slate-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="hidden sm:inline">3. Stays &amp; Rituals</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div
                onClick={() => setStep("payment")}
                className={`cursor-pointer flex items-center gap-1.5 font-bold ${
                  step === "payment" ? "text-amber-400" : "text-slate-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px]">
                  4
                </span>
                <span className="hidden sm:inline">4. Review &amp; Pay</span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: Dates, Batch & Travelers Count */}
          {step === "details" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Select Yatra Departure Batch &amp; Base Point</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-cleared shrine trust entry slots &amp; reserved helicopter/coach allocations.
                </p>
              </div>

              {/* Batch Date Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedPackage.departureDates.map((batch) => (
                  <div
                    key={batch.id}
                    onClick={() => setSelectedBatchId(batch.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedBatchId === batch.id
                        ? "border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/30"
                        : "border-slate-200 hover:border-amber-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-extrabold text-slate-900">{batch.date}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          batch.status === "FILLING_FAST"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {batch.availableSeats} Seats Left
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Return: {batch.returnDate}</p>
                    <p className="text-sm font-black text-amber-900 mt-2">
                      ₹{batch.batchPricePerPerson.toLocaleString("en-IN")}{" "}
                      <span className="text-[10px] text-slate-500 font-normal">/ Yatri</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Departure Point Select */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Yatra Starting / Assembly Point
                </label>
                <input
                  type="text"
                  value={departurePoint}
                  onChange={(e) => setDeparturePoint(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  placeholder="e.g. Sahastradhara Helipad Dehradun or Haridwar Station"
                />
              </div>

              {/* Yatris Count Selectors */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                  Number of Yatris / Pilgrims
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Adults */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Adults (12–59 yrs)</p>
                      <p className="text-[10px] text-slate-400">Full Yatra Package</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-sm hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-4 text-center">{adultsCount}</span>
                      <button
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-sm hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Seniors */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-900">Seniors (60+ yrs)</p>
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      </div>
                      <p className="text-[10px] text-amber-700 font-semibold">Priority care &amp; medical</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSeniorCount(Math.max(0, seniorCount - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-amber-300 font-bold text-sm hover:bg-amber-100"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-4 text-center">{seniorCount}</span>
                      <button
                        onClick={() => setSeniorCount(seniorCount + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-amber-300 font-bold text-sm hover:bg-amber-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Children (&lt;12 yrs)</p>
                      <p className="text-[10px] text-slate-400">Half meal &amp; bed plan</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-sm hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-4 text-center">{childrenCount}</span>
                      <button
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-sm hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Next Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Yatris</span>
                  <span className="text-base font-black text-slate-900">
                    {totalPilgrims} Person(s) ({seniorCount} Senior)
                  </span>
                </div>

                <button
                  onClick={() => setStep("pilgrims")}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span>Continue to Pilgrim Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Lead Pilgrim & Passenger Manifest */}
          {step === "pilgrims" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Lead Pilgrim &amp; Yatri ID Manifest</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Required for Temple Shrine Trust VIP biometric passes, Helicopter manifest, and police verification.
                </p>
              </div>

              {/* Lead Pilgrim Contacts */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <h4 className="text-xs font-extrabold text-amber-900 uppercase">Lead Pilgrim Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile (WhatsApp SMS updates)</label>
                    <input
                      type="text"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={leadAddress}
                      onChange={(e) => setLeadAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-2 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Contact Person</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Phone</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Yatri Manifest Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-slate-600">
                  Individual Yatri Details ({totalPilgrims} Pilgrims)
                </h4>
                {Array.from({ length: totalPilgrims }).map((_, idx) => {
                  const p = pilgrims[idx] || {
                    id: `p-${idx + 1}`,
                    fullName: "",
                    age: idx === 2 ? 70 : 35,
                    gender: "male",
                    isSeniorCitizen: idx === 2,
                    idType: "Aadhaar",
                    idNumber: "",
                    medicalFitnessCertified: true,
                  };

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                            {idx + 1}
                          </span>
                          <span>Yatri #{idx + 1}</span>
                          {p.age >= 60 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                              Senior Citizen (Priority Care)
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Medical Self-Certified</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Full Name as per Aadhaar/Passport"
                            value={p.fullName}
                            onChange={(e) => handlePilgrimChange(idx, "fullName", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-medium"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Age"
                            value={p.age || ""}
                            onChange={(e) => handlePilgrimChange(idx, "age", Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-medium"
                          />
                        </div>
                        <div>
                          <select
                            value={p.gender}
                            onChange={(e) => handlePilgrimChange(idx, "gender", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-medium bg-white"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div>
                          <select
                            value={p.idType}
                            onChange={(e) => handlePilgrimChange(idx, "idType", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-medium bg-white"
                          >
                            <option value="Aadhaar">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Voter ID">Voter ID Card</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Govt ID Number (e.g. XXXX-XXXX-9104)"
                            value={p.idNumber}
                            onChange={(e) => handlePilgrimChange(idx, "idNumber", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setStep("details")}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Back to Dates
                </button>
                <button
                  onClick={() => setStep("addons")}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>Proceed to Stays &amp; Rituals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Accommodation, Transport & Sacred Add-ons */}
          {step === "addons" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Choose Accommodation, Transport &amp; Sacred Seva Add-ons</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize stays, pure satvik food preferences, and sacred pooja arrangements.
                </p>
              </div>

              {/* Accommodation Tier Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Accommodation Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Standard Dharamshala", title: "Standard Ashram / Lodge", cost: "Included in Base", desc: "Clean twin rooms with attached bath & satvik bhojan." },
                    { id: "Deluxe 3-Star Hotel", title: "Deluxe 3-Star AC Hotel", cost: "+₹2,500 / Yatri", desc: "Premium heated rooms near temple corridors with hot water 24x7." },
                    { id: "VIP Heritage Resort", title: "VIP 4-Star Resort", cost: "+₹6,000 / Yatri", desc: "Luxury mountain view suites, oxygen support & private dining." },
                  ].map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setAccommodationTier(tier.id as any)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        accommodationTier === tier.id
                          ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/30"
                          : "border-slate-200 bg-white hover:border-amber-200"
                      }`}
                    >
                      <p className="text-xs font-extrabold text-slate-900">{tier.title}</p>
                      <span className="text-[11px] font-bold text-amber-800 block mt-0.5">{tier.cost}</span>
                      <p className="text-[11px] text-slate-500 mt-1">{tier.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Mode */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Vehicle / Transport Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "AC Volvo Coach", title: "AC Luxury Volvo Coach", desc: "Spacious recliner coach with bhajan audio & onboard sahayak." },
                    { id: "Private Innova Crysta", title: "Private Innova Crysta", desc: "Dedicated AC SUV for private family comfort & swift transfers." },
                    { id: "Helicopter VIP Shuttle", title: "Helicopter VIP Shuttle", desc: "Direct twin-engine helicopter flights between shrines." },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTransportMode(t.id as any)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        transportMode === t.id
                          ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/30"
                          : "border-slate-200 bg-white hover:border-amber-200"
                      }`}
                    >
                      <p className="text-xs font-extrabold text-slate-900">{t.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sacred Add-Ons Checkboxes */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Sacred Rituals, Darshan Passes &amp; Senior Seva Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={addOns.vipDarshanPass}
                      onChange={(e) => setAddOns({ ...addOns, vipDarshanPass: e.target.checked })}
                      className="mt-1 w-4 h-4 text-amber-600 rounded-sm"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">VIP Sugam Fast-Track Darshan Pass</span>
                      <span className="text-[11px] text-slate-500">Zero queue waiting at sanctum sanctorum (+₹1,500/person)</span>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={addOns.personalPurohitPooja}
                      onChange={(e) => setAddOns({ ...addOns, personalPurohitPooja: e.target.checked })}
                      className="mt-1 w-4 h-4 text-amber-600 rounded-sm"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Personal Vedic Purohit Sankalp Pooja</span>
                      <span className="text-[11px] text-slate-500">Special Rudrabhishek with your family Gotra (+₹2,100 total)</span>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={addOns.palkiPonyArrangement}
                      onChange={(e) => setAddOns({ ...addOns, palkiPonyArrangement: e.target.checked })}
                      className="mt-1 w-4 h-4 text-amber-600 rounded-sm"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Palki / Pony Service for Seniors</span>
                      <span className="text-[11px] text-slate-500">Shrine board registered sahayak for uphill trek (+₹4,500/senior)</span>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={addOns.oxygenKit}
                      onChange={(e) => setAddOns({ ...addOns, oxygenKit: e.target.checked })}
                      className="mt-1 w-4 h-4 text-amber-600 rounded-sm"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Portable Medical Oxygen Canister</span>
                      <span className="text-[11px] text-slate-500">Essential for Kedarnath/Yamunotri high-altitude safety (+₹1,200/person)</span>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-amber-400 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={addOns.sacredPrasadDeliveryHome}
                      onChange={(e) => setAddOns({ ...addOns, sacredPrasadDeliveryHome: e.target.checked })}
                      className="mt-1 w-4 h-4 text-amber-600 rounded-sm"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Sacred Temple Prasad Box Delivered Home</span>
                      <span className="text-[11px] text-slate-500">Blessed holy dry fruit prasad &amp; silver coin delivered to your home address (+₹750)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setStep("pilgrims")}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Back to Manifest
                </button>
                <button
                  onClick={() => setStep("payment")}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>Review Booking &amp; Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review Summary, Coupon & Multi-Gateway Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Fare Breakdown, Discount &amp; Secure Payment</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  100% Secure checkout protected by 256-bit encryption and IRCTC / Ministry of Tourism trust.
                </p>
              </div>

              {/* Itinerary & Booking Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{selectedPackage.title}</span>
                  <span className="font-bold text-amber-800">{selectedBatch?.date}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block">Yatris</span>
                    <span className="font-bold text-slate-900">{totalPilgrims} Persons</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Accommodation</span>
                    <span className="font-bold text-slate-900">{accommodationTier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transport</span>
                    <span className="font-bold text-slate-900">{transportMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lead Yatri</span>
                    <span className="font-bold text-slate-900">{leadName}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Fare Summary */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Itemized Price Summary
                </h4>
                <div className="flex justify-between text-slate-600">
                  <span>Base Yatra Fare ({totalPilgrims} × ₹{baseRate.toLocaleString("en-IN")})</span>
                  <span className="font-bold text-slate-900">₹{baseTotal.toLocaleString("en-IN")}</span>
                </div>
                {accommodationUpgradeFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Accommodation Tier Upgrade ({accommodationTier})</span>
                    <span className="font-bold text-slate-900">₹{accommodationUpgradeFee.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {transportFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Transport Tier Upgrade ({transportMode})</span>
                    <span className="font-bold text-slate-900">₹{transportFee.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Rituals &amp; Seva Add-ons</span>
                    <span className="font-bold text-slate-900">₹{addOnsTotal.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Taxes &amp; Surcharges</span>
                  <span className="font-bold text-slate-900">₹{gstTaxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Yatra Insurance &amp; Platform Fee</span>
                  <span className="font-bold text-slate-900">₹{platformFee.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                    <span>Promo Discount ({couponCode.toUpperCase()})</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {/* Coupon Code Input */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. SANATANVIP)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold uppercase flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Coupon {couponCode.toUpperCase()} applied successfully!
                  </p>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black">
                  <span className="text-slate-900">Total Payable Amount</span>
                  <span className="text-xl text-amber-600 font-black">
                    ₹{totalPayable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {[
                    { id: "UPI", label: "Instant UPI / GPay / QR", icon: "⚡" },
                    { id: "CREDIT_DEBIT_CARD", label: "Credit / Debit Card", icon: "💳" },
                    { id: "NET_BANKING", label: "Net Banking (All Banks)", icon: "🏦" },
                    { id: "WALLET", label: "BharatYatra Wallet", icon: "🪙" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-2xl border-2 font-bold text-left transition-all ${
                        paymentMethod === m.id
                          ? "border-amber-500 bg-amber-50/80 text-amber-950 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-amber-200"
                      }`}
                    >
                      <span className="text-base block mb-1">{m.icon}</span>
                      <span className="text-[11px] block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setStep("addons")}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Back to Add-ons
                </button>

                <button
                  disabled={isProcessing}
                  onClick={handleConfirmAndPay}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Securing Divine Yatra Booking...</span>
                  ) : (
                    <>
                      <span>Pay ₹{totalPayable.toLocaleString("en-IN")} &amp; Confirm</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Booking Confirmation & Digital Voucher */}
          {step === "confirmed" && confirmedRecord && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase">
                  Jai Shri Ram • Har Har Mahadev
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Pilgrimage Yatra Booking Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your VIP Yatra slot has been confirmed and synced to your central <strong>My Trips</strong> profile.
                </p>
              </div>

              {/* Printable Voucher Ticket */}
              <div className="max-w-xl mx-auto p-5 rounded-3xl bg-amber-50/60 border-2 border-dashed border-amber-300 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold uppercase block">Booking ID / PNR</span>
                    <span className="text-base font-black text-slate-900">{confirmedRecord.pnrNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">GST Tax Invoice</span>
                    <span className="text-xs font-extrabold text-slate-800">{confirmedRecord.gstInvoiceNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Yatra Circuit</span>
                    <span className="font-extrabold text-slate-900">{confirmedRecord.packageName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Departure Date</span>
                    <span className="font-extrabold text-amber-900">{confirmedRecord.departureDate} (5-Day Circuit)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lead Pilgrim</span>
                    <span className="font-extrabold text-slate-900">{confirmedRecord.leadPilgrim.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Yatris</span>
                    <span className="font-extrabold text-slate-900">{confirmedRecord.totalPilgrims} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Guide</span>
                    <span className="font-extrabold text-slate-900">{confirmedRecord.assignedGuide}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Amount Paid</span>
                    <span className="font-black text-emerald-700 text-sm">
                      ₹{confirmedRecord.fareBreakdown.totalPayable.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="pt-3 border-t border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={confirmedRecord.qrCodeUrl}
                      alt="Booking QR"
                      className="w-14 h-14 rounded-xl border border-amber-300 p-1 bg-white"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Fast-Track Pass</span>
                      <span className="text-[11px] font-bold text-slate-800">Scan at Shrine Checkpost</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    <a
                      href={confirmedRecord.voucherUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-slate-950 text-white font-extrabold text-xs shadow-md hover:bg-slate-800"
                >
                  Close &amp; View in My Trips
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
