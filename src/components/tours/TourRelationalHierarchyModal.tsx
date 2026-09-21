import React, { useState } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  FileText,
  X,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Database,
  Building2,
  Check,
} from "lucide-react";
import { TourEntity, TourBookingEntity } from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

interface TourRelationalHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedTourId?: string;
  currentUserId?: string;
}

export const TourRelationalHierarchyModal: React.FC<TourRelationalHierarchyModalProps> = ({
  isOpen,
  onClose,
  preSelectedTourId,
  currentUserId = "usr-auth-rajesh-771",
}) => {
  const [tours, setTours] = useState<TourEntity[]>(travelVerticalsService.getTours());
  const [bookings, setBookings] = useState<TourBookingEntity[]>(travelVerticalsService.getTourBookings());
  const [selectedTourId, setSelectedTourId] = useState<string>(
    preSelectedTourId || (tours[0]?.id ?? "")
  );

  const selectedTour = tours.find((t) => t.id === selectedTourId) || tours[0];
  const tourBookings = bookings.filter((b) => b.tour_id === selectedTour?.id);

  // Booking Flow State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [travelDate, setTravelDate] = useState(selectedTour?.availability.departure_dates[0] || "2026-09-24");
  const [passengers, setPassengers] = useState<TourBookingEntity["passengers"]>([
    {
      full_name: "Rajesh K. Mehta",
      age: 46,
      gender: "Male",
      id_type: "Aadhaar",
      id_number: "XXXX-XXXX-4912",
      passenger_type: "Adult",
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("Direct UPI");
  const [bookingSuccess, setBookingSuccess] = useState<TourBookingEntity | null>(null);

  if (!isOpen) return null;

  const adultCount = passengers.filter((p) => p.passenger_type === "Adult").length;
  const childCount = passengers.filter((p) => p.passenger_type === "Child").length;
  const basePrice =
    (selectedTour?.pricing.base_price_adult || 0) * adultCount +
    (selectedTour?.pricing.base_price_child || 0) * childCount;
  const gstAmount = Math.round(basePrice * ((selectedTour?.pricing.gst_percent || 5) / 100));
  const totalAmount = basePrice + gstAmount;

  const handleAddPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      {
        full_name: "",
        age: 30,
        gender: "Female",
        id_type: "Aadhaar",
        id_number: "",
        passenger_type: "Adult",
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index: number, field: string, value: any) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;

    const newBooking = travelVerticalsService.createTourBooking({
      tour_id: selectedTour.id,
      customer_id: currentUserId,
      travel_date: travelDate,
      passengers,
      total_amount: totalAmount,
      payment_method: paymentMethod,
    });

    setBookings(travelVerticalsService.getTourBookings());
    setBookingSuccess(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Relational Vertical: tour ➔ tour_bookings
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  FK: tour_bookings.tour_id ➔ tour.id
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Holiday Tours &amp; Guided Circuit Expeditions
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

        {/* Relational Schema Bar */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-amber-400 font-bold">SCHEMA:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            tour (id, tour_code, title, destination, itinerary, pricing, availability, operator)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="px-2 py-0.5 rounded bg-amber-950/50 text-amber-200 border border-amber-500/30">
            tour_bookings (booking_ref, tour_id ➔ tour.id, customer_id ➔ auth.users.id, travel_date, passengers, payment_status)
          </span>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tour Selection Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tours.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTourId(t.id);
                  setTravelDate(t.availability.departure_dates[0] || "");
                  setBookingSuccess(null);
                  setIsBookingOpen(false);
                }}
                className={`p-4 rounded-2xl text-left border transition flex items-start justify-between gap-3 ${
                  selectedTour?.id === t.id
                    ? "bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-amber-400">
                      {t.tour_code}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {t.duration_days}D/{t.duration_nights}N
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{t.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {t.destination}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">From</span>
                  <span className="text-sm font-black text-amber-400">
                    ₹{t.pricing.base_price_adult.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 block">/adult</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Tour Details Card */}
          {selectedTour && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
              {/* Tour Overview Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedTour.circuit_category}
                    </span>
                    <span className="text-xs text-slate-400">
                      ID: <span className="font-mono text-slate-300">{selectedTour.id}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedTour.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {selectedTour.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {selectedTour.duration_days} Days / {selectedTour.duration_nights} Nights
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Users className="w-3.5 h-3.5" />
                      {selectedTour.availability.available_seats} of {selectedTour.availability.seats_per_batch} seats left
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsBookingOpen(!isBookingOpen);
                      setBookingSuccess(null);
                    }}
                    className="px-5 py-2.5 rounded-xl font-black text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isBookingOpen ? "Close Booking Form" : "Book This Tour (Create Booking)"}</span>
                  </button>
                </div>
              </div>

              {/* Operator & Pricing Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Operator Entity */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      Tour Operator
                    </span>
                    {selectedTour.operator.verified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Govt Certified
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm">{selectedTour.operator.name}</h4>
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p>Reg No: <span className="font-mono text-slate-300">{selectedTour.operator.registrationNumber}</span></p>
                    <p>Location: {selectedTour.operator.city} • Rating: ⭐ {selectedTour.operator.rating} ({selectedTour.operator.reviewsCount} reviews)</p>
                    <p>Contact: {selectedTour.operator.phone} • {selectedTour.operator.email}</p>
                  </div>
                </div>

                {/* Pricing & Availability */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    Pricing &amp; Departure Dates
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Adult Fare</span>
                      <span className="font-bold text-amber-300 text-sm">
                        ₹{selectedTour.pricing.base_price_adult.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-500 block">+ {selectedTour.pricing.gst_percent}% GST</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Child Fare</span>
                      <span className="font-bold text-amber-300 text-sm">
                        ₹{selectedTour.pricing.base_price_child.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Age 5-11 yrs</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 flex-wrap">
                    <span className="text-slate-500">Upcoming Batches:</span>
                    {selectedTour.availability.departure_dates.map((d) => (
                      <span key={d} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day-by-Day Itinerary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Day-by-Day Itinerary ({selectedTour.itinerary.length} Days)
                </h4>
                <div className="space-y-2">
                  {selectedTour.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0">
                          {day.day}
                        </span>
                        <div>
                          <h5 className="font-bold text-white text-sm">{day.title}</h5>
                          <p className="text-slate-400 mt-0.5">{day.description}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {day.sightseeingPoints.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 text-[10px]">
                                • {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 md:border-l md:border-slate-800 md:pl-4">
                        <span className="text-[10px] text-slate-500 block">Night Stay</span>
                        <span className="font-medium text-slate-300">{day.stayLocation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Booking Flow Modal Container */}
              {isBookingOpen && (
                <form
                  onSubmit={handleConfirmBooking}
                  className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          New Tour Booking Record (tour_bookings insertion)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Customer Auth ID: <span className="font-mono text-amber-400">{currentUserId}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      FK: {selectedTour.id}
                    </span>
                  </div>

                  {/* Travel Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Select Departure Date (travel_date)
                      </label>
                      <select
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                        required
                      >
                        {selectedTour.availability.departure_dates.map((d) => (
                          <option key={d} value={d}>
                            {d} (Confirmed Departure)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Payment Method (payment_method)
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                      >
                        <option value="Direct UPI">Direct UPI / AutoPay (Instant Confirmation)</option>
                        <option value="HDFC Corporate NetBanking">HDFC Corporate NetBanking</option>
                        <option value="ICICI Visa Credit Card">ICICI Visa / Mastercard</option>
                      </select>
                    </div>
                  </div>

                  {/* Passengers Manifest */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        Passenger Details (passengers JSON array)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddPassenger}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-amber-400 hover:bg-slate-700 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Passenger
                      </button>
                    </div>

                    {passengers.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-xs"
                      >
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Full Legal Name"
                            value={p.full_name}
                            onChange={(e) => handlePassengerChange(idx, "full_name", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Age"
                            min="1"
                            max="99"
                            value={p.age}
                            onChange={(e) => handlePassengerChange(idx, "age", Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                            required
                          />
                        </div>
                        <div>
                          <select
                            value={p.passenger_type}
                            onChange={(e) => handlePassengerChange(idx, "passenger_type", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                          >
                            <option value="Adult">Adult (₹{selectedTour.pricing.base_price_adult})</option>
                            <option value="Child">Child (₹{selectedTour.pricing.base_price_child})</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Aadhaar / ID No"
                            value={p.id_number}
                            onChange={(e) => handlePassengerChange(idx, "id_number", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                          />
                          {passengers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePassenger(idx)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="text-slate-400 space-y-0.5">
                      <p>
                        Base: {adultCount} Adults × ₹{selectedTour.pricing.base_price_adult} + {childCount} Children × ₹{selectedTour.pricing.base_price_child} = ₹{basePrice.toLocaleString("en-IN")}
                      </p>
                      <p>GST (5%): ₹{gstAmount.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Amount</span>
                      <span className="text-lg font-black text-amber-400">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-black text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/30 flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Authorize Payment &amp; Create Booking</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Booking Confirmation Alert */}
              {bookingSuccess && (
                <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Tour Booking Confirmed &amp; Invoiced!</span>
                  </div>
                  <div className="text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Booking Reference</span>
                      <span className="text-emerald-400 font-bold">{bookingSuccess.booking_reference}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Invoice Number</span>
                      <span className="text-slate-300 font-bold">{bookingSuccess.invoice_number}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Travel Date</span>
                      <span className="text-slate-300 font-bold">{bookingSuccess.travel_date}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Total Amount</span>
                      <span className="text-amber-400 font-bold">₹{bookingSuccess.total_amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tour Bookings (1-to-Many Relational Listing) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    Existing Bookings for this Tour ({tourBookings.length} records)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    SELECT * FROM tour_bookings WHERE tour_id = &apos;{selectedTour.id}&apos;
                  </span>
                </div>

                {tourBookings.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                    No bookings yet for this tour. Click &apos;Book This Tour&apos; above to generate the first relational record.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tourBookings.map((b) => (
                      <div
                        key={b.booking_reference}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">
                              {b.booking_reference}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {b.booking_status}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                              {b.payment_status}
                            </span>
                          </div>
                          <p className="text-slate-400">
                            Customer: <span className="font-mono text-slate-300">{b.customer_id}</span> • Departure: <span className="text-white font-medium">{b.travel_date}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Passengers: {b.passengers.map((p) => `${p.full_name} (${p.age})`).join(", ")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-500 block">Total Invoiced</span>
                          <span className="font-black text-amber-400 text-sm">
                            ₹{b.total_amount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-mono">{b.invoice_number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
