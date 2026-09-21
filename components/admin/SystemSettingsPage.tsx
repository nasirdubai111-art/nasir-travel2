import React, { useState, useEffect, useMemo } from "react";
import {
  Settings,
  Globe,
  Lock,
  Ticket,
  CreditCard,
  Percent,
  Wrench,
  Flag,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  UserCheck,
  ShieldAlert,
  Plane,
  Train,
  Bus,
  Palmtree,
  Map,
  Landmark,
  Building2,
  DollarSign,
  Layers,
  ChevronRight,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Info,
  Sliders,
  Check,
  Copy,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Server,
} from "lucide-react";
import {
  SystemSettingsConfig,
  SystemSettingsSection,
  DEFAULT_SYSTEM_SETTINGS,
  ServiceFeatureFlag,
} from "../../src/types/systemSettings";
import { systemSettingsService } from "../../src/services/systemSettingsService";

export function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettingsConfig>(DEFAULT_SYSTEM_SETTINGS);
  const [activeSection, setActiveSection] = useState<SystemSettingsSection>("all");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previewMaintenanceBanner, setPreviewMaintenanceBanner] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loaded = systemSettingsService.getSettings();
    setSettings(loaded);
  }, []);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Generic updater
  const updateGeneral = <K extends keyof SystemSettingsConfig["general"]>(
    key: K,
    value: SystemSettingsConfig["general"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const updateAuth = <K extends keyof SystemSettingsConfig["authentication"]>(
    key: K,
    value: SystemSettingsConfig["authentication"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      authentication: { ...prev.authentication, [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const updateLoginSettings = <K extends keyof SystemSettingsConfig["authentication"]["loginSettings"]>(
    key: K,
    value: SystemSettingsConfig["authentication"]["loginSettings"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      authentication: {
        ...prev.authentication,
        loginSettings: { ...prev.authentication.loginSettings, [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const updateBooking = <K extends keyof SystemSettingsConfig["booking"]>(
    key: K,
    value: SystemSettingsConfig["booking"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      booking: { ...prev.booking, [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const updateCancellationRules = <K extends keyof SystemSettingsConfig["booking"]["cancellationRules"]>(
    key: K,
    value: SystemSettingsConfig["booking"]["cancellationRules"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      booking: {
        ...prev.booking,
        cancellationRules: { ...prev.booking.cancellationRules, [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const updateBookingLimits = <K extends keyof SystemSettingsConfig["booking"]["bookingLimits"]>(
    key: K,
    value: SystemSettingsConfig["booking"]["bookingLimits"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      booking: {
        ...prev.booking,
        bookingLimits: { ...prev.booking.bookingLimits, [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const updatePayment = <K extends keyof SystemSettingsConfig["payment"]>(
    key: K,
    value: SystemSettingsConfig["payment"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      payment: { ...prev.payment, [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const updatePaymentMethods = <K extends keyof SystemSettingsConfig["payment"]["paymentMethods"]>(
    key: K,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentMethods: { ...prev.payment.paymentMethods, [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const updateCommission = <K extends keyof SystemSettingsConfig["commission"]>(
    key: K,
    value: SystemSettingsConfig["commission"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      commission: { ...prev.commission, [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const updatePartnerCommission = (
    key: keyof SystemSettingsConfig["commission"]["partnerCommission"],
    value: number
  ) => {
    setSettings((prev) => ({
      ...prev,
      commission: {
        ...prev.commission,
        partnerCommission: { ...prev.commission.partnerCommission, [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const updateAgentCommission = <K extends keyof SystemSettingsConfig["commission"]["agentCommission"]>(
    key: K,
    value: SystemSettingsConfig["commission"]["agentCommission"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      commission: {
        ...prev.commission,
        agentCommission: { ...prev.commission.agentCommission, [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const updateMaintenance = <K extends keyof SystemSettingsConfig["maintenance"]>(
    key: K,
    value: SystemSettingsConfig["maintenance"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      maintenance: { ...prev.maintenance, [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const updateFeatureFlag = (
    key: keyof SystemSettingsConfig["featureFlags"],
    updates: Partial<ServiceFeatureFlag>
  ) => {
    setSettings((prev) => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [key]: { ...prev.featureFlags[key], ...updates, lastUpdatedBy: "Super Admin" },
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Save Settings handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await systemSettingsService.saveSettings(settings, "Super Admin (Console)");
      if (res.success) {
        setHasUnsavedChanges(false);
        showToast("All system configuration settings have been updated and broadcasted.", "success");
      } else {
        showToast(res.message, "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to save settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    const defaults = systemSettingsService.resetDefaults();
    setSettings(defaults);
    setHasUnsavedChanges(false);
    setShowResetConfirm(false);
    showToast("System settings restored to factory defaults.", "info");
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bharatyatra_system_settings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Settings exported as JSON snapshot.", "info");
  };

  // Summary Metrics
  const activeFeaturesCount = useMemo(() => {
    return Object.values(settings.featureFlags).filter((f) => f.enabled).length;
  }, [settings.featureFlags]);

  const navSections = [
    { id: "all" as const, label: "All Settings", icon: Layers, badge: "Overview" },
    { id: "general" as const, label: "General", icon: Globe, badge: settings.general.currency },
    {
      id: "authentication" as const,
      label: "Authentication",
      icon: Lock,
      badge: settings.authentication.customerRegistration ? "Open" : "Restricted",
    },
    {
      id: "booking" as const,
      label: "Booking",
      icon: Ticket,
      badge: settings.booking.bookingEnabled ? "Active" : "Paused",
    },
    {
      id: "payment" as const,
      label: "Payment",
      icon: CreditCard,
      badge: settings.payment.gatewayMode === "production" ? "Live PG" : "Sandbox",
    },
    {
      id: "commission" as const,
      label: "Commission",
      icon: Percent,
      badge: `${settings.commission.defaultCommission}% Base`,
    },
    {
      id: "maintenance" as const,
      label: "Maintenance",
      icon: Wrench,
      badge: settings.maintenance.maintenanceMode ? "ACTIVE" : "Normal",
      badgeColor: settings.maintenance.maintenanceMode ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "",
    },
    {
      id: "feature_flags" as const,
      label: "Feature Flags",
      icon: Flag,
      badge: `${activeFeaturesCount}/7 Active`,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40"
              : toastMessage.type === "error"
              ? "bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/40"
              : "bg-indigo-950/90 border-indigo-500/40 text-indigo-200 shadow-indigo-950/40"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toastMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Maintenance Mode Alert Banner if active */}
      {settings.maintenance.maintenanceMode && (
        <div className="bg-gradient-to-r from-rose-950/90 via-red-900/60 to-rose-950/90 border-2 border-rose-500/60 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-rose-200 uppercase tracking-wider">
                  ⚠️ Platform Maintenance Mode is CURRENTLY ACTIVE
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-slate-950 text-[10px] font-black uppercase">
                  Live Impact
                </span>
              </div>
              <p className="text-xs text-rose-300/90 mt-0.5 max-w-2xl">
                {settings.maintenance.maintenanceMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => updateMaintenance("maintenanceMode", false)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/30 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            Turn Off Maintenance
          </button>
        </div>
      )}

      {/* Top Breadcrumbs & Action Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="text-indigo-400 font-bold">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              System Settings
            </span>
            {hasUnsavedChanges && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            Global Platform Configuration Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure core runtime parameters, multi-service feature flags, payment routing, commission splits, and auth gates.
          </p>
        </div>

        {/* Global Save / Reset Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export JSON Configuration"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-slate-700 hover:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Restore Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              hasUnsavedChanges
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/40 animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4 text-white" />
            )}
            <span>{isSaving ? "Applying..." : hasUnsavedChanges ? "Save All Changes" : "Saved"}</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Reset All Settings to Factory Defaults?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This action will revert General parameters, Authentication rules, Booking windows, Payment gateways, Commission rates, and Feature flags back to their out-of-the-box configuration.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Yes, Revert to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80">
        {navSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{sec.label}</span>
              {sec.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    sec.badgeColor
                      ? sec.badgeColor
                      : isActive
                      ? "bg-indigo-500/40 text-indigo-100"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {sec.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION 1: GENERAL SETTINGS
          ├── Platform Name
          ├── Currency
          ├── Timezone
          └── Language
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "general") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">General Settings</h3>
                <p className="text-xs text-slate-400">
                  Global branding, default monetary units, temporal timezone, and localization standards.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Namespace: settings.general
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Platform Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Platform Name</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {settings.general.platformName.length} / 50 characters
                </span>
              </label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) => updateGeneral("platformName", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                placeholder="e.g. BharatYatra Superapp"
              />
              <p className="text-[11px] text-slate-400">
                Visible across customer navigation headers, SMS transactional templates, and PNR PDFs.
              </p>
            </div>

            {/* Platform Tagline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Platform Tagline / Slogan</label>
              <input
                type="text"
                value={settings.general.tagline}
                onChange={(e) => updateGeneral("tagline", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                placeholder="Platform tagline"
              />
              <p className="text-[11px] text-slate-400">
                Shown in browser title bar and OpenGraph metadata.
              </p>
            </div>

            {/* 2. Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Base Platform Currency</span>
                <span className="text-[10px] font-mono text-emerald-400">Symbol: {settings.general.currencySymbol}</span>
              </label>
              <select
                value={settings.general.currency}
                onChange={(e) => {
                  const val = e.target.value;
                  const symbol = val.includes("INR") ? "₹" : val.includes("USD") ? "$" : val.includes("EUR") ? "€" : val.includes("GBP") ? "£" : val.includes("AED") ? "د.إ" : "$";
                  updateGeneral("currency", val);
                  updateGeneral("currencySymbol", symbol);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee (Default RBI Compliant)</option>
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                <option value="SGD ($)">SGD ($) - Singapore Dollar</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Default base currency for inventory pricing, fare calculations, and tax invoicing.
              </p>
            </div>

            {/* 3. Timezone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>System Timezone</span>
                <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Live Server Time
                </span>
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => updateGeneral("timezone", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Asia/Kolkata (IST, UTC+05:30)">Asia/Kolkata (IST, UTC+05:30) - Indian Standard Time</option>
                <option value="Asia/Dubai (GST, UTC+04:00)">Asia/Dubai (GST, UTC+04:00) - Gulf Standard Time</option>
                <option value="UTC (UTC+00:00)">UTC (UTC+00:00) - Coordinated Universal Time</option>
                <option value="Asia/Singapore (SGT, UTC+08:00)">Asia/Singapore (SGT, UTC+08:00)</option>
                <option value="Europe/London (GMT/BST)">Europe/London (GMT/BST)</option>
                <option value="America/New_York (EST/EDT)">America/New_York (EST/EDT)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Governs departure/arrival timestamps, IRCTC tatkal booking windows, and audit log clocks.
              </p>
            </div>

            {/* 4. Language */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">Default System Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { code: "en-IN (English - India)", name: "English (India)", native: "English" },
                  { code: "hi-IN (Hindi)", name: "Hindi", native: "हिन्दी" },
                  { code: "ta-IN (Tamil)", name: "Tamil", native: "தமிழ்" },
                  { code: "te-IN (Telugu)", name: "Telugu", native: "తెలుగు" },
                  { code: "bn-IN (Bengali)", name: "Bengali", native: "বাংলা" },
                  { code: "mr-IN (Marathi)", name: "Marathi", native: "मराठी" },
                  { code: "gu-IN (Gujarati)", name: "Gujarati", native: "ગુજરાતી" },
                  { code: "kn-IN (Kannada)", name: "Kannada", native: "ಕನ್ನಡ" },
                ].map((lang) => {
                  const isSelected = settings.general.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => updateGeneral("language", lang.code)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className="text-xs font-bold">{lang.name}</div>
                      <div className="text-[11px] font-mono text-indigo-400 mt-1">{lang.native}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: AUTHENTICATION
          ├── Customer Registration
          ├── Partner Registration
          └── Login Settings
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "authentication") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Authentication &amp; User Gateways</h3>
                <p className="text-xs text-slate-400">
                  Onboarding policies for travelers and operators, MFA enforcement, and session security.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Namespace: settings.authentication
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Customer Registration */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Customer Registration</h4>
                </div>
                <button
                  onClick={() => updateAuth("customerRegistration", !settings.authentication.customerRegistration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.authentication.customerRegistration ? "bg-emerald-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.authentication.customerRegistration ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Controls whether new retail travelers can sign up on the web or mobile applications.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Fast Phone OTP Sign-up (WhatsApp/SMS)</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.allowPhoneOtp}
                    onChange={(e) => updateAuth("allowPhoneOtp", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Social OAuth (Google &amp; Apple ID)</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.allowGoogleAuth}
                    onChange={(e) => updateAuth("allowGoogleAuth", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Require Email Verification</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.requireEmailVerification}
                    onChange={(e) => updateAuth("requireEmailVerification", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Auto-Activate New Customer Accounts</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.autoActivateCustomer}
                    onChange={(e) => updateAuth("autoActivateCustomer", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            {/* 2. Partner Registration */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Partner Registration</h4>
                </div>
                <button
                  onClick={() => updateAuth("partnerRegistration", !settings.authentication.partnerRegistration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.authentication.partnerRegistration ? "bg-indigo-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.authentication.partnerRegistration ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Governs vendor onboarding for Hotels, Homestays, Houseboats, Bus operators, and Tour guides.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Mandatory Admin Approval Before Listing</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.partnerApprovalRequired}
                    onChange={(e) => updateAuth("partnerApprovalRequired", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Enforce GSTIN &amp; PAN Verification</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.mandatoryGstPan}
                    onChange={(e) => updateAuth("mandatoryGstPan", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Bank Account Penny-Drop Validation</span>
                  <input
                    type="checkbox"
                    checked={settings.authentication.bankPennyDropVerification}
                    onChange={(e) => updateAuth("bankPennyDropVerification", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            {/* 3. Login Settings */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Login &amp; Security Session Settings</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">MFA / 2FA Enforcement</label>
                  <select
                    value={settings.authentication.loginSettings.mfaEnforcement}
                    onChange={(e) => updateLoginSettings("mfaEnforcement", e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="disabled">Disabled (Single Factor)</option>
                    <option value="optional">Optional (User Managed)</option>
                    <option value="admin_only">Mandatory for Admin &amp; Staff</option>
                    <option value="all_users">Mandatory for All Users</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Max Failed Login Attempts</label>
                  <input
                    type="number"
                    min={3}
                    max={10}
                    value={settings.authentication.loginSettings.maxFailedAttempts}
                    onChange={(e) => updateLoginSettings("maxFailedAttempts", parseInt(e.target.value) || 5)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Account Lockout Duration (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={settings.authentication.loginSettings.lockoutDurationMinutes}
                    onChange={(e) => updateLoginSettings("lockoutDurationMinutes", parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Session Inactivity Timeout (Mins)</label>
                  <input
                    type="number"
                    min={15}
                    max={720}
                    value={settings.authentication.loginSettings.sessionTimeoutMinutes}
                    onChange={(e) => updateLoginSettings("sessionTimeoutMinutes", parseInt(e.target.value) || 120)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Password Expiry (Days)</label>
                  <input
                    type="number"
                    min={30}
                    max={365}
                    value={settings.authentication.loginSettings.passwordRotationDays}
                    onChange={(e) => updateLoginSettings("passwordRotationDays", parseInt(e.target.value) || 90)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center justify-between text-xs text-slate-300 p-2.5 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
                    <span>Allow Simultaneous Logins</span>
                    <input
                      type="checkbox"
                      checked={settings.authentication.loginSettings.allowSimultaneousSessions}
                      onChange={(e) => updateLoginSettings("allowSimultaneousSessions", e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 h-4 w-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: BOOKING
          ├── Booking Enabled
          ├── Cancellation Rules
          └── Booking Limits
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "booking") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Booking Engine &amp; Policy Matrix</h3>
                <p className="text-xs text-slate-400">
                  Master reservation switch, automated cancellation deductions, refund SLAs, and rate limits.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Namespace: settings.booking
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Booking Enabled (Master Switch) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              settings.booking.bookingEnabled
                ? "bg-slate-950/80 border-slate-800"
                : "bg-rose-950/40 border-rose-500/40"
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      settings.booking.bookingEnabled ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                    }`} />
                    <h4 className="text-sm font-bold text-white">Global Booking Engine Switch</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      settings.booking.bookingEnabled
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}>
                      {settings.booking.bookingEnabled ? "Active & Accepting Bookings" : "Emergency Reservation Freeze"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    When disabled, all reservation buttons show the emergency pause notice and checkout gates are locked.
                  </p>
                </div>

                <button
                  onClick={() => updateBooking("bookingEnabled", !settings.booking.bookingEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                    settings.booking.bookingEnabled
                      ? "bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  {settings.booking.bookingEnabled ? "Emergency Pause Bookings" : "Resume Booking Engine"}
                </button>
              </div>

              {!settings.booking.bookingEnabled && (
                <div className="mt-4 pt-3 border-t border-rose-500/30">
                  <label className="text-xs font-bold text-rose-300 block mb-1.5">
                    Customer Notice Message Displayed During Freeze
                  </label>
                  <input
                    type="text"
                    value={settings.booking.emergencyPauseNotice}
                    onChange={(e) => updateBooking("emergencyPauseNotice", e.target.value)}
                    className="w-full bg-slate-900 border border-rose-500/40 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* 2. Cancellation Rules */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Cancellation &amp; Refund Rules Matrix</h4>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.booking.cancellationRules.instantAutoRefund}
                      onChange={(e) => updateCancellationRules("instantAutoRefund", e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 h-4 w-4"
                    />
                    <span>Instant UPI/PG Auto-Refund</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.booking.cancellationRules.convenienceFeeRefundable}
                      onChange={(e) => updateCancellationRules("convenienceFeeRefundable", e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 h-4 w-4"
                    />
                    <span>Convenience Fee Refundable</span>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Window Tier</th>
                      <th className="p-3">Hours Before Departure</th>
                      <th className="p-3">Penalty Deduction (%)</th>
                      <th className="p-3">Net Customer Refund (%)</th>
                      <th className="p-3">Policy Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {settings.booking.cancellationRules.tiers.map((tier, idx) => (
                      <tr key={tier.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-semibold text-white">{tier.windowLabel}</td>
                        <td className="p-3 font-mono text-indigo-400">&gt; {tier.hoursBeforeDeparture} Hours</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={tier.penaltyPercentage}
                            onChange={(e) => {
                              const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                              const newTiers = [...settings.booking.cancellationRules.tiers];
                              newTiers[idx].penaltyPercentage = val;
                              updateCancellationRules("tiers", newTiers);
                            }}
                            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-400 font-bold"
                          />
                          <span className="ml-1 text-slate-500">%</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {100 - tier.penaltyPercentage}%
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">{tier.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Booking Limits */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Booking Constraints &amp; Fraud Prevention Limits</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 font-semibold block">Max Active Bookings/User</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={settings.booking.bookingLimits.maxConcurrentActiveBookings}
                    onChange={(e) => updateBookingLimits("maxConcurrentActiveBookings", parseInt(e.target.value) || 6)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Limits hoarding</p>
                </div>

                <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 font-semibold block">Max Passengers/Ticket</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={settings.booking.bookingLimits.maxPassengersPerTicket}
                    onChange={(e) => updateBookingLimits("maxPassengersPerTicket", parseInt(e.target.value) || 6)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Per PNR ceiling</p>
                </div>

                <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 font-semibold block">Max Txn without PAN (₹)</label>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={settings.booking.bookingLimits.maxBookingValueWithoutPan}
                    onChange={(e) => updateBookingLimits("maxBookingValueWithoutPan", parseInt(e.target.value) || 50000)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">IT Act Rule 114B</p>
                </div>

                <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 font-semibold block">Rate Limit (Req/Min/IP)</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={settings.booking.bookingLimits.rateLimitRequestsPerMin}
                    onChange={(e) => updateBookingLimits("rateLimitRequestsPerMin", parseInt(e.target.value) || 25)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Anti-scraping defense</p>
                </div>

                <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 font-semibold block">Seat Lock Hold (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={settings.booking.bookingLimits.seatLockDurationMinutes}
                    onChange={(e) => updateBookingLimits("seatLockDurationMinutes", parseInt(e.target.value) || 15)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Hold release timer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: PAYMENT
          ├── Payment Enabled
          ├── Gateway Mode
          └── Currency
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "payment") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Payment Gateway &amp; Currency Engine</h3>
                <p className="text-xs text-slate-400">
                  Payment switch, PG sandbox vs production modes, settlement currencies, and split transfers.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Namespace: settings.payment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Payment Enabled */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Live Payment Gateway</span>
                <button
                  onClick={() => updatePayment("paymentEnabled", !settings.payment.paymentEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.payment.paymentEnabled ? "bg-emerald-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.payment.paymentEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="text-xs text-slate-400">
                {settings.payment.paymentEnabled ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Payments Active &amp; Processing
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> PG Temporarily Disabled
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Controls all online payment capture, UPI dynamic QR generation, and card tokenization.
              </p>
            </div>

            {/* 2. Gateway Mode */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Gateway Environment</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    settings.payment.gatewayMode === "production"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {settings.payment.gatewayMode}
                </span>
              </div>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => updatePayment("gatewayMode", "production")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settings.payment.gatewayMode === "production"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Production (Live)
                </button>
                <button
                  onClick={() => updatePayment("gatewayMode", "sandbox")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settings.payment.gatewayMode === "sandbox"
                      ? "bg-amber-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sandbox (Test)
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                In Sandbox mode, test UPI handles and dummy cards work without debiting real bank accounts.
              </p>
            </div>

            {/* 3. Settlement Currency */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Settlement Currency</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{settings.payment.currency}</span>
              </div>
              <select
                value={settings.payment.currency}
                onChange={(e) => updatePayment("currency", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee (Direct Nodal Settlement)</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
              </select>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>Multi-Currency Auto Forex Conversion</span>
                <input
                  type="checkbox"
                  checked={settings.payment.multiCurrencyEnabled}
                  onChange={(e) => updatePayment("multiCurrencyEnabled", e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Payment Gateway Provider & Supported Methods */}
          <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                Active Gateway Provider &amp; Payment Methods
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Primary Switch:</span>
                <select
                  value={settings.payment.primaryGateway}
                  onChange={(e) => updatePayment("primaryGateway", e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-bold"
                >
                  <option value="zeul_pay">Zeul Pay Gateway (RBI Nodal Split & Multi-Aggregator)</option>
                  <option value="cashfree">Cashfree AutoCollect (Split Escrow Enabled)</option>
                  <option value="payu">PayU Enterprise</option>
                  <option value="stripe">Stripe International</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: "upi" as const, label: "UPI & QR (GPay/PhonePe)" },
                { key: "creditDebitCards" as const, label: "Credit & Debit Cards" },
                { key: "netBanking" as const, label: "NetBanking (54 Banks)" },
                { key: "wallets" as const, label: "Prepaid Wallets" },
                { key: "emi" as const, label: "No-Cost Cardless EMI" },
                { key: "payLater" as const, label: "Buy Now Pay Later" },
              ].map((m) => {
                const isEnabled = settings.payment.paymentMethods[m.key];
                return (
                  <button
                    key={m.key}
                    onClick={() => updatePaymentMethods(m.key, !isEnabled)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isEnabled
                        ? "bg-emerald-600/10 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-500"
                    }`}
                  >
                    <span className="text-[11px] font-bold leading-snug">{m.label}</span>
                    <span className={`text-[9px] font-bold uppercase mt-2 ${isEnabled ? "text-emerald-400" : "text-slate-600"}`}>
                      {isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Zeul Pay Admin Console Notice */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                  Zeul Pay Switch Active
                </span>
                <span className="text-slate-300">
                  Split payment rules, nodal escrow holds, and aggregator additions are managed inside the <strong>Admin Console &gt; Zeul Pay Gateway</strong>.
                </span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0">
                Never Displayed at Frontend
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: COMMISSION
          ├── Default Commission
          ├── Partner Commission
          └── Agent Commission
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "commission") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Commission &amp; Platform Take-Rate Engine</h3>
                <p className="text-xs text-slate-400">
                  Global margin take-rates, vertical partner commission splits, and B2B agent incentive margins.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Namespace: settings.commission
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Default Commission */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Default Commission Take-Rate</h4>
              </div>
              <p className="text-xs text-slate-400">
                Fallback gross margin percentage applied whenever a specific category or partner rule is not defined.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Platform Default Take-Rate</span>
                    <span className="text-amber-400 font-mono">{settings.commission.defaultCommission}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    step={0.5}
                    value={settings.commission.defaultCommission}
                    onChange={(e) => updateCommission("defaultCommission", parseFloat(e.target.value) || 8.5)}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Minimum Platform Processing Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={settings.commission.minPlatformFee}
                    onChange={(e) => updateCommission("minPlatformFee", parseInt(e.target.value) || 25)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Floor fee collected on low-fare tickets (e.g. short bus routes)</p>
                </div>
              </div>
            </div>

            {/* 2. Partner Commission by Category */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Partner Commission Splits</h4>
              </div>
              <p className="text-xs text-slate-400">
                Vendor revenue share deducted automatically by Escrow Gateway during settlement.
              </p>

              <div className="space-y-2.5 pt-1">
                {[
                  { key: "hotels" as const, label: "Hotels & Stays", icon: Building2 },
                  { key: "resorts" as const, label: "Luxury Resorts", icon: Palmtree },
                  { key: "tours" as const, label: "Tour Packages", icon: Map },
                  { key: "buses" as const, label: "Intercity Buses", icon: Bus },
                  { key: "pilgrimage" as const, label: "Pilgrimage Passes", icon: Landmark },
                  { key: "flights" as const, label: "Flight Tickets", icon: Plane },
                  { key: "trains" as const, label: "Train Reservations", icon: Train },
                ].map((item) => {
                  const Icon = item.icon;
                  const val = settings.commission.partnerCommission[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          max={35}
                          value={val}
                          onChange={(e) => updatePartnerCommission(item.key, parseFloat(e.target.value) || 0)}
                          className="w-14 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-emerald-400 font-bold text-right"
                        />
                        <span className="text-slate-500">%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Agent Commission */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Agent Commission (B2B)</h4>
              </div>
              <p className="text-xs text-slate-400">
                Incentive disbursements for registered travel agencies, white-label portals, and affiliates.
              </p>

              <div className="space-y-3 pt-1 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold flex justify-between">
                    <span>Base Agent Commission</span>
                    <span className="text-indigo-400 font-mono font-bold">
                      {settings.commission.agentCommission.baseAgentCommission}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={settings.commission.agentCommission.baseAgentCommission}
                    onChange={(e) => updateAgentCommission("baseAgentCommission", parseFloat(e.target.value) || 4.5)}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold block">Min Payout (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={settings.commission.agentCommission.minPayoutThreshold}
                      onChange={(e) => updateAgentCommission("minPayoutThreshold", parseInt(e.target.value) || 1000)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold block">Disbursement Cycle</label>
                    <select
                      value={settings.commission.agentCommission.payoutCycle}
                      onChange={(e) => updateAgentCommission("payoutCycle", e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                    >
                      <option value="daily">Daily Auto-Transfer</option>
                      <option value="weekly">Weekly (Every Monday)</option>
                      <option value="monthly">Monthly (1st of month)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Statutory Tax Deductions
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>TDS Section 194H (Commission):</span>
                    <span className="font-mono font-bold text-amber-400">
                      {settings.commission.agentCommission.tdsSection194HPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>TDS Section 194O (E-commerce):</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {settings.commission.agentCommission.tdsSection194OPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: MAINTENANCE
          ├── Maintenance Mode
          └── Maintenance Message
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "maintenance") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Maintenance Mode &amp; Outage Broadcast</h3>
                <p className="text-xs text-slate-400">
                  Temporary platform lockdowns, scheduled database maintenance windows, and customer banners.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Namespace: settings.maintenance
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Maintenance Mode Switch */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
                </div>
                <button
                  onClick={() => updateMaintenance("maintenanceMode", !settings.maintenance.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.maintenance.maintenanceMode ? "bg-rose-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenance.maintenanceMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className={`p-3 rounded-xl border text-xs ${
                settings.maintenance.maintenanceMode
                  ? "bg-rose-950/60 border-rose-500/40 text-rose-200"
                  : "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
              }`}>
                {settings.maintenance.maintenanceMode ? (
                  <div className="font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    MAINTENANCE ACTIVE: Non-admin users are locked out.
                  </div>
                ) : (
                  <div className="font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    NORMAL RUNTIME: All services fully accessible.
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Maintenance Scope</label>
                  <select
                    value={settings.maintenance.maintenanceScope}
                    onChange={(e) => updateMaintenance("maintenanceScope", e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="entire_platform">Entire Platform (All Apps)</option>
                    <option value="customer_only">Customer Portals Only (Partners Active)</option>
                    <option value="partner_only">Partner &amp; Agent Portals Only</option>
                  </select>
                </div>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span>Allow Authenticated Admins to Bypass</span>
                  <input
                    type="checkbox"
                    checked={settings.maintenance.allowAdminBypass}
                    onChange={(e) => updateMaintenance("allowAdminBypass", e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            {/* 2. Maintenance Message */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Maintenance Message &amp; Estimated Schedule</h4>
                </div>
                <button
                  onClick={() => setPreviewMaintenanceBanner(!previewMaintenanceBanner)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{previewMaintenanceBanner ? "Hide Preview" : "Preview Modal"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Customer Outage Notice Copy</label>
                <textarea
                  rows={3}
                  value={settings.maintenance.maintenanceMessage}
                  onChange={(e) => updateMaintenance("maintenanceMessage", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                  placeholder="Enter message displayed to travelers during downtime..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Scheduled Start Time</label>
                  <input
                    type="datetime-local"
                    value={settings.maintenance.scheduledStart}
                    onChange={(e) => updateMaintenance("scheduledStart", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Estimated Completion Time</label>
                  <input
                    type="datetime-local"
                    value={settings.maintenance.estimatedCompletionTime}
                    onChange={(e) => updateMaintenance("estimatedCompletionTime", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {previewMaintenanceBanner && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-2">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Customer Screen Preview
                  </div>
                  <div className="text-center py-4 space-y-2">
                    <Wrench className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                    <h5 className="text-sm font-bold text-white">BharatYatra Scheduled Maintenance</h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {settings.maintenance.maintenanceMessage}
                    </p>
                    <div className="text-[11px] font-mono text-emerald-400">
                      Expected Completion: {settings.maintenance.estimatedCompletionTime || "Shortly"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: FEATURE FLAGS
          ├── Flights
          ├── Trains
          ├── Buses
          ├── Hotels
          ├── Resorts
          ├── Tours
          └── Pilgrimage
      ========================================================================= */}
      {(activeSection === "all" || activeSection === "feature_flags") && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Service Category Feature Flags</h3>
                <p className="text-xs text-slate-400">
                  Granular control switches for Flights, Trains, Buses, Hotels, Resorts, Tours, and Pilgrimage modules.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                {activeFeaturesCount} of 7 Services Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                id: "flights" as const,
                title: "Flights",
                icon: Plane,
                color: "text-sky-400",
                bgColor: "bg-sky-500/10 border-sky-500/30",
              },
              {
                id: "trains" as const,
                title: "Trains",
                icon: Train,
                color: "text-orange-400",
                bgColor: "bg-orange-500/10 border-orange-500/30",
              },
              {
                id: "buses" as const,
                title: "Buses",
                icon: Bus,
                color: "text-emerald-400",
                bgColor: "bg-emerald-500/10 border-emerald-500/30",
              },
              {
                id: "hotels" as const,
                title: "Hotels",
                icon: Building2,
                color: "text-blue-400",
                bgColor: "bg-blue-500/10 border-blue-500/30",
              },
              {
                id: "resorts" as const,
                title: "Resorts",
                icon: Palmtree,
                color: "text-teal-400",
                bgColor: "bg-teal-500/10 border-teal-500/30",
              },
              {
                id: "tours" as const,
                title: "Tours",
                icon: Map,
                color: "text-purple-400",
                bgColor: "bg-purple-500/10 border-purple-500/30",
              },
              {
                id: "pilgrimage" as const,
                title: "Pilgrimage",
                icon: Landmark,
                color: "text-amber-400",
                bgColor: "bg-amber-500/10 border-amber-500/30",
              },
            ].map((flagMeta) => {
              const flag = settings.featureFlags[flagMeta.id];
              const Icon = flagMeta.icon;
              const isEnabled = flag.enabled;

              return (
                <div
                  key={flagMeta.id}
                  className={`rounded-2xl border p-5 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isEnabled
                      ? "bg-slate-950/80 border-slate-800 hover:border-slate-700 shadow-md"
                      : "bg-slate-950/40 border-slate-850 opacity-70"
                  }`}
                >
                  {/* Top color indicator */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isEnabled ? "bg-indigo-500" : "bg-slate-700"
                    }`}
                  />

                  <div>
                    {/* Header: Icon, Name & Toggle */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${flagMeta.bgColor} ${flagMeta.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">{flagMeta.title}</h4>
                            {flag.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {flag.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            flag.{flagMeta.id}
                          </span>
                        </div>
                      </div>

                      {/* Primary Toggle */}
                      <button
                        onClick={() => updateFeatureFlag(flagMeta.id, { enabled: !isEnabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          isEnabled ? "bg-emerald-600" : "bg-slate-700"
                        }`}
                        title={isEnabled ? "Disable service" : "Enable service"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {flag.description}
                    </p>

                    {/* Provider Info */}
                    <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80 mb-3 text-[11px] space-y-1">
                      <div className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                        Active Provider Switch
                      </div>
                      <div className="text-slate-300 font-mono text-[11px] truncate" title={flag.provider}>
                        {flag.provider}
                      </div>
                    </div>
                  </div>

                  {/* Footer Controls: Beta Mode & Status */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flag.betaOnly}
                        onChange={(e) => updateFeatureFlag(flagMeta.id, { betaOnly: e.target.checked })}
                        className="rounded border-slate-700 text-indigo-600 h-3.5 w-3.5"
                      />
                      <span className="text-[11px]">Beta/Admin Only</span>
                    </label>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isEnabled ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      {isEnabled ? "● Live Online" : "○ Disabled"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Action Bar when unsaved changes exist */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 border-2 border-emerald-500/60 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-2 text-xs text-white font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>You have unsaved configuration modifications!</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const loaded = systemSettingsService.getSettings();
                setSettings(loaded);
                setHasUnsavedChanges(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemSettingsPage;
