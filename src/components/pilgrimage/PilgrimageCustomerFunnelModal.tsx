import React, { useState } from "react";
import {
  X,
  Compass,
  Search,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sun,
  ShieldCheck,
  Check,
  Download,
  Printer,
  Sparkles,
  Award,
  Phone,
  User,
  Heart,
  AlertCircle,
  HelpCircle,
  MapPin,
  Clock,
  Car,
} from "lucide-react";
import {
  PilgrimagePackage,
  PilgrimagePassenger,
  PilgrimageCustomerProfile,
  PilgrimageBookingRecord,
} from "../../types/pilgrimagePipelineTypes";
import { pilgrimageService } from "../../services/pilgrimageService";

interface PilgrimageCustomerFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated?: (booking: any) => void;
}

type FunnelStep =
  | "customer"
  | "search"
  | "package_details"
  | "passenger_details"
  | "booking"
  | "payment"
  | "ticket_qr"
  | "itinerary";

const FUNNEL_STEPS: { id: FunnelStep; label: string; number: number }[] = [
  { id: "customer", label: "Customer", number: 1 },
  { id: "search", label: "Pilgrimage Search", number: 2 },
  { id: "package_details", label: "Package Details", number: 3 },
  { id: "passenger_details", label: "Passenger Details", number: 4 },
  { id: "booking", label: "Booking", number: 5 },
  { id: "payment", label: "Payment", number: 6 },
  { id: "ticket_qr", label: "Ticket/QR", number: 7 },
  { id: "itinerary", label: "Confirmation", number: 8 },
];

export function PilgrimageCustomerFunnelModal({
  isOpen,
  onClose,
  onBookingCreated,
}: PilgrimageCustomerFunnelModalProps) {
  const [currentStep, setCurrentStep] = useState<FunnelStep>("customer");

  // Step 1: Customer Profile
  const [customerProfile, setCustomerProfile] = useState<PilgrimageCustomerProfile>({
    customerId: "CUST-IN-99012",
    fullName: "Ramesh Sharma",
    phone: "+91 98112 44332",
    email: "ramesh.sharma@gmail.com",
    city: "Lucknow",
    state: "Uttar Pradesh",
    emergencyContactName: "Sumit Sharma (Son)",
    emergencyContactPhone: "+91 98112 44335",
    isSeniorCitizenPriority: true,
    medicalFitnessDeclared: true,
  });

  // Step 2: Search filters & selection
  const [searchCircuit, setSearchCircuit] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const allPackages = pilgrimageService.getPackages();

  const filteredPackages = allPackages.filter((pkg) => {
    const matchesCircuit = searchCircuit === "all" || pkg.circuit === searchCircuit;
    const matchesQuery =
      pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.circuit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.temples.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCircuit && matchesQuery;
  });

  // Step 3: Selected Package & Customization
  const [selectedPackage, setSelectedPackage] = useState<PilgrimagePackage>(allPackages[0]);
  const [selectedTravelDate, setSelectedTravelDate] = useState<string>(allPackages[0].availableBatchDates[0]);
  const [hasHelicopterAddon, setHasHelicopterAddon] = useState<boolean>(true);

  // Step 4: Passenger Details
  const [passengers, setPassengers] = useState<PilgrimagePassenger[]>([
    {
      id: "pax-1",
      fullName: "Ramesh Sharma",
      age: 62,
      gender: "Male",
      aadhaarToken: "AADHAAR-8819-VERIFIED",
      specialSeva: "Rudrabhishek Puja",
      highAltitudeFitnessOk: true,
    },
    {
      id: "pax-2",
      fullName: "Sharda Sharma",
      age: 59,
      gender: "Female",
      aadhaarToken: "AADHAAR-8820-VERIFIED",
      specialSeva: "Senior Wheelchair / Doli",
      highAltitudeFitnessOk: true,
    },
  ]);

  // Step 6: Payment simulation state
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "NetBanking" | "CreditCard" | "DebitCard">("UPI");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Step 7: Completed Booking
  const [completedBooking, setCompletedBooking] = useState<PilgrimageBookingRecord | null>(null);

  if (!isOpen) return null;

  // Pricing calculations for review
  const seniorsCount = passengers.filter((p) => p.age >= 60).length;
  const adultsCount = passengers.length - seniorsCount;
  const baseFare = adultsCount * selectedPackage.basePriceAdult + seniorsCount * selectedPackage.basePriceSenior;
  const vipDarshanFees = passengers.length * selectedPackage.vipDarshanFee;
  const helicopterFees = hasHelicopterAddon ? passengers.length * selectedPackage.helipadAddonPrice : 0;
  const sevaAddonFees = passengers.reduce((acc, p) => {
    if (p.specialSeva === "Rudrabhishek Puja") return acc + 1500;
    if (p.specialSeva === "Aarti Pass") return acc + 500;
    if (p.specialSeva === "Senior Wheelchair / Doli") return acc + 2500;
    if (p.specialSeva === "Mahaprasad Box") return acc + 350;
    return acc;
  }, 0);
  const subtotal = baseFare + vipDarshanFees + helicopterFees + sevaAddonFees;
  const gstAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + gstAmount;

  const handleAddPassenger = () => {
    const newIdx = passengers.length + 1;
    setPassengers([
      ...passengers,
      {
        id: `pax-${newIdx}`,
        fullName: "",
        age: 35,
        gender: "Male",
        aadhaarToken: `AADHAAR-PAX-${newIdx}-NEW`,
        specialSeva: "None",
        highAltitudeFitnessOk: true,
      },
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((p) => p.id !== id));
    }
  };

  const handleUpdatePassenger = (id: string, field: keyof PilgrimagePassenger, val: any) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const record = pilgrimageService.createCustomerBooking({
        packageId: selectedPackage.packageId,
        customer: customerProfile,
        travelDate: selectedTravelDate,
        passengers,
        hasHelicopterAddon,
        paymentMethod,
      });

      setCompletedBooking(record);
      setIsProcessingPayment(false);
      setCurrentStep("ticket_qr");

      // Notify global booking state
      if (onBookingCreated) {
        onBookingCreated({
          id: record.bookingId,
          type: "pilgrimage",
          serviceType: "pilgrimage",
          title: record.packageName,
          from: selectedPackage.departureCity,
          to: selectedPackage.arrivalCity,
          date: record.travelDate,
          status: "confirmed",
          amount: record.totalAmount,
          ticketNumber: record.ticketNumber,
          pnr: record.bookingId,
          pax: record.passengers.length,
          darshanSlot: record.darshanSlotTime,
          qrCode: record.shrineBoardQrPayload,
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-orange-500/40 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header with Title & Close */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30">
              <Sun className="w-5 h-5 text-orange-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  Pilgrimage 8-Step Funnel
                </span>
                <span className="text-2xs text-slate-400 font-mono hidden sm:inline">
                  Customer ➔ Search ➔ Package ➔ Passenger ➔ Booking ➔ Payment ➔ Ticket/QR ➔ Confirmation
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                Sacred Yatra &amp; Sugam Darshan Booking Engine
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Step Funnel Progress Bar */}
        <div className="bg-slate-950/80 px-3 sm:px-6 py-2.5 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-1">
            {FUNNEL_STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast =
                FUNNEL_STEPS.findIndex((s) => s.id === currentStep) > idx;

              return (
                <div key={step.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      // Allow jumping back or forward if already generated
                      if (isPast || (step.id === "ticket_qr" && completedBooking) || (step.id === "itinerary" && completedBooking)) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={!isPast && !isActive && step.id !== "itinerary"}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-2xs font-bold transition-all ${
                      isActive
                        ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black"
                        : isPast
                        ? "bg-slate-800 text-emerald-400 hover:bg-slate-700 cursor-pointer"
                        : "bg-slate-900/50 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isActive
                          ? "bg-slate-950 text-orange-400"
                          : isPast
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isPast ? "✓" : step.number}
                    </span>
                    <span className="whitespace-nowrap">{step.label}</span>
                  </button>
                  {idx < FUNNEL_STEPS.length - 1 && (
                    <span className="text-slate-700 text-2xs">➔</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/60 space-y-6">
          {/* =============================================================== */}
          {/* STEP 1: CUSTOMER PROFILE & CONTEXT */}
          {/* =============================================================== */}
          {currentStep === "customer" && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Step 1: Customer Profile Context</h3>
                    <p className="text-xs text-slate-400">
                      Verify primary devotee details, contact information, and senior citizen preferences.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-2xs font-bold text-slate-300 uppercase mb-1">
                      Lead Pilgrim Full Name
                    </label>
                    <input
                      type="text"
                      value={customerProfile.fullName}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, fullName: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-300 uppercase mb-1">
                      Mobile Number (SMS / WhatsApp Pass)
                    </label>
                    <input
                      type="text"
                      value={customerProfile.phone}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, phone: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-300 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerProfile.email}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, email: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-300 uppercase mb-1">
                      Hometown / City
                    </label>
                    <input
                      type="text"
                      value={customerProfile.city}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, city: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-300 uppercase mb-1">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={customerProfile.emergencyContactName}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, emergencyContactName: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-300 uppercase mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="text"
                      value={customerProfile.emergencyContactPhone}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, emergencyContactPhone: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerProfile.isSeniorCitizenPriority}
                      onChange={(e) =>
                        setCustomerProfile({
                          ...customerProfile,
                          isSeniorCitizenPriority: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-orange-500 bg-slate-950 border-slate-700 focus:ring-0"
                    />
                    <span className="text-xs text-slate-300 font-semibold">
                      Devotee Group includes Senior Citizens (Flag for ground assistance &amp; Sugam wheelchair queue)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerProfile.medicalFitnessDeclared}
                      onChange={(e) =>
                        setCustomerProfile({
                          ...customerProfile,
                          medicalFitnessDeclared: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-orange-500 bg-slate-950 border-slate-700 focus:ring-0"
                    />
                    <span className="text-xs text-slate-300 font-semibold">
                      Devotees self-declare medical fitness for high-altitude shrine circuits
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep("search")}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <span>Proceed to Pilgrimage Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 2: PILGRIMAGE SEARCH */}
          {/* =============================================================== */}
          {currentStep === "search" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">Step 2: Sacred Circuit Search</h3>
                  <p className="text-xs text-slate-400">
                    Select your spiritual destination across India&apos;s verified Shrine Board circuits.
                  </p>
                </div>

                {/* Circuit Filter & Search Input */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search shrine, temple..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <select
                    value={searchCircuit}
                    onChange={(e) => setSearchCircuit(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-400 font-semibold"
                  >
                    <option value="all">All Circuits</option>
                    <option value="Char Dham">Char Dham (Uttarakhand)</option>
                    <option value="12 Jyotirlinga">12 Jyotirlinga (Ujjain/Omkareshwar)</option>
                    <option value="Kashi & Ayodhya">Kashi Vishwanath &amp; Ayodhya</option>
                    <option value="Vaishno Devi">Mata Vaishno Devi (J&amp;K)</option>
                    <option value="South Temple Circuit">Tirupati Balaji (South)</option>
                  </select>
                </div>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPackages.map((pkg) => {
                  const isSelected = selectedPackage.packageId === pkg.packageId;
                  return (
                    <div
                      key={pkg.packageId}
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setSelectedTravelDate(pkg.availableBatchDates[0]);
                      }}
                      className={`rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-slate-900 border-orange-400 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/30"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={pkg.image}
                          alt={pkg.packageName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-orange-300 border border-orange-500/30 text-3xs font-extrabold uppercase">
                          {pkg.circuit}
                        </span>
                        <span className="absolute bottom-2 left-2.5 text-3xs text-slate-300 font-mono">
                          {pkg.duration} &bull; {pkg.departureCity}
                        </span>
                      </div>

                      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">
                            {pkg.packageName}
                          </h4>
                          <p className="text-2xs text-slate-400 mt-1 line-clamp-2">
                            {pkg.temples.join(", ")}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-3xs text-slate-500 block">From / Devotee</span>
                            <span className="font-black text-orange-400 text-sm">₹{pkg.basePriceAdult.toLocaleString()}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPackage(pkg);
                              setSelectedTravelDate(pkg.availableBatchDates[0]);
                              setCurrentStep("package_details");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep("customer")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Customer</span>
                </button>
                <button
                  onClick={() => setCurrentStep("package_details")}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>View Package Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 3: PACKAGE DETAILS */}
          {/* =============================================================== */}
          {currentStep === "package_details" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                      {selectedPackage.circuit} &bull; {selectedPackage.duration}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {selectedPackage.packageName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Accredited Operator: <strong>{selectedPackage.operatorName}</strong> ({selectedPackage.rating}★ &bull; {selectedPackage.reviewsCount} reviews)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xs text-slate-400 block">Adult Fare / Devotee</span>
                    <span className="text-xl font-black text-orange-400">₹{selectedPackage.basePriceAdult.toLocaleString()}</span>
                    <span className="text-3xs text-emerald-400 block">Senior Citizen Fare: ₹{selectedPackage.basePriceSenior.toLocaleString()}</span>
                  </div>
                </div>

                {/* Batch Date Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-2xs font-bold text-slate-300 uppercase block">
                    Select Batch Departure Date:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedPackage.availableBatchDates.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedTravelDate(d)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedTravelDate === d
                            ? "bg-orange-500/20 border-orange-400 text-white font-bold"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-mono block">{d}</span>
                        <span className="text-[10px] text-emerald-400 block">Confirmed Batch</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inclusions & Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-white text-2xs uppercase tracking-wider block">
                      Sacred Inclusions
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-2xs">
                      {selectedPackage.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-white text-2xs uppercase tracking-wider block">
                      Logistics &amp; Hospitality
                    </span>
                    <div className="space-y-2 text-2xs text-slate-300">
                      <div>
                        <strong className="text-slate-400 block">Transport:</strong>
                        <span>{selectedPackage.transportVehicle}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 block">Accommodation:</strong>
                        <span>{selectedPackage.accommodationType}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 block">Dietary &amp; Meals:</strong>
                        <span>{selectedPackage.mealPlan}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Helicopter Addon Option */}
                {selectedPackage.helipadAddonPrice > 0 && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-950 border border-orange-500/30 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Helicopter Transfer Addon (+₹{selectedPackage.helipadAddonPrice.toLocaleString()} / person)
                      </span>
                      <p className="text-2xs text-slate-300 mt-0.5">
                        Guaranteed priority helipad boarding pass (Phata/Sersi ➔ Kedarnath Sanctum Helipad).
                      </p>
                    </div>

                    <button
                      onClick={() => setHasHelicopterAddon(!hasHelicopterAddon)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hasHelicopterAddon
                          ? "bg-orange-500 text-slate-950 shadow-md font-black"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {hasHelicopterAddon ? "✓ Helipad Included" : "+ Add Helipad"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep("search")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Search</span>
                </button>
                <button
                  onClick={() => setCurrentStep("passenger_details")}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Add Passenger Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 4: PASSENGER DETAILS */}
          {/* =============================================================== */}
          {currentStep === "passenger_details" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Step 4: Devotee Passenger Manifest</h3>
                  <p className="text-xs text-slate-400">
                    Mandatory biometric ID verification for Shrine Board Sugam Darshan Passes.
                  </p>
                </div>

                <button
                  onClick={handleAddPassenger}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-300 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>+ Add Another Devotee</span>
                </button>
              </div>

              <div className="space-y-4">
                {passengers.map((pax, idx) => (
                  <div
                    key={pax.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-black text-orange-400 font-mono">
                        Devotee #{idx + 1}
                      </span>
                      {passengers.length > 1 && (
                        <button
                          onClick={() => handleRemovePassenger(pax.id)}
                          className="text-slate-500 hover:text-rose-400 text-2xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-3xs font-bold text-slate-400 uppercase mb-1">
                          Full Name (As on Govt ID)
                        </label>
                        <input
                          type="text"
                          value={pax.fullName}
                          onChange={(e) => handleUpdatePassenger(pax.id, "fullName", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <label className="block text-3xs font-bold text-slate-400 uppercase mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={pax.age}
                          onChange={(e) => handleUpdatePassenger(pax.id, "age", Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-3xs font-bold text-slate-400 uppercase mb-1">
                          Gender
                        </label>
                        <select
                          value={pax.gender}
                          onChange={(e) => handleUpdatePassenger(pax.id, "gender", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-400"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-3xs font-bold text-slate-400 uppercase mb-1">
                          Aadhaar Token / Biometric ID
                        </label>
                        <input
                          type="text"
                          value={pax.aadhaarToken}
                          onChange={(e) => handleUpdatePassenger(pax.id, "aadhaarToken", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs font-mono text-emerald-400 focus:outline-none focus:border-orange-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-3xs font-bold text-slate-400 uppercase mb-1">
                          Special Seva &amp; Assistance Addon
                        </label>
                        <select
                          value={pax.specialSeva}
                          onChange={(e) => handleUpdatePassenger(pax.id, "specialSeva", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-400"
                        >
                          <option value="None">None (Standard VIP Darshan)</option>
                          <option value="Rudrabhishek Puja">Special Rudrabhishek Puja (+₹1,500)</option>
                          <option value="Aarti Pass">Morning Aarti Sanctum Pass (+₹500)</option>
                          <option value="Senior Wheelchair / Doli">Senior Wheelchair / Doli Assistance (+₹2,500)</option>
                          <option value="Mahaprasad Box">Blessed Mahaprasad Box (+₹350)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep("package_details")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Package</span>
                </button>
                <button
                  onClick={() => setCurrentStep("booking")}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Review Booking Bill</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 5: BOOKING SUMMARY */}
          {/* =============================================================== */}
          {currentStep === "booking" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Step 5: Booking Review &amp; Allocation</h3>
                    <p className="text-xs text-slate-400">
                      Departure on {selectedTravelDate} &bull; {passengers.length} Devotees
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 font-mono text-xs font-extrabold">
                    {selectedPackage.circuit}
                  </span>
                </div>

                {/* Package & Transport Summary */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{selectedPackage.packageName}</span>
                    <span className="font-mono text-slate-400">{selectedPackage.duration}</span>
                  </div>
                  <p className="text-2xs text-slate-400">
                    Allocated Coach: {selectedPackage.transportVehicle}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap text-3xs font-mono text-emerald-400">
                    {passengers.map((_, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        Seat #{10 + i}A (Window)
                      </span>
                    ))}
                    {hasHelicopterAddon && (
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300">
                        Helipad Priority Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Breakdown Table */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Package Fare ({passengers.length} pilgrims)</span>
                    <span className="font-semibold">₹{baseFare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>VIP Sugam Darshan Pass fees</span>
                    <span className="font-semibold">₹{vipDarshanFees.toLocaleString()}</span>
                  </div>
                  {hasHelicopterAddon && (
                    <div className="flex justify-between text-orange-300">
                      <span>Helicopter Priority Transfer ({passengers.length} pax)</span>
                      <span className="font-semibold">₹{helicopterFees.toLocaleString()}</span>
                    </div>
                  )}
                  {sevaAddonFees > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Special Seva &amp; Wheelchair/Doli Addons</span>
                      <span className="font-semibold">₹{sevaAddonFees.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-900">
                    <span>GST (5% Inland Pilgrimage Transport &amp; Tour)</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-slate-800">
                    <span>Total Net Amount Payable</span>
                    <span className="text-orange-400 text-base">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep("passenger_details")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Passengers</span>
                </button>
                <button
                  onClick={() => setCurrentStep("payment")}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 6: PAYMENT */}
          {/* =============================================================== */}
          {currentStep === "payment" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Step 6: Payment Gateway</h3>
                    <p className="text-xs text-slate-400">
                      Razorpay multi-party escrow gateway (90% operator escrow &bull; 5% shrine seva &bull; 5% platform).
                    </p>
                  </div>
                  <span className="text-lg font-black text-orange-400">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="text-2xs font-bold text-slate-400 uppercase block">Select Payment Mode:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "UPI", label: "UPI / QR", icon: QrCode },
                      { id: "CreditCard", label: "Credit Card", icon: CreditCard },
                      { id: "DebitCard", label: "Debit Card", icon: CreditCard },
                      { id: "NetBanking", label: "NetBanking", icon: Sun },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? "bg-orange-500/20 border-orange-400 text-white font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                          <span className="text-xs block">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated UPI / Card Interface */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Razorpay Merchant Gateway:</span>
                    <span className="font-mono text-emerald-400 font-bold">BHARATYATRA-ESCROW</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-2xs text-slate-300">
                    VPA: <span className="text-orange-300">{customerProfile.phone.replace(/[^0-9]/g, "")}@okhdfcbank</span>
                  </div>
                  <p className="text-3xs text-slate-400">
                    256-Bit SSL encrypted &bull; Real-time token settlement &bull; Instant SMS Darshan Pass issuance
                  </p>
                </div>

                <button
                  disabled={isProcessingPayment}
                  onClick={handleExecutePayment}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing ₹{totalAmount.toLocaleString()}...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{totalAmount.toLocaleString()} &amp; Issue Sacred Pass</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setCurrentStep("booking")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Booking</span>
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 7: TICKET / QR */}
          {/* =============================================================== */}
          {currentStep === "ticket_qr" && completedBooking && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-orange-950/60 via-slate-900 to-slate-950 border border-orange-500/40 space-y-6 shadow-2xl">
                {/* Top Pass Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-500/30 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Confirmed Sacred Yatra Pass
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {completedBooking.packageName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Shrine Board Pass: <strong className="text-orange-300 font-mono">{completedBooking.ticketNumber}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xs text-slate-400 block font-mono">Invoice Number</span>
                    <span className="text-xs font-mono text-slate-200 font-bold">{completedBooking.taxInvoiceNumber}</span>
                  </div>
                </div>

                {/* QR Code & Sacred Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Optical QR Section */}
                  <div className="p-4 rounded-2xl bg-white text-slate-950 flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
                    <div className="w-36 h-36 bg-slate-100 p-2 rounded-xl flex items-center justify-center border border-slate-300">
                      <QrCode className="w-32 h-32 text-slate-950" />
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase text-slate-800">
                      SCAN AT SHRINE CHECKPOST
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {completedBooking.bookingId}
                    </span>
                  </div>

                  {/* Devotee & Darshan Details */}
                  <div className="sm:col-span-2 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-3xs text-slate-500 block">Confirmed Darshan Slot</span>
                        <span className="font-bold text-orange-400 text-xs">{completedBooking.darshanSlotTime}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-3xs text-slate-500 block">Departure Date</span>
                        <span className="font-bold text-white text-xs">{completedBooking.travelDate}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-3xs text-slate-500 block">Assigned Vedic Guide</span>
                        <span className="font-bold text-white text-2xs">{completedBooking.assignedVedicGuide.name}</span>
                        <span className="text-3xs text-slate-400 block font-mono">{completedBooking.assignedVedicGuide.phone}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-3xs text-slate-500 block">Allocated Transport Seats</span>
                        <span className="font-mono font-bold text-emerald-400 text-2xs">
                          {completedBooking.transportSeats.join(", ")}
                        </span>
                      </div>
                    </div>

                    {completedBooking.helipadPriorityToken && (
                      <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-between text-2xs">
                        <span className="text-orange-300 font-bold">Helipad Priority Boarding Pass</span>
                        <span className="font-mono font-black text-white">{completedBooking.helipadPriorityToken}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passenger Manifest Table */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-2xs font-bold uppercase text-slate-400 block">
                    Verified Devotee Manifest ({completedBooking.passengers.length} Pilgrims)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                    {completedBooking.passengers.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">{p.fullName} ({p.age}y, {p.gender})</span>
                          <span className="text-3xs text-slate-400 font-mono">{p.aadhaarToken}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-3xs text-orange-300">
                          {p.specialSeva}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Print & Download Action Controls */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => alert(`Official Sacred Yatra E-Pass ${completedBooking.ticketNumber} printed!`)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sacred Pass</span>
                  </button>
                  <button
                    onClick={() => alert(`Tax Invoice ${completedBooking.taxInvoiceNumber} downloaded as PDF!`)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Tax Invoice</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep("itinerary")}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <span>Proceed to Itinerary (Step 8)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 8: CONFIRMATION & ITINERARY */}
          {/* =============================================================== */}
          {currentStep === "itinerary" && completedBooking && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Step 8: Booking Confirmed &amp; Verified
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      Sacred Yatra Confirmed in Devotee Itinerary!
                    </h3>
                    <p className="text-xs text-slate-300">
                      Your booking has been persisted to the application&apos;s active travel ledger and confirmed with temple authorities.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">{completedBooking.packageName}</span>
                      <span className="text-slate-400 text-2xs">
                        Departure on {completedBooking.travelDate} &bull; {completedBooking.passengers.length} Devotees
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      STATUS: CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-2xs">
                    <div>
                      <span className="text-3xs text-slate-500 block">Booking Reference</span>
                      <span className="font-mono text-white font-bold">{completedBooking.bookingId}</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-500 block">Darshan Timing</span>
                      <span className="text-orange-400 font-bold">{completedBooking.darshanSlotTime}</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-500 block">Total Paid</span>
                      <span className="text-emerald-400 font-black">₹{completedBooking.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-500 block">Payment Ref</span>
                      <span className="font-mono text-slate-300">{completedBooking.paymentId}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done &bull; Complete Booking</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
