import {
  BookingHierarchy,
  BookingItem,
  BookingItemType,
  PaymentTransaction,
  BookingStatus,
} from "../types/bookingHierarchy";
import { INITIAL_BOOKING_HIERARCHY_DATA } from "../data/bookingHierarchyData";

const STORAGE_KEY = "bharatyatra_booking_hierarchy_v1";

export class BookingHierarchyService {
  /**
   * Load all bookings with hierarchical items and payment transactions
   */
  public static getBookings(): BookingHierarchy[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKING_HIERARCHY_DATA));
        return INITIAL_BOOKING_HIERARCHY_DATA;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading bookings from localStorage:", e);
      return INITIAL_BOOKING_HIERARCHY_DATA;
    }
  }

  /**
   * Get single booking by booking_id
   */
  public static getBookingById(bookingId: string): BookingHierarchy | null {
    const bookings = this.getBookings();
    return bookings.find((b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()) || null;
  }

  /**
   * Save bookings list to local storage and broadcast change
   */
  private static saveBookings(bookings: BookingHierarchy[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      window.dispatchEvent(
        new CustomEvent("bharatyatra_bookings_updated", {
          detail: { timestamp: new Date().toISOString(), count: bookings.length },
        })
      );
    } catch (e) {
      console.error("Error saving bookings to localStorage:", e);
    }
  }

  /**
   * Create a new booking
   */
  public static createBooking(
    booking: Omit<BookingHierarchy, "createdAt" | "updatedAt">
  ): BookingHierarchy {
    const bookings = this.getBookings();
    const now = new Date().toISOString();
    const newBooking: BookingHierarchy = {
      ...booking,
      createdAt: now,
      updatedAt: now,
    };

    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  }

  /**
   * Add an item (Flight, Train, Bus, Hotel, Resort, Lodge, Tour, Pilgrimage, Cab) to a booking
   */
  public static addItemToBooking(
    bookingId: string,
    item: Omit<BookingItem, "id" | "bookingId" | "createdAt">
  ): BookingHierarchy | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.bookingId === bookingId);
    if (index === -1) return null;

    const targetBooking = { ...bookings[index] };
    const newItem: BookingItem = {
      ...item,
      id: `item-${item.itemType.toLowerCase().slice(0, 3)}-${Date.now().toString(36)}`,
      bookingId: bookingId,
      createdAt: new Date().toISOString(),
    };

    targetBooking.bookingsItems = [...targetBooking.bookingsItems, newItem];
    // Recompute total amount
    const itemsTotal = targetBooking.bookingsItems.reduce((sum, it) => sum + it.amount, 0);
    targetBooking.totalAmount = itemsTotal;
    targetBooking.taxAmount = Math.round(itemsTotal * 0.05);
    targetBooking.netPayableAmount = itemsTotal + targetBooking.taxAmount - targetBooking.discountAmount;
    targetBooking.updatedAt = new Date().toISOString();

    bookings[index] = targetBooking;
    this.saveBookings(bookings);
    return targetBooking;
  }

  /**
   * Remove an item from a booking
   */
  public static removeItemFromBooking(
    bookingId: string,
    itemId: string
  ): BookingHierarchy | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.bookingId === bookingId);
    if (index === -1) return null;

    const targetBooking = { ...bookings[index] };
    targetBooking.bookingsItems = targetBooking.bookingsItems.filter((i) => i.id !== itemId);

    const itemsTotal = targetBooking.bookingsItems.reduce((sum, it) => sum + it.amount, 0);
    targetBooking.totalAmount = itemsTotal;
    targetBooking.taxAmount = Math.round(itemsTotal * 0.05);
    targetBooking.netPayableAmount = Math.max(0, itemsTotal + targetBooking.taxAmount - targetBooking.discountAmount);
    targetBooking.updatedAt = new Date().toISOString();

    bookings[index] = targetBooking;
    this.saveBookings(bookings);
    return targetBooking;
  }

  /**
   * Record a payment transaction for a booking
   */
  public static recordPaymentTransaction(
    bookingId: string,
    transaction: Omit<PaymentTransaction, "bookingId" | "createdAt">
  ): BookingHierarchy | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.bookingId === bookingId);
    if (index === -1) return null;

    const targetBooking = { ...bookings[index] };
    const newTx: PaymentTransaction = {
      ...transaction,
      bookingId: bookingId,
      createdAt: new Date().toISOString(),
    };

    targetBooking.payments = {
      ...targetBooking.payments,
      paymentTransactions: [...targetBooking.payments.paymentTransactions, newTx],
    };

    // Calculate paid amount
    const capturedPaid = targetBooking.payments.paymentTransactions
      .filter((t) => t.status === "captured")
      .reduce((sum, t) => sum + t.amount, 0);

    targetBooking.payments.totalPaidAmount = capturedPaid;
    targetBooking.payments.balanceDue = Math.max(0, targetBooking.netPayableAmount - capturedPaid);

    if (capturedPaid >= targetBooking.netPayableAmount) {
      targetBooking.payments.paymentStatus = "paid";
      targetBooking.status = "confirmed";
    } else if (capturedPaid > 0) {
      targetBooking.payments.paymentStatus = "partial";
    }

    targetBooking.updatedAt = new Date().toISOString();
    bookings[index] = targetBooking;
    this.saveBookings(bookings);
    return targetBooking;
  }

  /**
   * Update booking status
   */
  public static updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): BookingHierarchy | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.bookingId === bookingId);
    if (index === -1) return null;

    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();
    this.saveBookings(bookings);
    return bookings[index];
  }

  /**
   * Filter bookings by item type (Flight, Train, Bus, Hotel, Resort, Lodge, Tour, Pilgrimage, Cab)
   */
  public static getBookingsByItemType(itemType: BookingItemType): BookingHierarchy[] {
    const bookings = this.getBookings();
    return bookings.filter((b) =>
      b.bookingsItems.some((item) => item.itemType.toLowerCase() === itemType.toLowerCase())
    );
  }

  /**
   * Reset to initial dataset
   */
  public static resetToDefault(): BookingHierarchy[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKING_HIERARCHY_DATA));
    this.saveBookings(INITIAL_BOOKING_HIERARCHY_DATA);
    return INITIAL_BOOKING_HIERARCHY_DATA;
  }
}
