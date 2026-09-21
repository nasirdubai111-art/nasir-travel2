// src/services/notificationApi.ts
// Push Notifications, SMS Gateways & PNR Status Alerts API Service

import { apiClient } from "./apiClient";
import { ApiResponse, AppNotification } from "../types/api";

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-001",
    title: "Vande Bharat Platform Assigned",
    message: "Train #22436 Vande Bharat Express will arrive on Platform #1 at Varanasi Cantt.",
    type: "GATE_CHANGE",
    read: false,
    timestamp: new Date().toISOString(),
    actionUrl: "/trains/live",
  },
  {
    id: "ntf-002",
    title: "Flight Price Drop Alert",
    message: "Delhi to Mumbai airfares dropped by ₹650 on IndiGo 6E-2041.",
    type: "PRICE_DROP",
    read: true,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: "/flights/search",
  },
  {
    id: "ntf-003",
    title: "Sugam Darshan E-Pass Ready",
    message: "Your VIP Darshan Slot at Kashi Vishwanath is confirmed for tomorrow 06:00 AM.",
    type: "BOOKING_ALERT",
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actionUrl: "/pilgrimage/e-pass",
  },
];

export const notificationApi = {
  // Get notifications for user
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    const res = await apiClient.get<AppNotification[]>("/api/notifications");
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_NOTIFICATIONS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<{ read: boolean }>> {
    return apiClient.patch(`/api/notifications/${notificationId}/read`);
  },

  // Register push token
  async registerPushToken(token: string, deviceType: "web" | "android" | "ios"): Promise<ApiResponse<any>> {
    return apiClient.post("/api/notifications/register-token", { token, deviceType });
  },
};

export default notificationApi;
