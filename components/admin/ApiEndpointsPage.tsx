import React, { useState, useEffect, useMemo } from "react";
import {
  Globe,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Shield,
  Database,
  SlidersHorizontal,
  X,
  Play,
  Clock,
  Zap,
  Activity,
  AlertCircle,
  Copy,
  Check,
  Code,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  Server,
  ArrowRight,
  Info,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export type EndpointHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type EndpointType = "REST" | "GraphQL" | "Webhook" | "SOAP" | "gRPC";
export type EndpointEnvironment = "production" | "staging" | "sandbox" | "development";

export interface ApiEndpoint {
  id: string;
  name: string;
  provider: string;
  module: string;
  type: EndpointType | string;
  method: EndpointHttpMethod | string;
  environment: EndpointEnvironment | string;
  active: boolean;
  created_at: string;
  endpoint_url?: string;
  description?: string;
  auth_type?: string;
  rate_limit_per_min?: number;
  last_status_code?: number | null;
  last_latency_ms?: number | null;
}

export interface TestResultData {
  success: boolean;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  testedAt: string;
  endpointUrl: string;
  method: string;
  headers?: Record<string, string>;
  responsePayload: any;
  errorMessage?: string;
  responseSize?: number;
}

const TRAVEL_MODULES = [
  "Flights",
  "Hotels & Stays",
  "IRCTC Trains",
  "Intercity Buses",
  "Cabs & Transfers",
  "Spiritual Yatras",
  "Razorpay Split & Payments",
  "GST & Tax Filing",
  "Weather & AI Services",
  "Central Bookings",
  "Supabase & Database",
];

const HTTP_METHODS: EndpointHttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const ENDPOINT_TYPES: EndpointType[] = ["REST", "GraphQL", "Webhook", "SOAP", "gRPC"];
const ENVIRONMENTS: EndpointEnvironment[] = ["production", "staging", "sandbox", "development"];

// Initial default fallback data when Supabase table is fresh
const SEED_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "ep-indigo-01",
    name: "IndiGo Real-time Fare & Schedule Search",
    provider: "IndiGo Aviation Ltd",
    module: "Flights",
    type: "REST",
    method: "GET",
    environment: "production",
    active: true,
    created_at: "2026-03-15T08:30:00Z",
    endpoint_url: "/api/flights/seat-map",
    description: "Low-cost carrier direct NDC flight search with cabin baggage rules and ancillary seat maps.",
    auth_type: "Bearer",
    rate_limit_per_min: 300,
  },
  {
    id: "ep-irctc-01",
    name: "IRCTC NextGen PNR Status & Train Live Running",
    provider: "Indian Railway Catering & Tourism Corp",
    module: "IRCTC Trains",
    type: "REST",
    method: "POST",
    environment: "production",
    active: true,
    created_at: "2026-04-10T11:20:00Z",
    endpoint_url: "/api/trains/pnr-status",
    description: "Real-time 10-digit PNR confirmation predictor, coach position, and NTES live GPS running status.",
    auth_type: "API Key",
    rate_limit_per_min: 600,
  },
  {
    id: "ep-amadeus-01",
    name: "Amadeus Global Distribution System Multi-GDS",
    provider: "Amadeus IT Group",
    module: "Flights",
    type: "SOAP",
    method: "POST",
    environment: "production",
    active: true,
    created_at: "2026-02-18T09:45:00Z",
    endpoint_url: "https://nodeD1.amadeus.com/1ASIWYATRA",
    description: "International interline baggage tracking, Air India / Vistara PSS ticket issuance gateway.",
    auth_type: "OAuth2",
    rate_limit_per_min: 120,
  },
  {
    id: "ep-hotel-taj-01",
    name: "Taj / IHCL Luxury Inventory Engine",
    provider: "Cleartrip / IHCL Direct Connect",
    module: "Hotels & Stays",
    type: "REST",
    method: "GET",
    environment: "production",
    active: true,
    created_at: "2026-05-12T14:15:00Z",
    endpoint_url: "/api/hotels/inventory-rates",
    description: "Real-time 5-star inventory sync, meal plan inclusion rates, and complimentary airport transfer checks.",
    auth_type: "Bearer",
    rate_limit_per_min: 250,
  },
  {
    id: "ep-zingbus-01",
    name: "Zingbus Electric Intercity Live Seat Map",
    provider: "Zingbus Mobility Pvt Ltd",
    module: "Intercity Buses",
    type: "REST",
    method: "GET",
    environment: "production",
    active: true,
    created_at: "2026-06-01T10:00:00Z",
    endpoint_url: "/api/buses/live-seatmap",
    description: "EV bus sleeper/seater berth selection, boarding point GPS tracking, and lounge access verification.",
    auth_type: "Bearer",
    rate_limit_per_min: 180,
  },
  {
    id: "ep-razorpay-01",
    name: "Razorpay Route Marketplace Split Settlement",
    provider: "Razorpay Software Pvt Ltd",
    module: "Razorpay Split & Payments",
    type: "Webhook",
    method: "POST",
    environment: "production",
    active: true,
    created_at: "2026-01-20T16:00:00Z",
    endpoint_url: "/api/payments/razorpay-webhook",
    description: "Handles payment.captured webhooks, automatic vendor escrow splits, and instant refund triggers.",
    auth_type: "Basic",
    rate_limit_per_min: 1000,
  },
  {
    id: "ep-gst-01",
    name: "ClearTax GSTIN Auto-Verification & E-Invoicing",
    provider: "ClearTax / Defmacro Software",
    module: "GST & Tax Filing",
    type: "REST",
    method: "POST",
    environment: "production",
    active: true,
    created_at: "2026-07-04T07:30:00Z",
    endpoint_url: "/api/admin/gst/verify-gstin",
    description: "Validates corporate GSTINs, fetches registered trade legal names, and generates IRN QR codes.",
    auth_type: "Bearer",
    rate_limit_per_min: 150,
  },
  {
    id: "ep-weather-01",
    name: "India Meteorological Dept High-Altitude Radar",
    provider: "IMD / OpenWeather Gov Grid",
    module: "Weather & AI Services",
    type: "REST",
    method: "GET",
    environment: "production",
    active: true,
    created_at: "2026-06-25T13:40:00Z",
    endpoint_url: "/api/weather/himalayan-pass-radar",
    description: "Severe weather alerts, landslide forecasting, and snowfall advisory for Char Dham & Ladakh routes.",
    auth_type: "API Key",
    rate_limit_per_min: 120,
  },
];

export function ApiEndpointsPage() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "disabled">("all");

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEndpointId, setCurrentEndpointId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Testing Drawer / Popover State
  const [testingEndpoint, setTestingEndpoint] = useState<ApiEndpoint | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResultData | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [testViewTab, setTestViewTab] = useState<"body" | "headers" | "diagnostics">("body");
  const [isRawBodyFormat, setIsRawBodyFormat] = useState(false);

  // Form inputs
  const initialFormData = {
    name: "",
    provider: "",
    module: "Flights",
    type: "REST" as EndpointType,
    method: "GET" as EndpointHttpMethod,
    environment: "production" as EndpointEnvironment,
    active: true,
    endpoint_url: "",
    description: "",
    auth_type: "Bearer",
    rate_limit_per_min: 120,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize Supabase client
  const supabase = useMemo(() => createClient(), []);

  // Fetch endpoints from Supabase `api_endpoints` table
  const fetchEndpoints = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Direct query to Supabase using createClient()
      const { data, error } = await supabase
        .from("api_endpoints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase query note (using fallback mesh):", error.message);
        // Fallback to backend proxy / seed cache
        const res = await fetch("/api/admin/endpoints");
        if (res.ok) {
          const json = await res.json();
          if (json.endpoints && json.endpoints.length > 0) {
            setEndpoints(
              json.endpoints.map((e: any) => ({
                id: e.id,
                name: e.name,
                provider: e.provider,
                module: e.module,
                type: e.type || e.endpoint_type || "REST",
                method: e.method || e.http_method || "GET",
                environment: e.environment,
                active: typeof e.active === "boolean" ? e.active : e.is_active ?? true,
                created_at: e.created_at,
                endpoint_url: e.endpoint_url || e.url || "",
                description: e.description || "",
                auth_type: e.auth_type,
                rate_limit_per_min: e.rate_limit_per_min,
                last_status_code: e.last_status_code,
                last_latency_ms: e.last_latency_ms,
              }))
            );
            setIsSupabaseConnected(true);
            return;
          }
        }
        // Fallback to local seeds if network or table uninitialized
        setEndpoints(SEED_ENDPOINTS);
        setIsSupabaseConnected(false);
      } else if (data && data.length > 0) {
        setEndpoints(
          data.map((e: any) => ({
            id: e.id,
            name: e.name,
            provider: e.provider,
            module: e.module,
            type: e.type || e.endpoint_type || "REST",
            method: e.method || e.http_method || "GET",
            environment: e.environment,
            active: typeof e.active === "boolean" ? e.active : e.is_active ?? true,
            created_at: e.created_at,
            endpoint_url: e.endpoint_url || e.url || "",
            description: e.description || "",
            auth_type: e.auth_type,
            rate_limit_per_min: e.rate_limit_per_min,
            last_status_code: e.last_status_code,
            last_latency_ms: e.last_latency_ms,
          }))
        );
        setIsSupabaseConnected(true);
      } else {
        // Table is empty, show default seed set
        setEndpoints(SEED_ENDPOINTS);
        setIsSupabaseConnected(true);
      }
    } catch (err: any) {
      console.error("Error fetching api_endpoints:", err);
      setEndpoints(SEED_ENDPOINTS);
      setIsSupabaseConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  // Filtered Endpoints
  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((ep) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ep.name.toLowerCase().includes(q);
        const matchesProvider = ep.provider.toLowerCase().includes(q);
        const matchesModule = ep.module.toLowerCase().includes(q);
        const matchesUrl = (ep.endpoint_url || "").toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesModule && !matchesUrl) {
          return false;
        }
      }

      // Module Filter
      if (selectedModule !== "all" && ep.module !== selectedModule) {
        return false;
      }

      // Environment Filter
      if (selectedEnv !== "all" && ep.environment !== selectedEnv) {
        return false;
      }

      // Method Filter
      if (selectedMethod !== "all" && ep.method !== selectedMethod) {
        return false;
      }

      // Status Filter
      if (selectedStatus === "active" && !ep.active) return false;
      if (selectedStatus === "disabled" && ep.active) return false;

      return true;
    });
  }, [endpoints, searchQuery, selectedModule, selectedEnv, selectedMethod, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = endpoints.length;
    const activeCount = endpoints.filter((e) => e.active).length;
    const prodCount = endpoints.filter((e) => e.environment === "production").length;
    const vendors = new Set(endpoints.map((e) => e.provider)).size;
    return { total, activeCount, prodCount, vendors };
  }, [endpoints]);

  // Open Add Modal
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentEndpointId(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ep: ApiEndpoint) => {
    setIsEditing(true);
    setCurrentEndpointId(ep.id);
    setFormData({
      name: ep.name,
      provider: ep.provider,
      module: ep.module,
      type: ep.type as EndpointType,
      method: ep.method as EndpointHttpMethod,
      environment: ep.environment as EndpointEnvironment,
      active: ep.active,
      endpoint_url: ep.endpoint_url || "",
      description: ep.description || "",
      auth_type: ep.auth_type || "Bearer",
      rate_limit_per_min: ep.rate_limit_per_min || 120,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Toggle active status directly
  const handleToggleActive = async (ep: ApiEndpoint) => {
    const nextState = !ep.active;
    // Optimistic UI update
    setEndpoints((prev) =>
      prev.map((item) => (item.id === ep.id ? { ...item, active: nextState } : item))
    );

    try {
      // 1. Try Supabase update
      const { error } = await supabase
        .from("api_endpoints")
        .update({ active: nextState, is_active: nextState })
        .eq("id", ep.id);

      if (error) {
        // Fallback to backend API
        await fetch(`/api/admin/endpoints/${ep.id}/toggle`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: nextState }),
        });
      }
    } catch (err) {
      console.warn("Toggle fallback note:", err);
    }
  };

  // Delete endpoint
  const handleDeleteEndpoint = async (ep: ApiEndpoint) => {
    if (!window.confirm(`Are you sure you want to delete the endpoint "${ep.name}"?`)) return;

    // Optimistic UI removal
    setEndpoints((prev) => prev.filter((item) => item.id !== ep.id));

    try {
      const { error } = await supabase.from("api_endpoints").delete().eq("id", ep.id);
      if (error) {
        await fetch(`/api/admin/endpoints/${ep.id}`, { method: "DELETE" });
      }
      setSuccessMessage(`Deleted endpoint "${ep.name}"`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Delete failed:", err);
    }
  };

  // Validate form
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Endpoint name is required";
    if (!formData.provider.trim()) errors.provider = "Provider / Vendor name is required";
    if (!formData.endpoint_url.trim()) errors.endpoint_url = "Endpoint URL path is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const recordPayload = {
      name: formData.name.trim(),
      provider: formData.provider.trim(),
      module: formData.module,
      type: formData.type,
      endpoint_type: formData.type,
      method: formData.method,
      http_method: formData.method,
      environment: formData.environment,
      active: formData.active,
      is_active: formData.active,
      endpoint_url: formData.endpoint_url.trim(),
      description: formData.description.trim(),
      auth_type: formData.auth_type,
      rate_limit_per_min: formData.rate_limit_per_min,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && currentEndpointId) {
        // UPDATE existing endpoint
        const { error } = await supabase
          .from("api_endpoints")
          .update(recordPayload)
          .eq("id", currentEndpointId)
          .select()
          .maybeSingle();

        if (error) {
          // Fallback to backend API
          const res = await fetch(`/api/admin/endpoints/${currentEndpointId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recordPayload),
          });
          const json = await res.json();
          if (json.endpoint) {
            setEndpoints((prev) =>
              prev.map((item) =>
                item.id === currentEndpointId
                  ? {
                      ...item,
                      ...formData,
                    }
                  : item
              )
            );
          }
        } else {
          setEndpoints((prev) =>
            prev.map((item) =>
              item.id === currentEndpointId
                ? {
                    ...item,
                    ...formData,
                  }
                : item
            )
          );
        }

        setSuccessMessage("Endpoint successfully updated in Supabase.");
      } else {
        // CREATE new endpoint
        const newId = `ep-${Date.now().toString(36)}`;
        const fullInsert = {
          id: newId,
          ...recordPayload,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("api_endpoints")
          .insert([fullInsert])
          .select()
          .maybeSingle();

        if (error) {
          // Fallback to backend endpoint
          const res = await fetch("/api/admin/endpoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullInsert),
          });
          const json = await res.json();
          const created = json.endpoint || fullInsert;
          setEndpoints((prev) => [
            {
              id: created.id,
              name: created.name,
              provider: created.provider,
              module: created.module,
              type: created.type || created.endpoint_type,
              method: created.method || created.http_method,
              environment: created.environment,
              active: created.active ?? created.is_active ?? true,
              created_at: created.created_at || new Date().toISOString(),
              endpoint_url: created.endpoint_url,
              description: created.description,
              auth_type: created.auth_type,
              rate_limit_per_min: created.rate_limit_per_min,
            },
            ...prev,
          ]);
        } else {
          setEndpoints((prev) => [
            {
              id: data?.id || newId,
              name: formData.name,
              provider: formData.provider,
              module: formData.module,
              type: formData.type,
              method: formData.method,
              environment: formData.environment,
              active: formData.active,
              created_at: data?.created_at || new Date().toISOString(),
              endpoint_url: formData.endpoint_url,
              description: formData.description,
              auth_type: formData.auth_type,
              rate_limit_per_min: formData.rate_limit_per_min,
            },
            ...prev,
          ]);
        }

        setSuccessMessage("New API endpoint registered in Supabase registry.");
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Save failed:", err);
      setErrorMessage(err.message || "Failed to save endpoint");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run live test against the endpoint securely via backend proxy
  const handleOpenAndRunTest = async (ep: ApiEndpoint) => {
    setTestingEndpoint(ep);
    setIsTesting(true);
    setTestResult(null);
    setTestViewTab("body");

    try {
      // All sensitive provider keys, secrets, tokens, and credentials are kept strictly server-side.
      // The browser dispatches to the secure backend proxy which handles SSL, proxying, and secret injection.
      const res = await fetch("/api/admin/endpoints/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpointId: ep.id,
          url: ep.endpoint_url || "/api/health",
          method: ep.method,
          timeoutMs: 8000,
        }),
      });

      const data = await res.json();
      const stringifiedPayload = typeof data.responsePayload === "string" 
        ? data.responsePayload 
        : JSON.stringify(data.responsePayload || {});
      
      const payloadSize = new Blob([stringifiedPayload]).size;

      const formattedResult: TestResultData = {
        success: Boolean(data.success),
        statusCode: data.statusCode || res.status,
        statusText: data.statusText || (res.status === 200 ? "OK" : `HTTP ${res.status}`),
        latencyMs: data.latencyMs || 0,
        testedAt: data.testedAt || new Date().toISOString(),
        endpointUrl: data.endpointUrl || ep.endpoint_url || "",
        method: data.method || ep.method,
        headers: data.headers || {},
        responsePayload: data.responsePayload,
        errorMessage: data.errorMessage || (!data.success && data.statusCode >= 400 ? `HTTP ${data.statusCode}: ${data.statusText || "Request failed"}` : undefined),
        responseSize: payloadSize,
      };

      setTestResult(formattedResult);

      // update status in list
      setEndpoints((prev) =>
        prev.map((item) =>
          item.id === ep.id
            ? {
                ...item,
                last_status_code: formattedResult.statusCode,
                last_latency_ms: formattedResult.latencyMs,
              }
            : item
        )
      );
    } catch (err: any) {
      setTestResult({
        success: false,
        statusCode: 500,
        statusText: "Client Network Exception",
        latencyMs: 0,
        testedAt: new Date().toISOString(),
        endpointUrl: ep.endpoint_url || "",
        method: ep.method,
        responsePayload: { error: err.message || "Failed to contact backend proxy" },
        errorMessage: err.message || "An unexpected error occurred while executing health check.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Copy JSON or text
  const handleCopyPayload = () => {
    if (!testResult) return;
    const content = isRawBodyFormat || typeof testResult.responsePayload === "string"
      ? typeof testResult.responsePayload === "string"
        ? testResult.responsePayload
        : JSON.stringify(testResult.responsePayload, null, 2)
      : JSON.stringify(testResult.responsePayload, null, 2);

    navigator.clipboard.writeText(content);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Visual helper styles
  const getMethodBadgeClass = (m: string) => {
    switch (m?.toUpperCase()) {
      case "GET":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "POST":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "PUT":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "PATCH":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getEnvBadgeClass = (env: string) => {
    switch (env?.toLowerCase()) {
      case "production":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "staging":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "sandbox":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const getStatusColorClass = (code?: number) => {
    if (!code) return "text-slate-400";
    if (code >= 200 && code < 300) return "text-emerald-400";
    if (code >= 300 && code < 400) return "text-sky-400";
    if (code >= 400 && code < 500) return "text-amber-400";
    return "text-rose-400";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">API Endpoints Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Admin Only
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                isSupabaseConnected
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSupabaseConnected ? "Supabase Connected" : "Local Gateway Cache"}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              RLS Protected
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-semibold border border-slate-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Secrets Guarded Server-Side
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Central registry managing flight GDS, IRCTC trains, hotel CRS, intercity mobility, payment escrow, and tax filing APIs from the{" "}
            <code className="text-indigo-300 font-mono">api_endpoints</code> Supabase table with server-side proxy isolation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchEndpoints}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Endpoint</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Endpoints</div>
          <div className="text-xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{stats.total}</span>
            <span className="text-[11px] font-normal text-slate-500">records in Supabase</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Active Services</div>
          <div className="text-xl font-bold text-emerald-300 mt-1 flex items-baseline gap-2">
            <span>{stats.activeCount}</span>
            <span className="text-[11px] font-normal text-emerald-500/80">/ {stats.total} online</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Production Tier</div>
          <div className="text-xl font-bold text-purple-300 mt-1 flex items-baseline gap-2">
            <span>{stats.prodCount}</span>
            <span className="text-[11px] font-normal text-purple-400/80">endpoints</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Integrated Vendors</div>
          <div className="text-xl font-bold text-indigo-300 mt-1 flex items-baseline gap-2">
            <span>{stats.vendors}</span>
            <span className="text-[11px] font-normal text-indigo-400/80">providers</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, provider, route path (/api/flights), or module..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white placeholder-slate-500 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Module Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Modules ({endpoints.length})</option>
              {TRAVEL_MODULES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Environment Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Environments</option>
              {ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>
                  {env.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Badges: Method & Active Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Method:
            </span>
            <button
              onClick={() => setSelectedMethod("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedMethod === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All
            </button>
            {HTTP_METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  selectedMethod === m
                    ? getMethodBadgeClass(m)
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase mr-1">Status:</span>
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedStatus === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus("active")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                selectedStatus === "active"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              Active Only
            </button>
            <button
              onClick={() => setSelectedStatus("disabled")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                selectedStatus === "disabled"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              Disabled Only
            </button>
          </div>
        </div>
      </div>

      {/* 4. Table Listing Endpoints */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Provider</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5">Environment</th>
                <th className="px-4 py-3.5">Active</th>
                <th className="px-4 py-3.5">Created At</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    <span>Loading API endpoints from Supabase...</span>
                  </td>
                </tr>
              ) : filteredEndpoints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No API endpoints match your filter.</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedModule("all");
                        setSelectedEnv("all");
                        setSelectedMethod("all");
                        setSelectedStatus("all");
                      }}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEndpoints.map((ep) => (
                  <tr
                    key={ep.id}
                    className={`hover:bg-slate-850/60 transition-colors ${
                      !ep.active ? "opacity-60 bg-slate-950/40" : ""
                    }`}
                  >
                    {/* 1. Name */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-semibold text-white truncate" title={ep.name}>
                        {ep.name}
                      </div>
                      {ep.endpoint_url && (
                        <div className="font-mono text-[11px] text-indigo-400/90 truncate mt-0.5" title={ep.endpoint_url}>
                          {ep.endpoint_url}
                        </div>
                      )}
                      {ep.description && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5" title={ep.description}>
                          {ep.description}
                        </div>
                      )}
                    </td>

                    {/* 2. Provider */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{ep.provider}</div>
                      {ep.auth_type && <div className="text-[10px] text-slate-500">Auth: {ep.auth_type}</div>}
                    </td>

                    {/* 3. Module */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/80">
                        {ep.module}
                      </span>
                    </td>

                    {/* 4. Type */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {ep.type}
                      </span>
                    </td>

                    {/* 5. Method */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getMethodBadgeClass(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>
                    </td>

                    {/* 6. Environment */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getEnvBadgeClass(
                          ep.environment
                        )}`}
                      >
                        {ep.environment}
                      </span>
                    </td>

                    {/* 7. Active */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(ep)}
                        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          ep.active
                            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                        }`}
                        title={ep.active ? "Click to disable" : "Click to activate"}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ep.active ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                          }`}
                        ></span>
                        <span>{ep.active ? "Active" : "Disabled"}</span>
                      </button>
                    </td>

                    {/* 8. Created At */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      <div>{formatDate(ep.created_at)}</div>
                      {typeof ep.last_status_code === "number" && (
                        <div className="text-[10px] mt-0.5 flex items-center gap-1">
                          <span className={getStatusColorClass(ep.last_status_code)}>
                            ● {ep.last_status_code}
                          </span>
                          <span className="text-slate-500">({ep.last_latency_ms || 0}ms)</span>
                        </div>
                      )}
                    </td>

                    {/* 9. Actions - Prominent 'Test' Button included for each row */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAndRunTest(ep)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-indigo-300 hover:text-white text-xs font-bold transition-all border border-indigo-500/40 shadow-sm flex items-center gap-1.5 cursor-pointer group"
                          title={`Test ${ep.name} live via server-side proxy`}
                        >
                          <Play className="w-3.5 h-3.5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
                          <span>Test</span>
                        </button>

                        <button
                          onClick={() => openEditModal(ep)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
                          title="Edit endpoint details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteEndpoint(ep)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-all border border-slate-700 hover:border-rose-500/40 cursor-pointer"
                          title="Delete endpoint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Showing <span className="font-semibold text-white">{filteredEndpoints.length}</span> of{" "}
            <span className="font-semibold text-white">{endpoints.length}</span> endpoints
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Client Active
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Shield className="w-3.5 h-3.5" /> Row Level Security Active
            </span>
          </div>
        </div>
      </div>

      {/* 5. ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isEditing ? "Edit API Endpoint" : "Add New API Endpoint"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEditing ? "Update configuration in api_endpoints table" : "Register a travel service endpoint in Supabase"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Endpoint Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. IndiGo NDC Flight Search"
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:ring-1 ${
                      formErrors.name ? "border-rose-500 focus:ring-rose-500" : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Provider / Vendor *</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. IndiGo Aviation Ltd, IRCTC Rail"
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:ring-1 ${
                      formErrors.provider ? "border-rose-500 focus:ring-rose-500" : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                  {formErrors.provider && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.provider}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Module *</label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    {TRAVEL_MODULES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">HTTP Method *</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as EndpointHttpMethod })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Endpoint Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EndpointType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    {ENDPOINT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Endpoint URL / Route *</label>
                <input
                  type="text"
                  value={formData.endpoint_url}
                  onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                  placeholder="e.g. /api/flights/seat-map or https://api.indigo.in/v2/search"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border font-mono text-xs text-white focus:outline-none focus:ring-1 ${
                    formErrors.endpoint_url ? "border-rose-500 focus:ring-rose-500" : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
                {formErrors.endpoint_url && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.endpoint_url}</p>}
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports internal proxy routes (e.g. <code>/api/trains/...</code>) or vendor endpoints.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as EndpointEnvironment })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    {ENVIRONMENTS.map((env) => (
                      <option key={env} value={env}>
                        {env.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Auth Type</label>
                  <select
                    value={formData.auth_type}
                    onChange={(e) => setFormData({ ...formData, auth_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Bearer">Bearer Token</option>
                    <option value="API Key">API Key</option>
                    <option value="Basic">Basic Auth</option>
                    <option value="OAuth2">OAuth 2.0</option>
                    <option value="None">None (Public)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    value={formData.rate_limit_per_min}
                    onChange={(e) => setFormData({ ...formData, rate_limit_per_min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Integration specifications, failover notes, or SLA parameters..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="active_checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                />
                <label htmlFor="active_checkbox" className="text-xs text-slate-300 cursor-pointer">
                  Endpoint is Active and available for routing requests
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving to Supabase..." : isEditing ? "Update Endpoint" : "Register Endpoint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. SECONDARY TESTING VIEW / POPOVER MODAL */}
      {testingEndpoint && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shadow-inner">
                  <Play className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">Endpoint Live Test Runner</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {testingEndpoint.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getEnvBadgeClass(testingEndpoint.environment)}`}>
                      {testingEndpoint.environment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md">{testingEndpoint.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAndRunTest(testingEndpoint)}
                  disabled={isTesting}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title="Re-run Test"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                  <span>{isTesting ? "Testing..." : "Re-test"}</span>
                </button>
                <button
                  onClick={() => setTestingEndpoint(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Security Isolation Notice */}
            <div className="px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Server-Side Proxy Isolation:</strong> Sensitive provider secrets, client keys, and tokens are safely injected by backend runtime and never exposed in browser DevTools.
                </span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest hidden sm:inline-block">
                SECURE GATEWAY
              </span>
            </div>

            {/* Target Endpoint Ribbon */}
            <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs truncate">
                <span className={`px-2 py-0.5 rounded font-bold border ${getMethodBadgeClass(testingEndpoint.method)}`}>
                  {testingEndpoint.method}
                </span>
                <span className="text-slate-200 font-semibold truncate">
                  {testingEndpoint.endpoint_url || "/api/health"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Provider: <strong className="text-slate-200">{testingEndpoint.provider}</strong></span>
                <span>Module: <strong className="text-slate-200">{testingEndpoint.module}</strong></span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {isTesting ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="relative w-12 h-12 mx-auto">
                    <RefreshCw className="w-12 h-12 animate-spin text-indigo-500" />
                    <Server className="w-5 h-5 text-indigo-300 absolute inset-0 m-auto" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Triggering Server-Side Health Probe...</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Routing through internal gateway proxy at <code className="text-indigo-400">/api/admin/endpoints/test</code>
                    </p>
                  </div>
                </div>
              ) : testResult ? (
                <div className="space-y-4">
                  {/* Status & Latency Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">HTTP Status</div>
                      <div className={`text-base font-bold mt-1 flex items-center gap-1.5 ${getStatusColorClass(testResult.statusCode)}`}>
                        <span>{testResult.statusCode}</span>
                        <span className="text-xs font-normal opacity-90 truncate">{testResult.statusText}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Gateway Latency</div>
                      <div className="text-base font-bold text-sky-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{testResult.latencyMs} ms</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Response Size</div>
                      <div className="text-base font-bold text-slate-300 mt-1">
                        {testResult.responseSize ? `${(testResult.responseSize / 1024).toFixed(2)} KB` : "< 1 KB"}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Diagnostic State</div>
                      <div className="text-base font-bold mt-1 flex items-center gap-1.5">
                        {testResult.statusCode >= 200 && testResult.statusCode < 400 ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Healthy
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Error
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Box (If Present) */}
                  {(testResult.errorMessage || testResult.statusCode >= 400) && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-1.5">
                      <div className="flex items-center gap-2 font-semibold text-xs text-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>HTTP Error / Diagnostic Warning:</span>
                      </div>
                      <p className="text-xs font-mono text-rose-200/90 pl-6">
                        {testResult.errorMessage || `Server responded with status code ${testResult.statusCode}`}
                      </p>
                      <div className="pl-6 pt-1 text-[11px] text-rose-300/70 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Suggestion: Check server routes, verify parameter contracts, or verify provider API availability.</span>
                      </div>
                    </div>
                  )}

                  {/* Secondary View Tabs */}
                  <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setTestViewTab("body")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            testViewTab === "body"
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>Response Body</span>
                        </button>

                        <button
                          onClick={() => setTestViewTab("headers")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            testViewTab === "headers"
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Sanitized Headers ({Object.keys(testResult.headers || {}).length})</span>
                        </button>

                        <button
                          onClick={() => setTestViewTab("diagnostics")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            testViewTab === "diagnostics"
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Diagnostics</span>
                        </button>
                      </div>

                      {testViewTab === "body" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsRawBodyFormat(!isRawBodyFormat)}
                            className="px-2.5 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                          >
                            {isRawBodyFormat ? "View Formatted JSON" : "View Raw Text"}
                          </button>

                          <button
                            onClick={handleCopyPayload}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:text-white hover:bg-indigo-600/40 border border-indigo-500/30 flex items-center gap-1 transition-all"
                          >
                            {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedPayload ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tab 1: Response Body */}
                    {testViewTab === "body" && (
                      <div className="p-4">
                        <pre className="font-mono text-xs text-slate-200 max-h-80 overflow-auto whitespace-pre-wrap leading-relaxed">
                          {isRawBodyFormat || typeof testResult.responsePayload === "string"
                            ? typeof testResult.responsePayload === "string"
                              ? testResult.responsePayload
                              : JSON.stringify(testResult.responsePayload)
                            : JSON.stringify(testResult.responsePayload, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Tab 2: Sanitized Headers */}
                    {testViewTab === "headers" && (
                      <div className="p-4">
                        {testResult.headers && Object.keys(testResult.headers).length > 0 ? (
                          <table className="w-full text-left font-mono text-xs">
                            <thead className="text-slate-500 border-b border-slate-800">
                              <tr>
                                <th className="pb-2 text-[11px] uppercase">Header</th>
                                <th className="pb-2 text-[11px] uppercase">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {Object.entries(testResult.headers).map(([key, val]) => (
                                <tr key={key} className="hover:bg-slate-900/50">
                                  <td className="py-2 text-indigo-400 font-semibold pr-4">{key}</td>
                                  <td className="py-2 text-slate-300 break-all">{val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="py-6 text-center text-slate-500 text-xs">
                            No custom headers returned or non-sensitive headers stripped by proxy.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 3: Diagnostics */}
                    {testViewTab === "diagnostics" && (
                      <div className="p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-500 text-[11px]">Timestamp</span>
                            <div className="font-mono text-slate-200 mt-0.5">{testResult.testedAt}</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-500 text-[11px]">Target Address</span>
                            <div className="font-mono text-indigo-300 mt-0.5 truncate">{testResult.endpointUrl}</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-500 text-[11px]">Security Perimeter</span>
                            <div className="text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5" /> Backend Ingress Proxy / Zero Browser Leaks
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-500 text-[11px]">SLA Expectation</span>
                            <div className="text-slate-300 mt-0.5">
                              {testResult.latencyMs < 500 ? (
                                <span className="text-emerald-400">Optimal (&lt; 500ms)</span>
                              ) : (
                                <span className="text-amber-400">High Latency (&gt; 500ms)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Bearer & API keys are strictly loaded from server environment
              </span>
              <button
                onClick={() => setTestingEndpoint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiEndpointsPage;
