import { Router, Request, Response } from "express";
import { INITIAL_BOOKING_HIERARCHY_DATA } from "../data/bookingHierarchyData";
import { BookingHierarchy, BookingItem, PaymentTransaction } from "../types/bookingHierarchy";

export const bookingsApiRouter = Router();

// In-memory cache synced with initial dataset
let memoryBookings: BookingHierarchy[] = [...INITIAL_BOOKING_HIERARCHY_DATA];

/**
 * GET /api/bookings
 * Returns all bookings with nested bookings_items and payments.payment_transactions
 */
bookingsApiRouter.get("/", (req: Request, res: Response) => {
  try {
    const { item_type, status, search } = req.query;
    let filtered = [...memoryBookings];

    if (item_type && typeof item_type === "string") {
      filtered = filtered.filter((b) =>
        b.bookingsItems.some(
          (item) => item.itemType.toLowerCase() === item_type.toLowerCase()
        )
      );
    }

    if (status && typeof status === "string") {
      filtered = filtered.filter(
        (b) => b.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(q) ||
          b.customer.name.toLowerCase().includes(q) ||
          b.customer.phone.includes(q) ||
          b.customer.email.toLowerCase().includes(q) ||
          b.bookingsItems.some((i) => i.title.toLowerCase().includes(q) || i.itemCodeOrPnr.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      bookings: filtered,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bookings/:bookingId
 */
bookingsApiRouter.get("/:bookingId", (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const booking = memoryBookings.find(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking with ID ${bookingId} not found`,
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bookings
 * Create new booking with bookings_items and payments
 */
bookingsApiRouter.post("/", (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<BookingHierarchy>;
    if (!payload.bookingId || !payload.customer) {
      return res.status(400).json({
        success: false,
        error: "bookingId and customer details are required",
      });
    }

    const now = new Date().toISOString();
    const newBooking: BookingHierarchy = {
      bookingId: payload.bookingId,
      customer: payload.customer,
      bookingDate: payload.bookingDate || now,
      travelStartDate: payload.travelStartDate || now,
      travelEndDate: payload.travelEndDate || now,
      status: payload.status || "confirmed",
      totalAmount: payload.totalAmount || 0,
      taxAmount: payload.taxAmount || 0,
      discountAmount: payload.discountAmount || 0,
      netPayableAmount: payload.netPayableAmount || 0,
      currency: "INR",
      specialRequests: payload.specialRequests || "",
      internalNotes: payload.internalNotes || "",
      bookingsItems: payload.bookingsItems || [],
      payments: payload.payments || {
        totalPaidAmount: 0,
        balanceDue: payload.netPayableAmount || 0,
        paymentStatus: "unpaid",
        paymentTransactions: [],
      },
      createdAt: now,
      updatedAt: now,
    };

    memoryBookings.unshift(newBooking);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bookings/:bookingId/items
 * Append an item (Flight, Train, Bus, Hotel, Resort, Lodge, Tour, Pilgrimage, Cab)
 */
bookingsApiRouter.post("/:bookingId/items", (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const itemData = req.body as Partial<BookingItem>;

    const index = memoryBookings.findIndex(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    if (!itemData.itemType || !itemData.title || itemData.amount === undefined) {
      return res.status(400).json({
        success: false,
        error: "itemType, title, and amount are required",
      });
    }

    const newItem: BookingItem = {
      id: `item-${itemData.itemType.toLowerCase().slice(0, 3)}-${Date.now().toString(36)}`,
      bookingId,
      itemType: itemData.itemType,
      title: itemData.title,
      serviceProvider: itemData.serviceProvider || "BharatYatra Travel Services",
      itemCodeOrPnr: itemData.itemCodeOrPnr || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      startDate: itemData.startDate || new Date().toISOString(),
      endDate: itemData.endDate,
      amount: Number(itemData.amount),
      taxRatePercent: itemData.taxRatePercent || 5,
      status: itemData.status || "confirmed",
      sacCode: itemData.sacCode || "998555",
      details: itemData.details as any,
      createdAt: new Date().toISOString(),
    };

    const targetBooking = { ...memoryBookings[index] };
    targetBooking.bookingsItems = [...targetBooking.bookingsItems, newItem];
    const total = targetBooking.bookingsItems.reduce((acc, it) => acc + it.amount, 0);
    targetBooking.totalAmount = total;
    targetBooking.taxAmount = Math.round(total * 0.05);
    targetBooking.netPayableAmount = Math.max(0, total + targetBooking.taxAmount - targetBooking.discountAmount);
    targetBooking.updatedAt = new Date().toISOString();

    memoryBookings[index] = targetBooking;

    res.json({
      success: true,
      message: `Item (${itemData.itemType}) added to booking ${bookingId}`,
      item: newItem,
      booking: targetBooking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bookings/:bookingId/payments
 * Record a payment transaction
 */
bookingsApiRouter.post("/:bookingId/payments", (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const txData = req.body as Partial<PaymentTransaction>;

    const index = memoryBookings.findIndex(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    const newTx: PaymentTransaction = {
      transactionId: txData.transactionId || `tx_pay_${Date.now().toString(36)}`,
      bookingId,
      razorpayOrderId: txData.razorpayOrderId || `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      razorpayPaymentId: txData.razorpayPaymentId || `pay_${Math.random().toString(36).substring(2, 10)}`,
      razorpaySignature: txData.razorpaySignature || "sig_verified_mock_sha256",
      signatureVerified: txData.signatureVerified !== undefined ? txData.signatureVerified : true,
      amount: Number(txData.amount || memoryBookings[index].netPayableAmount),
      currency: "INR",
      status: txData.status || "captured",
      paymentMethod: txData.paymentMethod || "upi",
      paymentMethodDetail: txData.paymentMethodDetail || "UPI / Razorpay",
      receiptNumber: txData.receiptNumber || `RCPT-BY-${Math.floor(100000 + Math.random() * 900000)}`,
      taxInvoiceNumber: txData.taxInvoiceNumber || `INV-BY-26-${Math.floor(10000 + Math.random() * 90000)}`,
      nodalEscrowStatus: txData.nodalEscrowStatus || "held",
      subMerchantSplits: txData.subMerchantSplits || [],
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    const targetBooking = { ...memoryBookings[index] };
    targetBooking.payments = {
      ...targetBooking.payments,
      paymentTransactions: [...targetBooking.payments.paymentTransactions, newTx],
    };

    const paidTotal = targetBooking.payments.paymentTransactions
      .filter((t) => t.status === "captured")
      .reduce((sum, t) => sum + t.amount, 0);

    targetBooking.payments.totalPaidAmount = paidTotal;
    targetBooking.payments.balanceDue = Math.max(0, targetBooking.netPayableAmount - paidTotal);
    targetBooking.payments.paymentStatus = paidTotal >= targetBooking.netPayableAmount ? "paid" : "partial";
    targetBooking.status = "confirmed";
    targetBooking.updatedAt = new Date().toISOString();

    memoryBookings[index] = targetBooking;

    res.json({
      success: true,
      message: "Payment transaction recorded successfully",
      transaction: newTx,
      booking: targetBooking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
