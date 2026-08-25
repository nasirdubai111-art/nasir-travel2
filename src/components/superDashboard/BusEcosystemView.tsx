import React, { useState } from "react";
import {
  Bus,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  DollarSign,
  TrendingUp,
  Server,
  Database,
  Key,
  Cpu,
  Download,
  Search,
  Filter,
  Check,
  Zap,
  ArrowRight,
  Sliders,
  ChevronRight,
  ChevronDown,
  UserCheck,
  Truck,
  FileSpreadsheet,
  RefreshCw,
  Award,
  Sparkles,
  Phone,
  Mail,
  Building,
  Radio,
  Wifi,
  Coffee,
  Tv,
  AirVent,
  Printer,
  Copy,
} from "lucide-react";

type BusSubView =
  | "operator_registration"
  | "customer_booking"
  | "operator_booking"
  | "backend_modules"
  | "admin_console";

export function BusEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<BusSubView>("operator_registration");

  // Operator Registration Form State
  const [regStep, setRegStep] = useState<number>(1);
  const [registrationSubmitted, setRegistrationSubmitted] = useState<boolean>(false);
  const [operatorData, setOperatorData] = useState({
    // 1. Business / Company Details
    companyName: "Bharat Express Mobility Pvt Ltd",
    brandName: "Bharat Garuda Luxury Coaches",
    entityType: "Private Limited",
    cinNumber: "U63040DL2024PTC981245",
    gstin: "07AABCB9912K1ZQ",
    pan: "AABCB9912K",
    incorporationYear: "2021",

    // 2. Owner / Contact Details
    ownerName: "Vikramaditya Singhal",
    designation: "Managing Director",
    mobile: "+91 98112 34567",
    email: "operations@bharatgaruda.in",
    supportDesk: "1800-891-9922",
    emergencyContact: "+91 98112 99887",

    // 3. Address & Service Areas
    registeredOffice: "Plot 42, Cyber Hub Mobility Wing, Gurugram, Haryana 122002",
    primaryHub: "ISBT Kashmere Gate, New Delhi",
    serviceCorridors: ["Delhi - Manali - Leh", "Delhi - Jaipur - Udaipur", "Delhi - Rishikesh - Dehradun"],
    permitStates: ["Delhi (DL)", "Haryana (HR)", "Himachal Pradesh (HP)", "Rajasthan (RJ)", "Uttarakhand (UK)"],

    // 4. KYC / Document Upload
    kycAadhaarDoc: "VERIFIED_AADHAAR_9921_DIGILOCKER.pdf",
    kycPanDoc: "VERIFIED_PAN_AABCB9912K.pdf",
    incorporationCert: "CERT_INCORP_DL2024.pdf",
    gstCert: "GST_REG_07AABCB9912K1ZQ.pdf",

    // 5. Bank / Settlement Details
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200088912344",
    ifscCode: "HDFC0001042",
    accountHolder: "Bharat Express Mobility Pvt Ltd",
    branch: "Cyber City Branch, Gurugram",
    tdsDeclaration: "Section 194-O (1% TDS Compliant)",

    // 6. Bus / Fleet Registration
    busRegNumber: "DL 01 AA 9842",
    busMakeModel: "Volvo 9600 B11R Multi-Axle Luxury Sleeper (15m)",
    manufactureYear: "2025",
    seatingCapacity: "40 Sleeper Berths (2+1 Layout)",
    chassisNumber: "MB1B11R98KL829341",
    engineNumber: "D11K460EU6-91823",
    rcDoc: "RC_DL01AA9842_DIGILOCKER.pdf",
    insurancePolicy: "ICICI_LOMBARD_COMMERCIAL_POL_981249.pdf",
    insuranceValidTill: "2027-08-30",
    nationalPermitNumber: "NP-DL-2025-88419",
    permitValidTill: "2030-05-15",
    fitnessCertNumber: "FIT-DL-2025-4192",
    primaryDriverName: "Harpreet Singh (Badge: DL-DL-88231)",
    driverLicense: "DL-142011009842",
    coDriverName: "Rameshwar Gurjar",
    conductorName: "Sunil Kumar",

    // 7. Route Registration
    routeSource: "New Delhi (ISBT Kashmere Gate)",
    routeDestination: "Manali (Private Bus Stand)",
    viaStops: "Sonipat • Panipat • Karnal • Chandigarh • Bilaspur • Mandi • Kullu",
    boardingPoints: [
      { name: "ISBT Kashmere Gate, Metro Gate 1", time: "20:00", landmark: "Opp. HP Petrol Pump" },
      { name: "Majnu Ka Tilla, Tibetan Market", time: "20:30", landmark: "Footover Bridge" },
      { name: "Karnal Bypass, Mukarba Chowk", time: "21:15", landmark: "Bus Shelter" },
    ],
    droppingPoints: [
      { name: "Mandi Bus Stand Bypass", time: "05:30", landmark: "National Highway" },
      { name: "Kullu Bypass Bus Stand", time: "07:00", landmark: "Gandhi Chowk" },
      { name: "Manali Private Bus Stand", time: "08:30", landmark: "Mall Road Circle" },
    ],
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    amenities: [
      "AC Climate Control",
      "High-Speed Wi-Fi",
      "Individual LCD Screens",
      "USB & 220V Charging",
      "Sanitized Blanket & Pillow",
      "Mineral Water Bottle",
      "Clean Vacuum Restroom",
      "Emergency SOS & CCTV",
      "Live GPS Tracking",
    ],
    pricing: {
      lowerSingleBerth: 1450,
      lowerDoubleBerth: 1350,
      upperSingleBerth: 1250,
      upperDoubleBerth: 1150,
    },
    cancellationPolicy: "100% refund up to 12h before departure; 50% between 6-12h; 0% within 6h.",
    termsAccepted: true,
  });

  // Customer Booking Interactive State
  const [custFrom, setCustFrom] = useState("Delhi");
  const [custTo, setCustTo] = useState("Manali");
  const [custDate, setCustDate] = useState("2026-08-28");
  const [selectedSeat, setSelectedSeat] = useState<string | null>("L4 (Lower Single)");
  const [passengerName, setPassengerName] = useState("Aarav Sharma");
  const [passengerAge, setPassengerAge] = useState("29");
  const [passengerGender, setPassengerGender] = useState("Male");
  const [custCoupon, setCustCoupon] = useState("BHARAT50");
  const [couponApplied, setCouponApplied] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Admin Module Filter
  const [adminApprovalStatus, setAdminApprovalStatus] = useState<"pending" | "approved" | "rejected">("approved");

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Ribbon for Bus Vertical */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("operator_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "operator_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>1. Operator &amp; Fleet Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Customer Bus Booking Frontend</span>
          </button>

          <button
            onClick={() => setActiveSubView("operator_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "operator_booking"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3. Operator Operations Portal</span>
          </button>

          <button
            onClick={() => setActiveSubView("backend_modules")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "backend_modules"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>4. Backend Modules (Never Displayed)</span>
          </button>

          <button
            onClick={() => setActiveSubView("admin_console")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "admin_console"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>5. Separate Secure Admin Login</span>
          </button>
        </div>

        <span className="text-3xs font-mono px-2 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
          Vertical: Bus Mobility
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. BUS OPERATOR REGISTRATION FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_registration" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Partner Onboarding Portal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Auto-KYC &amp; VAHAN Integrated
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Bus Operator, Fleet &amp; Route Registration
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Comprehensive multi-step onboarding covering Company KYC, Bank Escrow, Vehicle Registration Certificate (RC), National Permits, Driver Staffing, and Seat Layout mapping.
              </p>
            </div>

            {/* Registration Status Pill */}
            <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xs uppercase font-extrabold text-slate-400">Current Status</div>
                <div className="text-xs font-black text-emerald-400">VAHAN &amp; KYC Verified</div>
                <div className="text-3xs text-slate-500 font-mono">OP_ID: BY-BUS-2026-9812</div>
              </div>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { num: 1, label: "Business Details" },
              { num: 2, label: "Owner Details" },
              { num: 3, label: "Address & Hubs" },
              { num: 4, label: "KYC Upload" },
              { num: 5, label: "Bank Details" },
              { num: 6, label: "Fleet & Drivers" },
              { num: 7, label: "Route & Seats" },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setRegStep(step.num)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  regStep === step.num
                    ? "bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-md"
                    : regStep > step.num
                    ? "bg-slate-950 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-2xs font-mono mb-1">
                  <span>Step 0{step.num}</span>
                  {regStep > step.num && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-1">{step.label}</div>
              </button>
            ))}
          </div>

          {/* Form Step Contents */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Step 1: Business/Company Details */}
            {regStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <Building className="w-4 h-4 text-amber-400" />
                      <span>1. Business / Company Details</span>
                    </h4>
                    <p className="text-xs text-slate-400">Legal business entity credentials for tax and commercial contracts.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-3xs font-mono text-slate-300">
                    MCA &amp; GSTIN Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Company / Legal Name</label>
                    <input
                      type="text"
                      value={operatorData.companyName}
                      onChange={(e) => setOperatorData({ ...operatorData, companyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Public Brand Name</label>
                    <input
                      type="text"
                      value={operatorData.brandName}
                      onChange={(e) => setOperatorData({ ...operatorData, brandName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Entity Type</label>
                    <select
                      value={operatorData.entityType}
                      onChange={(e) => setOperatorData({ ...operatorData, entityType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                    >
                      <option>Private Limited</option>
                      <option>Public Limited</option>
                      <option>LLP (Limited Liability Partnership)</option>
                      <option>Partnership Firm</option>
                      <option>Proprietorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">GSTIN (15-Digit)</label>
                    <input
                      type="text"
                      value={operatorData.gstin}
                      onChange={(e) => setOperatorData({ ...operatorData, gstin: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Company PAN</label>
                    <input
                      type="text"
                      value={operatorData.pan}
                      onChange={(e) => setOperatorData({ ...operatorData, pan: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">CIN Number</label>
                    <input
                      type="text"
                      value={operatorData.cinNumber}
                      onChange={(e) => setOperatorData({ ...operatorData, cinNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Owner/Contact Details */}
            {regStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>2. Owner &amp; Executive Contact Details</span>
                  </h4>
                  <p className="text-xs text-slate-400">Primary authorized signatory and 24x7 control room emergency contact.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Owner / Signatory Name</label>
                    <input
                      type="text"
                      value={operatorData.ownerName}
                      onChange={(e) => setOperatorData({ ...operatorData, ownerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Designation</label>
                    <input
                      type="text"
                      value={operatorData.designation}
                      onChange={(e) => setOperatorData({ ...operatorData, designation: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Mobile (OTP Verified)</label>
                    <input
                      type="text"
                      value={operatorData.mobile}
                      onChange={(e) => setOperatorData({ ...operatorData, mobile: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Official Email</label>
                    <input
                      type="email"
                      value={operatorData.email}
                      onChange={(e) => setOperatorData({ ...operatorData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">24x7 Support Desk</label>
                    <input
                      type="text"
                      value={operatorData.supportDesk}
                      onChange={(e) => setOperatorData({ ...operatorData, supportDesk: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Emergency SOS Line</label>
                    <input
                      type="text"
                      value={operatorData.emergencyContact}
                      onChange={(e) => setOperatorData({ ...operatorData, emergencyContact: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address & Service Areas */}
            {regStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>3. Address &amp; Service Corridors</span>
                  </h4>
                  <p className="text-xs text-slate-400">Headquarters location, central operations hub and intercity routes.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Registered Office Address</label>
                    <textarea
                      rows={2}
                      value={operatorData.registeredOffice}
                      onChange={(e) => setOperatorData({ ...operatorData, registeredOffice: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Primary Maintenance / Depots Hub</label>
                      <input
                        type="text"
                        value={operatorData.primaryHub}
                        onChange={(e) => setOperatorData({ ...operatorData, primaryHub: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">State Permit Authorizations</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {operatorData.permitStates.map((st, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-3xs font-mono">
                            ✓ {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: KYC/Document Upload */}
            {regStep === 4 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>4. KYC &amp; Regulatory Document Upload</span>
                  </h4>
                  <p className="text-xs text-slate-400">DigiLocker &amp; CKYC automated OCR verification audit trail.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { title: "Aadhaar of Signatory", doc: operatorData.kycAadhaarDoc, status: "Verified via UIDAI OTP" },
                    { title: "Company PAN Card", doc: operatorData.kycPanDoc, status: "Verified via NSDL" },
                    { title: "Certificate of Incorporation", doc: operatorData.incorporationCert, status: "Verified via MCA V3" },
                    { title: "GSTIN Certificate", doc: operatorData.gstCert, status: "Verified via GST Portal" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-white block">{item.title}</span>
                        <span className="text-3xs font-mono text-slate-400 block">{item.doc}</span>
                        <span className="text-3xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {item.status}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-bold border border-emerald-500/30">
                        ATTACHED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Bank & Settlement Details */}
            {regStep === 5 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>5. Bank &amp; Settlement Account (RBI Escrow)</span>
                  </h4>
                  <p className="text-xs text-slate-400">Automated T+1 daily payout routing &amp; TDS Section 194-O deduction configuration.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Bank Name</label>
                    <input
                      type="text"
                      value={operatorData.bankName}
                      onChange={(e) => setOperatorData({ ...operatorData, bankName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Account Number</label>
                    <input
                      type="text"
                      value={operatorData.accountNumber}
                      onChange={(e) => setOperatorData({ ...operatorData, accountNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">IFSC Code</label>
                    <input
                      type="text"
                      value={operatorData.ifscCode}
                      onChange={(e) => setOperatorData({ ...operatorData, ifscCode: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Beneficiary Account Name</label>
                    <input
                      type="text"
                      value={operatorData.accountHolder}
                      onChange={(e) => setOperatorData({ ...operatorData, accountHolder: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Settlement Schedule</label>
                    <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold">
                      Daily T+1 Automatic RTGS / NEFT
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Tax Compliance</label>
                    <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                      {operatorData.tdsDeclaration}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Fleet & Driver Details */}
            {regStep === 6 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <Bus className="w-4 h-4 text-amber-400" />
                      <span>6. Bus / Fleet Registration &amp; Staffing</span>
                    </h4>
                    <p className="text-xs text-slate-400">VAHAN registered vehicle parameters, insurance, national permit and licensed crew.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-mono font-bold">
                    VAHAN API: VALID
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Vehicle Registration Number</label>
                    <input
                      type="text"
                      value={operatorData.busRegNumber}
                      onChange={(e) => setOperatorData({ ...operatorData, busRegNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Make &amp; Coach Model</label>
                    <input
                      type="text"
                      value={operatorData.busMakeModel}
                      onChange={(e) => setOperatorData({ ...operatorData, busMakeModel: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Seating &amp; Berth Capacity</label>
                    <input
                      type="text"
                      value={operatorData.seatingCapacity}
                      onChange={(e) => setOperatorData({ ...operatorData, seatingCapacity: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">National Permit Number</label>
                    <input
                      type="text"
                      value={operatorData.nationalPermitNumber}
                      onChange={(e) => setOperatorData({ ...operatorData, nationalPermitNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Insurance Valid Till</label>
                    <input
                      type="text"
                      value={operatorData.insuranceValidTill}
                      onChange={(e) => setOperatorData({ ...operatorData, insuranceValidTill: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Primary Driver &amp; Badge</label>
                    <input
                      type="text"
                      value={operatorData.primaryDriverName}
                      onChange={(e) => setOperatorData({ ...operatorData, primaryDriverName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Route & Seat Layout */}
            {regStep === 7 && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>7. Route Registration, Boarding Points &amp; Pricing</span>
                  </h4>
                  <p className="text-xs text-slate-400">Define origin, destination, intermediate boarding stops, pricing tiers and cancellation rules.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Origin &bull; Destination</label>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 font-bold text-white">
                      {operatorData.routeSource} &rarr; {operatorData.routeDestination}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Operating Days</label>
                    <div className="flex gap-1 pt-1">
                      {operatorData.operatingDays.map((d, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-3xs border border-amber-500/40">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Boarding Points Table */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Boarding Points &amp; Scheduled Times:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {operatorData.boardingPoints.map((bp, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                        <div className="font-bold text-white">{bp.name}</div>
                        <div className="text-3xs text-amber-400 font-mono">Time: {bp.time} | {bp.landmark}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier Pricing */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Sleeper Berth Pricing Tiers:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-3xs text-slate-400 block">Lower Single (L1-L10)</span>
                      <span className="text-sm font-black text-amber-400">₹{operatorData.pricing.lowerSingleBerth}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-3xs text-slate-400 block">Lower Double (L11-L20)</span>
                      <span className="text-sm font-black text-amber-400">₹{operatorData.pricing.lowerDoubleBerth}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-3xs text-slate-400 block">Upper Single (U1-U10)</span>
                      <span className="text-sm font-black text-amber-400">₹{operatorData.pricing.upperSingleBerth}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-3xs text-slate-400 block">Upper Double (U11-U20)</span>
                      <span className="text-sm font-black text-amber-400">₹{operatorData.pricing.upperDoubleBerth}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <button
                disabled={regStep === 1}
                onClick={() => setRegStep(Math.max(1, regStep - 1))}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40"
              >
                Previous Step
              </button>

              {regStep < 7 ? (
                <button
                  onClick={() => setRegStep(regStep + 1)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <span>Continue to Step 0{regStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRegistrationSubmitted(true);
                    alert("Bus Operator & Fleet Registration successfully submitted for automated VAHAN & Admin Approval!");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Full Bus Registration</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. BUS BOOKING — CUSTOMER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Intercity Bus Search &amp; Seat Selection
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>GPS Live Tracking Enabled</span>
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">From City</label>
                <input
                  type="text"
                  value={custFrom}
                  onChange={(e) => setCustFrom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">To Destination</label>
                <input
                  type="text"
                  value={custTo}
                  onChange={(e) => setCustTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Travel Date</label>
                <input
                  type="date"
                  value={custDate}
                  onChange={(e) => setCustDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center justify-center gap-2 shadow-md">
                  <Search className="w-4 h-4" />
                  <span>Search Buses</span>
                </button>
              </div>
            </div>

            {/* Bus Listing Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Bharat Garuda Multi-Axle AC Sleeper (2+1)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-extrabold border border-emerald-500/30">
                      ★ 4.9 (1,840 reviews)
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400">Volvo 9600 B11R • Live GPS Tracking • Washroom Onboard • Clean Linen</p>
                </div>

                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Starting from</span>
                  <span className="text-lg font-black text-amber-400">₹1,450</span>
                </div>
              </div>

              {/* Timing and Route Ribbon */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-white">20:00</span>
                  <span className="text-2xs text-slate-400 block">ISBT Kashmere Gate</span>
                </div>
                <div className="text-center">
                  <span className="text-3xs font-mono text-slate-500">12h 30m non-stop</span>
                  <div className="w-24 h-0.5 bg-slate-700 mx-auto my-1 relative">
                    <div className="w-2 h-2 rounded-full bg-amber-400 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">08:30 (+1 Day)</span>
                  <span className="text-2xs text-slate-400 block">Manali Private Stand</span>
                </div>
              </div>

              {/* Interactive Sleeper Berth Matrix */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Select Sleeper Berth:</span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {["L1", "L2", "L3", "L4", "L5", "L6", "U1", "U2"].map((berth) => {
                    const isSelected = selectedSeat === `${berth} (Lower Single)` || selectedSeat === berth;
                    return (
                      <button
                        key={berth}
                        onClick={() => setSelectedSeat(berth)}
                        className={`p-2.5 rounded-xl border text-center font-mono font-bold text-xs transition-all ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                            : "bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <div>{berth}</div>
                        <div className="text-3xs font-normal">₹1,450</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passenger Details & Payment Simulator */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Passenger Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Coupon Code</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={custCoupon}
                      onChange={(e) => setCustCoupon(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <button
                      onClick={() => setCouponApplied(!couponApplied)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-amber-300 font-bold border border-slate-700"
                    >
                      {couponApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setBookingConfirmed(true);
                      alert(`Bus Ticket Confirmed! PNR: BYBUS981240. E-Ticket & SMS dispatched to passenger.`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹1,400 &amp; Confirm PNR</span>
                  </button>
                </div>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      E-Ticket Generated &bull; PNR: BYBUS981240
                    </span>
                    <p className="text-2xs text-emerald-300">
                      Passenger: {passengerName} &bull; Seat: {selectedSeat} &bull; Bus: Bharat Garuda Luxury Sleeper &bull; Boarding: ISBT Kashmere Gate (20:00)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-2xs shrink-0">
                    PASSENGER SYNCED
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. OPERATOR BOOKING FRONTEND (PORTAL) */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Operator Operations Console
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Today's Trips, Passenger Manifest &amp; Boarding
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400">
                  Fleet Occupancy: 38/40 (95%)
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Today's Realized Revenue</span>
                <span className="text-base font-black text-white">₹54,200</span>
                <span className="text-3xs text-emerald-400 block">+12% vs Yesterday</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Platform Commission (8%)</span>
                <span className="text-base font-black text-rose-400">-₹4,336</span>
                <span className="text-3xs text-slate-400 block">GST ITC Eligible</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Net Payout to Bank (T+1)</span>
                <span className="text-base font-black text-emerald-400">₹49,322</span>
                <span className="text-3xs text-slate-400 block">HDFC Escrow Account</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Total Passengers Boarded</span>
                <span className="text-base font-black text-amber-400">38 Confirmed</span>
                <span className="text-3xs text-slate-400 block">2 Cancellations settled</span>
              </div>
            </div>

            {/* Live Passenger Manifest */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Live Passenger Manifest &bull; Trip #TRIP-DL-MNL-2026</span>
                <span className="text-slate-400">Volvo Multi-Axle Sleeper (DL 01 AA 9842)</span>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800 text-3xs uppercase">
                      <th className="p-3">Seat</th>
                      <th className="p-3">Passenger</th>
                      <th className="p-3">Boarding Point</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">PNR</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950 font-medium">
                    <tr>
                      <td className="p-3 font-mono font-bold text-amber-400">L1 (Lower)</td>
                      <td className="p-3 text-white">Rajesh Malhotra (34, M)</td>
                      <td className="p-3 text-slate-300">ISBT Kashmere Gate (20:00)</td>
                      <td className="p-3 font-mono text-slate-400">+91 98711 29481</td>
                      <td className="p-3 font-mono text-indigo-400">BYBUS981201</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">✓ Boarded (QR)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-amber-400">L2 (Lower)</td>
                      <td className="p-3 text-white">Ananya Sen (28, F)</td>
                      <td className="p-3 text-slate-300">Majnu Ka Tilla (20:30)</td>
                      <td className="p-3 font-mono text-slate-400">+91 98110 38291</td>
                      <td className="p-3 font-mono text-indigo-400">BYBUS981202</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">✓ Boarded (QR)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-amber-400">L3 (Lower)</td>
                      <td className="p-3 text-white">Vikram Rathore (42, M)</td>
                      <td className="p-3 text-slate-300">Mukarba Chowk (21:15)</td>
                      <td className="p-3 font-mono text-slate-400">+91 99201 44192</td>
                      <td className="p-3 font-mono text-indigo-400">BYBUS981203</td>
                      <td className="p-3 text-right text-amber-300 font-bold">&bull; Expected at Stop</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. BACKEND MODULES (NEVER DISPLAYED ON FRONTEND) */}
      {/* ======================================================================= */}
      {activeSubView === "backend_modules" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Strict Server-Side Isolation
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Backend Modules &bull; Zero Client-Side Exposure
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              All 28 critical microservices, API secret keys, database credentials, mutex locks, and settlement algorithms execute strictly in containerized private VPC infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Authentication & RBAC Engine",
                desc: "JWT Auth, OAuth2 tokens, Argon2 password hashing, and granular operator role validation.",
                icon: Key,
              },
              {
                title: "Operator & KYC Verification Service",
                desc: "Automated VAHAN database verification, NSDL PAN verification, MCA corporate verification, and OCR validation.",
                icon: ShieldCheck,
              },
              {
                title: "Real-Time Seat Locking (Redis Mutex)",
                desc: "Distributed mutex lock with 10-minute TTL preventing double-booking during active checkout sessions.",
                icon: Lock,
              },
              {
                title: "Dynamic Fare & Coupon Calculation",
                desc: "Surge pricing formulas, GST calculation (5% SAC 996411), IRDAI travel insurance, and coupon validation.",
                icon: Cpu,
              },
              {
                title: "Payment Gateway Webhook Verification",
                desc: "HMAC-SHA256 signature verification for Razorpay, UPI auto-refunds, and automated escrow reconciliations.",
                icon: CreditCard,
              },
              {
                title: "Commission & Settlement Engine",
                desc: "Automated T+1 settlement batching, 1% Section 194-O TDS deductions, 18% GST invoice generation, and RTGS payouts.",
                icon: TrendingUp,
              },
              {
                title: "E-Ticket & Tax Invoice Generator",
                desc: "Server-side headless PDF generation with encrypted QR codes, SAC code 996411, and digital verification stamps.",
                icon: FileText,
              },
              {
                title: "Multi-Channel Notification Gateway",
                desc: "Enterprise SMS gateway, WhatsApp Business API, AWS SES Email, and WebPush dispatch engines.",
                icon: Zap,
              },
              {
                title: "Audit Logging & Fraud Detection",
                desc: "Immutable append-only audit trail capturing all IP addresses, device fingerprints, and financial ledger events.",
                icon: Server,
              },
            ].map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-white text-xs">{mod.title}</span>
                  </div>
                  <p className="text-2xs text-slate-400 leading-relaxed">{mod.desc}</p>
                  <div className="pt-2 border-t border-slate-900 text-3xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Status: Isolated in Private VPC</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. SEPARATE SECURE ADMIN LOGIN */}
      {/* ======================================================================= */}
      {activeSubView === "admin_console" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Separate Admin Gate
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Master Administrator Console &bull; Operator Approval Queue
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin Session: admin@bharatyatra.gov.in (RBAC: Master Admin)
              </span>
            </div>

            {/* Operator Approval Queue Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Pending / Verified Bus Operator Approvals:</span>
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800 text-3xs uppercase">
                      <th className="p-3">Operator Name</th>
                      <th className="p-3">Fleet Size</th>
                      <th className="p-3">VAHAN / RC</th>
                      <th className="p-3">KYC &amp; Bank</th>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950">
                    <tr>
                      <td className="p-3 font-bold text-white">Bharat Garuda Luxury Travels</td>
                      <td className="p-3 text-slate-300">12 Volvo 9600 Coaches</td>
                      <td className="p-3 text-emerald-400 font-mono text-2xs">✓ VAHAN Validated</td>
                      <td className="p-3 text-emerald-400 text-2xs">✓ HDFC Escrow Verified</td>
                      <td className="p-3 text-slate-300">Delhi &ndash; Manali (Direct)</td>
                      <td className="p-3 text-right space-x-2">
                        <button className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-3xs font-bold hover:bg-emerald-500">
                          Approve Fleet
                        </button>
                        <button className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-3xs font-bold hover:bg-slate-700">
                          Audit KYC
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Himalayan Superfast Express</td>
                      <td className="p-3 text-slate-300">8 Scania Sleeper Coaches</td>
                      <td className="p-3 text-amber-400 font-mono text-2xs">&bull; Fitness Renewal Pending</td>
                      <td className="p-3 text-emerald-400 text-2xs">✓ ICICI Verified</td>
                      <td className="p-3 text-slate-300">Delhi &ndash; Shimla &ndash; Dharamshala</td>
                      <td className="p-3 text-right space-x-2">
                        <button className="px-2.5 py-1 rounded-lg bg-amber-600 text-slate-950 text-3xs font-bold hover:bg-amber-500">
                          Request Fitness Doc
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
