import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Key,
  Lock,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Calendar,
  Clock,
  Server,
  Database,
  ExternalLink,
  Activity,
  FileText,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  Sliders,
  CheckCheck,
  LayoutDashboard,
  Table as TableIcon,
  Plane,
  Train,
  Bus,
  Building,
  CreditCard,
  MapPin,
  MessageSquare,
  Mail,
  Users,
  Wifi,
  WifiOff,
  Radio,
  Power,
  Globe,
} from "lucide-react";
import {
  ApiProviderCategory,
  ApiEnvironment,
  CredentialStatus,
  ApiProviderCredential,
  ApiCredentialLog,
  CreateCredentialInput,
  UpdateCredentialInput,
  TestConnectionResult,
  PROVIDER_CATEGORIES,
  fetchApiCredentials,
  createApiCredential,
  updateApiCredential,
  disableApiCredential,
  testApiCredential,
  fetchApiLogs,
} from "../../src/services/apiCredentialsService";

export function ApiCredentialsPage() {
  const [credentials, setCredentials] = useState<ApiProviderCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSecretInForm, setShowSecretInForm] = useState(false);

  // Form Inputs
  const initialFormState: CreateCredentialInput = {
    name: "",
    category: "Flight",
    environment: "production",
    base_url: "https://api.indigo.in/v2",
    api_key: "",
    api_secret: "",
    access_token: "",
    status: "active",
    expiry_date: "2027-12-31",
    description: "",
  };
  const [formData, setFormData] = useState<CreateCredentialInput>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Testing Modal / Popover State
  const [testingItem, setTestingItem] = useState<ApiProviderCredential | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);

  // Audit Logs View State
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<ApiCredentialLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Copied State
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // View Switcher: Dashboard View vs Credentials Table View
  const [viewMode, setViewMode] = useState<"dashboard" | "table">("dashboard");
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [pingProgress, setPingProgress] = useState<{ current: number; total: number } | null>(null);
  const [pingingCardId, setPingingCardId] = useState<string | null>(null);

  // Load Credentials
  const loadCredentials = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchApiCredentials();
      setCredentials(data);
    } catch (err: any) {
      console.error("Failed to load credentials:", err);
      setErrorMessage(err.message || "Could not retrieve API credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  // Filtered List
  const filteredCredentials = useMemo(() => {
    return credentials.filter((cred) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cred.name.toLowerCase().includes(q);
        const matchesKey = cred.api_key.toLowerCase().includes(q);
        const matchesUrl = cred.base_url.toLowerCase().includes(q);
        const matchesCategory = cred.category.toLowerCase().includes(q);
        if (!matchesName && !matchesKey && !matchesUrl && !matchesCategory) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== "all" && cred.category !== selectedCategory) {
        return false;
      }

      // Environment
      if (selectedEnv !== "all" && cred.environment !== selectedEnv) {
        return false;
      }

      // Status
      if (selectedStatus !== "all" && cred.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [credentials, searchQuery, selectedCategory, selectedEnv, selectedStatus]);

  // Key Metrics
  const stats = useMemo(() => {
    const total = credentials.length;
    const active = credentials.filter((c) => c.status === "active").length;
    const inactive = credentials.filter((c) => c.status === "inactive").length;
    const expired = credentials.filter((c) => c.status === "expired").length;
    const prod = credentials.filter((c) => c.environment === "production").length;
    const sandbox = credentials.filter((c) => c.environment === "sandbox").length;

    // Check expiry
    const now = new Date().getTime();
    const expiringSoon = credentials.filter((c) => {
      if (!c.expiry_date) return false;
      const expiry = new Date(c.expiry_date).getTime();
      const diffDays = (expiry - now) / (1000 * 3600 * 24);
      return diffDays > 0 && diffDays <= 60;
    }).length;

    return { total, active, inactive, expired, prod, sandbox, expiringSoon };
  }, [credentials]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
    setFormErrors({});
    setShowSecretInForm(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cred: ApiProviderCredential) => {
    setIsEditing(true);
    setEditingId(cred.id);
    setFormData({
      name: cred.name,
      category: cred.category,
      environment: cred.environment,
      base_url: cred.base_url,
      api_key: cred.api_key,
      api_secret: "", // Leave blank to preserve existing vault secret
      access_token: "",
      status: cred.status,
      expiry_date: cred.expiry_date ? cred.expiry_date.slice(0, 10) : "",
      description: cred.description || "",
    });
    setFormErrors({});
    setShowSecretInForm(false);
    setIsModalOpen(true);
  };

  // Validate Form
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Provider name is required";
    if (!formData.base_url.trim()) errs.base_url = "Base URL is required";
    if (!formData.api_key.trim()) errs.api_key = "API Key / Client ID is required";
    if (!isEditing && !formData.api_secret.trim()) {
      errs.api_secret = "API Secret is required for new credentials";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Add/Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isEditing && editingId) {
        const updatePayload: UpdateCredentialInput = {
          name: formData.name,
          category: formData.category,
          environment: formData.environment,
          base_url: formData.base_url,
          api_key: formData.api_key,
          status: formData.status,
          expiry_date: formData.expiry_date,
          description: formData.description,
        };

        if (formData.api_secret.trim()) {
          updatePayload.api_secret = formData.api_secret.trim();
        }
        if (formData.access_token?.trim()) {
          updatePayload.access_token = formData.access_token.trim();
        }

        const updated = await updateApiCredential(editingId, updatePayload);
        setCredentials((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        setSuccessMessage(`Updated credentials for ${updated.name}. Secrets secured.`);
      } else {
        const created = await createApiCredential(formData);
        setCredentials((prev) => [created, ...prev]);
        setSuccessMessage(`Registered and vaulted credentials for ${created.name}.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Failed to save API credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable / Revoke Action
  const handleDisable = async (cred: ApiProviderCredential) => {
    const targetStatus = cred.status === "active" ? "inactive" : "active";
    const confirmMsg =
      targetStatus === "inactive"
        ? `Disable API credential for "${cred.name}"? Active calls will be blocked.`
        : `Re-activate API credential for "${cred.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await disableApiCredential(cred.id, targetStatus as "inactive");
      setCredentials((prev) => prev.map((c) => (c.id === cred.id ? res.credential : c)));
      setSuccessMessage(`Credential status changed to ${targetStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to toggle status");
    }
  };

  // Test Connection
  const handleRunTest = async (cred: ApiProviderCredential) => {
    setTestingItem(cred);
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testApiCredential(cred.id);
      setTestResult(result);
      // update local status
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id
            ? {
                ...c,
                last_status_code: result.statusCode,
                last_latency_ms: result.latencyMs,
                last_tested_at: result.testedAt,
              }
            : c
        )
      );
    } catch (err: any) {
      setTestResult({
        success: false,
        statusCode: 500,
        statusText: "Client Exception",
        latencyMs: 0,
        testedAt: new Date().toISOString(),
        message: err.message || "Failed to initiate probe",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Open Audit Logs
  const handleOpenLogs = async () => {
    setIsLogsDrawerOpen(true);
    setIsLoadingLogs(true);
    try {
      const logs = await fetchApiLogs();
      setAuditLogs(logs);
    } catch (err: any) {
      console.error("Failed to load logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Quick test individual provider card
  const handleCardTest = async (cred: ApiProviderCredential) => {
    setPingingCardId(cred.id);
    try {
      const result = await testApiCredential(cred.id);
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id
            ? {
                ...c,
                last_status_code: result.statusCode,
                last_latency_ms: result.latencyMs,
                last_tested_at: result.testedAt,
              }
            : c
        )
      );
      setSuccessMessage(
        `Probe response from ${cred.name}: HTTP ${result.statusCode} (${result.latencyMs}ms)`
      );
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || `Probe failed for ${cred.name}`);
    } finally {
      setPingingCardId(null);
    }
  };

  // Quick toggle Active/Inactive directly from the card
  const handleToggleStatusQuick = async (cred: ApiProviderCredential) => {
    const targetStatus = cred.status === "active" ? "inactive" : "active";
    try {
      const res = await disableApiCredential(cred.id, targetStatus as "inactive");
      setCredentials((prev) => prev.map((c) => (c.id === cred.id ? res.credential : c)));
      setSuccessMessage(`${cred.name} is now ${targetStatus.toUpperCase()}`);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update status");
    }
  };

  // Batch Ping All Active Providers
  const handlePingAll = async () => {
    const targetList = credentials.filter((c) => c.status === "active");
    if (targetList.length === 0) return;

    setIsPingingAll(true);
    setPingProgress({ current: 0, total: targetList.length });

    let count = 0;
    for (const cred of targetList) {
      try {
        const result = await testApiCredential(cred.id);
        setCredentials((prev) =>
          prev.map((c) =>
            c.id === cred.id
              ? {
                  ...c,
                  last_status_code: result.statusCode,
                  last_latency_ms: result.latencyMs,
                  last_tested_at: result.testedAt,
                }
              : c
          )
        );
      } catch (e) {
        console.warn("Ping failed for", cred.name);
      }
      count++;
      setPingProgress({ current: count, total: targetList.length });
    }

    setIsPingingAll(false);
    setPingProgress(null);
    setSuccessMessage(`Live health check completed for ${count} active providers.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Category Icon Resolver
  const getCategoryIcon = (cat: ApiProviderCategory) => {
    switch (cat) {
      case "Flight":
        return Plane;
      case "Train":
        return Train;
      case "Bus":
        return Bus;
      case "Hotel":
        return Building;
      case "Resort":
        return Sparkles;
      case "Payment":
        return CreditCard;
      case "Maps":
        return MapPin;
      case "SMS":
        return MessageSquare;
      case "Email":
        return Mail;
      case "CRM":
        return Users;
      default:
        return Server;
    }
  };

  // Visual Connection Status Indicator with pulsating beacon
  const renderConnectionStatusIndicator = (status: CredentialStatus, showLabel = true) => {
    if (status === "active") {
      return (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] border border-emerald-300"></span>
          </span>
          {showLabel && (
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              Active
            </span>
          )}
        </div>
      );
    }

    if (status === "inactive") {
      return (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500 border border-slate-400"></span>
          </span>
          {showLabel && (
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5 text-slate-500" />
              Inactive
            </span>
          )}
        </div>
      );
    }

    if (status === "expired") {
      return (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]"></span>
          </span>
          {showLabel && (
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Expired
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]"></span>
        </span>
        {showLabel && (
          <span className="text-xs font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Revoked
          </span>
        )}
      </div>
    );
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Category Badge Helper
  const getCategoryColor = (cat: ApiProviderCategory) => {
    switch (cat) {
      case "Flight":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "Train":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Bus":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Hotel":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      case "Resort":
        return "bg-teal-500/10 text-teal-400 border-teal-500/30";
      case "Payment":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Maps":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "SMS":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Email":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "CRM":
        return "bg-pink-500/10 text-pink-400 border-pink-500/30";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const getStatusBadge = (status: CredentialStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Inactive
          </span>
        );
      case "expired":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Expired
          </span>
        );
      case "revoked":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-rose-400" />
            Revoked
          </span>
        );
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "No Expiry";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Header & Security Guarantee Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black shadow-inner">
              <Key className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">API Credentials Vault</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Admin RBAC Only
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Zero Secrets in Browser
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Supabase Edge Functions
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              api_providers &amp; api_logs
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Encrypted credential management for Flight GDS, IRCTC Trains, Intercity Buses, Hotels, Resorts, Razorpay Escrow, Google Maps, Gupshup SMS, SendGrid, and CRM suites with strict server-side masking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenLogs}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            title="Inspect audit logs in api_logs table"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Audit Logs</span>
          </button>

          <button
            onClick={loadCredentials}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title="Refresh credentials"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Provider</span>
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
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Providers</div>
          <div className="text-xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{stats.total}</span>
            <span className="text-[11px] font-normal text-slate-500">configured</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Active Keys</div>
          <div className="text-xl font-bold text-emerald-300 mt-1 flex items-baseline gap-2">
            <span>{stats.active}</span>
            <span className="text-[11px] font-normal text-emerald-500/80">ready</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Production Tier</div>
          <div className="text-xl font-bold text-purple-300 mt-1 flex items-baseline gap-2">
            <span>{stats.prod}</span>
            <span className="text-[11px] font-normal text-purple-400/80">live</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Sandbox Tier</div>
          <div className="text-xl font-bold text-amber-300 mt-1 flex items-baseline gap-2">
            <span>{stats.sandbox}</span>
            <span className="text-[11px] font-normal text-amber-400/80">test env</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Expiry Monitor</div>
          <div className="text-xl font-bold text-sky-300 mt-1 flex items-baseline gap-2">
            <span>{stats.expiringSoon}</span>
            <span className="text-[11px] font-normal text-sky-400/80">&lt; 60 days</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Controls */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search provider, key preview, category, or base URL..."
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

          {/* Environment */}
          <div className="w-full md:w-44">
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Environments</option>
              <option value="production">Production</option>
              <option value="sandbox">Sandbox / Staging</option>
            </select>
          </div>

          {/* Status */}
          <div className="w-full md:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-800/60 scrollbar-none text-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              selectedCategory === "all"
                ? "bg-slate-700 text-white"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All (10)
          </button>
          {PROVIDER_CATEGORIES.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all border ${
                selectedCategory === cat.category
                  ? getCategoryColor(cat.category)
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* 4. View Switcher & Live Health Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
        {/* Left: View Mode Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Connection Dashboard</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                viewMode === "dashboard"
                  ? "bg-indigo-500/40 text-indigo-100"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {stats.active} Online
            </span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Credentials Table</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                viewMode === "table"
                  ? "bg-indigo-500/40 text-indigo-100"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {filteredCredentials.length}
            </span>
          </button>
        </div>

        {/* Right: Quick Batch Ping & Diagnostics */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-[11px] text-slate-400 hidden md:flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{stats.active} Active</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">{stats.inactive} Inactive</span>
            {stats.expired > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-400">{stats.expired} Expired</span>
              </>
            )}
          </div>

          <button
            onClick={handlePingAll}
            disabled={isPingingAll || stats.active === 0}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all border border-slate-700 flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            title="Probe all active endpoints via Edge Proxy"
          >
            <Activity className={`w-3.5 h-3.5 text-indigo-400 ${isPingingAll ? "animate-spin" : ""}`} />
            <span>
              {isPingingAll
                ? `Pinging (${pingProgress?.current || 0}/${pingProgress?.total || 0})...`
                : "Ping All Active"}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Main View: Connection Dashboard or Credentials Table */}
      {viewMode === "dashboard" ? (
        /* ================== CONNECTION STATUS DASHBOARD VIEW ================== */
        <div className="space-y-4">
          {/* Health Telemetry Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Live Connection Gateway Dashboard</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {Math.round((stats.active / (stats.total || 1)) * 100)}% Available
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual connection status across {credentials.length} registered travel provider endpoints.
                </p>
              </div>
            </div>

            {/* Quick Status Legend with Visual Indicators */}
            <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-semibold text-[11px]">Active • Online ({stats.active})</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-2">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-500"></span>
                <span className="text-slate-400 font-semibold text-[11px]">Inactive • Standby ({stats.inactive})</span>
              </div>
              {stats.expired > 0 && (
                <>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    <span className="text-amber-400 font-semibold text-[11px]">Expired ({stats.expired})</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
              <p className="font-semibold text-sm">Querying API Providers Connection Health...</p>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
              <Key className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No registered providers match this filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedEnv("all");
                  setSelectedStatus("all");
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCredentials.map((cred) => {
                const CategoryIcon = getCategoryIcon(cred.category);
                const isCardPinging = pingingCardId === cred.id;
                const isActive = cred.status === "active";

                return (
                  <div
                    key={cred.id}
                    className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden shadow-lg group ${
                      isActive
                        ? "bg-slate-900/90 border-slate-800 hover:border-emerald-500/40 hover:shadow-emerald-950/20"
                        : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700 opacity-90"
                    }`}
                  >
                    {/* Top ambient status highlight line */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"
                          : cred.status === "expired"
                          ? "bg-amber-500"
                          : cred.status === "revoked"
                          ? "bg-rose-500"
                          : "bg-slate-700"
                      }`}
                    />

                    {/* Card Header: Icon, Name, Category & VISUAL STATUS INDICATOR */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 border ${
                              isActive
                                ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryColor(
                                  cred.category
                                )}`}
                              >
                                {cred.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                                  cred.environment === "production"
                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                }`}
                              >
                                {cred.environment}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1 leading-snug line-clamp-1" title={cred.name}>
                              {cred.name}
                            </h4>
                          </div>
                        </div>

                        {/* VISUAL CONNECTION STATUS INDICATOR */}
                        <div
                          className={`px-2.5 py-1 rounded-full border shrink-0 transition-all ${
                            isActive
                              ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                              : "bg-slate-900 border-slate-800"
                          }`}
                        >
                          {renderConnectionStatusIndicator(cred.status)}
                        </div>
                      </div>

                      {/* Description if present */}
                      {cred.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mb-3.5" title={cred.description}>
                          {cred.description}
                        </p>
                      )}

                      {/* Connection Details & Endpoint */}
                      <div className="space-y-2 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-3.5 text-xs">
                        {/* Base URL */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">Endpoint</span>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300 truncate max-w-[190px]">
                            <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="truncate" title={cred.base_url}>
                              {cred.base_url}
                            </span>
                            <button
                              onClick={() => handleCopy(cred.base_url, `url-${cred.id}`)}
                              className="text-slate-500 hover:text-slate-300 shrink-0 ml-0.5"
                              title="Copy URL"
                            >
                              {copiedKeyId === `url-${cred.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* API Key */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">API Key</span>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-200">
                            <Key className="w-3 h-3 text-slate-400" />
                            <span>{cred.api_key}</span>
                            <button
                              onClick={() => handleCopy(cred.api_key, `key-${cred.id}`)}
                              className="text-slate-500 hover:text-slate-300 ml-0.5"
                              title="Copy API Key"
                            >
                              {copiedKeyId === `key-${cred.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Secret Vault Status */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">Secret Vault</span>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                            <Lock className="w-3 h-3" />
                            <span>{cred.masked_secret}</span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Telemetry & Latency Box */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Latency & Status */}
                        <div className="bg-slate-950/40 rounded-lg p-2 border border-slate-800/60">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                            Response Health
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 font-semibold text-xs">
                            {typeof cred.last_status_code === "number" ? (
                              <>
                                <span
                                  className={
                                    cred.last_status_code < 400 ? "text-emerald-400" : "text-rose-400"
                                  }
                                >
                                  HTTP {cred.last_status_code}
                                </span>
                                <span className="text-slate-400 font-mono text-[10px]">
                                  ({cred.last_latency_ms || 0}ms)
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-400">Untested</span>
                            )}
                          </div>
                        </div>

                        {/* Expiry */}
                        <div className="bg-slate-950/40 rounded-lg p-2 border border-slate-800/60">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                            Credentials Expiry
                          </div>
                          <div className="mt-1 text-xs font-semibold text-slate-300 truncate">
                            {formatDate(cred.expiry_date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      {/* Left: Quick Active/Inactive Toggle */}
                      <button
                        onClick={() => handleToggleStatusQuick(cred)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                          isActive
                            ? "bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border-slate-700 hover:border-rose-500/40"
                            : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/30"
                        }`}
                        title={isActive ? "Deactivate provider" : "Activate provider"}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isActive ? "Deactivate" : "Activate"}</span>
                      </button>

                      {/* Right: Test Connection + Edit */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCardTest(cred)}
                          disabled={isCardPinging}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all border border-indigo-500/30 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                          title="Ping connection via edge proxy"
                        >
                          <Play
                            className={`w-3.5 h-3.5 text-indigo-400 ${
                              isCardPinging ? "animate-spin" : ""
                            }`}
                          />
                          <span>{isCardPinging ? "Pinging..." : "Test Ping"}</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(cred)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
                          title="Edit / Rotate credentials"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ================== CREDENTIALS TABLE VIEW ================== */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Provider &amp; Service</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Environment</th>
                  <th className="px-4 py-3.5">API Key / Client ID</th>
                  <th className="px-4 py-3.5">API Secret (Vault Masked)</th>
                  <th className="px-4 py-3.5">Base URL</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Expiry</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                      <span>Accessing secure API Credentials vault...</span>
                    </td>
                  </tr>
                ) : filteredCredentials.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                      <Key className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-300">No credentials match your filter.</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedEnv("all");
                          setSelectedStatus("all");
                        }}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredCredentials.map((cred) => (
                    <tr
                      key={cred.id}
                      className={`hover:bg-slate-850/60 transition-colors ${
                        cred.status !== "active" ? "opacity-75 bg-slate-950/30" : ""
                      }`}
                    >
                      {/* 1. Name */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-semibold text-white truncate" title={cred.name}>
                          {cred.name}
                        </div>
                        {cred.description && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5" title={cred.description}>
                            {cred.description}
                          </div>
                        )}
                      </td>

                      {/* 2. Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCategoryColor(cred.category)}`}>
                          {cred.category}
                        </span>
                      </td>

                      {/* 3. Environment */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            cred.environment === "production"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {cred.environment}
                        </span>
                      </td>

                      {/* 4. API Key */}
                      <td className="px-4 py-3.5 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 w-fit">
                          <span className="text-slate-200">{cred.api_key}</span>
                          <button
                            onClick={() => handleCopy(cred.api_key, `key-${cred.id}`)}
                            className="text-slate-500 hover:text-slate-300"
                            title="Copy API Key"
                          >
                            {copiedKeyId === `key-${cred.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 5. API Secret (Never plain text) */}
                      <td className="px-4 py-3.5 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 w-fit">
                          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-emerald-400/90 font-semibold tracking-wider">
                            {cred.masked_secret}
                          </span>
                        </div>
                      </td>

                      {/* 6. Base URL */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-indigo-400 max-w-[180px] truncate" title={cred.base_url}>
                        {cred.base_url}
                      </td>

                      {/* 7. Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {renderConnectionStatusIndicator(cred.status)}
                      </td>

                      {/* 8. Expiry */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        <div>{formatDate(cred.expiry_date)}</div>
                        {typeof cred.last_status_code === "number" && (
                          <div className="text-[10px] mt-0.5 flex items-center gap-1">
                            <span
                              className={
                                cred.last_status_code < 400 ? "text-emerald-400" : "text-rose-400"
                              }
                            >
                              ● {cred.last_status_code}
                            </span>
                            <span className="text-slate-500">({cred.last_latency_ms || 0}ms)</span>
                          </div>
                        )}
                      </td>

                      {/* 9. Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRunTest(cred)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all border border-indigo-500/30 flex items-center gap-1 cursor-pointer"
                            title="Test connection via edge proxy"
                          >
                            <Play className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Test</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(cred)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
                            title="Edit / Rotate credentials"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDisable(cred)}
                            className={`p-1.5 rounded-lg transition-all border cursor-pointer ${
                              cred.status === "active"
                                ? "bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border-slate-700 hover:border-rose-500/40"
                                : "bg-slate-800 hover:bg-emerald-950/60 text-slate-400 hover:text-emerald-300 border-slate-700 hover:border-emerald-500/40"
                            }`}
                            title={cred.status === "active" ? "Disable credential" : "Re-activate credential"}
                          >
                            {cred.status === "active" ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Registered Providers: <span className="font-semibold text-white">{filteredCredentials.length}</span> /{" "}
              <span className="font-semibold text-white">{credentials.length}</span> total
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> Vault Encryption Enabled
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Server className="w-3.5 h-3.5" /> Edge Proxy Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT CREDENTIAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  {isEditing ? <Edit2 className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isEditing ? "Update API Credential" : "Register API Provider Credential"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEditing
                      ? "Rotate keys or update service endpoints in secure vault"
                      : "Vault credentials safely. Secrets are encrypted and never logged."}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              {/* Category & Environment Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Provider Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ApiProviderCategory;
                      const preset = PROVIDER_CATEGORIES.find((p) => p.category === newCat);
                      setFormData({
                        ...formData,
                        category: newCat,
                        base_url: preset ? preset.defaultBaseUrl : formData.base_url,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    {PROVIDER_CATEGORIES.map((p) => (
                      <option key={p.category} value={p.category}>
                        {p.category} ({p.label})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Environment *</label>
                  <select
                    value={formData.environment}
                    onChange={(e) =>
                      setFormData({ ...formData, environment: e.target.value as ApiEnvironment })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="production">Production (Live Gateway)</option>
                    <option value="sandbox">Sandbox / Staging</option>
                  </select>
                </div>
              </div>

              {/* Provider Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Provider Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. IndiGo Airlines NDC Gateway or IRCTC Railway Engine"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:ring-1 ${
                    formErrors.name
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
                {formErrors.name && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.name}</p>}
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">API Base URL *</label>
                <input
                  type="text"
                  value={formData.base_url}
                  onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                  placeholder="https://api.provider.com/v1"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border font-mono text-xs text-white focus:outline-none focus:ring-1 ${
                    formErrors.base_url
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
                {formErrors.base_url && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.base_url}</p>}
              </div>

              {/* API Key & API Secret */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">API Key / Client ID *</label>
                  <input
                    type="text"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    placeholder="e.g. IND_PROD_9821_KEY"
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border font-mono text-xs text-white focus:outline-none focus:ring-1 ${
                      formErrors.api_key
                        ? "border-rose-500 focus:ring-rose-500"
                        : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                  {formErrors.api_key && <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.api_key}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>API Secret / Client Secret {isEditing ? "(Leave empty to keep)" : "*"}</span>
                    <button
                      type="button"
                      onClick={() => setShowSecretInForm(!showSecretInForm)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {showSecretInForm ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showSecretInForm ? "Hide" : "Show"}</span>
                    </button>
                  </label>
                  <input
                    type={showSecretInForm ? "text" : "password"}
                    value={formData.api_secret}
                    onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                    placeholder={isEditing ? "••••••••••••••••" : "Paste raw secret"}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border font-mono text-xs text-white focus:outline-none focus:ring-1 ${
                      formErrors.api_secret
                        ? "border-rose-500 focus:ring-rose-500"
                        : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                  {formErrors.api_secret && (
                    <p className="text-[11px] text-rose-400 mt-0.5">{formErrors.api_secret}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Will be masked immediately. Never visible to users or browser.
                  </p>
                </div>
              </div>

              {/* Status & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as CredentialStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="active">Active (Available for Gateway)</option>
                    <option value="inactive">Inactive (Disabled)</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Usage instructions, tier limits, or account ownership notes..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Security Callout */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Security Assurance:</strong> Secrets are dispatched securely via TLS and encrypted in the backend memory &amp; Supabase vault. Neither the client bundle nor the network response exposes the plain text secret.
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? "Vaulting Credentials..."
                    : isEditing
                    ? "Update Credentials"
                    : "Save to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. TEST RUNNER POPUP MODAL */}
      {testingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edge Function Credential Handshake</h3>
                  <p className="text-xs text-slate-400">{testingItem.name}</p>
                </div>
              </div>
              <button onClick={() => setTestingItem(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-slate-500 text-[10px] block">ENDPOINT BASE URL</span>
                  <span className="text-indigo-300 font-semibold">{testingItem.base_url}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryColor(testingItem.category)}`}>
                  {testingItem.category}
                </span>
              </div>

              {isTesting ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
                  <p className="text-sm font-bold text-white">Negotiating TLS &amp; Ingress Handshake...</p>
                  <p className="text-xs text-slate-500">Provider secret verified strictly inside server environment.</p>
                </div>
              ) : testResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">HTTP Status</span>
                      <div
                        className={`text-base font-bold mt-1 ${
                          testResult.statusCode < 400 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {testResult.statusCode} {testResult.statusText}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Latency</span>
                      <div className="text-base font-bold text-sky-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{testResult.latencyMs} ms</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Diagnosis</span>
                      <div className="text-base font-bold mt-1">
                        {testResult.success ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Healthy
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-1">
                      Gateway Message
                    </span>
                    <p className="font-mono text-slate-200">{testResult.message}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Logged to <code className="font-mono">api_logs</code> with zero credential leakage.</span>
                  </div>
                </div>
              ) : null}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleRunTest(testingItem)}
                  disabled={isTesting}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                  <span>Re-test</span>
                </button>

                <button
                  onClick={() => setTestingItem(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. AUDIT LOGS DRAWER */}
      {isLogsDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">API Credentials Audit Log</h3>
                  <p className="text-xs text-slate-400">Streamed from Supabase api_logs table</p>
                </div>
              </div>
              <button onClick={() => setIsLogsDrawerOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {isLoadingLogs ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                  <span>Loading audit logs...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>No audit events recorded yet.</p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{log.provider_name || "System"}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>User: {log.admin_user}</span>
                      <span>{new Date(log.timestamp).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> Zero credential exposure guaranteed
              </span>
              <button
                onClick={() => setIsLogsDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiCredentialsPage;
