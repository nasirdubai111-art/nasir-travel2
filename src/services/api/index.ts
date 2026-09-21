// src/services/api/index.ts
// Barrel export for the api microservice layer

export * from "./apiClient";
export * from "./authApi";
export * from "./bookingApi";
export * from "./paymentApi";

export { default as apiClient } from "./apiClient";
export { default as authApi } from "./authApi";
export { default as bookingApi } from "./bookingApi";
export { default as paymentApi } from "./paymentApi";
