import React, { useState } from "react";
import {
  Palmtree,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  FileText,
  X,
  Plus,
  ArrowRight,
  Database,
  Building,
  Bed,
  Check,
  Star,
} from "lucide-react";
import { ResortEntity, ResortBookingEntity } from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

interface ResortRelationalHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedResortId?: string;
  currentUserId?: string;
}

export const ResortRelationalHierarchyModal: React.FC<ResortRelationalHierarchyModalProps> = ({
  isOpen,
  onClose,
  preSelectedResortId,
  currentUserId = "usr-auth-vikram-991",
}) => {
  const [resorts, setResorts] = useState<ResortEntity[]>(travelVerticalsService.getResorts());
  const [bookings, setBookings] = useState<ResortBookingEntity[]>(travelVerticalsService.getResortBookings());
  const [selectedResortId, setSelectedResortId] = useState<string>(
    preSelectedResortId || (resorts[0]?.resort_id ?? "")
  );

  const selectedResort = resorts.find((r) => r.resort_id === selectedResortId) || resorts[0];
  const resortBookings = bookings.filter((b) => b.resort_id === selectedResort?.resort_id);

  // Booking Flow State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(selectedResort?.rooms[0]?.room_id || "");
  const [checkInDate, setCheckInDate] = useState("2026-09-22");
  const [checkOutDate, setCheckOutDate] = useState("2026-09-24");
  const [nightsCount, setNightsCount] = useState(2);
  const [unitsBooked, setUnitsBooked] = useState(1);
  const [customerName, setCustomerName] = useState("Vikramaditya Oberoi");
  const [customerEmail, setCustomerEmail] = useState("v.oberoi@techcap.in");
  const [customerPhone, setCustomerPhone] = useState("+91 98112 55901");
  const [bookingSuccess, setBookingSuccess] = useState<ResortBookingEntity | null>(null);

  if (!isOpen) return null;

  const chosenRoom = selectedResort?.rooms.find((r) => r.room_id === selectedRoomId) || selectedResort?.rooms[0];
  const baseFare = (chosenRoom?.base_price_per_night || 24000) * nightsCount * unitsBooked;
  const taxes = Math.round(baseFare * 0.18); // 18% luxury GST
  const totalAmount = baseFare + taxes;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResort || !chosenRoom) return;

    const newBooking = travelVerticalsService.createResortBooking({
      resort_id: selectedResort.resort_id,
      customer_id: currentUserId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      guest_details: [
        {
          full_name: customerName,
          age: 42,
          gender: "Male",
          id_type: "Passport",
          id_number: "Z-9912041",
          is_primary: true,
        },
      ],
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      nights_count: nightsCount,
      room_id: chosenRoom.room_id,
      room_name: chosenRoom.room_name,
      units_booked: unitsBooked,
      base_fare: baseFare,
      taxes,
      total_amount: totalAmount,
    });

    setBookings(travelVerticalsService.getResortBookings());
    setBookingSuccess(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Palmtree className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Relational Vertical: resort ➔ resort_bookings
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  FK: resort_bookings.resort ➔ resort.Resort ID
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Luxury Resorts, Lake Sanctuaries &amp; Retreats
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
          <span className="text-cyan-400 font-bold">SCHEMA:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            resort (Resort ID, Resort Name, Location, Rooms, Amenities, Images, Pricing, Status)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-200 border border-cyan-500/30">
            resort_bookings (Booking Ref, Resort, Customer, Guest Details, Check-in/Out, Room, Amount, Payment Status)
          </span>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Resort Selection Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resorts.map((r) => (
              <button
                key={r.resort_id}
                onClick={() => {
                  setSelectedResortId(r.resort_id);
                  setSelectedRoomId(r.rooms[0]?.room_id || "");
                  setBookingSuccess(null);
                  setIsBookingOpen(false);
                }}
                className={`p-4 rounded-2xl text-left border transition flex items-start justify-between gap-3 ${
                  selectedResort?.resort_id === r.resort_id
                    ? "bg-cyan-950/30 border-cyan-500/60 ring-1 ring-cyan-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400">
                      {r.resort_id}
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {r.user_rating} ({r.reviews_count} reviews)
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{r.resort_name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {r.location.destination}, {r.location.state}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">From</span>
                  <span className="text-sm font-black text-cyan-400">
                    ₹{r.pricing.starting_price_per_night.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 block">/night</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Resort Details */}
          {selectedResort && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Status: {selectedResort.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Resort ID: {selectedResort.resort_id}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedResort.resort_name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedResort.location.address} • Nearest: {selectedResort.location.nearest_airport}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsBookingOpen(!isBookingOpen);
                    setBookingSuccess(null);
                  }}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBookingOpen ? "Close Booking Drawer" : "Book A Room in this Resort"}</span>
                </button>
              </div>

              {/* Rooms & Amenities Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rooms Available */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-cyan-400" />
                    Rooms ({selectedResort.rooms.length} room types)
                  </span>
                  <div className="space-y-2">
                    {selectedResort.rooms.map((rm) => (
                      <div
                        key={rm.room_id}
                        className={`p-3 rounded-xl border text-xs transition ${
                          selectedRoomId === rm.room_id
                            ? "bg-cyan-950/40 border-cyan-500/60"
                            : "bg-slate-950 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-bold text-white">{rm.room_name}</h5>
                          <span className="font-mono font-bold text-cyan-300">
                            ₹{rm.base_price_per_night.toLocaleString("en-IN")}/nt
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {rm.size_sq_ft} sq.ft • {rm.bed_type} • Up to {rm.max_adults} adults
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {rm.amenities.map((a) => (
                            <span key={a} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities List */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Resort Amenities &amp; Experiences
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedResort.amenities.map((amenity, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Drawer Form */}
              {isBookingOpen && (
                <form
                  onSubmit={handleConfirmBooking}
                  className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          New Resort Booking (resort_bookings insert)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Customer: <span className="font-mono text-cyan-400">{currentUserId}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      Resort: {selectedResort.resort_id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Select Room</label>
                      <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        {selectedResort.rooms.map((rm) => (
                          <option key={rm.room_id} value={rm.room_id}>
                            {rm.room_name} (₹{rm.base_price_per_night}/nt)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      >
                      </input>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Check-out Date</label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      >
                      </input>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Primary Guest Full Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Price Calculation Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="text-slate-400 space-y-0.5">
                      <p>Room: {chosenRoom?.room_name} ({nightsCount} nights × {unitsBooked} unit)</p>
                      <p>Base: ₹{baseFare.toLocaleString("en-IN")} + GST (18%): ₹{taxes.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Invoiced</span>
                      <span className="text-lg font-black text-cyan-400">
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
                      className="px-6 py-2.5 rounded-xl font-black text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm Resort Booking</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Confirmation Alert */}
              {bookingSuccess && (
                <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Resort Booking Successfully Confirmed!</span>
                  </div>
                  <div className="text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Booking Reference</span>
                      <span className="text-cyan-400 font-bold">{bookingSuccess.booking_reference}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Invoice Number</span>
                      <span className="text-slate-300 font-bold">{bookingSuccess.invoice_number}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Check-in / Out</span>
                      <span className="text-slate-300 font-bold">{bookingSuccess.check_in_date}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Amount Invoiced</span>
                      <span className="text-cyan-400 font-bold">₹{bookingSuccess.amount.total_amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resort Bookings Relational Listing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    Relational Bookings (resort_bookings for {selectedResort.resort_id})
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    SELECT * FROM resort_bookings WHERE resort_id = &apos;{selectedResort.resort_id}&apos;
                  </span>
                </div>

                {resortBookings.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                    No bookings logged yet for this resort property.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resortBookings.map((b) => (
                      <div
                        key={b.booking_reference}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-cyan-400">
                              {b.booking_reference}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {b.booking_status}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                              {b.payment_status}
                            </span>
                          </div>
                          <p className="text-slate-300 font-medium">
                            {b.customer_name} ({b.customer_phone}) • Room: {b.room.room_name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Check-in: {b.check_in_date} ➔ Check-out: {b.check_out_date} ({b.nights_count} nights)
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-500 block">Total Amount</span>
                          <span className="font-black text-cyan-400 text-sm">
                            ₹{b.amount.total_amount.toLocaleString("en-IN")}
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
