import React, { useState } from "react";
import {
  Building2,
  Bed,
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
  QrCode,
  Star,
  MapPin,
  Check,
  ShieldCheck,
} from "lucide-react";
import {
  HotelPropertyEntity,
  HotelRoomEntity,
  HotelBookingEntity,
} from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

interface Hotel3TierRelationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedHotelId?: string;
  currentUserId?: string;
}

export const Hotel3TierRelationalModal: React.FC<Hotel3TierRelationalModalProps> = ({
  isOpen,
  onClose,
  preSelectedHotelId,
  currentUserId = "usr-auth-rajesh-771",
}) => {
  const [properties, setProperties] = useState<HotelPropertyEntity[]>(
    travelVerticalsService.getHotelProperties()
  );
  const [rooms, setRooms] = useState<HotelRoomEntity[]>(
    travelVerticalsService.getHotelRooms()
  );
  const [bookings, setBookings] = useState<HotelBookingEntity[]>(
    travelVerticalsService.getHotelBookings()
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    preSelectedHotelId || (properties[0]?.id ?? "")
  );

  const selectedProperty =
    properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const hotelRooms = rooms.filter((r) => r.hotel_id === selectedProperty?.id);
  const hotelBookings = bookings.filter((b) => b.hotel_id === selectedProperty?.id);

  // New Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [chosenRoomId, setChosenRoomId] = useState<string>(hotelRooms[0]?.id || "");
  const [checkInDate, setCheckInDate] = useState("2026-09-22");
  const [checkOutDate, setCheckOutDate] = useState("2026-09-24");
  const [nightsCount, setNightsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [customerName, setCustomerName] = useState("Rajesh K. Mehta");
  const [customerEmail, setCustomerEmail] = useState("rajesh.mehta@mumbai-tech.in");
  const [customerPhone, setCustomerPhone] = useState("+91 98200 44912");
  const [bookingSuccess, setBookingSuccess] = useState<HotelBookingEntity | null>(null);

  if (!isOpen) return null;

  const currentRoom = hotelRooms.find((r) => r.id === chosenRoomId) || hotelRooms[0];
  const roomCharges = (currentRoom?.base_price_per_night || 6500) * nightsCount * roomsCount;
  const mealCharges = currentRoom?.breakfast_addon_price ? currentRoom.breakfast_addon_price * nightsCount * roomsCount : 0;
  const gstAmount = Math.round((roomCharges + mealCharges) * ((currentRoom?.tax_rate_percent || 12) / 100));
  const totalAmount = roomCharges + mealCharges + gstAmount;

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !currentRoom) return;

    const newBooking = travelVerticalsService.createHotelBooking({
      hotel_id: selectedProperty.id,
      room_id: currentRoom.id,
      customer_id: currentUserId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      nights_count: nightsCount,
      rooms_booked_count: roomsCount,
      adults_count: 2,
      children_count: 0,
      guest_manifest: [
        {
          full_name: customerName,
          age: 46,
          id_type: "Aadhaar",
          id_number: "XXXX-XXXX-4912",
        },
      ],
      room_charges: roomCharges,
      meal_charges: mealCharges,
      gst_amount: gstAmount,
      total_amount: totalAmount,
    });

    setBookings(travelVerticalsService.getHotelBookings());
    setBookingSuccess(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Hotels 3-Tier Relational Hierarchy
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  HOTELS ➔ HOTELS_ROOMS ➔ HOTELS_BOOKINGS
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Hotel Properties, Room Inventories &amp; Booking Manifests
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

        {/* Relational Schema Visualizer */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-indigo-400 font-bold">3-TIER DDL:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            HOTELS (hotels.id)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-200 border border-indigo-500/30">
            HOTELS_ROOMS (hotels_rooms.hotel_id)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-200 border border-emerald-500/30">
            HOTELS_BOOKINGS (hotel_id, room_id)
          </span>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TIER 1: Select Hotel Property */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                Tier 1: Select Hotel Property (HOTELS)
              </span>
              <span className="text-xs text-slate-500 font-mono">PK: hotels.id</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {properties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPropertyId(p.id);
                    setChosenRoomId(rooms.find((r) => r.hotel_id === p.id)?.id || "");
                    setBookingSuccess(null);
                    setIsBookingOpen(false);
                  }}
                  className={`p-4 rounded-2xl text-left border transition flex items-start justify-between gap-3 ${
                    selectedProperty?.id === p.id
                      ? "bg-indigo-950/40 border-indigo-500/70 ring-1 ring-indigo-500/50"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-indigo-300">
                        {p.id}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {p.rating_score}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{p.property_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {p.city}, {p.state}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Inventory</span>
                    <span className="text-xs font-bold text-white font-mono">{p.total_rooms_count} Rooms</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TIER 2: Room Types Inventory & Pricing */}
          {selectedProperty && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-indigo-400" />
                  Tier 2: Room Types &amp; Inventory (HOTELS_ROOMS where hotel_id = &apos;{selectedProperty.id}&apos;)
                </span>
                <button
                  onClick={() => {
                    setIsBookingOpen(!isBookingOpen);
                    setBookingSuccess(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-indigo-500 text-white hover:bg-indigo-400 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBookingOpen ? "Close Booking" : "Create Hotel Booking (Tier 3)"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotelRooms.map((rm) => (
                  <div
                    key={rm.id}
                    onClick={() => setChosenRoomId(rm.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      chosenRoomId === rm.id
                        ? "bg-indigo-950/30 border-indigo-500/70 ring-1 ring-indigo-500/40"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">
                          {rm.room_code}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                          {rm.status}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        ₹{rm.base_price_per_night.toLocaleString("en-IN")}/night
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{rm.room_name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {rm.bedding_setup} • {rm.room_size_sqm} m² • Max {rm.max_occupancy_adults} Adults
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900 text-xs">
                      <span className="text-slate-500 font-mono">
                        Available: {rm.available_inventory} of {rm.total_inventory}
                      </span>
                      <span className="text-indigo-400 font-medium">GST: {rm.tax_rate_percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Creation Form */}
          {isBookingOpen && (
            <form
              onSubmit={handleConfirmReservation}
              className="p-5 rounded-3xl bg-slate-950 border border-indigo-500/40 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Tier 3 Insertion: HOTELS_BOOKINGS (hotel_id, room_id)
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    hotel_id: {selectedProperty?.id} | room_id: {chosenRoomId}
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Customer: {currentUserId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Rooms Count</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-400 space-y-0.5">
                  <p>Room Charges: ₹{roomCharges.toLocaleString("en-IN")}</p>
                  <p>GST Amount ({currentRoom?.tax_rate_percent || 12}%): ₹{gstAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Invoiced</span>
                  <span className="text-base font-black text-indigo-400">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

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
                  className="px-6 py-2.5 rounded-xl font-black text-xs bg-indigo-500 text-white hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Insert HOTELS_BOOKINGS Record</span>
                </button>
              </div>
            </form>
          )}

          {/* Booking Confirmation Box */}
          {bookingSuccess && (
            <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>HOTELS_BOOKINGS Record Generated!</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white text-slate-950">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
              <div className="text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Booking Reference</span>
                  <span className="text-indigo-300 font-bold">{bookingSuccess.booking_reference}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">QR Pass</span>
                  <span className="text-slate-300 font-bold truncate block">{bookingSuccess.qr_pass_code}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Check-in</span>
                  <span className="text-slate-300 font-bold">{bookingSuccess.check_in_date}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Amount</span>
                  <span className="text-emerald-400 font-bold">₹{bookingSuccess.pricing_breakdown.total_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* TIER 3: Existing Hotel Bookings (HOTELS_BOOKINGS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Tier 3: HOTELS_BOOKINGS Table ({hotelBookings.length} records)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                SELECT * FROM hotels_bookings WHERE hotel_id = &apos;{selectedProperty.id}&apos;
              </span>
            </div>

            {hotelBookings.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                No booking records found for this property yet.
              </div>
            ) : (
              <div className="space-y-2">
                {hotelBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-400">{b.booking_reference}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                          {b.booking_status}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          room_id: {b.room_id}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium">
                        {b.customer_name} ({b.customer_email}) • {b.room_name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Check-in: {b.check_in_date} ➔ Check-out: {b.check_out_date} ({b.nights_count} nights)
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 block">Total Invoiced</span>
                      <span className="font-black text-indigo-400 text-sm">
                        ₹{b.pricing_breakdown.total_amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">{b.tax_invoice_number}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
