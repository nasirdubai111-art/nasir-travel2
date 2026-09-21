// src/services/index.ts
// Barrel export for all BharatYatra Travel Super App Microservice APIs

// Core HTTP & Supabase Edge Client
export * from "./apiClient";
export { apiClient, default as ApiClientDefault } from "./apiClient";

// Auth, User & Platform Admin
export * from "./authApi";
export { authApi, default as AuthApiDefault } from "./authApi";
export * from "./userApi";
export { userApi, default as UserApiDefault } from "./userApi";
export * from "./adminApi";
export { adminApi, default as AdminApiDefault } from "./adminApi";

// Transportation Verticals
export * from "./trainApi";
export { trainApi, default as TrainApiDefault } from "./trainApi";
export * from "./flightApi";
export { flightApi, default as FlightApiDefault } from "./flightApi";
export * from "./busApi";
export { busApi, default as BusApiDefault } from "./busApi";

// Hospitality Verticals
export * from "./hotelApi";
export { hotelApi, default as HotelApiDefault } from "./hotelApi";
export * from "./resortApi";
export { resortApi, default as ResortApiDefault } from "./resortApi";
export * from "./lodgeApi";
export { lodgeApi, default as LodgeApiDefault } from "./lodgeApi";

// Specialized Experiences & Heritage
export * from "./tourApi";
export { tourApi, default as TourApiDefault } from "./tourApi";
export * from "./pilgrimageApi";
export { pilgrimageApi, default as PilgrimageApiDefault } from "./pilgrimageApi";
export * from "./cabApi";
export { cabApi, default as CabApiDefault } from "./cabApi";
export * from "./restaurantApi";
export { restaurantApi, default as RestaurantApiDefault } from "./restaurantApi";
export * from "./jungleSafariApi";
export { jungleSafariApi, default as JungleSafariApiDefault } from "./jungleSafariApi";
export * from "./houseboatApi";
export { houseboatApi, default as HouseboatApiDefault } from "./houseboatApi";

// Bookings, Passengers, Payments & Wallets
export * from "./bookingApi";
export { bookingApi, default as BookingApiDefault } from "./bookingApi";
export * from "./passengerApi";
export { passengerApi, default as PassengerApiDefault } from "./passengerApi";
export * from "./paymentApi";
export { paymentApi, default as PaymentApiDefault } from "./paymentApi";
export * from "./walletApi";
export { walletApi, default as WalletApiDefault } from "./walletApi";
export * from "./rewardsApi";
export { rewardsApi, default as RewardsApiDefault } from "./rewardsApi";

// Post-Booking Lifecycle
export * from "./cancellationApi";
export { cancellationApi, default as CancellationApiDefault } from "./cancellationApi";
export * from "./refundApi";
export { refundApi, default as RefundApiDefault } from "./refundApi";
export * from "./ticketApi";
export { ticketApi, default as TicketApiDefault } from "./ticketApi";

// Partner & B2B Operations
export * from "./partnerApi";
export { partnerApi, default as PartnerApiDefault } from "./partnerApi";
export * from "./operatorApi";
export { operatorApi, default as OperatorApiDefault } from "./operatorApi";
export * from "./commissionApi";
export { commissionApi, default as CommissionApiDefault } from "./commissionApi";

// Platform Intelligence & Engagement
export * from "./notificationApi";
export { notificationApi, default as NotificationApiDefault } from "./notificationApi";
export * from "./cmsApi";
export { cmsApi, default as CmsApiDefault } from "./cmsApi";
export * from "./offersApi";
export { offersApi, default as OffersApiDefault } from "./offersApi";
export * from "./crmApi";
export { crmApi, default as CrmApiDefault } from "./crmApi";
export * from "./analyticsApi";
export { analyticsApi, default as AnalyticsApiDefault } from "./analyticsApi";

// Consolidated namespace export
import { apiClient } from "./apiClient";
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import { adminApi } from "./adminApi";
import { trainApi } from "./trainApi";
import { flightApi } from "./flightApi";
import { busApi } from "./busApi";
import { hotelApi } from "./hotelApi";
import { resortApi } from "./resortApi";
import { lodgeApi } from "./lodgeApi";
import { tourApi } from "./tourApi";
import { pilgrimageApi } from "./pilgrimageApi";
import { cabApi } from "./cabApi";
import { restaurantApi } from "./restaurantApi";
import { jungleSafariApi } from "./jungleSafariApi";
import { houseboatApi } from "./houseboatApi";
import { bookingApi } from "./bookingApi";
import { passengerApi } from "./passengerApi";
import { paymentApi } from "./paymentApi";
import { walletApi } from "./walletApi";
import { rewardsApi } from "./rewardsApi";
import { cancellationApi } from "./cancellationApi";
import { refundApi } from "./refundApi";
import { ticketApi } from "./ticketApi";
import { partnerApi } from "./partnerApi";
import { operatorApi } from "./operatorApi";
import { commissionApi } from "./commissionApi";
import { notificationApi } from "./notificationApi";
import { cmsApi } from "./cmsApi";
import { offersApi } from "./offersApi";
import { crmApi } from "./crmApi";
import { analyticsApi } from "./analyticsApi";

export const services = {
  client: apiClient,
  auth: authApi,
  user: userApi,
  admin: adminApi,
  train: trainApi,
  flight: flightApi,
  bus: busApi,
  hotel: hotelApi,
  resort: resortApi,
  lodge: lodgeApi,
  tour: tourApi,
  pilgrimage: pilgrimageApi,
  cab: cabApi,
  restaurant: restaurantApi,
  jungleSafari: jungleSafariApi,
  houseboat: houseboatApi,
  booking: bookingApi,
  passenger: passengerApi,
  payment: paymentApi,
  wallet: walletApi,
  rewards: rewardsApi,
  cancellation: cancellationApi,
  refund: refundApi,
  ticket: ticketApi,
  partner: partnerApi,
  operator: operatorApi,
  commission: commissionApi,
  notification: notificationApi,
  cms: cmsApi,
  offers: offersApi,
  crm: crmApi,
  analytics: analyticsApi,
};

export default services;
