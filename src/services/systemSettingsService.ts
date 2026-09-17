import {
  SystemSettingsConfig,
  DEFAULT_SYSTEM_SETTINGS,
} from "../types/systemSettings";
import { createClient } from "@/utils/supabase/client";

const STORAGE_KEY = "bharatyatra_master_system_settings";

export const systemSettingsService = {
  // Load settings from localStorage with fallback to default
  getSettings(): SystemSettingsConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure any new keys exist
        return {
          ...DEFAULT_SYSTEM_SETTINGS,
          ...parsed,
          general: { ...DEFAULT_SYSTEM_SETTINGS.general, ...(parsed.general || {}) },
          authentication: {
            ...DEFAULT_SYSTEM_SETTINGS.authentication,
            ...(parsed.authentication || {}),
            loginSettings: {
              ...DEFAULT_SYSTEM_SETTINGS.authentication.loginSettings,
              ...(parsed.authentication?.loginSettings || {}),
            },
          },
          booking: {
            ...DEFAULT_SYSTEM_SETTINGS.booking,
            ...(parsed.booking || {}),
            cancellationRules: {
              ...DEFAULT_SYSTEM_SETTINGS.booking.cancellationRules,
              ...(parsed.booking?.cancellationRules || {}),
            },
            bookingLimits: {
              ...DEFAULT_SYSTEM_SETTINGS.booking.bookingLimits,
              ...(parsed.booking?.bookingLimits || {}),
            },
          },
          payment: {
            ...DEFAULT_SYSTEM_SETTINGS.payment,
            ...(parsed.payment || {}),
            paymentMethods: {
              ...DEFAULT_SYSTEM_SETTINGS.payment.paymentMethods,
              ...(parsed.payment?.paymentMethods || {}),
            },
          },
          commission: {
            ...DEFAULT_SYSTEM_SETTINGS.commission,
            ...(parsed.commission || {}),
            partnerCommission: {
              ...DEFAULT_SYSTEM_SETTINGS.commission.partnerCommission,
              ...(parsed.commission?.partnerCommission || {}),
            },
            agentCommission: {
              ...DEFAULT_SYSTEM_SETTINGS.commission.agentCommission,
              ...(parsed.commission?.agentCommission || {}),
            },
          },
          maintenance: {
            ...DEFAULT_SYSTEM_SETTINGS.maintenance,
            ...(parsed.maintenance || {}),
          },
          featureFlags: {
            ...DEFAULT_SYSTEM_SETTINGS.featureFlags,
            ...(parsed.featureFlags || {}),
          },
        };
      }
    } catch (e) {
      console.warn("Failed to load settings from localStorage, using defaults", e);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  },

  // Save settings locally and attempt Supabase backup
  async saveSettings(
    newSettings: SystemSettingsConfig,
    savedBy = "Super Admin"
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updated: SystemSettingsConfig = {
        ...newSettings,
        lastSavedAt: new Date().toISOString(),
        savedBy,
      };

      // 1. Save to local storage for immediate zero-latency propagation
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // 2. Dispatch a custom window event so other components can reactively update
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("systemSettingsUpdated", { detail: updated })
        );
      }

      // 3. Try persisting to Supabase if system_settings table exists
      try {
        const supabase = createClient();
        await supabase.from("system_settings").upsert(
          {
            id: "global_config",
            settings: updated,
            updated_at: new Date().toISOString(),
            updated_by: savedBy,
          },
          { onConflict: "id" }
        );
      } catch (dbErr) {
        // Supabase table may not exist yet; localStorage is durable
        console.info("Supabase sync optional step completed or skipped:", dbErr);
      }

      return { success: true, message: "System settings successfully saved and applied." };
    } catch (err: any) {
      console.error("Failed to save system settings:", err);
      return { success: false, message: err?.message || "Failed to save settings." };
    }
  },

  // Reset to factory defaults
  resetDefaults(): SystemSettingsConfig {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_SYSTEM_SETTINGS;
  },
};
