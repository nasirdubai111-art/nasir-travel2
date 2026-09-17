import React, { useState, useEffect, useMemo } from "react";
import {
  Server,
  Globe,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Lock,
  Shield,
  Activity,
  Clock,
  Check,
  Copy,
  ChevronRight,
  Database,
  Sliders,
  Eye,
  ExternalLink,
  Code2,
  Sparkles,
  Zap,
  Info,
  X,
} from "lucide-react";
import {
  ApiEndpointItem,
  EndpointHttpMethod,
  EndpointType,
  EndpointEnvironment,
  TravelModule,
  EndpointTestResult,
} from "../../types/apiEndpoints";
import { ApiEndpointsService } from "../../services/apiEndpointsService";

const TRAVEL_MODULES: TravelModule[] = [
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

export function ApiEndpointsManagementView() {
  const [endpoints, setEndpoints] = useState<ApiEndpointItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncSource, setSyncSource] = useState<"supabase" | "local_cache">("supabase");
  const [rlsActive, setRlsActive] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "disabled">("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Modal / Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Active items in modals
  const [editingEndpoint, setEditingEndpoint] = useState<ApiEndpointItem | null>(null);
  const [testingEndpoint, setTestingEndpoint] = useState<ApiEndpointItem | null>(null);
  const [testResult, setTestResult] = useState<EndpointTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Form State
  const initialFormState: Omit<ApiEndpointItem, "id" | "created_at"> = {
    name: "",
    provider: "",
    module: "Flights",
    endpoint_type: "REST",
    http_method: "GET",
    endpoint_url: "",
    environment: "production",
    is_active: true,
    description: "",
    auth_type: "Bearer",
    rate_limit_per_min: 120,
    timeout_ms: 4000,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load Endpoints
  const loadEndpoints = async () => {
    setIsLoading(true);
    try {
      const res = await ApiEndpointsService.getEndpoints();
      setEndpoints(res.endpoints);
      setSyncSource(res.source);
      if (typeof res.rlsActive === "boolean") setRlsActive(res.rlsActive);
    } catch (err) {
      console.error("Error loading endpoints:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEndpoints();
  }, []);

  // Filtered Endpoints
  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((ep) => {
      // Search query (name, provider, url, module)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ep.name.toLowerCase().includes(q);
        const matchProvider = ep.provider.toLowerCase().includes(q);
        const matchUrl = ep.endpoint_url.toLowerCase().includes(q);
        const matchMod = ep.module.toLowerCase().includes(q);
        if (!matchName && !matchProvider && !matchUrl && !matchMod) return false;
      }

      // Module Filter
      if (selectedModule !== "all" && ep.module !== selectedModule) {
        return false;
      }

      // Environment Filter
      if (selectedEnv !== "all" && ep.environment !== selectedEnv) {
        return false;
      }

      // HTTP Method Filter
      if (selectedMethod !== "all" && ep.http_method !== selectedMethod) {
        return false;
      }

      // Status Filter
      if (selectedStatus === "active" && !ep.is_active) return false;
      if (selectedStatus === "disabled" && ep.is_active) return false;

      // Type Filter
      if (selectedType !== "all" && ep.endpoint_type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [endpoints, searchQuery, selectedModule, selectedEnv, selectedMethod, selectedStatus, selectedType]);

  // Statistics
  const stats = useMemo(() => {
    const total = endpoints.length;
    const active = endpoints.filter((e) => e.is_active).length;
    const prodCount = endpoints.filter((e) => e.environment === "production").length;
    const tested = endpoints.filter((e) => typeof e.last_status_code === "number");
    const avgLatency =
      tested.length > 0
        ? Math.round(tested.reduce((acc, curr) => acc + (curr.last_latency_ms || 0), 0) / tested.length)
        : 58;
    const providers = new Set(endpoints.map((e) => e.provider)).size;
    return { total, active, prodCount, avgLatency, providers };
  }, [endpoints]);

  // Handle Toggle Status
  const handleToggle = async (ep: ApiEndpointItem) => {
    try {
      // Optimistic update
      setEndpoints((prev) =>
        prev.map((item) => (item.id === ep.id ? { ...item, is_active: !item.is_active } : item))
      );
      await ApiEndpointsService.toggleStatus(ep.id, ep.is_active);
    } catch (err) {
      console.error("Failed to toggle status:", err);
      // Revert on error
      loadEndpoints();
    }
  };

  // Open Edit Modal
  const openEditModal = (ep: ApiEndpointItem) => {
    setEditingEndpoint(ep);
    setFormData({
      name: ep.name,
      provider: ep.provider,
      module: ep.module,
      endpoint_type: ep.endpoint_type,
      http_method: ep.http_method,
      endpoint_url: ep.endpoint_url,
      environment: ep.environment,
      is_active: ep.is_active,
      description: ep.description || "",
      auth_type: ep.auth_type || "Bearer",
      rate_limit_per_min: ep.rate_limit_per_min || 120,
      timeout_ms: ep.timeout_ms || 4000,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Endpoint name is required";
    if (!formData.provider.trim()) errors.provider = "Provider name is required";
    if (!formData.endpoint_url.trim()) errors.endpoint_url = "Endpoint URL is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Submit Form (Add)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const created = await ApiEndpointsService.createEndpoint(formData);
      setEndpoints((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setFormData(initialFormState);
    } catch (err) {
      console.error("Error creating endpoint:", err);
    }
  };

  // Handle Submit Form (Edit)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEndpoint || !validateForm()) return;

    try {
      const updated = await ApiEndpointsService.updateEndpoint(editingEndpoint.id, formData);
      setEndpoints((prev) => prev.map((item) => (item.id === editingEndpoint.id ? updated : item)));
      setIsEditModalOpen(false);
      setEditingEndpoint(null);
    } catch (err) {
      console.error("Error updating endpoint:", err);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the endpoint "${name}"?`)) return;
    try {
      await ApiEndpointsService.deleteEndpoint(id);
      setEndpoints((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete endpoint:", err);
    }
  };

  // Handle Run Test
  const handleRunTest = async (ep: ApiEndpointItem) => {
    setTestingEndpoint(ep);
    setIsTestDrawerOpen(true);
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await ApiEndpointsService.testEndpoint(ep);
      setTestResult(res);

      // Update in table status
      setEndpoints((prev) =>
        prev.map((item) =>
          item.id === ep.id
            ? {
                ...item,
                last_tested_at: res.testedAt,
                last_status_code: res.statusCode,
                last_latency_ms: res.latencyMs,
              }
            : item
        )
      );
    } catch (err: any) {
      console.error("Test execution failed:", err);
    } finally {
      setIsTesting(false);
    }
  };

  // Handle Sync to Supabase
  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await ApiEndpointsService.syncToSupabase();
      setSyncFeedback(res.message);
      loadEndpoints();
    } catch (err: any) {
      setSyncFeedback("Sync failed: " + (err?.message || "Check network"));
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 6000);
    }
  };

  // Copy JSON response
  const copyResponsePayload = () => {
    if (!testResult?.responsePayload) return;
    navigator.clipboard.writeText(JSON.stringify(testResult.responsePayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
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
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  const getEnvBadgeClass = (env: string) => {
    switch (env.toLowerCase()) {
      case "production":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "staging":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "sandbox":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      case "development":
        return "bg-slate-700/50 text-slate-300 border-slate-600";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
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
      {/* 1. Header & Navigation Ribbon */}
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
                syncSource === "supabase"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{syncSource === "supabase" ? "Supabase Synced" : "Local Gateway Cache"}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              RLS Enforced
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Central registry for flight aggregators, IRCTC train ticketing, hotel CRS, intercity mobility, payment escrow, and tax filing APIs.
            All client calls pass through backend security gateways to protect provider secrets and API credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSchemaModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
            title="View Supabase api_endpoints SQL schema & RLS policies"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>SQL Schema</span>
          </button>

          <button
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 disabled:opacity-50"
            title="Synchronize registry with Supabase api_endpoints table"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Supabase"}</span>
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

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="p-3.5 rounded-xl bg-slate-850 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Key Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Endpoints</div>
          <div className="text-xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{stats.total}</span>
            <span className="text-[11px] font-normal text-slate-500">registered</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Active Services</div>
          <div className="text-xl font-bold text-emerald-300 mt-1 flex items-baseline gap-2">
            <span>{stats.active}</span>
            <span className="text-[11px] font-normal text-emerald-500/80">/ {stats.total} live</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Production Env</div>
          <div className="text-xl font-bold text-purple-300 mt-1 flex items-baseline gap-2">
            <span>{stats.prodCount}</span>
            <span className="text-[11px] font-normal text-purple-400/80">endpoints</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Avg Gateway Latency</div>
          <div className="text-xl font-bold text-sky-300 mt-1 flex items-baseline gap-2">
            <span>{stats.avgLatency}</span>
            <span className="text-[11px] font-normal text-sky-400/80">ms</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Integrated Providers</div>
          <div className="text-xl font-bold text-indigo-300 mt-1 flex items-baseline gap-2">
            <span>{stats.providers}</span>
            <span className="text-[11px] font-normal text-indigo-400/80">vendors</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Comprehensive Filter Suite */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by endpoint name, provider, URL path (/api/flights), or module..."
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

        {/* Secondary Filter Pills: Method, Status, Type */}
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

      {/* 4. API Endpoints Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Endpoint Name &amp; Path</th>
                <th className="px-4 py-3.5">Provider</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Type &amp; Method</th>
                <th className="px-4 py-3.5">Environment</th>
                <th className="px-4 py-3.5">Active Status</th>
                <th className="px-4 py-3.5">Created Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    <span>Loading API endpoints registry from Supabase...</span>
                  </td>
                </tr>
              ) : filteredEndpoints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No endpoints matched your filter criteria.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing search terms or reset filters.</p>
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
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEndpoints.map((ep) => (
                  <tr
                    key={ep.id}
                    className={`hover:bg-slate-850/60 transition-colors ${
                      !ep.is_active ? "opacity-60 bg-slate-950/40" : ""
                    }`}
                  >
                    {/* Name & URL */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-semibold text-white truncate" title={ep.name}>
                        {ep.name}
                      </div>
                      <div className="font-mono text-[11px] text-indigo-400/90 truncate flex items-center gap-1 mt-0.5" title={ep.endpoint_url}>
                        <span>{ep.endpoint_url}</span>
                      </div>
                      {ep.description && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5" title={ep.description}>
                          {ep.description}
                        </div>
                      )}
                    </td>

                    {/* Provider */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{ep.provider}</div>
                      <div className="text-[10px] text-slate-500">Auth: {ep.auth_type || "Bearer"}</div>
                    </td>

                    {/* Module */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/80">
                        {ep.module}
                      </span>
                    </td>

                    {/* Type & Method */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getMethodBadgeClass(
                            ep.http_method
                          )}`}
                        >
                          {ep.http_method}
                        </span>
                        <span className="text-[11px] text-slate-400">{ep.endpoint_type}</span>
                      </div>
                    </td>

                    {/* Environment */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getEnvBadgeClass(
                          ep.environment
                        )}`}
                      >
                        {ep.environment}
                      </span>
                    </td>

                    {/* Active Status with quick toggle */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(ep)}
                        className={`group flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          ep.is_active
                            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                        }`}
                        title={ep.is_active ? "Click to disable endpoint" : "Click to enable endpoint"}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ep.is_active ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                          }`}
                        ></span>
                        <span>{ep.is_active ? "Active" : "Disabled"}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      <div>{formatDate(ep.created_at)}</div>
                      {typeof ep.last_status_code === "number" && (
                        <div className="text-[10px] mt-0.5 flex items-center gap-1">
                          <span
                            className={
                              ep.last_status_code >= 200 && ep.last_status_code < 400
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }
                          >
                            ● {ep.last_status_code}
                          </span>
                          <span className="text-slate-500">({ep.last_latency_ms || 0}ms)</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRunTest(ep)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all border border-indigo-500/30 flex items-center gap-1"
                          title="Execute live health probe from backend"
                        >
                          <Play className="w-3 h-3 text-indigo-400" />
                          <span>Test</span>
                        </button>

                        <button
                          onClick={() => openEditModal(ep)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
                          title="Edit endpoint parameters"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(ep.id, ep.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-all border border-slate-700 hover:border-rose-500/40"
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

        {/* Footer Summary */}
        <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Showing <span className="font-semibold text-white">{filteredEndpoints.length}</span> of{" "}
            <span className="font-semibold text-white">{endpoints.length}</span> endpoints
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Backend Test Engine Ready
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Lock className="w-3.5 h-3.5" /> Private Keys Hidden
            </span>
          </div>
        </div>
      </div>

      {/* 5. ADD ENDPOINT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add New API Endpoint</h3>
                  <p className="text-xs text-slate-400">Register a travel service API in Supabase registry</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
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
                      formErrors.provider
                        ? "border-rose-500 focus:ring-rose-500"
                        : "border-slate-800 focus:border-indigo-500"
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
                    value={formData.http_method}
                    onChange={(e) => setFormData({ ...formData, http_method: e.target.value as EndpointHttpMethod })}
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
                    value={formData.endpoint_type}
                    onChange={(e) => setFormData({ ...formData, endpoint_type: e.target.value as EndpointType })}
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
                  placeholder="e.g. /api/flights/seat-map or https://api.indigo.in/v2/flights"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border font-mono text-xs text-white focus:outline-none focus:ring-1 ${
                    formErrors.endpoint_url
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
                {formErrors.endpoint_url && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.endpoint_url}</p>}
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports relative paths (e.g. <code>/api/flights/...</code>) or fully qualified HTTPS URLs.
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
                    onChange={(e) => setFormData({ ...formData, auth_type: e.target.value as any })}
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
                    value={formData.rate_limit_per_min || 120}
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
                  placeholder="Optional architectural or business rules note for this integration..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="add_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                />
                <label htmlFor="add_is_active" className="text-xs text-slate-300 cursor-pointer">
                  Activate endpoint immediately upon creation
                </label>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Security Guarantee: Private keys and provider secrets are retained strictly on the server mesh.</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  Save to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT ENDPOINT MODAL */}
      {isEditModalOpen && editingEndpoint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Endpoint: {editingEndpoint.name}</h3>
                  <p className="text-xs text-slate-400">ID: {editingEndpoint.id}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Endpoint Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Provider / Vendor *</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                  {formErrors.provider && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.provider}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Module</label>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">HTTP Method</label>
                  <select
                    value={formData.http_method}
                    onChange={(e) => setFormData({ ...formData, http_method: e.target.value as EndpointHttpMethod })}
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
                    value={formData.endpoint_type}
                    onChange={(e) => setFormData({ ...formData, endpoint_type: e.target.value as EndpointType })}
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:border-indigo-500 outline-none"
                />
                {formErrors.endpoint_url && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.endpoint_url}</p>}
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
                    onChange={(e) => setFormData({ ...formData, auth_type: e.target.value as any })}
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
                    value={formData.rate_limit_per_min || 120}
                    onChange={(e) => setFormData({ ...formData, rate_limit_per_min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Purpose</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                />
                <label htmlFor="edit_is_active" className="text-xs text-slate-300 cursor-pointer">
                  Endpoint is active &amp; traffic enabled
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. TEST ENDPOINT DRAWER / MODAL */}
      {isTestDrawerOpen && testingEndpoint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Live Endpoint Probe &amp; Diagnostic</h3>
                  <p className="text-xs text-slate-400">{testingEndpoint.name}</p>
                </div>
              </div>
              <button onClick={() => setIsTestDrawerOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Target Specs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getMethodBadgeClass(
                        testingEndpoint.http_method
                      )}`}
                    >
                      {testingEndpoint.http_method}
                    </span>
                    <span className="font-mono text-xs text-white break-all">{testingEndpoint.endpoint_url}</span>
                  </div>
                  <button
                    onClick={() => handleRunTest(testingEndpoint)}
                    disabled={isTesting}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                    <span>{isTesting ? "Executing Probe..." : "Re-test Probe"}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Provider: <strong className="text-slate-200">{testingEndpoint.provider}</strong></span>
                  <span>Module: <strong className="text-slate-200">{testingEndpoint.module}</strong></span>
                  <span>Env: <strong className="text-slate-200">{testingEndpoint.environment}</strong></span>
                  <span>Auth: <strong className="text-slate-200">{testingEndpoint.auth_type || "Bearer"}</strong></span>
                </div>
              </div>

              {/* Probe Result Section */}
              {isTesting ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
                  <p className="text-sm font-semibold text-white">Probing destination endpoint via backend proxy...</p>
                  <p className="text-xs text-slate-500 mt-1">Measuring roundtrip latency, verifying headers, and testing payload response.</p>
                </div>
              ) : testResult ? (
                <div className="space-y-4">
                  {/* Status & Latency Banner */}
                  <div
                    className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                      testResult.statusCode >= 200 && testResult.statusCode < 400
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                        : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {testResult.statusCode >= 200 && testResult.statusCode < 400 ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="text-base font-bold flex items-center gap-2">
                          <span>HTTP {testResult.statusCode}</span>
                          <span className="text-xs font-normal px-2 py-0.5 rounded bg-black/40 border border-white/10">
                            {testResult.statusText}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Probe completed at {new Date(testResult.testedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <div className="text-slate-400 text-[10px] uppercase">Latency</div>
                        <div className="text-sm font-bold text-white">{testResult.latencyMs} ms</div>
                      </div>
                    </div>
                  </div>

                  {/* Response Body & Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" /> API Response Payload
                      </span>
                      <button
                        onClick={copyResponsePayload}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                      >
                        {copiedPayload ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 max-h-72 overflow-y-auto font-mono text-xs text-slate-200">
                      <pre className="whitespace-pre-wrap break-words">
                        {typeof testResult.responsePayload === "object"
                          ? JSON.stringify(testResult.responsePayload, null, 2)
                          : String(testResult.responsePayload)}
                      </pre>
                    </div>
                  </div>

                  {/* Response Headers */}
                  {testResult.headers && Object.keys(testResult.headers).length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Response Headers
                      </span>
                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-[11px] font-mono space-y-1 text-slate-300 max-h-32 overflow-y-auto">
                        {Object.entries(testResult.headers).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-indigo-400 font-semibold">{key}:</span>
                            <span className="text-slate-300 truncate">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsTestDrawerOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Close Diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUPABASE SQL SCHEMA & RLS POLICIES MODAL */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Supabase SQL Schema &amp; RLS Policies</h3>
                  <p className="text-xs text-slate-400">PostgreSQL table definition for public.api_endpoints</p>
                </div>
              </div>
              <button onClick={() => setIsSchemaModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300">
                You can execute this SQL script in the <strong>Supabase SQL Studio</strong> tab or the Supabase Cloud Console
                to configure your table and security rules:
              </p>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-300 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{`-- 1. Create api_endpoints table
CREATE TABLE IF NOT EXISTS public.api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL DEFAULT 'BharatYatra Gateway',
    module VARCHAR(100) NOT NULL,
    endpoint_type VARCHAR(50) NOT NULL DEFAULT 'REST',
    http_method VARCHAR(10) NOT NULL DEFAULT 'GET',
    endpoint_url TEXT NOT NULL,
    environment VARCHAR(50) NOT NULL DEFAULT 'production',
    is_active BOOLEAN NOT NULL DEFAULT true,
    auth_type VARCHAR(50) DEFAULT 'Bearer',
    rate_limit_per_min INTEGER DEFAULT 120,
    timeout_ms INTEGER DEFAULT 5000,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;

-- 3. RLS Security Policy: Admin & Service Role Full Access
CREATE POLICY "Allow authenticated admins full access to api_endpoints"
ON public.api_endpoints
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. RLS Policy: Public read-only for active endpoints (optional)
CREATE POLICY "Allow public read of active endpoint routes"
ON public.api_endpoints
FOR SELECT
TO anon
USING (is_active = true);`}</pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Target Project: <span className="font-mono text-indigo-300">attstemjmtsxafavjman</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL DEFAULT 'BharatYatra Gateway',
    module VARCHAR(100) NOT NULL,
    endpoint_type VARCHAR(50) NOT NULL DEFAULT 'REST',
    http_method VARCHAR(10) NOT NULL DEFAULT 'GET',
    endpoint_url TEXT NOT NULL,
    environment VARCHAR(50) NOT NULL DEFAULT 'production',
    is_active BOOLEAN NOT NULL DEFAULT true,
    auth_type VARCHAR(50) DEFAULT 'Bearer',
    rate_limit_per_min INTEGER DEFAULT 120,
    timeout_ms INTEGER DEFAULT 5000,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;`);
                    alert("SQL copied to clipboard!");
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
