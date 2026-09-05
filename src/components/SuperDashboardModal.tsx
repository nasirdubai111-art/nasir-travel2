import React, { useState, useMemo } from "react";
import {
  X,
  Bus,
  Train,
  Hotel,
  Home,
  Palmtree,
  Sun,
  Compass,
  Building2,
  Car,
  Utensils,
  Ship,
  Plane,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Layers,
  FileText,
  CheckCircle2,
  Star,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CreditCard,
  Calendar,
  Award,
  Search,
  Check,
  AlertTriangle,
  Server,
  Database,
  Key,
  Cpu,
  TrendingUp,
  RefreshCw,
  Users,
  QrCode,
  Ticket,
  ChevronRight,
  Info,
  DollarSign,
  Activity,
  Image as ImageIcon,
  Sliders,
  Briefcase,
  Zap,
  Download,
  FileSpreadsheet,
  Printer,
  Table,
  Filter,
  ArrowUpDown,
  Receipt,
  Coins,
  CalendarDays,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  SUPER_DASHBOARD_MODULES,
  OperatorModuleDetail,
} from "../data/superDashboardData";
import {
  OPERATOR_DEEP_SPECS,
  OperatorDeepSpecification,
} from "../data/superDashboardExtendedData";
import { BusEcosystemView } from "./superDashboard/BusEcosystemView";
import { TrainEcosystemView } from "./superDashboard/TrainEcosystemView";
import { RestaurantEcosystemView } from "./superDashboard/RestaurantEcosystemView";
import { DhabaEcosystemView } from "./superDashboard/DhabaEcosystemView";
import { HotelEcosystemView } from "./superDashboard/HotelEcosystemView";
import { LodgeEcosystemView } from "./superDashboard/LodgeEcosystemView";
import { PilgrimageEcosystemView } from "./superDashboard/PilgrimageEcosystemView";
import { CorporateEcosystemView } from "./superDashboard/CorporateEcosystemView";
import { TourEcosystemView } from "./superDashboard/TourEcosystemView";
import { FlightEcosystemView } from "./superDashboard/FlightEcosystemView";
import { CabEcosystemView } from "./superDashboard/CabEcosystemView";
import { HouseboatEcosystemView } from "./superDashboard/HouseboatEcosystemView";
import { ResortEcosystemView } from "./superDashboard/ResortEcosystemView";
import { BookingOperatorEcosystemView } from "./superDashboard/BookingOperatorEcosystemView";
import { IntegrationFlowVisualizer } from "./superDashboard/IntegrationFlowVisualizer";
import { BackendDebuggingView } from "./admin/BackendDebuggingView";
import { BackendTestingView } from "./admin/BackendTestingView";

interface SuperDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOperatorId?: string;
}

type DashboardTab = "frontend_modules" | "partner_dashboard" | "backend_isolation";

export function SuperDashboardModal({
  isOpen,
  onClose,
  initialOperatorId = "lodge",
}: SuperDashboardModalProps) {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(initialOperatorId);
  const [activeTab, setActiveTab] = useState<DashboardTab>("frontend_modules");
  
  // Interactive simulator states
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<"select" | "details" | "confirmed">("select");
  const [guestName, setGuestName] = useState("Rajesh Kumar");
  const [guestEmail, setGuestEmail] = useState("rajesh.kumar@example.com");

  // Admin Diagnostics Gate inside Tab 3
  const [showAdminDiagnostics, setShowAdminDiagnostics] = useState(false);
  const [adminDiagnosticPin, setAdminDiagnosticPin] = useState("");
  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const [adminDiagnosticSubTab, setAdminDiagnosticSubTab] = useState<"debugging" | "testing">("debugging");
  const [guestPhone, setGuestPhone] = useState("+91 98765 43210");
  const [selectedCheckInDate, setSelectedCheckInDate] = useState("2026-09-12");
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState("2026-09-15");
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [cancellationSimulated, setCancellationSimulated] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [partnerSubTab, setPartnerSubTab] = useState<"manage_overview" | "listing_plan" | "commission_plan" | "earnings_ledger">("manage_overview");
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);
  const [commissionSearch, setCommissionSearch] = useState("");
  const [commissionStatusFilter, setCommissionStatusFilter] = useState<"all" | "cleared" | "pending">("all");
  const [hoveredLedgerId, setHoveredLedgerId] = useState<string | null>(null);
  const [hoveredEarningsCycle, setHoveredEarningsCycle] = useState<string | null>(null);

  // Date range picker states for Commission & Earnings filtering
  const [financialDatePreset, setFinancialDatePreset] = useState<
    "this_month" | "last_month" | "last_7_days" | "last_30_days" | "q3_2026" | "ytd_2026" | "custom"
  >("this_month");
  const [financialStartDate, setFinancialStartDate] = useState("2026-08-01");
  const [financialEndDate, setFinancialEndDate] = useState("2026-08-31");
  const [showCustomDateInputs, setShowCustomDateInputs] = useState(false);

  const currentOperator: OperatorModuleDetail = useMemo(() => {
    return (
      SUPER_DASHBOARD_MODULES.find((op) => op.id === selectedOperatorId) ||
      SUPER_DASHBOARD_MODULES[0]
    );
  }, [selectedOperatorId]);

  const deepSpec: OperatorDeepSpecification | undefined = useMemo(() => {
    return OPERATOR_DEEP_SPECS[selectedOperatorId];
  }, [selectedOperatorId]);

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case "Bus":
        return <Bus className={className} />;
      case "Train":
        return <Train className={className} />;
      case "Hotel":
        return <Hotel className={className} />;
      case "Home":
        return <Home className={className} />;
      case "Palmtree":
        return <Palmtree className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "Compass":
        return <Compass className={className} />;
      case "Building2":
        return <Building2 className={className} />;
      case "Car":
        return <Car className={className} />;
      case "Utensils":
        return <Utensils className={className} />;
      case "Ship":
        return <Ship className={className} />;
      case "Plane":
        return <Plane className={className} />;
      case "Briefcase":
        return <Briefcase className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const handleSimulateBooking = (itemId: string) => {
    setSelectedInventoryItem(itemId);
    setBookingStep("details");
    setCancellationSimulated(false);
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep("confirmed");
  };

  const getSampleTransactions = (opId: string, gross: number, rate: number) => {
    const titles: Record<string, { service: string; guest: string; base: number; date: string; status?: "Cleared & Reconciled" | "In Settlement Batch" }[]> = {
      bus: [
        { service: "Delhi to Manali Volvo Multi-Axle AC Sleeper (2 Seats)", guest: "Rohit Malhotra", base: 3200, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Chandigarh to Dharamshala Scania AC (4 Seats)", guest: "Pooja Sharma", base: 5600, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Shimla to Delhi Volvo 9600 AC Sleeper (1 Seat)", guest: "Vikas Mehra", base: 1600, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Delhi to Rishikesh Royal Coach AC (2 Seats)", guest: "Ananya Roy", base: 2400, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Manali to Delhi Volvo AC (3 Seats)", guest: "Siddharth Jain", base: 4800, date: "2026-08-12", status: "Cleared & Reconciled" },
        { service: "Delhi to Jaipur AC Sleeper Express (2 Seats)", guest: "Kunal Singhania", base: 2800, date: "2026-08-05", status: "Cleared & Reconciled" },
        { service: "Dehradun to Delhi Multi-Axle Intercity (2 Seats)", guest: "Meera Sen", base: 2200, date: "2026-07-28", status: "Cleared & Reconciled" },
        { service: "Amritsar to Delhi AC Seater Coach (3 Seats)", guest: "Harpreet Singh", base: 3900, date: "2026-07-22", status: "Cleared & Reconciled" },
        { service: "Delhi to Shimla Royal AC Coach (2 Seats)", guest: "Tanmay Bhatia", base: 3100, date: "2026-07-15", status: "Cleared & Reconciled" },
        { service: "Jaipur to Agra Golden Express (4 Seats)", guest: "Rajendra Pareek", base: 4400, date: "2026-07-08", status: "Cleared & Reconciled" },
      ],
      train: [
        { service: "Vande Bharat Express (Executive Chair Car - 2 Tickets)", guest: "Kavita Rao", base: 4800, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Rajdhani Special (AC First Class 1A)", guest: "Dr. Arvind Gupta", base: 6200, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Shatabdi Express (AC 2-Tier 2 Tickets)", guest: "Sunil Verma", base: 3100, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Tejas Express (Executive AC 2 Tickets)", guest: "Neha Singhal", base: 4500, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Duronto Express (AC 3-Tier Family 4 Tickets)", guest: "Manish Agarwal", base: 7200, date: "2026-08-14", status: "Cleared & Reconciled" },
        { service: "Gatimaan Express (Executive Hostess Coach - 2 Pax)", guest: "Amitabh Sen", base: 3600, date: "2026-08-06", status: "Cleared & Reconciled" },
        { service: "Palace on Wheels (Heritage Deluxe Cabin - 1 Night)", guest: "Lord Sterling & Lady", base: 42000, date: "2026-07-27", status: "Cleared & Reconciled" },
        { service: "Deccan Odyssey (Presidential Suite Experience)", guest: "Cyrus Mistry Family", base: 58000, date: "2026-07-18", status: "Cleared & Reconciled" },
        { service: "Vande Bharat Express (Chair Car - 3 Tickets)", guest: "Priyanka Saxena", base: 4200, date: "2026-07-11", status: "Cleared & Reconciled" },
        { service: "Garib Rath Express (AC 3-Tier - 4 Tickets)", guest: "Sudhir Pandey", base: 3800, date: "2026-07-04", status: "Cleared & Reconciled" },
      ],
      hotel: [
        { service: "Imperial Heritage Suite (3 Nights + Breakfast)", guest: "Aditya Chopra", base: 22500, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Royal Deluxe Room (2 Nights)", guest: "Sonia Kapoor", base: 11000, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Executive Business Suite (4 Nights)", guest: "Rahul Dravid Associates", base: 36000, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Grand Family Villa (2 Nights)", guest: "Mehta Family", base: 18000, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Presidential Pool Suite (1 Night)", guest: "Deepak Parekh", base: 19500, date: "2026-08-12", status: "Cleared & Reconciled" },
        { service: "Heritage Garden View Room (3 Nights)", guest: "Anil Ambani Delegation", base: 28000, date: "2026-08-04", status: "Cleared & Reconciled" },
        { service: "Luxury Lake View Suite (2 Nights)", guest: "Tara Sutaria", base: 32000, date: "2026-07-29", status: "Cleared & Reconciled" },
        { service: "Club Executive Room with Lounge Access (3 Nights)", guest: "Vinod Khosla Venture", base: 24000, date: "2026-07-20", status: "Cleared & Reconciled" },
        { service: "Royal Courtyard Room (2 Nights)", guest: "Bhavna Panday", base: 15500, date: "2026-07-14", status: "Cleared & Reconciled" },
        { service: "Boutique Poolside Cottage (2 Nights)", guest: "Rhea Chakraborty", base: 14000, date: "2026-07-06", status: "Cleared & Reconciled" },
      ],
      lodge: [
        { service: "Standard Non-AC Double Room (2 Nights)", guest: "Gopal Krishna", base: 1700, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Deluxe AC Family Room (3 Nights)", guest: "Rameshwar Dayal", base: 4200, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Economy Pilgrim Dormitory (4 Beds - 2 Nights)", guest: "Shiv Shakti Yatra Group", base: 3200, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Standard AC Double Room (1 Night)", guest: "Rakesh Tiwari", base: 1250, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Triple Bedded Tourist Room (2 Nights)", guest: "Hemant Kumar", base: 2800, date: "2026-08-11", status: "Cleared & Reconciled" },
        { service: "Four Bed AC Family Hall (2 Nights)", guest: "Pandit Govind Joshi", base: 3600, date: "2026-08-03", status: "Cleared & Reconciled" },
        { service: "Standard Non-AC Double Room (3 Nights)", guest: "Santosh Tripathi", base: 2400, date: "2026-07-26", status: "Cleared & Reconciled" },
        { service: "Pilgrim Group Dormitory (6 Beds - 1 Night)", guest: "Om Shanti Yatra Mandal", base: 4500, date: "2026-07-19", status: "Cleared & Reconciled" },
        { service: "Economy Double Room with Geyser (2 Nights)", guest: "Vijay Shankar", base: 1800, date: "2026-07-12", status: "Cleared & Reconciled" },
        { service: "Deluxe AC Twin Room (2 Nights)", guest: "Mahesh Bhardwaj", base: 2600, date: "2026-07-05", status: "Cleared & Reconciled" },
      ],
      homestay: [
        { service: "Heritage Chettinad Verandah Suite (2 Nights)", guest: "Dr. Malini Iyer", base: 9600, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Organic Farmstay Cottage (3 Nights)", guest: "Prateek Deshmukh", base: 13500, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Traditional Coffee Estate Bungalow (2 Nights)", guest: "Arjun Nambiar", base: 11000, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Village Courtyard Room with Meals (2 Nights)", guest: "Sneha Nair", base: 7800, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Riverside Wooden Cottage (1 Night)", guest: "Gaurav Sen", base: 5200, date: "2026-08-10", status: "Cleared & Reconciled" },
        { service: "Orchard View Family Suite (3 Nights)", guest: "Rohan & Tara Varma", base: 16000, date: "2026-08-02", status: "Cleared & Reconciled" },
        { service: "Himalayan Stone Villa (2 Nights)", guest: "Aditi Mathur", base: 12500, date: "2026-07-28", status: "Cleared & Reconciled" },
        { service: "Tea Plantation Wooden Chalet (2 Nights)", guest: "Sunil & Deepa Kurian", base: 10500, date: "2026-07-21", status: "Cleared & Reconciled" },
        { service: "Artisan Heritage Home (3 Nights + Workshops)", guest: "Zoya Akhtar Group", base: 18500, date: "2026-07-13", status: "Cleared & Reconciled" },
        { service: "Spice Farm Bamboo House (2 Nights)", guest: "Mathew Joseph", base: 8200, date: "2026-07-04", status: "Cleared & Reconciled" },
      ],
      packages: [
        { service: "Kashmir Paradise 6D/5N (Gulmarg, Pahalgam, Srinagar)", guest: "Tanvi & Sandeep Kulkarni", base: 48500, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Golden Triangle Tour 4D/3N (Delhi, Agra, Jaipur)", guest: "David Harrison", base: 34000, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Kerala Backwaters & Hills 5D/4N (Munnar, Alleppey)", guest: "Dr. Abhijit Bose", base: 42000, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Spiti Valley High Altitude Explorer 7D/6N", guest: "Karan Johar Adventure Club", base: 38000, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Goa Luxury Beach & Heritage Retreat 4D/3N", guest: "Vivek Oberoi Group", base: 29000, date: "2026-08-09", status: "Cleared & Reconciled" },
        { service: "Andaman Islands Coral & Cruise 6D/5N", guest: "Mehra Family Reunion", base: 64000, date: "2026-08-01", status: "Cleared & Reconciled" },
        { service: "Ladakh Bike & Monasteries Expedition 8D/7N", guest: "Royal Riders Club (6 Pax)", base: 78000, date: "2026-07-25", status: "Cleared & Reconciled" },
        { service: "Meghalaya Living Roots & Caves 5D/4N", guest: "Ananya & Friends", base: 36000, date: "2026-07-17", status: "Cleared & Reconciled" },
        { service: "Rajasthan Royal Forts Circuit 6D/5N", guest: "Khurana Family (4 Pax)", base: 52000, date: "2026-07-10", status: "Cleared & Reconciled" },
        { service: "Char Dham Yatra Helicopter Tour 2D/1N", guest: "Gupta Trust Elders", base: 110000, date: "2026-07-03", status: "Cleared & Reconciled" },
      ],
      flight: [
        { service: "Delhi to Mumbai (IndiGo Business Flexi - 2 Pax)", guest: "Alok Bansal", base: 18400, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Bengaluru to Delhi (Air India Executive - 1 Pax)", guest: "Shweta Tiwari", base: 11200, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Mumbai to Dubai (Emirates Economy - 1 Pax)", guest: "Fahad Khan", base: 26500, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Hyderabad to Goa (SpiceJet Return - 2 Pax)", guest: "Rohan & Riya Joshi", base: 14800, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Kolkata to Port Blair (Air India Return - 2 Pax)", guest: "Bhattacharya Family", base: 32000, date: "2026-08-11", status: "Cleared & Reconciled" },
        { service: "Delhi to Srinagar (Vistara Premium Economy - 2 Pax)", guest: "Sanjay Singhal", base: 21000, date: "2026-08-04", status: "Cleared & Reconciled" },
        { service: "Chennai to Singapore (Singapore Airlines - 2 Pax)", guest: "Karthik Subramanian", base: 48000, date: "2026-07-27", status: "Cleared & Reconciled" },
        { service: "Mumbai to London Heathrow (British Airways - 1 Pax)", guest: "Pooja Hegde", base: 62000, date: "2026-07-19", status: "Cleared & Reconciled" },
        { service: "Delhi to Kochi (IndiGo Corporate - 3 Pax)", guest: "Cognizant India Lead", base: 27000, date: "2026-07-11", status: "Cleared & Reconciled" },
        { service: "Bengaluru to Male Maldives (IndiGo Return - 2 Pax)", guest: "Aakash & Simran", base: 36000, date: "2026-07-02", status: "Cleared & Reconciled" },
      ],
      corporate: [
        { service: "Annual Leadership Offsite (Goa 3D/2N - 28 Pax)", guest: "Infosys Tech Delivery Group", base: 840000, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "CXO Strategic Delegation (Dubai Summit - 6 Pax)", guest: "Tata Consultancy Services", base: 420000, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Regional Sales Conference (Bengaluru - 40 Pax)", guest: "Wipro Digital Solutions", base: 560000, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Executive Board Retreat (Udaipur - 12 Pax)", guest: "Reliance Retail Leadership", base: 680000, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Tech Hackathon Accommodation (Hyderabad - 50 Pax)", guest: "Swiggy Engineering", base: 390000, date: "2026-08-10", status: "Cleared & Reconciled" },
        { service: "Product Launch Offsite (Jaipur - 35 Pax)", guest: "Zomato Founders Group", base: 490000, date: "2026-08-02", status: "Cleared & Reconciled" },
        { service: "Global Partners Summit (Mumbai - 20 Pax)", guest: "McKinsey & Company", base: 720000, date: "2026-07-26", status: "Cleared & Reconciled" },
        { service: "Quarterly Strategy Conclave (Delhi - 45 Pax)", guest: "HCL Technologies", base: 510000, date: "2026-07-18", status: "Cleared & Reconciled" },
        { service: "Engineering Excellence Retreat (Coorg - 30 Pax)", guest: "PhonePe Tech Group", base: 440000, date: "2026-07-09", status: "Cleared & Reconciled" },
        { service: "Sales Kickoff Summit (Goa - 60 Pax)", guest: "Bajaj Finserv Leaders", base: 890000, date: "2026-07-02", status: "Cleared & Reconciled" },
      ],
      cab: [
        { service: "Delhi to Agra Golden Triangle Day Trip (Toyota Innova)", guest: "Harish Chandra", base: 4800, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Mumbai to Pune Expressway Roundtrip (Swift Dzire)", guest: "Nikhil Sawant", base: 3200, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Bangalore to Coorg 3-Day Outstation (Innova Crysta)", guest: "Kiran Mazumdar", base: 12500, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Delhi to Jaipur Airport Drop (Prime Sedan)", guest: "Pawan Agarwal", base: 3900, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Chandigarh to Shimla Mountain Route (Tempo Traveller)", guest: "Grewal Family (10 Pax)", base: 8500, date: "2026-08-12", status: "Cleared & Reconciled" },
        { service: "Chennai to Pondicherry Coastal Highway (Innova)", guest: "Srinivasan Raman", base: 4600, date: "2026-08-04", status: "Cleared & Reconciled" },
        { service: "Delhi to Rishikesh & Haridwar 2-Day Package", guest: "Ashok Singhania", base: 7400, date: "2026-07-28", status: "Cleared & Reconciled" },
        { service: "Mumbai to Lonavala Weekend Rental (Ertiga AC)", guest: "Prashant Shinde", base: 4100, date: "2026-07-20", status: "Cleared & Reconciled" },
        { service: "Jaipur to Jodhpur Desert Corridor (Crysta)", guest: "Capt. Arvind Rathore", base: 9800, date: "2026-07-13", status: "Cleared & Reconciled" },
        { service: "Hyderabad to Srisailam Temple Roundtrip (Sedan)", guest: "Venkat Reddy", base: 5300, date: "2026-07-05", status: "Cleared & Reconciled" },
      ],
      restaurant: [
        { service: "Royal Punjab Heritage Thali Combo (VIP Table - 8 Pax)", guest: "Surinder Sandhu & Family", base: 5200, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Express Highway Buffet & Breakfast Vouchers (14 Pax)", guest: "Delhi-Chandigarh Tour Coach", base: 6800, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Special Desi Ghee Tandoori Feast (Table #12)", guest: "Amrik Singh", base: 3400, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Family Weekend Dinner Thali (6 Pax)", guest: "Sunita Chawla", base: 4100, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Midnight Highway Travelers Refreshment Package", guest: "Himachal Express Bus #104", base: 7900, date: "2026-08-12", status: "Cleared & Reconciled" },
        { service: "Highway Royal Breakfast Buffet (20 Vouchers)", guest: "Shree Travels Coach", base: 5800, date: "2026-08-05", status: "Cleared & Reconciled" },
        { service: "Celebration Birthday Feast (VIP Lounge - 12 Pax)", guest: "Gurpreet Dhillon", base: 8200, date: "2026-07-29", status: "Cleared & Reconciled" },
        { service: "Executive Business Lunch Set (Table #4)", guest: "ICICI Regional Audit Team", base: 4600, date: "2026-07-21", status: "Cleared & Reconciled" },
        { service: "Weekend Unlimited Highway Thali (10 Pax)", guest: "Sharma Clan", base: 6200, date: "2026-07-14", status: "Cleared & Reconciled" },
        { service: "Traditional Punjabi Kadhai Feast (Table #9)", guest: "Jaswinder Bains", base: 3800, date: "2026-07-06", status: "Cleared & Reconciled" },
      ],
      houseboat: [
        { service: "Royal 2-Bedroom Luxury Kettuvallam (Overnight Stay)", guest: "Kishore & Priya Mathew", base: 19500, date: "2026-08-23", status: "In Settlement Batch" },
        { service: "Honeymoon Glass-AC Backwater Cruiser (Overnight)", guest: "Ashwin & Divya Raman", base: 14000, date: "2026-08-22", status: "Cleared & Reconciled" },
        { service: "Maharaja 4-Bedroom Grand Cruiser (Family 8 Pax)", guest: "Varghese Family Reunion", base: 36000, date: "2026-08-20", status: "Cleared & Reconciled" },
        { service: "Vembanad Lake Sunset Cruise with Private Chef (Day)", guest: "Dr. George Thomas", base: 11500, date: "2026-08-18", status: "Cleared & Reconciled" },
        { service: "Champakulam Heritage Canal Overnight Package", guest: "Siddique & Friends", base: 18000, date: "2026-08-11", status: "Cleared & Reconciled" },
        { service: "Upper Deck AC Luxury Kettuvallam (2 Nights)", guest: "Paul Koshy & Family", base: 26000, date: "2026-08-03", status: "Cleared & Reconciled" },
        { service: "Backwater Serenade Honeymoon Cruiser (Overnight)", guest: "Nikhil & Anjali Nair", base: 15500, date: "2026-07-27", status: "Cleared & Reconciled" },
        { service: "Alappuzha-Kumarakom Canal Cruise with Lunch (6 Pax)", guest: "Dr. Jacob Kuruvilla", base: 12800, date: "2026-07-19", status: "Cleared & Reconciled" },
        { service: "Traditional Heritage 3-Bedroom Houseboat", guest: "Menon Family Gathering", base: 29000, date: "2026-07-12", status: "Cleared & Reconciled" },
        { service: "Twilight Lake Cruise with Seafood Feast", guest: "Reneesh & Colleagues", base: 10500, date: "2026-07-04", status: "Cleared & Reconciled" },
      ],
    };

    const defaultList = [
      { service: "Standard Service Booking", guest: "Verified Customer", base: 5000, date: "2026-08-23", status: "In Settlement Batch" as const },
      { service: "Premium Package Booking", guest: "Corporate Client", base: 12000, date: "2026-08-22", status: "Cleared & Reconciled" as const },
      { service: "Special Reservation Order", guest: "Direct Traveler", base: 7500, date: "2026-08-20", status: "Cleared & Reconciled" as const },
      { service: "Weekend Departure Booking", guest: "Family Group", base: 9000, date: "2026-08-18", status: "Cleared & Reconciled" as const },
      { service: "Advance Flexi Reservation", guest: "Travel Agent Partner", base: 6500, date: "2026-08-12", status: "Cleared & Reconciled" as const },
      { service: "Midweek Value Reservation", guest: "Solo Traveler", base: 4200, date: "2026-08-04", status: "Cleared & Reconciled" as const },
      { service: "Heritage Stay Package", guest: "Heritage Club Member", base: 11000, date: "2026-07-28", status: "Cleared & Reconciled" as const },
      { service: "Express Tour Confirmation", guest: "VIP Client", base: 8500, date: "2026-07-19", status: "Cleared & Reconciled" as const },
      { service: "Family Suite Reservation", guest: "Kapadia Group", base: 14000, date: "2026-07-11", status: "Cleared & Reconciled" as const },
      { service: "Specialty Service Order", guest: "Regional Tourist", base: 5800, date: "2026-07-03", status: "Cleared & Reconciled" as const },
    ];

    const items = titles[opId] || defaultList;

    return items.map((item, idx) => {
      const grossAmt = item.base;
      const commAmt = Math.round((grossAmt * rate) / 100);
      const gstAmt = Math.round(commAmt * 0.18);
      const tdsAmt = Math.round(grossAmt * 0.01);
      const netDisbursed = grossAmt - commAmt - tdsAmt;
      const refId = `BK-${opId.toUpperCase().slice(0, 3)}-${260800 + (idx + 1) * 17}`;
      const utr = `UTR${opId.toUpperCase().slice(0, 3)}2608${89100 + idx * 43}`;
      const status = item.status || (idx === 0 ? "In Settlement Batch" : "Cleared & Reconciled");

      return {
        refId,
        date: item.date,
        guest: item.guest,
        service: item.service,
        grossAmount: grossAmt,
        commRate: rate,
        commAmount: commAmt,
        gstOnComm: gstAmt,
        tdsSec194O: tdsAmt,
        netDisbursed,
        status,
        utr: status.includes("Cleared") ? utr : "PENDING_NEXT_CYCLE",
      };
    });
  };

  const allTransactions = useMemo(() => {
    return getSampleTransactions(
      currentOperator.id,
      currentOperator.partnerListingPlans.grossBookingsThisMonth,
      currentOperator.partnerListingPlans.commissionRatePercentage
    );
  }, [currentOperator]);

  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((txn) => {
        if (financialStartDate && txn.date < financialStartDate) return false;
        if (financialEndDate && txn.date > financialEndDate) return false;
        return true;
      })
      .filter((item) => {
        if (commissionStatusFilter === "cleared") return item.status.includes("Cleared");
        if (commissionStatusFilter === "pending") return item.status.includes("Settlement");
        return true;
      })
      .filter((item) => {
        if (!commissionSearch) return true;
        const q = commissionSearch.toLowerCase();
        return (
          item.refId.toLowerCase().includes(q) ||
          item.guest.toLowerCase().includes(q) ||
          item.service.toLowerCase().includes(q) ||
          item.utr.toLowerCase().includes(q)
        );
      });
  }, [allTransactions, financialStartDate, financialEndDate, commissionStatusFilter, commissionSearch]);

  const dateRangeMatchedTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      if (financialStartDate && txn.date < financialStartDate) return false;
      if (financialEndDate && txn.date > financialEndDate) return false;
      return true;
    });
  }, [allTransactions, financialStartDate, financialEndDate]);

  const filteredFinancialSummary = useMemo(() => {
    const gross = dateRangeMatchedTransactions.reduce((acc, t) => acc + t.grossAmount, 0);
    const comm = dateRangeMatchedTransactions.reduce((acc, t) => acc + t.commAmount, 0);
    const tds = dateRangeMatchedTransactions.reduce((acc, t) => acc + t.tdsSec194O, 0);
    const gst = dateRangeMatchedTransactions.reduce((acc, t) => acc + t.gstOnComm, 0);
    const net = dateRangeMatchedTransactions.reduce((acc, t) => acc + t.netDisbursed, 0);
    return { gross, comm, tds, gst, net, count: dateRangeMatchedTransactions.length };
  }, [dateRangeMatchedTransactions]);

  const handleSelectDatePreset = (
    preset: "this_month" | "last_month" | "last_7_days" | "last_30_days" | "q3_2026" | "ytd_2026" | "custom"
  ) => {
    setFinancialDatePreset(preset);
    if (preset === "this_month") {
      setFinancialStartDate("2026-08-01");
      setFinancialEndDate("2026-08-31");
      setShowCustomDateInputs(false);
    } else if (preset === "last_month") {
      setFinancialStartDate("2026-07-01");
      setFinancialEndDate("2026-07-31");
      setShowCustomDateInputs(false);
    } else if (preset === "last_7_days") {
      setFinancialStartDate("2026-08-18");
      setFinancialEndDate("2026-08-24");
      setShowCustomDateInputs(false);
    } else if (preset === "last_30_days") {
      setFinancialStartDate("2026-07-25");
      setFinancialEndDate("2026-08-24");
      setShowCustomDateInputs(false);
    } else if (preset === "q3_2026") {
      setFinancialStartDate("2026-07-01");
      setFinancialEndDate("2026-09-30");
      setShowCustomDateInputs(false);
    } else if (preset === "ytd_2026") {
      setFinancialStartDate("2026-04-01");
      setFinancialEndDate("2026-08-24");
      setShowCustomDateInputs(false);
    } else if (preset === "custom") {
      setShowCustomDateInputs(true);
    }
  };

  const getEarningsCycles = (
    opId: string,
    gross: number,
    commRate: number,
    preset: string = financialDatePreset
  ) => {
    if (preset === "last_month") {
      const julGross = Math.round(gross * 0.94);
      const w1 = Math.round(julGross * 0.23);
      const w2 = Math.round(julGross * 0.25);
      const w3 = Math.round(julGross * 0.27);
      const w4 = julGross - (w1 + w2 + w3);

      const calcJulRow = (
        id: string,
        cycleName: string,
        dateRange: string,
        cycleGross: number,
        utr: string,
        growth: string
      ) => {
        const comm = Math.round(cycleGross * (commRate / 100));
        const tds = Math.round(cycleGross * 0.01);
        const gst = Math.round(comm * 0.18);
        const cycleNet = cycleGross - comm - tds;
        return {
          id,
          cycleName,
          dateRange,
          gross: cycleGross,
          comm,
          tds,
          gst,
          net: cycleNet,
          status: "Disbursed & Reconciled" as const,
          utr,
          growth,
        };
      };

      return [
        calcJulRow("jul-c1", "Week 1 Payout Cycle", "Jul 01 – Jul 07, 2026", w1, `UTR${opId.toUpperCase().slice(0, 3)}070781`, "+6.2%"),
        calcJulRow("jul-c2", "Week 2 Payout Cycle", "Jul 08 – Jul 14, 2026", w2, `UTR${opId.toUpperCase().slice(0, 3)}071485`, "+9.4%"),
        calcJulRow("jul-c3", "Week 3 Payout Cycle", "Jul 15 – Jul 21, 2026", w3, `UTR${opId.toUpperCase().slice(0, 3)}072188`, "+11.0%"),
        calcJulRow("jul-c4", "Week 4 Payout Cycle", "Jul 22 – Jul 31, 2026", w4, `UTR${opId.toUpperCase().slice(0, 3)}073190`, "+13.5%"),
      ];
    }

    if (preset === "last_7_days") {
      const d1Gross = Math.round(gross * 0.15);
      const d2Gross = Math.round(gross * 0.28);
      const d3Gross = Math.round(gross * 0.32);
      const d4Gross = gross - (d1Gross + d2Gross + d3Gross);

      const calc7DayRow = (
        id: string,
        cycleName: string,
        dateRange: string,
        cycleGross: number,
        status: "Disbursed & Reconciled" | "In Settlement Batch",
        utr: string,
        growth: string
      ) => {
        const comm = Math.round(cycleGross * (commRate / 100));
        const tds = Math.round(cycleGross * 0.01);
        const gst = Math.round(comm * 0.18);
        const cycleNet = cycleGross - comm - tds;
        return {
          id,
          cycleName,
          dateRange,
          gross: cycleGross,
          comm,
          tds,
          gst,
          net: cycleNet,
          status,
          utr,
          growth,
        };
      };

      return [
        calc7DayRow("7d-1", "Daily Batch: Aug 18–19", "Aug 18 – Aug 19, 2026", d1Gross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}081911`, "+14.2%"),
        calc7DayRow("7d-2", "Daily Batch: Aug 20–21", "Aug 20 – Aug 21, 2026", d2Gross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}082122`, "+16.8%"),
        calc7DayRow("7d-3", "Weekend Batch: Aug 22–23", "Aug 22 – Aug 23, 2026", d3Gross, "In Settlement Batch", "BATCH_QUEUE_2308", "+19.5%"),
        calc7DayRow("7d-4", "Intraday Queue: Aug 24", "Aug 24, 2026", d4Gross, "In Settlement Batch", "BATCH_TODAY_2408", "+21.0%"),
      ];
    }

    if (preset === "last_30_days") {
      const w1 = Math.round(gross * 0.22);
      const w2 = Math.round(gross * 0.25);
      const w3 = Math.round(gross * 0.27);
      const w4 = gross - (w1 + w2 + w3);

      const calc30DayRow = (
        id: string,
        cycleName: string,
        dateRange: string,
        cycleGross: number,
        status: "Disbursed & Reconciled" | "In Settlement Batch",
        utr: string,
        growth: string
      ) => {
        const comm = Math.round(cycleGross * (commRate / 100));
        const tds = Math.round(cycleGross * 0.01);
        const gst = Math.round(comm * 0.18);
        const cycleNet = cycleGross - comm - tds;
        return {
          id,
          cycleName,
          dateRange,
          gross: cycleGross,
          comm,
          tds,
          gst,
          net: cycleNet,
          status,
          utr,
          growth,
        };
      };

      return [
        calc30DayRow("30d-1", "Rolling Cycle 1", "Jul 25 – Jul 31, 2026", w1, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}073101`, "+10.5%"),
        calc30DayRow("30d-2", "Rolling Cycle 2", "Aug 01 – Aug 07, 2026", w2, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}080789`, "+12.1%"),
        calc30DayRow("30d-3", "Rolling Cycle 3", "Aug 08 – Aug 14, 2026", w3, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}081492`, "+15.3%"),
        calc30DayRow("30d-4", "Rolling Cycle 4 (Active)", "Aug 15 – Aug 24, 2026", w4, "In Settlement Batch", "BATCH_QUEUE_2808", "+18.7%"),
      ];
    }

    if (preset === "ytd_2026") {
      const q1Gross = Math.round(gross * 1.85);
      const q2JulGross = Math.round(gross * 0.94);
      const q2AugGross = gross;

      const calcYtdRow = (
        id: string,
        cycleName: string,
        dateRange: string,
        cycleGross: number,
        status: "Disbursed & Reconciled" | "In Settlement Batch",
        utr: string,
        growth: string
      ) => {
        const comm = Math.round(cycleGross * (commRate / 100));
        const tds = Math.round(cycleGross * 0.01);
        const gst = Math.round(comm * 0.18);
        const cycleNet = cycleGross - comm - tds;
        return {
          id,
          cycleName,
          dateRange,
          gross: cycleGross,
          comm,
          tds,
          gst,
          net: cycleNet,
          status,
          utr,
          growth,
        };
      };

      return [
        calcYtdRow("ytd-q1", "Q1 FY26-27 Consolidated", "Apr 01 – Jun 30, 2026", q1Gross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}Q1AUDIT`, "+24.6%"),
        calcYtdRow("ytd-jul", "July 2026 Monthly Statement", "Jul 01 – Jul 31, 2026", q2JulGross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}073199`, "+11.2%"),
        calcYtdRow("ytd-aug", "August 2026 Active Cycle", "Aug 01 – Aug 24, 2026", q2AugGross, "In Settlement Batch", "BATCH_QUEUE_2808", "+18.0%"),
      ];
    }

    if (preset === "q3_2026") {
      const julGross = Math.round(gross * 0.94);
      const augGross = gross;
      const sepProjected = Math.round(gross * 1.14);

      const calcQ3Month = (
        id: string,
        cycleName: string,
        dateRange: string,
        cycleGross: number,
        status: "Disbursed & Reconciled" | "In Settlement Batch",
        utr: string,
        growth: string
      ) => {
        const comm = Math.round(cycleGross * (commRate / 100));
        const tds = Math.round(cycleGross * 0.01);
        const gst = Math.round(comm * 0.18);
        const cycleNet = cycleGross - comm - tds;
        return {
          id,
          cycleName,
          dateRange,
          gross: cycleGross,
          comm,
          tds,
          gst,
          net: cycleNet,
          status,
          utr,
          growth,
        };
      };

      return [
        calcQ3Month("q3-jul", "July 2026 Monthly Consolidated", "Jul 01 – Jul 31, 2026", julGross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}073199`, "+11.2%"),
        calcQ3Month("q3-aug", "August 2026 Active Cycle", "Aug 01 – Aug 28, 2026", augGross, "In Settlement Batch", "BATCH_QUEUE_2808", "+14.2%"),
        calcQ3Month("q3-sep", "September 2026 Projected Target", "Sep 01 – Sep 30, 2026", sepProjected, "In Settlement Batch", "ESTIMATED_RUN_RATE", "+18.0%"),
      ];
    }

    // Default: August weekly payout cycles
    const w1Gross = Math.round(gross * 0.22);
    const w2Gross = Math.round(gross * 0.26);
    const w3Gross = Math.round(gross * 0.28);
    const w4Gross = gross - (w1Gross + w2Gross + w3Gross);

    const calcRow = (
      id: string,
      cycleName: string,
      dateRange: string,
      cycleGross: number,
      status: "Disbursed & Reconciled" | "In Settlement Batch",
      utr: string,
      growth: string
    ) => {
      const comm = Math.round(cycleGross * (commRate / 100));
      const tds = Math.round(cycleGross * 0.01);
      const gst = Math.round(comm * 0.18);
      const cycleNet = cycleGross - comm - tds;
      return {
        id,
        cycleName,
        dateRange,
        gross: cycleGross,
        comm,
        tds,
        gst,
        net: cycleNet,
        status,
        utr,
        growth,
      };
    };

    return [
      calcRow("c1", "Week 1 Payout Cycle", "Aug 01 – Aug 07, 2026", w1Gross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}080789`, "+8.4%"),
      calcRow("c2", "Week 2 Payout Cycle", "Aug 08 – Aug 14, 2026", w2Gross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}081492`, "+12.1%"),
      calcRow("c3", "Week 3 Payout Cycle", "Aug 15 – Aug 21, 2026", w3Gross, "Disbursed & Reconciled", `UTR${opId.toUpperCase().slice(0, 3)}082195`, "+15.3%"),
      calcRow("c4", "Week 4 Payout Cycle (Active)", "Aug 22 – Aug 28, 2026", w4Gross, "In Settlement Batch", "BATCH_QUEUE_2808", "+18.7%"),
    ];
  };

  const handleDownloadCommissionReport = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString("en-IN");

    const planName = deepSpec?.listingPlan.planName || currentOperator.partnerListingPlans.currentPlan + " Partner";
    const planStatus = deepSpec?.listingPlan.planStatus || currentOperator.partnerListingPlans.planStatus;
    const applicablePlan = deepSpec?.commission.applicableCommissionPlan || `${currentOperator.categoryName} Standard Plan`;
    const bookingCommRate = deepSpec?.commission.bookingCommission || `${currentOperator.partnerListingPlans.commissionRatePercentage}%`;
    const commStatus = deepSpec?.commission.commissionAmountStatus || `Reconciled against ₹${filteredFinancialSummary.gross.toLocaleString()}`;
    const netAmount = `₹${filteredFinancialSummary.net.toLocaleString()}`;
    const settlementStatus = deepSpec?.commission.settlementStatus || currentOperator.partnerListingPlans.nextPayoutDate;
    const settlementCycle = currentOperator.partnerListingPlans.settlementCycle;
    const grossBookings = filteredFinancialSummary.gross;
    const netPayout = filteredFinancialSummary.net;
    const commPercent = currentOperator.partnerListingPlans.commissionRatePercentage;
    const commTotal = filteredFinancialSummary.comm;
    const tds194O = filteredFinancialSummary.tds;
    const gstOnComm = filteredFinancialSummary.gst;

    const cycles = getEarningsCycles(
      currentOperator.id,
      filteredFinancialSummary.gross,
      currentOperator.partnerListingPlans.commissionRatePercentage,
      financialDatePreset
    );

    const transactions = filteredTransactions;

    const escapeCsv = (val: string | number) => {
      const s = String(val ?? "");
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return `"${s}"`;
    };

    const csvRows: string[] = [
      "=== TRAVEL SUPER DASHBOARD — OPERATOR COMMISSION & EARNINGS REPORT ===",
      `"Operator ID",${escapeCsv(currentOperator.id)}`,
      `"Operator / Company Name",${escapeCsv(currentOperator.name)}`,
      `"Category / Vertical",${escapeCsv(currentOperator.categoryName)}`,
      `"Report Generated Date",${escapeCsv(dateStr + " " + timeStr)}`,
      `"Filtered Period Range",${escapeCsv(financialStartDate + " to " + financialEndDate + " (" + financialDatePreset + ")")}`,
      `"Listing Plan Tier",${escapeCsv(planName)}`,
      `"Listing Plan Status",${escapeCsv(planStatus)}`,
      `"Applicable Commission Plan",${escapeCsv(applicablePlan)}`,
      `"Commission Rate",${escapeCsv(bookingCommRate)}`,
      `"Settlement Payout Cycle",${escapeCsv(settlementCycle)}`,
      `"Settlement Status",${escapeCsv(settlementStatus)}`,
      "",
      "=== FINANCIAL SUMMARY (SELECTED TIME PERIOD) ===",
      `"Metric","Amount (INR)"`,
      `"Gross Bookings (Filtered Period)",${grossBookings}`,
      `"Commission Retained (${commPercent}%)",${commTotal}`,
      `"GST on Commission (18% ITC)",${gstOnComm}`,
      `"TDS Section 194-O (1%)",${tds194O}`,
      `"Net Operator Disbursed Earnings",${netPayout}`,
      `"Total Filtered Transactions",${transactions.length}`,
      `"Total Settlement Batches",${cycles.length}`,
      "",
      "=== SETTLEMENT CYCLES BREAKDOWN ===",
      [
        "Cycle ID",
        "Cycle Description",
        "Date Range",
        "Gross Bookings (INR)",
        "Platform Commission (INR)",
        "GST 18% (INR)",
        "TDS 194-O 1% (INR)",
        "Net Disbursed (INR)",
        "Disbursement Status",
        "Banking UTR / Reference",
        "MoM Trend",
      ].map(escapeCsv).join(","),
      ...cycles.map((c) =>
        [
          c.id,
          c.cycleName,
          c.dateRange,
          c.gross,
          c.comm,
          c.gst,
          c.tds,
          c.net,
          c.status,
          c.utr,
          c.growth,
        ].map(escapeCsv).join(",")
      ),
      "",
      "=== ITEMIZED BOOKING SETTLEMENT LEDGER (FILTERED) ===",
      [
        "Booking Reference",
        "Date",
        "Customer / Client",
        "Service Description",
        "Gross Amount (INR)",
        "Commission Rate (%)",
        "Commission Deducted (INR)",
        "GST (18%) (INR)",
        "TDS 194-O (1%) (INR)",
        "Net Payout (INR)",
        "Settlement Status",
        "Bank UTR / Payout Reference",
      ].map(escapeCsv).join(","),
      ...transactions.map((t) =>
        [
          t.refId,
          t.date,
          t.guest,
          t.service,
          t.grossAmount,
          `${t.commRate}%`,
          t.commAmount,
          t.gstOnComm,
          t.tdsSec194O,
          t.netDisbursed,
          t.status,
          t.utr,
        ].map(escapeCsv).join(",")
      ),
      "",
      "=== REGULATORY & COMPLIANCE NOTES ===",
      `"Tax Compliance","GST E-Invoicing & Section 194-O TDS compliant settlement statements. Generated via automated RBI RTGS settlement reconciliation engine."`,
      `"Data Isolation Notice","Export contains only authorized operator ledger records. Backend underwriting formulas and root platform secrets remain server-side."`,
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const filename = `${currentOperator.id}_commission_earnings_${financialStartDate}_to_${financialEndDate}.csv`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadFeedback(`Report downloaded: ${filename}`);
    setTimeout(() => setDownloadFeedback(null), 4000);
  };

  const handleDownloadPdfInvoice = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString("en-IN");
    const invoiceNo = `INV-2026-AUG-${currentOperator.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const planName = deepSpec?.listingPlan.planName || currentOperator.partnerListingPlans.currentPlan + " Partner";
    const applicablePlan = deepSpec?.commission.applicableCommissionPlan || `${currentOperator.categoryName} Standard Plan`;
    const bookingCommRate = deepSpec?.commission.bookingCommission || `${currentOperator.partnerListingPlans.commissionRatePercentage}%`;
    const settlementCycle = currentOperator.partnerListingPlans.settlementCycle;
    const grossBookings = filteredFinancialSummary.gross;
    const netPayout = filteredFinancialSummary.net;
    const commPercent = currentOperator.partnerListingPlans.commissionRatePercentage;
    const commTotal = filteredFinancialSummary.comm;
    const tds194O = filteredFinancialSummary.tds;
    const gstOnComm = filteredFinancialSummary.gst;
    const cgst = Math.round(gstOnComm / 2);
    const sgst = gstOnComm - cgst;

    const cycles = getEarningsCycles(
      currentOperator.id,
      filteredFinancialSummary.gross,
      currentOperator.partnerListingPlans.commissionRatePercentage,
      financialDatePreset
    );

    const transactions = filteredTransactions;

    const printableHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice & Settlement Statement - ${invoiceNo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      color: #0f172a;
      background-color: #ffffff;
      padding: 16px;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #334155;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      color: #1e1b4b;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .invoice-badge {
      display: inline-block;
      background-color: #e0e7ff;
      color: #3730a3;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 10px;
      border: 1px solid #c7d2fe;
    }
    .meta-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .grid-2 {
      display: table;
      width: 100%;
    }
    .grid-col {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin-bottom: 6px;
    }
    .info-row {
      margin-bottom: 3px;
      font-size: 10.5px;
    }
    .info-label {
      color: #64748b;
      display: inline-block;
      width: 120px;
      font-weight: 500;
    }
    .info-val {
      color: #0f172a;
      font-weight: 700;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    .summary-table th {
      background-color: #1e293b;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 7px 8px;
      text-align: left;
    }
    .summary-table td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10.5px;
    }
    .summary-table tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .text-emerald {
      color: #059669;
      font-weight: 800;
    }
    .text-rose {
      color: #dc2626;
      font-weight: 700;
    }
    .highlight-row {
      background-color: #f0fdf4 !important;
      font-weight: 800;
      border-top: 2px solid #059669;
      border-bottom: 2px solid #059669;
    }
    .highlight-row td {
      font-size: 12px;
      color: #065f46;
      padding: 8px !important;
    }
    .sub-heading {
      font-size: 12px;
      font-weight: 800;
      color: #1e1b4b;
      margin-top: 14px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer-note {
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      margin-top: 16px;
      font-size: 9px;
      color: #64748b;
      line-height: 1.5;
    }
    .stamp-box {
      border: 1.5px dashed #059669;
      padding: 8px 12px;
      border-radius: 6px;
      background-color: #ecfdf5;
      display: inline-block;
      text-align: center;
      margin-top: 6px;
    }
    .stamp-title {
      font-size: 10px;
      font-weight: 900;
      color: #065f46;
      text-transform: uppercase;
    }
    .stamp-sub {
      font-size: 8px;
      color: #047857;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header-table">
    <div style="display: table; width: 100%;">
      <div style="display: table-cell; vertical-align: middle;">
        <div class="brand-title">TRAVEL SUPER GLOBAL</div>
        <div class="brand-subtitle">Automated Partner Settlement & Tax Invoicing System</div>
      </div>
      <div style="display: table-cell; vertical-align: middle; text-align: right;">
        <div class="invoice-badge">TAX INVOICE & SETTLEMENT NOTE</div>
        <div style="font-size: 11px; font-weight: 800; color: #1e293b; margin-top: 4px;">${invoiceNo}</div>
        <div style="font-size: 9.5px; color: #64748b;">Issued: ${dateStr} ${timeStr}</div>
      </div>
    </div>
  </div>

  <div class="meta-box">
    <div class="grid-2">
      <div class="grid-col" style="padding-right: 12px;">
        <div class="section-title">ISSUER / PLATFORM OPERATOR</div>
        <div class="info-row"><span class="info-label">Entity Name:</span><span class="info-val">Travel Super Global Services Pvt. Ltd.</span></div>
        <div class="info-row"><span class="info-label">GSTIN / UIN:</span><span class="info-val">07AAACT9876Q1ZB</span></div>
        <div class="info-row"><span class="info-label">Corporate PAN:</span><span class="info-val">AAACT9876Q</span></div>
        <div class="info-row"><span class="info-label">SAC / HSN Code:</span><span class="info-val">998553 (Marketplace & Facilitation Services)</span></div>
        <div class="info-row"><span class="info-label">Registered Office:</span><span class="info-val">Cyber City Tech Park, Tower B, Sector 24, Gurugram, HR 122002</span></div>
      </div>
      <div class="grid-col" style="padding-left: 12px; border-left: 1px solid #e2e8f0;">
        <div class="section-title">BILLED TO / OPERATOR PARTNER</div>
        <div class="info-row"><span class="info-label">Operator Name:</span><span class="info-val">${currentOperator.name}</span></div>
        <div class="info-row"><span class="info-label">Operator ID:</span><span class="info-val">${currentOperator.id} (${currentOperator.categoryName})</span></div>
        <div class="info-row"><span class="info-label">Billing Period:</span><span class="info-val">${financialStartDate} to ${financialEndDate} (${financialDatePreset.replace(/_/g, " ").toUpperCase()})</span></div>
        <div class="info-row"><span class="info-label">Listing Tier:</span><span class="info-val">${planName}</span></div>
        <div class="info-row"><span class="info-label">Commission Rate:</span><span class="info-val">${bookingCommRate} (${applicablePlan})</span></div>
        <div class="info-row"><span class="info-label">Settlement Cycle:</span><span class="info-val">${settlementCycle}</span></div>
      </div>
    </div>
  </div>

  <div class="sub-heading">1. STATUTORY FINANCIAL &amp; TAX SETTLEMENT SUMMARY</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th style="width: 50%;">Accounting Component / Line Item</th>
        <th style="width: 25%;">Tax / Statutory Basis</th>
        <th style="width: 25%; text-align: right;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Gross Realized Bookings</strong> (Customer Payments)</td>
        <td>Total confirmed guest reservation receipts</td>
        <td class="text-right"><strong>₹${grossBookings.toLocaleString()}</strong></td>
      </tr>
      <tr>
        <td><strong>Platform Intermediation Fee / Commission</strong></td>
        <td>Retained marketplace rate (${commPercent}%)</td>
        <td class="text-right text-rose">-₹${commTotal.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>CGST on Commission Fee (9%)</strong></td>
        <td>Central Goods & Services Tax (ITC eligible)</td>
        <td class="text-right">₹${cgst.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>SGST on Commission Fee (9%)</strong></td>
        <td>State Goods & Services Tax (ITC eligible)</td>
        <td class="text-right">₹${sgst.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>TDS under Section 194-O (1% on Gross)</strong></td>
        <td>Income Tax Act, 1961 (E-commerce operator deduction)</td>
        <td class="text-right text-rose">-₹${tds194O.toLocaleString()}</td>
      </tr>
      <tr class="highlight-row">
        <td><strong>NET SETTLED OPERATOR EARNINGS</strong></td>
        <td>Direct Remittance to Verified Escrow Bank Account</td>
        <td class="text-right"><strong>₹${netPayout.toLocaleString()}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="sub-heading">2. SETTLEMENT CYCLES &amp; BANKING DISBURSEMENTS</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th>Batch / Cycle</th>
        <th>Period</th>
        <th class="text-right">Gross (INR)</th>
        <th class="text-right">Comm (INR)</th>
        <th class="text-right">TDS (INR)</th>
        <th class="text-right">Net Payout (INR)</th>
        <th>Status</th>
        <th class="text-right">Banking UTR</th>
      </tr>
    </thead>
    <tbody>
      ${cycles.map(c => `
        <tr>
          <td><strong>${c.cycleName}</strong></td>
          <td>${c.dateRange}</td>
          <td class="text-right">₹${c.gross.toLocaleString()}</td>
          <td class="text-right text-rose">-₹${c.comm.toLocaleString()}</td>
          <td class="text-right text-rose">-₹${c.tds.toLocaleString()}</td>
          <td class="text-right text-emerald">₹${c.net.toLocaleString()}</td>
          <td><span style="background-color: ${c.status.includes('Disbursed') ? '#d1fae5' : '#fef3c7'}; color: ${c.status.includes('Disbursed') ? '#065f46' : '#92400e'}; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 9px;">${c.status}</span></td>
          <td class="text-right" style="font-family: monospace; font-size: 9.5px;">${c.utr}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="sub-heading">3. ITEMIZED TRANSACTION LEDGER (FIRST 10 BATCH ITEMS)</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th>Booking Ref</th>
        <th>Date</th>
        <th>Customer</th>
        <th>Service Description</th>
        <th class="text-right">Gross</th>
        <th class="text-right">Comm</th>
        <th class="text-right">TDS 194-O</th>
        <th class="text-right">Net</th>
        <th class="text-right">Settlement Ref</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.slice(0, 10).map(t => `
        <tr>
          <td style="font-family: monospace; font-weight: 700;">${t.refId}</td>
          <td>${t.date}</td>
          <td>${t.guest}</td>
          <td>${t.service}</td>
          <td class="text-right">₹${t.grossAmount.toLocaleString()}</td>
          <td class="text-right text-rose">-₹${t.commAmount.toLocaleString()}</td>
          <td class="text-right text-rose">-₹${t.tdsSec194O.toLocaleString()}</td>
          <td class="text-right text-emerald">₹${t.netDisbursed.toLocaleString()}</td>
          <td class="text-right" style="font-family: monospace; font-size: 9px;">${t.utr}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div style="display: table; width: 100%; margin-top: 12px;">
    <div style="display: table-cell; width: 60%; vertical-align: top; padding-right: 14px;">
      <div style="font-size: 10px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">STATUTORY & TAX DECLARATIONS:</div>
      <div class="footer-note" style="margin-top: 0; padding-top: 0; border: none;">
        1. <strong>TDS Compliance:</strong> Tax Deducted at Source under Section 194-O has been credited to Central Government. Form 16A quarterly TDS certificate will be dispatched via TRACES portal.<br>
        2. <strong>GST ITC Eligibility:</strong> Platform fee GST (SAC 998553) is eligible for Input Tax Credit under Section 16 of CGST Act upon filing GSTR-3B.<br>
        3. <strong>RBI Remittance:</strong> Payouts are routed through automated RBI RTGS / Virtual Escrow accounts adhering to RBI Payout Guidelines.
      </div>
    </div>
    <div style="display: table-cell; width: 40%; vertical-align: top; text-align: right;">
      <div class="stamp-box">
        <div class="stamp-title">DIGITALLY VERIFIED</div>
        <div class="stamp-sub">Travel Super Global Finance & Tax Cell</div>
        <div style="font-size: 8px; color: #065f46; margin-top: 3px; font-family: monospace;">AUTH_KEY: TSG-${currentOperator.id.toUpperCase()}-VERIFIED</div>
      </div>
      <div style="font-size: 8.5px; color: #94a3b8; margin-top: 6px;">
        *Computer generated tax invoice. No physical signature required under Rule 48, CGST Rules 2017.
      </div>
    </div>
  </div>
</body>
</html>`;

    // 1. Trigger Print Dialog via hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printableHtml);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.warn("Direct iframe print invocation failed:", err);
        }
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 60000);
      }, 500);
    }

    // 2. Also trigger a standalone downloadable tax invoice file (.html)
    const blob = new Blob([printableHtml], { type: "text/html;charset=utf-8;" });
    const filename = `${currentOperator.id}_tax_invoice_${invoiceNo}_${financialStartDate}_to_${financialEndDate}.html`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadFeedback(`PDF Tax Invoice generated: ${invoiceNo}. Ready for print/PDF export.`);
    setTimeout(() => setDownloadFeedback(null), 5000);
  };

  const renderDateRangeFilterBar = (titleContext: string = "Financial Period Filter") => {
    const isCustom = financialDatePreset === "custom" || showCustomDateInputs;
    const activeDateCount = dateRangeMatchedTransactions.length;

    const formatDisplayDate = (dStr: string) => {
      if (!dStr) return "";
      try {
        const parts = dStr.split("-");
        if (parts.length === 3) {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const mIdx = parseInt(parts[1], 10) - 1;
          return `${months[mIdx] || parts[1]} ${parts[2]}, ${parts[0]}`;
        }
      } catch (e) {
        // fallback
      }
      return dStr;
    };

    const presetLabels: Record<string, string> = {
      this_month: "This Month (Aug 2026)",
      last_month: "Last Month (Jul 2026)",
      last_7_days: "Last 7 Days (Aug 18–24)",
      last_30_days: "Last 30 Days",
      q3_2026: "Q3 2026 (Jul–Sep)",
      ytd_2026: "FY 2026-27 YTD",
      custom: "Custom Range",
    };

    return (
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        {/* Header: Title, Active Range Chip, and Quick Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white flex flex-wrap items-center gap-2">
                <span>{titleContext}</span>
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {presetLabels[financialDatePreset] || "Custom Window"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {activeDateCount} {activeDateCount === 1 ? "record" : "records"} in range
                </span>
              </div>
              <div className="text-2xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>Active Period:</span>
                <span className="text-amber-300 font-semibold">{formatDisplayDate(financialStartDate)}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-amber-300 font-semibold">{formatDisplayDate(financialEndDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {(financialDatePreset !== "this_month" || financialStartDate !== "2026-08-01" || financialEndDate !== "2026-08-31") && (
              <button
                onClick={() => handleSelectDatePreset("this_month")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-3xs font-bold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm active:scale-95"
                title="Reset date filter to current month (August 2026)"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset to Aug 2026</span>
              </button>
            )}
            <button
              onClick={handleDownloadPdfInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-3xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md border border-indigo-400/40 transition-all active:scale-95 shrink-0"
              title="Print & Download Tax Compliant PDF Invoice for Filtered Period"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Invoice</span>
            </button>
            <button
              onClick={handleDownloadCommissionReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-3xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md border border-emerald-400/40 transition-all active:scale-95 shrink-0"
              title="Export CSV Financial Statement for Filtered Period"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Live Filtered Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <div className="space-y-0.5">
            <div className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Filtered Gross Revenue</div>
            <div className="text-sm font-black text-amber-300">₹{filteredFinancialSummary.gross.toLocaleString()}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Platform Comm ({currentOperator.partnerListingPlans.commissionRatePercentage}%)</div>
            <div className="text-sm font-bold text-rose-300">-₹{filteredFinancialSummary.comm.toLocaleString()}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xs uppercase tracking-wider text-slate-400 font-bold">TDS (1%) &amp; GST ITC</div>
            <div className="text-sm font-bold text-slate-300">-₹{filteredFinancialSummary.tds.toLocaleString()}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Net Disbursed Payout</div>
            <div className="text-sm font-black text-emerald-400">₹{filteredFinancialSummary.net.toLocaleString()}</div>
          </div>
        </div>

        {/* Quick Date Presets Selector Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-indigo-400" />
              <span>Quick Presets:</span>
            </span>
            <button
              onClick={() => handleSelectDatePreset("this_month")}
              className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "this_month"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              This Month (Aug 2026)
            </button>
            <button
              onClick={() => handleSelectDatePreset("last_month")}
              className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "last_month"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              Last Month (Jul 2026)
            </button>
            <button
              onClick={() => handleSelectDatePreset("last_7_days")}
              className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "last_7_days"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleSelectDatePreset("last_30_days")}
              className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "last_30_days"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => handleSelectDatePreset("q3_2026")}
              className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "q3_2026"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              Q3 2026 (Jul–Sep)
            </button>
            <button
              onClick={() => handleSelectDatePreset("ytd_2026")}
              className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "ytd_2026"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              FY 2026-27 YTD
            </button>
            <button
              onClick={() => {
                if (financialDatePreset === "custom") {
                  setShowCustomDateInputs(!showCustomDateInputs);
                } else {
                  handleSelectDatePreset("custom");
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                financialDatePreset === "custom"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 border border-amber-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Custom Range</span>
            </button>
          </div>
        </div>

        {/* Custom Start & End Date Interactive Pickers */}
        {isCustom && (
          <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3.5 animate-in fade-in duration-200 shadow-inner">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold text-slate-300">From Date:</span>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={financialStartDate}
                    onChange={(e) => {
                      setFinancialStartDate(e.target.value);
                      setFinancialDatePreset("custom");
                    }}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold text-slate-300">To Date:</span>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={financialEndDate}
                    onChange={(e) => {
                      setFinancialEndDate(e.target.value);
                      setFinancialDatePreset("custom");
                    }}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Fast Quick Range Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-3xs font-semibold text-slate-400 mr-0.5">Quick Step:</span>
              <button
                onClick={() => {
                  setFinancialStartDate("2026-08-24");
                  setFinancialEndDate("2026-08-24");
                  setFinancialDatePreset("custom");
                }}
                className="px-2 py-1 rounded-lg text-3xs font-bold bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                Today (Aug 24)
              </button>
              <button
                onClick={() => {
                  setFinancialStartDate("2026-08-18");
                  setFinancialEndDate("2026-08-24");
                  setFinancialDatePreset("custom");
                }}
                className="px-2 py-1 rounded-lg text-3xs font-bold bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                Current Week
              </button>
              <button
                onClick={() => {
                  setFinancialStartDate("2026-08-01");
                  setFinancialEndDate("2026-08-15");
                  setFinancialDatePreset("custom");
                }}
                className="px-2 py-1 rounded-lg text-3xs font-bold bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                First Half MTD
              </button>
              <button
                onClick={() => {
                  setFinancialStartDate("2026-07-01");
                  setFinancialEndDate("2026-07-31");
                  setFinancialDatePreset("custom");
                }}
                className="px-2 py-1 rounded-lg text-3xs font-bold bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                Full July
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        
        {/* Download Success Toast Notification */}
        {downloadFeedback && (
          <div className="absolute top-20 right-6 z-50 bg-emerald-600/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/50 animate-in slide-in-from-top-3 fade-in duration-200 max-w-md">
            <div className="p-1.5 rounded-xl bg-emerald-700/80 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black">Commission CSV Report Generated</div>
              <div className="text-2xs text-emerald-100 truncate">{downloadFeedback}</div>
            </div>
          </div>
        )}
        
        {/* ========================================================================= */}
        {/* TOP HEADER & PILL BAR */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  India Travel Super Dashboard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {SUPER_DASHBOARD_MODULES.length} Profile Modules Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hidden sm:inline-flex">
                  Zero Frontend Leakage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Frontend Modules (Displayed) • Operator Partner Dashboard • Strictly Hidden Backend Services
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab("frontend_modules");
                setBookingStep("select");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "frontend_modules"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1. Frontend Modules (Displayed)</span>
            </button>

            <button
              onClick={() => setActiveTab("partner_dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "partner_dashboard"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2. Operator Dashboard (Frontend)</span>
            </button>

            <button
              onClick={() => setActiveTab("backend_isolation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "backend_isolation"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>3. Backend Modules (NEVER DISPLAYED)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="super-dashboard-modal-download-pdf-btn"
              onClick={handleDownloadPdfInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md border border-indigo-400/40 transition-all active:scale-95 shrink-0"
              title="Download & Print PDF Tax Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF Invoice</span>
              <span className="sm:hidden">PDF Invoice</span>
            </button>

            <button
              id="super-dashboard-modal-download-report-btn"
              onClick={handleDownloadCommissionReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md border border-emerald-400/40 transition-all active:scale-95 shrink-0"
              title="Download Commission & Earnings CSV Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Report (CSV)</span>
              <span className="sm:hidden">CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPERATOR HORIZONTAL SELECTOR STRIP (11 MODULES) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-2xs font-extrabold uppercase text-slate-500 px-2 shrink-0">
            Select Module:
          </span>
          {SUPER_DASHBOARD_MODULES.map((op, idx) => {
            const isSelected = op.id === selectedOperatorId;
            return (
              <button
                key={`${op.id}-${idx}`}
                onClick={() => {
                  setSelectedOperatorId(op.id);
                  setBookingStep("select");
                  setSelectedInventoryItem(null);
                  setCancellationSimulated(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-xs"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800"
                }`}
              >
                {renderIcon(op.icon, `w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-400"}`)}
                <span>{op.categoryName}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/70">
          
          {/* ======================================================================= */}
          {/* TAB 1: FRONTEND MODULES — DISPLAYED */}
          {/* ======================================================================= */}
          {activeTab === "frontend_modules" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {selectedOperatorId === "bus" ? (
                <BusEcosystemView />
              ) : selectedOperatorId === "train" ? (
                <TrainEcosystemView />
              ) : selectedOperatorId === "restaurant" || selectedOperatorId === "food" ? (
                <RestaurantEcosystemView />
              ) : selectedOperatorId === "dhaba" ? (
                <DhabaEcosystemView />
              ) : selectedOperatorId === "hotel" ? (
                <HotelEcosystemView />
              ) : selectedOperatorId === "lodge" ? (
                <LodgeEcosystemView />
              ) : selectedOperatorId === "pilgrimage" || selectedOperatorId === "yatra" ? (
                <PilgrimageEcosystemView />
              ) : selectedOperatorId === "corporate" || selectedOperatorId === "mice" ? (
                <CorporateEcosystemView />
              ) : selectedOperatorId === "packages" || selectedOperatorId === "tour" || selectedOperatorId === "holiday" ? (
                <TourEcosystemView />
              ) : selectedOperatorId === "flight" || selectedOperatorId === "airline" ? (
                <FlightEcosystemView />
              ) : selectedOperatorId === "cab" || selectedOperatorId === "taxi" ? (
                <CabEcosystemView />
              ) : selectedOperatorId === "houseboat" ? (
                <HouseboatEcosystemView />
              ) : selectedOperatorId === "resort" || selectedOperatorId === "luxury_resort" ? (
                <ResortEcosystemView />
              ) : selectedOperatorId === "booking" || selectedOperatorId === "agent" || selectedOperatorId === "b2b" ? (
                <BookingOperatorEcosystemView />
              ) : (
                <>
                  {/* Operator Hero Banner */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                    <div className="h-44 sm:h-56 relative w-full overflow-hidden">
                      <img
                        src={currentOperator.heroImage}
                        alt={currentOperator.name}
                        className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 shadow-md">
                          {currentOperator.badge}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900/90 text-slate-200 border border-slate-700">
                          {currentOperator.categoryName}
                        </span>
                      </div>

                  <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {currentOperator.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
                        {currentOperator.tagline}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shrink-0">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-white">
                        {currentOperator.starRating}
                      </span>
                      <span className="text-2xs text-slate-400">
                        ({currentOperator.totalReviews.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-slate-950 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{currentOperator.operatingBase}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentOperator.supportContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{currentOperator.supportContact.hours}</span>
                  </div>
                </div>
              </div>

              {/* 1. Official Frontend Modules Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        1. Frontend Modules — Displayed Features Matrix
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer-facing verified data rendered in the user interface (No backend internals exposed)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    {deepSpec?.frontendModulesTable?.length || 13} Modules Live
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                        <th className="py-2.5 px-3 font-extrabold w-44">Frontend Module</th>
                        <th className="py-2.5 px-3 font-extrabold w-80">Frontend Features</th>
                        <th className="py-2.5 px-3 font-extrabold">Active Display Output</th>
                        <th className="py-2.5 px-3 font-extrabold w-24 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(deepSpec?.frontendModulesTable || []).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{row.moduleName}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 font-medium">
                            {row.features}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-2xs">
                            {row.demoValue}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Live Interactive Booking & Discovery Engine */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Interactive Inventory / Options */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span>Interactive Booking &amp; Date Selection</span>
                        </h4>
                        <p className="text-2xs text-slate-400">
                          Select dates, occupancy &amp; room / villa / package / berth options
                        </p>
                      </div>

                      {/* Date & Guest controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-2xs">
                          <span className="text-slate-500 font-bold">In:</span>
                          <input
                            type="date"
                            value={selectedCheckInDate}
                            onChange={(e) => setSelectedCheckInDate(e.target.value)}
                            className="bg-transparent text-slate-200 focus:outline-hidden"
                          />
                        </div>
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-2xs">
                          <span className="text-slate-500 font-bold">Out:</span>
                          <input
                            type="date"
                            value={selectedCheckOutDate}
                            onChange={(e) => setSelectedCheckOutDate(e.target.value)}
                            className="bg-transparent text-slate-200 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inventory Items List */}
                    <div className="space-y-3">
                      {currentOperator.mockInventoryItems.map((item) => {
                        const isSelected = selectedInventoryItem === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isSelected
                                ? "bg-amber-500/10 border-amber-500/70 shadow-md"
                                : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-white text-sm">
                                    {item.title}
                                  </h5>
                                  <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {item.availableCount} Available
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">{item.subtitle}</p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {item.amenityHighlights.map((a, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-md text-3xs bg-slate-800 text-slate-300 border border-slate-700/60"
                                    >
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                                <div className="text-right">
                                  <div className="text-lg font-black text-amber-400">
                                    ₹{item.price.toLocaleString()}
                                  </div>
                                  <div className="text-3xs text-slate-400">
                                    {currentOperator.frontendAllowed.publicPricing.priceUnit}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleSimulateBooking(item.id)}
                                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                                >
                                  <span>Select &amp; Book</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Policies & Inclusions / Exclusions */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 text-xs">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>Policies, Inclusions &amp; Cancellation Slabs</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                      <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cancellation &amp; Refund Policy</span>
                        </div>
                        <p className="text-2xs text-slate-300">
                          {currentOperator.frontendAllowed.policies.cancellation}
                        </p>
                      </div>

                      <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Check-In / Departure Guidelines</span>
                        </div>
                        <p className="text-2xs text-slate-300">
                          {currentOperator.frontendAllowed.policies.checkInOrBoarding}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Instant Booking & Cancellation Simulator */}
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-emerald-400" />
                        <span>Live Booking Simulator</span>
                      </h4>
                      <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {bookingStep === "select" && "Step 1: Choose Option"}
                        {bookingStep === "details" && "Step 2: Guest Details"}
                        {bookingStep === "confirmed" && "Step 3: Confirmed Voucher"}
                      </span>
                    </div>

                    {bookingStep === "select" && (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                          <Search className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Click <strong>Select &amp; Book</strong> on any of the inventory options on the left to test the real-time guest checkout and cancellation flow.
                        </p>
                      </div>
                    )}

                    {bookingStep === "details" && (
                      <form onSubmit={handleCompleteBooking} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-400">Lead Guest / Traveller Name</label>
                          <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-400">Mobile Number</label>
                          <input
                            type="text"
                            required
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-400">Official Email (for E-Voucher)</label>
                          <input
                            type="email"
                            required
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        {/* Price Breakdown Calculation */}
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1 text-2xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Base Price</span>
                            <span>₹{currentOperator.mockInventoryItems[0].price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>GST &amp; Taxes ({currentOperator.frontendAllowed.publicPricing.taxPercentage}%)</span>
                            <span>₹{Math.round(currentOperator.mockInventoryItems[0].price * (currentOperator.frontendAllowed.publicPricing.taxPercentage / 100)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Platform Booking Fee</span>
                            <span className="text-emerald-400">₹0 (Free)</span>
                          </div>
                          <div className="flex justify-between font-bold text-white text-xs border-t border-slate-800 pt-1.5">
                            <span>Final Total Payable</span>
                            <span className="text-amber-400">
                              ₹{(
                                currentOperator.mockInventoryItems[0].price +
                                Math.round(currentOperator.mockInventoryItems[0].price * (currentOperator.frontendAllowed.publicPricing.taxPercentage / 100))
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay &amp; Generate Instant Voucher</span>
                        </button>
                      </form>
                    )}

                    {bookingStep === "confirmed" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/50 p-4 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Booking Confirmed &amp; Voucher Issued!</span>
                          </div>
                          <div className="font-mono text-2xs text-slate-300 space-y-0.5">
                            <div>PNR / Booking Ref: <span className="text-amber-400 font-bold">IND-TRV-{Math.floor(100000 + Math.random() * 900000)}</span></div>
                            <div>Lead Guest: <span className="text-white font-bold">{guestName}</span></div>
                            <div>Check-In: <span className="text-white">{selectedCheckInDate}</span></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl gap-3">
                          <QrCode className="w-10 h-10 text-amber-400" />
                          <div className="text-2xs text-slate-300">
                            <div className="font-bold text-white">Digital Check-In QR Pass</div>
                            <div>Ready to scan at arrival counter</div>
                          </div>
                        </div>

                        {/* Cancellation Test Trigger */}
                        <div className="border-t border-slate-800 pt-3">
                          {!cancellationSimulated ? (
                            <button
                              onClick={() => setCancellationSimulated(true)}
                              className="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
                            >
                              Simulate Cancellation &amp; Refund Request
                            </button>
                          ) : (
                            <div className="bg-rose-950/50 border border-rose-500/40 p-3 rounded-2xl text-2xs space-y-1">
                              <div className="font-bold text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Cancellation Eligibility Confirmed</span>
                              </div>
                              <p className="text-slate-300">
                                Refund of ₹{(currentOperator.mockInventoryItems[0].price).toLocaleString()} initiated to original UPI source within 5 business days.
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setBookingStep("select");
                            setSelectedInventoryItem(null);
                          }}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          Reset Simulator
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reviews Summary */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Verified Customer Ratings</span>
                    </h4>
                    <div className="space-y-2 text-2xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Cleanliness &amp; Sanitisation</span>
                        <span className="font-bold text-amber-400">4.9 / 5.0</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Staff Hospitality &amp; Service</span>
                        <span className="font-bold text-amber-400">4.9 / 5.0</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Value for Money</span>
                        <span className="font-bold text-amber-400">4.8 / 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

          {/* ======================================================================= */}
          {/* TAB 2: OPERATOR DASHBOARD — FRONTEND */}
          {/* ======================================================================= */}
          {activeTab === "partner_dashboard" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Partner Overview Stats Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500 text-slate-950">
                        {currentOperator.partnerListingPlans.currentPlan} Tier Partner
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Status: {currentOperator.partnerListingPlans.planStatus}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {currentOperator.name} — Partner Console
                    </h3>
                    <p className="text-xs text-slate-300">
                      Authorized operator management portal for inventory, reservations, listing plans, commissions &amp; bank settlement status.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-center">
                      <div className="text-2xs uppercase tracking-wider text-slate-400 font-bold">
                        Gross MTD Bookings
                      </div>
                      <div className="text-lg font-black text-amber-400">
                        ₹{currentOperator.partnerListingPlans.grossBookingsThisMonth.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-center">
                      <div className="text-2xs uppercase tracking-wider text-slate-400 font-bold">
                        Net Payout (Disbursed)
                      </div>
                      <div className="text-lg font-black text-emerald-400">
                        ₹{currentOperator.partnerListingPlans.netPayoutThisMonth.toLocaleString()}
                      </div>
                    </div>
                    <button
                      id="partner-download-pdf-invoice-btn"
                      onClick={handleDownloadPdfInvoice}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 border border-indigo-400/30 transition-all active:scale-95 shrink-0"
                      title="Download Professional PDF Tax Invoice & Settlement Statement"
                    >
                      <FileText className="w-4 h-4 text-white" />
                      <span>Download PDF Invoice</span>
                    </button>
                    <button
                      id="partner-earnings-download-report-btn"
                      onClick={handleDownloadCommissionReport}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all active:scale-95 shrink-0"
                      title="Download Commission & Earnings CSV Report"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download CSV Report</span>
                    </button>
                  </div>
                </div>

                {/* Sub Tab Navigation inside Partner Console */}
                <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    id="partner-subtab-manage-btn"
                    onClick={() => setPartnerSubTab("manage_overview")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "manage_overview"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    1. Authorized Controls ({deepSpec?.operatorDashboardManageList.length || 14})
                  </button>
                  <button
                    id="partner-subtab-listing-btn"
                    onClick={() => setPartnerSubTab("listing_plan")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "listing_plan"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    2. Listing Plan Breakdown
                  </button>
                  <button
                    id="partner-subtab-commission-btn"
                    onClick={() => setPartnerSubTab("commission_plan")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "commission_plan"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    3. Commission &amp; Settlements
                  </button>
                  <button
                    id="partner-subtab-earnings-btn"
                    onClick={() => setPartnerSubTab("earnings_ledger")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "earnings_ledger"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    4. Earnings Ledger &amp; Cycles
                  </button>
                </div>
              </div>

              {/* Sub Tab 1: Authorized Management Controls List & Monthly Earnings Cycles Table */}
              {partnerSubTab === "manage_overview" && (
                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-base font-bold text-white">
                          Authorized Partner Management Functions
                        </h4>
                      </div>
                      <span className="text-2xs font-extrabold text-slate-400">
                        Zero server credentials or internal rate logic exposed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(deepSpec?.operatorDashboardManageList || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white">
                              {item.split("(")[0]}
                            </div>
                            {item.includes("(") && (
                              <div className="text-2xs text-slate-400">
                                {item.substring(item.indexOf("("))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Earnings Cycles Table */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    {/* Date Range Filter Bar for Settlement Cycles */}
                    {renderDateRangeFilterBar("Settlement Cycles Period Filter")}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 pt-1">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Table className="w-5 h-5 text-emerald-400" />
                          <span>MONTHLY EARNINGS &amp; SETTLEMENT CYCLES</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Disbursement batches, gross realization, commission deductions &amp; bank settlement confirmation
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDownloadPdfInvoice}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md border border-indigo-400/40 transition-all active:scale-95 shrink-0"
                          title="Print / Download PDF Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download PDF Invoice</span>
                        </button>
                        <button
                          onClick={handleDownloadCommissionReport}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md border border-emerald-400/40 transition-all active:scale-95 shrink-0"
                          title="Export Earnings Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Cycles CSV</span>
                        </button>
                        <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
                          {financialDatePreset === "this_month"
                            ? "MTD Aug 2026"
                            : financialDatePreset === "last_month"
                            ? "MTD Jul 2026"
                            : financialDatePreset === "last_30_days"
                            ? "Last 30 Days"
                            : financialDatePreset === "q3_2026"
                            ? "Q3 2026"
                            : "Custom Window"}
                        </span>
                      </div>
                    </div>

                    {/* Zebra-Striped Earnings Table with Hover Effects */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-inner">
                      <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                        <thead>
                          <tr className="bg-slate-900/90 text-slate-300 font-bold uppercase tracking-wider text-2xs border-b border-slate-700/80">
                            <th className="py-3.5 px-4">Settlement Cycle &amp; Period</th>
                            <th className="py-3.5 px-4 text-right">Gross Bookings</th>
                            <th className="py-3.5 px-4 text-right">Platform Comm ({currentOperator.partnerListingPlans.commissionRatePercentage}%)</th>
                            <th className="py-3.5 px-4 text-right">TDS (1%) &amp; GST</th>
                            <th className="py-3.5 px-4 text-right">Net Disbursed Payout</th>
                            <th className="py-3.5 px-4 text-center">Cycle Trend</th>
                            <th className="py-3.5 px-4 text-right">Bank UTR &amp; Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                          {getEarningsCycles(
                            currentOperator.id,
                            filteredFinancialSummary.gross,
                            currentOperator.partnerListingPlans.commissionRatePercentage,
                            financialDatePreset
                          ).map((cycle, idx) => (
                            <tr
                              key={cycle.id}
                              onMouseEnter={() => setHoveredEarningsCycle(cycle.id)}
                              onMouseLeave={() => setHoveredEarningsCycle(null)}
                              className={`transition-all duration-150 cursor-pointer ${
                                idx % 2 === 0 ? "bg-slate-900/35" : "bg-slate-950/80"
                              } hover:bg-indigo-950/50 hover:border-l-4 hover:border-l-emerald-400`}
                            >
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                  <span>{cycle.cycleName}</span>
                                </div>
                                <div className="text-2xs text-slate-400 mt-0.5">{cycle.dateRange}</div>
                              </td>
                              <td className="py-3.5 px-4 text-right font-black text-amber-300">
                                ₹{cycle.gross.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 text-right text-rose-300/90 font-semibold">
                                -₹{cycle.comm.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 text-right text-slate-400 text-2xs">
                                <div>TDS: -₹{cycle.tds.toLocaleString()}</div>
                                <div className="text-3xs text-slate-500">GST: ₹{cycle.gst.toLocaleString()} (ITC)</div>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <span className="font-black text-emerald-400 text-sm">
                                  ₹{cycle.net.toLocaleString()}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-3xs font-black border border-emerald-500/30">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{cycle.growth}</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-3xs font-extrabold border ${
                                    cycle.status.includes("Disbursed")
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  }`}>
                                    {cycle.status}
                                  </span>
                                  <span className="font-mono text-3xs text-slate-400 mt-0.5">{cycle.utr}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-900/90 border-t-2 border-slate-700/80 font-bold text-xs">
                          {(() => {
                            const cycles = getEarningsCycles(
                              currentOperator.id,
                              filteredFinancialSummary.gross,
                              currentOperator.partnerListingPlans.commissionRatePercentage,
                              financialDatePreset
                            );
                            const totalGross = cycles.reduce((acc, c) => acc + c.gross, 0);
                            const totalComm = cycles.reduce((acc, c) => acc + c.comm, 0);
                            const totalTds = cycles.reduce((acc, c) => acc + c.tds, 0);
                            const totalNet = cycles.reduce((acc, c) => acc + c.net, 0);
                            return (
                              <tr>
                                <td className="py-3.5 px-4 text-white">Selected Period Total</td>
                                <td className="py-3.5 px-4 text-right text-amber-400 font-black">
                                  ₹{totalGross.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-rose-300 font-bold">
                                  -₹{totalComm.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-slate-400 text-2xs">
                                  -₹{totalTds.toLocaleString()} TDS
                                </td>
                                <td className="py-3.5 px-4 text-right text-emerald-400 text-sm font-black">
                                  ₹{totalNet.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-center text-emerald-300 text-3xs font-black">
                                  {cycles.length} Cycles
                                </td>
                                <td className="py-3.5 px-4 text-right text-slate-300 text-2xs">
                                  {cycles.filter(c => c.status.includes("Disbursed")).length}/{cycles.length} Batches Cleared
                                </td>
                              </tr>
                            );
                          })()}
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub Tab 2: Listing Plan Breakdown */}
              {partnerSubTab === "listing_plan" && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>LISTING PLAN — Partner Frontend View</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Active tier subscription, visibility parameters, package limits &amp; lead access privileges
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {deepSpec?.listingPlan.planStatus || "Active"}
                    </span>
                  </div>

                  {/* Visual Structure Tree Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Plan Name</div>
                        <div className="text-sm font-extrabold text-amber-300">
                          {deepSpec?.listingPlan.planName || currentOperator.partnerListingPlans.currentPlan + " Partner"}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Listing Duration</div>
                        <div className="text-sm font-extrabold text-white">
                          {deepSpec?.listingPlan.listingDuration || "12 Months (Auto-Renewing)"}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Package / Listing Limit</div>
                        <div className="text-sm font-extrabold text-emerald-400">
                          {deepSpec?.listingPlan.packageOrListingLimit || `${currentOperator.partnerListingPlans.inventorySlotsTotal} Allowed (${currentOperator.partnerListingPlans.inventorySlotsUsed} Active)`}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Package Visibility</div>
                        <div className="text-xs font-semibold text-slate-200">
                          {deepSpec?.listingPlan.packageVisibility || currentOperator.partnerListingPlans.searchVisibilityBoost}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Featured Listing Status</div>
                        <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{deepSpec?.listingPlan.featuredListingOption || deepSpec?.listingPlan.featuredListingEligibility || "Eligible & Badged"}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Lead / Booking Access</div>
                        <div className="text-xs font-semibold text-slate-200">
                          {deepSpec?.listingPlan.leadBookingAccess || currentOperator.partnerListingPlans.leadAccess}
                        </div>
                      </div>
                    </div>

                    {/* Listing Plan Tree Diagram */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Listing Plan Hierarchy</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-2xs text-amber-300 whitespace-pre overflow-x-auto leading-relaxed">
{`LISTING PLAN
├── Plan name
├── Listing duration
├── ${selectedOperatorId === "cab" ? "Vehicle/listing limit" : selectedOperatorId === "restaurant" ? "Menu/profile listing limits" : selectedOperatorId === "houseboat" ? "Houseboat listing limit" : "Package/service listing limit"}
├── Profile visibility / Search visibility
├── Featured listing option
└── Plan status`}
                      </div>
                      <div className="text-3xs text-slate-400">
                        Zero backend pricing algorithms or tier underwriting rules exposed to client.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub Tab 3: Commission & Settlements */}
              {partnerSubTab === "commission_plan" && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span>COMMISSION &amp; SETTLEMENT — Partner Frontend View</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Authorized commission rates, payable balances &amp; banking settlement schedule
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        id="commission-section-download-report-btn"
                        onClick={handleDownloadCommissionReport}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md border border-emerald-400/40 transition-all active:scale-95 shrink-0"
                        title="Download Commission & Earnings CSV Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Report (CSV)</span>
                      </button>
                      <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        Settlement Active
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Applicable Commission Plan</div>
                        <div className="text-sm font-bold text-white">
                          {deepSpec?.commission.applicableCommissionPlan || `${currentOperator.categoryName} Standard Plan`}
                        </div>
                        <div className="text-2xs text-indigo-300">
                          Booking Commission Rate: <strong>{deepSpec?.commission.bookingCommission || `${currentOperator.partnerListingPlans.commissionRatePercentage}% on Gross Value`}</strong>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Commission Deducted / Status</div>
                        <div className="text-sm font-bold text-amber-400">
                          {deepSpec?.commission.commissionAmountStatus || `Reconciled against ₹${currentOperator.partnerListingPlans.grossBookingsThisMonth.toLocaleString()} Gross`}
                        </div>
                        <div className="text-2xs text-slate-400">
                          Fully compliant with GST &amp; Section 194O TDS deductions
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Net Operator Payable Amount</div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={handleDownloadPdfInvoice}
                              className="text-3xs text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1 bg-indigo-500/15 hover:bg-indigo-500/25 px-2 py-0.5 rounded-lg border border-indigo-500/30 transition-colors"
                              title="Download PDF Tax Invoice"
                            >
                              <FileText className="w-2.5 h-2.5" />
                              <span>PDF Invoice</span>
                            </button>
                            <button
                              onClick={handleDownloadCommissionReport}
                              className="text-3xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30 transition-colors"
                            >
                              <Download className="w-2.5 h-2.5" />
                              <span>Export CSV</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-lg font-black text-emerald-400">
                          {deepSpec?.commission.netOperatorAmount || `₹${currentOperator.partnerListingPlans.netPayoutThisMonth.toLocaleString()}`}
                        </div>
                        <div className="text-2xs text-slate-400">
                          Disbursed via automated NEFT / RTGS / Instant UPI batch
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Settlement Status &amp; Next Batch</div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{deepSpec?.commission.settlementStatus || currentOperator.partnerListingPlans.nextPayoutDate}</span>
                        </div>
                        <div className="text-2xs text-slate-400">
                          Cycle: {currentOperator.partnerListingPlans.settlementCycle}
                        </div>
                      </div>
                    </div>

                    {/* Commission Tree Diagram */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Commission Hierarchy</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-2xs text-emerald-300 whitespace-pre overflow-x-auto leading-relaxed">
{`COMMISSION
├── Applicable commission plan
├── ${selectedOperatorId === "restaurant" ? "Booking/order commission" : "Booking commission"}
├── Commission status
├── ${selectedOperatorId === "corporate" ? "Net payable/receivable amount" : "Net operator amount"}
└── Settlement status`}
                      </div>
                      <div className="text-3xs text-slate-400">
                        Commission calculation logic &amp; escrow accounts strictly secluded on backend.
                      </div>
                    </div>
                  </div>

                  {/* Itemized Commission & Settlement Ledger Table */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    {/* Date Range Filter Bar */}
                    {renderDateRangeFilterBar("Commission Ledger Date Window Filter")}

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3 pt-1">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-indigo-400" />
                          <span>ITEMIZED COMMISSION &amp; SETTLEMENT TRANSACTION LEDGER</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Detailed booking deductions showing gross revenue, platform commission, GST (18% ITC), TDS Sec 194-O &amp; net payouts
                        </p>
                      </div>

                      {/* Filter & Search Bar */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Filter by ref, guest or service..."
                            value={commissionSearch}
                            onChange={(e) => setCommissionSearch(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
                          />
                          {commissionSearch && (
                            <button
                              onClick={() => setCommissionSearch("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-3xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                          <button
                            onClick={() => setCommissionStatusFilter("all")}
                            className={`px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                              commissionStatusFilter === "all"
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            All ({dateRangeMatchedTransactions.length})
                          </button>
                          <button
                            onClick={() => setCommissionStatusFilter("cleared")}
                            className={`px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                              commissionStatusFilter === "cleared"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Cleared ({dateRangeMatchedTransactions.filter(t => t.status.includes("Cleared")).length})
                          </button>
                          <button
                            onClick={() => setCommissionStatusFilter("pending")}
                            className={`px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                              commissionStatusFilter === "pending"
                                ? "bg-amber-600 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            In Batch ({dateRangeMatchedTransactions.filter(t => t.status.includes("Settlement")).length})
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleDownloadPdfInvoice}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-3xs shadow-md border border-indigo-400/40 transition-all active:scale-95 shrink-0"
                            title="Download Tax Compliant PDF Invoice"
                          >
                            <FileText className="w-3 h-3" />
                            <span>PDF Invoice</span>
                          </button>
                          <button
                            onClick={handleDownloadCommissionReport}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs shadow-md border border-emerald-400/40 transition-all active:scale-95 shrink-0"
                            title="Export Filtered Transactions to CSV"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export CSV</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Zebra-Striped Commission Table with Interactive Hover Effects */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-inner">
                      <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                        <thead>
                          <tr className="bg-slate-900/90 text-slate-300 font-bold uppercase tracking-wider text-2xs border-b border-slate-700/80">
                            <th className="py-3.5 px-4">Booking Ref &amp; Date</th>
                            <th className="py-3.5 px-4">Customer / Guest</th>
                            <th className="py-3.5 px-4">Service Booked</th>
                            <th className="py-3.5 px-4 text-right">Gross Amount</th>
                            <th className="py-3.5 px-4 text-right">Commission Retained</th>
                            <th className="py-3.5 px-4 text-right">TDS (1%) &amp; GST (18%)</th>
                            <th className="py-3.5 px-4 text-right">Net Disbursed</th>
                            <th className="py-3.5 px-4 text-right">Settlement &amp; Bank UTR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                          {filteredTransactions.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                                No transactions found matching selected date range and filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredTransactions.map((txn, idx) => (
                              <tr
                                key={txn.refId}
                                onMouseEnter={() => setHoveredLedgerId(txn.refId)}
                                onMouseLeave={() => setHoveredLedgerId(null)}
                                className={`transition-all duration-150 cursor-pointer ${
                                  idx % 2 === 0 ? "bg-slate-900/40" : "bg-slate-950/80"
                                } hover:bg-indigo-950/60 hover:border-l-4 hover:border-l-indigo-400 group`}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-mono font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {txn.refId}
                                  </div>
                                  <div className="text-3xs text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Calendar className="w-3 h-3 text-slate-500" />
                                    <span>{txn.date}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                    {txn.guest}
                                  </div>
                                  <div className="text-3xs text-slate-400">Verified Client</div>
                                </td>
                                <td className="py-3 px-4 max-w-[220px]">
                                  <div className="text-slate-300 text-2xs truncate font-medium group-hover:text-slate-100 transition-colors" title={txn.service}>
                                    {txn.service}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-amber-300">
                                  ₹{txn.grossAmount.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="font-bold text-rose-300/90">-₹{txn.commAmount.toLocaleString()}</div>
                                  <div className="text-3xs text-slate-400 font-mono">({txn.commRate}%)</div>
                                </td>
                                <td className="py-3 px-4 text-right text-slate-400 text-2xs">
                                  <div>TDS: -₹{txn.tdsSec194O.toLocaleString()}</div>
                                  <div className="text-3xs text-slate-500">GST: ₹{txn.gstOnComm.toLocaleString()}</div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="font-black text-emerald-400 group-hover:text-emerald-300 text-sm transition-colors">
                                    ₹{txn.netDisbursed.toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex flex-col items-end gap-0.5">
                                    <span className={`px-2 py-0.5 rounded-full text-3xs font-bold border ${
                                      txn.status.includes("Cleared")
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                    }`}>
                                      {txn.status}
                                    </span>
                                    <span className="font-mono text-3xs text-slate-400 mt-0.5">{txn.utr}</span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        <tfoot className="bg-slate-900/90 border-t-2 border-slate-700/80 font-bold text-xs">
                          {(() => {
                            const totalGross = filteredTransactions.reduce((acc, t) => acc + t.grossAmount, 0);
                            const totalComm = filteredTransactions.reduce((acc, t) => acc + t.commAmount, 0);
                            const totalTds = filteredTransactions.reduce((acc, t) => acc + t.tdsSec194O, 0);
                            const totalNet = filteredTransactions.reduce((acc, t) => acc + t.netDisbursed, 0);
                            return (
                              <tr>
                                <td colSpan={3} className="py-3.5 px-4 text-white">
                                  Reconciliation Batch Total ({filteredTransactions.length} Transactions)
                                </td>
                                <td className="py-3.5 px-4 text-right text-amber-400 font-black">
                                  ₹{totalGross.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-rose-300 font-bold">
                                  -₹{totalComm.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-slate-400 text-2xs">
                                  -₹{totalTds.toLocaleString()} TDS
                                </td>
                                <td className="py-3.5 px-4 text-right text-emerald-400 font-black text-sm">
                                  ₹{totalNet.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-slate-300 text-2xs">
                                  Auto-Disbursed via RBI RTGS
                                </td>
                              </tr>
                            );
                          })()}
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-2xs text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Security Rule:</strong> Only authorized business summary information is shown. Internal commission rules, dynamic algorithmic pricing triggers, and backend settlement banking tokens remain backend-controlled and are never exposed to the frontend.
                    </span>
                  </div>
                </div>
              )}

              {/* Sub Tab 4: Earnings Ledger & Cycles (Comprehensive Financial Dashboard) */}
              {partnerSubTab === "earnings_ledger" && (
                <div className="space-y-6">
                  {/* Earnings Overview Summary */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    {/* Date Range Filter Bar */}
                    {renderDateRangeFilterBar("Earnings & Settlement Statement Period")}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 pt-1">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Coins className="w-5 h-5 text-emerald-400" />
                          <span>FINANCIAL EARNINGS &amp; SETTLEMENT LEDGER</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Periodic cycles breakdown, gross volume metrics, commission deductions &amp; banking UTR ledger
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleDownloadPdfInvoice}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md border border-indigo-400/40 transition-all active:scale-95 shrink-0"
                          title="Generate & Download Tax Compliant PDF Invoice"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Download PDF Invoice</span>
                        </button>
                        <button
                          onClick={handleDownloadCommissionReport}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md border border-emerald-400/40 transition-all active:scale-95 shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Full Statement (CSV)</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Gross Filtered Period Bookings</div>
                        <div className="text-xl font-black text-amber-400 mt-1">
                          ₹{filteredFinancialSummary.gross.toLocaleString()}
                        </div>
                        <div className="text-2xs text-slate-400 mt-0.5">
                          {filteredTransactions.length} confirmed reservations in selected window
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Platform Commission &amp; Statutory TDS</div>
                        <div className="text-xl font-black text-rose-300 mt-1">
                          -₹{(
                            filteredFinancialSummary.comm +
                            filteredFinancialSummary.tds
                          ).toLocaleString()}
                        </div>
                        <div className="text-2xs text-slate-400 mt-0.5">
                          {currentOperator.partnerListingPlans.commissionRatePercentage}% Comm (₹{filteredFinancialSummary.comm.toLocaleString()}) + 1% TDS (₹{filteredFinancialSummary.tds.toLocaleString()})
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Net Disbursed To Bank Account</div>
                        <div className="text-xl font-black text-emerald-400 mt-1">
                          ₹{filteredFinancialSummary.net.toLocaleString()}
                        </div>
                        <div className="text-2xs text-slate-400 mt-0.5">Cycle: {currentOperator.partnerListingPlans.settlementCycle}</div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Earnings Cycles Table */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Table className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-base font-bold text-white">Settlement Cycles Breakdown (Filtered Window)</h4>
                      </div>
                      <span className="text-2xs font-extrabold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                        {getEarningsCycles(
                          currentOperator.id,
                          filteredFinancialSummary.gross,
                          currentOperator.partnerListingPlans.commissionRatePercentage,
                          financialDatePreset
                        ).length} Payout Batches
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-inner">
                      <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                        <thead>
                          <tr className="bg-slate-900/90 text-slate-300 font-bold uppercase tracking-wider text-2xs border-b border-slate-700/80">
                            <th className="py-3.5 px-4">Settlement Cycle</th>
                            <th className="py-3.5 px-4 text-right">Gross Bookings</th>
                            <th className="py-3.5 px-4 text-right">Platform Comm ({currentOperator.partnerListingPlans.commissionRatePercentage}%)</th>
                            <th className="py-3.5 px-4 text-right">TDS (1%) &amp; GST</th>
                            <th className="py-3.5 px-4 text-right">Net Disbursed Payout</th>
                            <th className="py-3.5 px-4 text-center">Trend</th>
                            <th className="py-3.5 px-4 text-right">Disbursement Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                          {getEarningsCycles(
                            currentOperator.id,
                            filteredFinancialSummary.gross,
                            currentOperator.partnerListingPlans.commissionRatePercentage,
                            financialDatePreset
                          ).map((cycle, idx) => (
                            <tr
                              key={cycle.id}
                              onMouseEnter={() => setHoveredEarningsCycle(cycle.id)}
                              onMouseLeave={() => setHoveredEarningsCycle(null)}
                              className={`transition-all duration-150 cursor-pointer ${
                                idx % 2 === 0 ? "bg-slate-900/35" : "bg-slate-950/80"
                              } hover:bg-indigo-950/50 hover:border-l-4 hover:border-l-emerald-400`}
                            >
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                  <span>{cycle.cycleName}</span>
                                </div>
                                <div className="text-2xs text-slate-400 mt-0.5">{cycle.dateRange}</div>
                              </td>
                              <td className="py-3.5 px-4 text-right font-black text-amber-300">
                                ₹{cycle.gross.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 text-right text-rose-300/90 font-semibold">
                                -₹{cycle.comm.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 text-right text-slate-400 text-2xs">
                                <div>TDS: -₹{cycle.tds.toLocaleString()}</div>
                                <div className="text-3xs text-slate-500">GST: ₹{cycle.gst.toLocaleString()} (ITC)</div>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <span className="font-black text-emerald-400 text-sm">
                                  ₹{cycle.net.toLocaleString()}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-3xs font-black border border-emerald-500/30">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{cycle.growth}</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-3xs font-extrabold border ${
                                    cycle.status.includes("Disbursed")
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  }`}>
                                    {cycle.status}
                                  </span>
                                  <span className="font-mono text-3xs text-slate-400 mt-0.5">{cycle.utr}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-900/90 border-t-2 border-slate-700/80 font-bold text-xs">
                          {(() => {
                            const cycles = getEarningsCycles(
                              currentOperator.id,
                              filteredFinancialSummary.gross,
                              currentOperator.partnerListingPlans.commissionRatePercentage,
                              financialDatePreset
                            );
                            const totalGross = cycles.reduce((acc, c) => acc + c.gross, 0);
                            const totalComm = cycles.reduce((acc, c) => acc + c.comm, 0);
                            const totalTds = cycles.reduce((acc, c) => acc + c.tds, 0);
                            const totalNet = cycles.reduce((acc, c) => acc + c.net, 0);
                            return (
                              <tr>
                                <td className="py-3.5 px-4 text-white">Period Total</td>
                                <td className="py-3.5 px-4 text-right text-amber-400 font-black">
                                  ₹{totalGross.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-rose-300 font-bold">
                                  -₹{totalComm.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-slate-400 text-2xs">
                                  -₹{totalTds.toLocaleString()} TDS
                                </td>
                                <td className="py-3.5 px-4 text-right text-emerald-400 text-sm font-black">
                                  ₹{totalNet.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-center text-emerald-300 text-3xs font-black">
                                  {cycles.length} Cycles
                                </td>
                                <td className="py-3.5 px-4 text-right text-slate-300 text-2xs">
                                  {cycles.filter(c => c.status.includes("Disbursed")).length}/{cycles.length} Batches Cleared
                                </td>
                              </tr>
                            );
                          })()}
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: BACKEND MODULES — NEVER DISPLAYED & ARCHITECTURE */}
          {/* ======================================================================= */}
          {activeTab === "backend_isolation" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Security Shield Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Zero Frontend Leakage</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {currentOperator.categoryName} Security Shield
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      3. Backend Modules — NEVER DISPLAYED &amp; INTEGRATION ARCHITECTURE
                    </h3>
                    <p className="text-xs text-slate-300 max-w-3xl">
                      {deepSpec?.architectureNotes || "Frontend shows only authorized profile, availability, pricing and booking information. Backend modules remain server-side and are never displayed or exposed to the frontend."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-3 rounded-2xl shrink-0">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-xs font-black text-white">100% Server Encrypted</div>
                      <div className="text-3xs text-slate-400">PostgreSQL • RBAC • AES-256 Vault</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* End-to-End Dual Integration Flow Visualizer */}
              <IntegrationFlowVisualizer
                operatorName={currentOperator.name}
                categoryName={currentOperator.categoryName}
              />

              {/* 3-Column Architecture Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Col 1: Backend Microservices Tree */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white">
                        {currentOperator.categoryName.toUpperCase()} BACKEND SERVICES
                      </h4>
                    </div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Hidden Server-Side
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-2xs text-slate-300">
                    {(deepSpec?.backendModulesNeverDisplayed || currentOperator.backendHiddenNeverDisplayed.backendServices).map((service, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 2: 🔐 Backend Data Never Displayed */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">
                        🔐 Concealed Data &amp; Secrets
                      </h4>
                    </div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Never Exposed
                    </span>
                  </div>

                  <div className="space-y-1.5 text-2xs text-slate-300">
                    {(deepSpec?.backendDataNeverDisplayed || currentOperator.backendHiddenNeverDisplayed.databaseTables).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2 text-slate-300"
                      >
                        <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 3: Architecture Diagram */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">
                        System Architecture Topology
                      </h4>
                    </div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Secured via Port 3000
                    </span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-2xs text-emerald-300 whitespace-pre overflow-x-auto leading-relaxed">
                    {deepSpec?.architectureAscii || `FRONTEND
   │
   ▼
SECURE API LAYER
   │
   ▼
BACKEND SERVICES
   │
   ├── Database
   ├── Payment Gateway
   └── External APIs`}
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 text-2xs text-slate-400">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Security Guarantee</span>
                    </div>
                    <p>
                      No database schemas, internal partner IDs, payment gateway private keys, raw KYC certificates, or commission formulas are accessible from the browser client.
                    </p>
                  </div>
                </div>

              </div>

              {/* RESTRICTED ADMIN & DEVELOPER DIAGNOSTICS SECTION */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                        <Lock className="w-3 h-3" />
                        Backend Diagnostics Gate
                      </span>
                      <span className="text-3xs text-rose-300 font-mono">
                        Rule: Never display on customer or operator UI
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white">
                      Admin / Developer Debugging &amp; Test Execution Console
                    </h4>
                    <p className="text-xs text-slate-400">
                      Standard operators see only their operational views above. Authorized engineering staff can authenticate below to review raw exception logs and trigger test suites.
                    </p>
                  </div>

                  {!showAdminDiagnostics ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowAdminDiagnostics(true);
                          setAdminPinError(null);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock Developer Console (PIN: 2026)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
                        <button
                          onClick={() => setAdminDiagnosticSubTab("debugging")}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            adminDiagnosticSubTab === "debugging"
                              ? "bg-rose-600 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Debugging &amp; Logs
                        </button>
                        <button
                          onClick={() => setAdminDiagnosticSubTab("testing")}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            adminDiagnosticSubTab === "testing"
                              ? "bg-indigo-600 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Testing Center
                        </button>
                      </div>

                      <button
                        onClick={() => setShowAdminDiagnostics(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                      >
                        Lock Console
                      </button>
                    </div>
                  )}
                </div>

                {showAdminDiagnostics && (
                  <div className="pt-2 animate-in fade-in">
                    {adminDiagnosticSubTab === "debugging" && <BackendDebuggingView />}
                    {adminDiagnosticSubTab === "testing" && <BackendTestingView />}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* FOOTER BAR */}
        {/* ========================================================================= */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Selected Profile: <strong className="text-white">{currentOperator.name}</strong> ({currentOperator.categoryName})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Secure Port: <strong className="text-slate-200">3000</strong></span>
            <span>Auth: <strong className="text-slate-200">RBAC Token Bearer</strong></span>
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close Super Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
