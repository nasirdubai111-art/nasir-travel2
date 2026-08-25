import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Server,
  Database,
  Key,
  ArrowRight,
  ArrowDown,
  Layers,
  Cpu,
  Globe,
  UserCheck,
  User,
  CheckCircle2,
  Activity,
  Play,
  Terminal,
  ExternalLink,
  Fingerprint,
  Radio,
  FileText,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface IntegrationFlowVisualizerProps {
  operatorName?: string;
  categoryName?: string;
}

export function IntegrationFlowVisualizer({
  operatorName = "Travel Operator",
  categoryName = "Ecosystem Operator",
}: IntegrationFlowVisualizerProps) {
  const [activeSimulation, setActiveSimulation] = useState<"customer" | "admin" | null>(null);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [activeFlowTab, setActiveFlowTab] = useState<"both" | "customer" | "admin">("both");
  const [showPayloadModal, setShowPayloadModal] = useState<string | null>(null);

  // Customer / Operator Flow Steps
  // Customer/Operator Frontend → Secure API → Backend Services → Database/External Integrations
  const customerFlowSteps = [
    {
      id: "cust_frontend",
      stage: "STAGE 1",
      title: "Customer/Operator Frontend",
      subtitle: "Web SPA & Mobile Interface",
      icon: <Globe className="w-5 h-5 text-sky-400" />,
      badge: "Public / Partner View",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      description: "Search inventory, real-time availability, dynamic pricing, booking forms, & partner listings.",
      securityNotes: "Strictly sanitized client state. Zero internal keys, secrets, or DB credentials exposed.",
      techStack: "React 18 • Tailwind CSS • Vite • Port 3000 Ingress",
      samplePayload: {
        action: "CREATE_BOOKING_REQUEST",
        operatorId: "op_lodge_9921",
        dates: { checkIn: "2026-09-12", checkOut: "2026-09-15" },
        guests: 2,
        clientIp: "203.0.113.195",
        tlsVersion: "TLS_1.3_AES_256_GCM",
      },
    },
    {
      id: "cust_secure_api",
      stage: "STAGE 2",
      title: "Secure API",
      subtitle: "Reverse Proxy & Gateway",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      badge: "Port 3000 Gateway",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description: "HTTPS/TLS termination, rate limiting, request validation, CORS policy, & token verification.",
      securityNotes: "Mutes upstream secrets, rejects malformed payloads, enforces JWT bearer verification.",
      techStack: "Express 5 Gateway • Nginx Reverse Proxy • Rate Limiter",
      samplePayload: {
        status: "AUTHORIZED",
        rateLimit: "985/1000 remaining",
        jwtVerified: true,
        sanitizedParams: { valid: true, sanitized: true },
        correlationId: "REQ-CORR-9981-CUSTOMER",
      },
    },
    {
      id: "cust_backend_services",
      stage: "STAGE 3",
      title: "Backend Services",
      subtitle: "Microservices & Business Logic",
      icon: <Server className="w-5 h-5 text-indigo-400" />,
      badge: "Protected Server-Side",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      description: "Yield management, booking engine, escrow calculation, commission split & notification queue.",
      securityNotes: "Isolated Node microservices behind private VPC. Executes business rules securely.",
      techStack: "Node.js • Express • Async Queues • Settlement Engine",
      samplePayload: {
        bookingEngine: "EXECUTE_LOCK_MUTEX",
        grossAmount: 48500,
        commissionRate: "4.8%",
        escrowHoldback: 2328,
        netOperatorPayable: 46172,
        status: "MUTEX_ACQUIRED",
      },
    },
    {
      id: "cust_db_external",
      stage: "STAGE 4",
      title: "Database/External Integrations",
      subtitle: "Data Persistence & 3rd Party",
      icon: <Database className="w-5 h-5 text-purple-400" />,
      badge: "Encrypted Storage & APIs",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      description: "PostgreSQL database, Razorpay/Stripe payments, GDS feeds, IRCTC rail, SDRF & Devasthanam.",
      securityNotes: "AES-256 encrypted at rest. Vault-stored third-party API credentials and webhook listeners.",
      techStack: "PostgreSQL DB • Razorpay API • Amadeus GDS • Devasthanam",
      samplePayload: {
        dbRecordId: "TBL_BOOKINGS_REC_88491",
        paymentGateStatus: "PAYMENT_INTENT_CONFIRMED",
        externalSync: "DEVASHTHANAM_VIP_PASS_ISSUED",
        auditLogged: true,
      },
    },
  ];

  // Admin Flow Steps
  // Admin Frontend → Admin Authentication → Admin APIs → Backend/Admin Services → Database
  const adminFlowSteps = [
    {
      id: "admin_frontend",
      stage: "STAGE 1",
      title: "Admin Frontend",
      subtitle: "Super Admin & Governance Console",
      icon: <UserCheck className="w-5 h-5 text-amber-400" />,
      badge: "Restricted Admin UI",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      description: "Master partner onboarding, KYC review, commission ledger controls, & system telemetry.",
      securityNotes: "Accessible only from authorized internal IPs and protected SSO administrative boundaries.",
      techStack: "Admin SPA • RBAC Matrix • Strict Security Headers",
      samplePayload: {
        adminUser: "superadmin_governance@travel-india.internal",
        portalAction: "DISBURSE_SETTLEMENT_BATCH",
        operatorFilter: "op_chardham_8819",
        timestamp: "2026-08-25T09:56:00Z",
      },
    },
    {
      id: "admin_auth",
      stage: "STAGE 2",
      title: "Admin Authentication",
      subtitle: "Multi-Factor & Session RBAC",
      icon: <Fingerprint className="w-5 h-5 text-rose-400" />,
      badge: "MFA / FIDO2 / RBAC",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      description: "Hardware token (WebAuthn), TOTP MFA, cryptographic session validation, & privilege check.",
      securityNotes: "Zero trust session lifetime (15 mins). Revokes token automatically on privilege change.",
      techStack: "FIDO2 / WebAuthn • OAuth2 / OIDC • HMAC Session Token",
      samplePayload: {
        mfaVerified: true,
        hardwareToken: "YUBIKEY_FIDO2_SECURE_AUTH",
        roles: ["SUPER_ADMIN", "SETTLEMENT_GOVERNOR"],
        sessionValidUntil: "2026-08-25T10:11:00Z",
      },
    },
    {
      id: "admin_apis",
      stage: "STAGE 3",
      title: "Admin APIs",
      subtitle: "Scoped Management Gateways",
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      badge: "Internal API Gateways",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description: "Dedicated admin routing, signature validation, rate limits, & mutation audit interceptors.",
      securityNotes: "Non-routable from public internet. Requires admin bearer JWT + mutual TLS (mTLS).",
      techStack: "mTLS Admin Endpoints • Scoped RBAC Controllers",
      samplePayload: {
        endpoint: "/api/admin/v1/settlements/execute-batch",
        mTLSCertVerified: true,
        callerRole: "SUPER_ADMIN",
        auditTraceId: "AUDIT-MTR-ADMIN-99021",
      },
    },
    {
      id: "admin_backend_services",
      stage: "STAGE 4",
      title: "Backend/Admin Services",
      subtitle: "Governance & Settlement Engines",
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      badge: "Privileged Execution",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      description: "KYC document verifier, payout batch disburser, audit trail recorder, & compliance engine.",
      securityNotes: "Double-entry accounting ledger engine with immutable audit verification hashes.",
      techStack: "Banking RTGS Gateway • KYC OCR Engine • Ledger Worker",
      samplePayload: {
        batchId: "SETTLE-BATCH-2026-W34",
        payoutOperatorCount: 14,
        totalDisbursed: "₹6,11,18,400",
        tdsDeducted: "₹6,42,000",
        bankAck: "RTGS_ACK_CONFIRMED_RBI_GATEWAY",
      },
    },
    {
      id: "admin_database",
      stage: "STAGE 5",
      title: "Database",
      subtitle: "Master Encrypted Ledger & Tables",
      icon: <Database className="w-5 h-5 text-amber-400" />,
      badge: "Master Encrypted DB",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      description: "PostgreSQL master cluster, audit ledger, partner KYC vaults, & transaction records.",
      securityNotes: "Row-Level Security (RLS), encrypted columns with KMS-managed rotating master keys.",
      techStack: "PostgreSQL Master Cluster • KMS Key Vault • RLS Policies",
      samplePayload: {
        tableUpdated: "operator_settlement_ledger_master",
        immutableHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "COMMITTED_ACID",
      },
    },
  ];

  // Simulator helper
  const runSimulation = (type: "customer" | "admin") => {
    setActiveSimulation(type);
    setSimulationStep(0);

    const maxSteps = type === "customer" ? customerFlowSteps.length : adminFlowSteps.length;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < maxSteps) {
        setSimulationStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveSimulation(null);
          setSimulationStep(0);
        }, 3500);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Leakage Architecture</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Port 3000 Ingress
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                RBAC Multi-Tenant
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              <span>Unified System Integration Flow</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Strictly segregated end-to-end data pipelines for <strong>Customer &amp; Operator Interactions</strong> and <strong>Privileged Platform Administration</strong>.
            </p>
          </div>

          {/* Flow View Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveFlowTab("both")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFlowTab === "both"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Dual Flow View
            </button>
            <button
              onClick={() => setActiveFlowTab("customer")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFlowTab === "customer"
                  ? "bg-sky-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Customer Flow
            </button>
            <button
              onClick={() => setActiveFlowTab("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFlowTab === "admin"
                  ? "bg-amber-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin Flow
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* FLOW 1: CUSTOMER / OPERATOR INTEGRATION FLOW */}
      {/* ======================================================================= */}
      {(activeFlowTab === "both" || activeFlowTab === "customer") && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 font-black text-sm">
                1
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>CUSTOMER / OPERATOR INTEGRATION FLOW</span>
                </h4>
                <div className="text-2xs text-sky-400 font-mono flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span>Customer/Operator Frontend</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Secure API</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Backend Services</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Database/External Integrations</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => runSimulation("customer")}
              disabled={activeSimulation !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold shadow-md border border-sky-400/30 transition-all active:scale-95 shrink-0"
            >
              <Play className="w-3 h-3" />
              <span>{activeSimulation === "customer" ? `Simulating Step ${simulationStep + 1}...` : "Simulate Customer Request"}</span>
            </button>
          </div>

          {/* Visual Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {customerFlowSteps.map((step, idx) => {
              const isCurrent = activeSimulation === "customer" && simulationStep === idx;
              const isPassed = activeSimulation === "customer" && simulationStep > idx;

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isCurrent
                      ? "bg-sky-950/70 border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.02] ring-2 ring-sky-400/50"
                      : isPassed
                      ? "bg-slate-900/90 border-emerald-500/60"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Step Connector Indicator */}
                  {idx < customerFlowSteps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 items-center justify-center text-slate-400 shadow-md">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-3xs font-mono text-slate-400 font-extrabold uppercase">
                            {step.stage}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-3xs font-bold border ${step.badgeColor}`}>
                            {step.badge}
                          </span>
                        </div>
                      </div>

                      {isPassed && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isCurrent && (
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping shrink-0" />
                      )}
                    </div>

                    <div>
                      <h5 className="text-xs font-black text-white leading-tight">
                        {step.title}
                      </h5>
                      <div className="text-3xs text-slate-400 font-mono mt-0.5">
                        {step.subtitle}
                      </div>
                    </div>

                    <p className="text-2xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="text-3xs text-emerald-400/90 font-medium flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{step.securityNotes}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-mono text-slate-500 truncate max-w-[120px]">
                        {step.techStack}
                      </span>
                      <button
                        onClick={() => setShowPayloadModal(JSON.stringify(step.samplePayload, null, 2))}
                        className="text-3xs font-mono text-sky-400 hover:text-sky-300 underline shrink-0"
                      >
                        Inspect Payload
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* FLOW 2: ADMIN INTEGRATION FLOW */}
      {/* ======================================================================= */}
      {(activeFlowTab === "both" || activeFlowTab === "admin") && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-sm">
                2
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>ADMIN INTEGRATION FLOW</span>
                </h4>
                <div className="text-2xs text-amber-400 font-mono flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span>Admin Frontend</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Admin Authentication</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Admin APIs</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Backend/Admin Services</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Database</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => runSimulation("admin")}
              disabled={activeSimulation !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold shadow-md border border-amber-400/30 transition-all active:scale-95 shrink-0"
            >
              <Play className="w-3 h-3" />
              <span>{activeSimulation === "admin" ? `Simulating Step ${simulationStep + 1}...` : "Simulate Admin Flow"}</span>
            </button>
          </div>

          {/* Visual Step Cards (5 Stages) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
            {adminFlowSteps.map((step, idx) => {
              const isCurrent = activeSimulation === "admin" && simulationStep === idx;
              const isPassed = activeSimulation === "admin" && simulationStep > idx;

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl p-3.5 border transition-all duration-300 flex flex-col justify-between space-y-2.5 relative overflow-hidden ${
                    isCurrent
                      ? "bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400/50"
                      : isPassed
                      ? "bg-slate-900/90 border-emerald-500/60"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Step Connector Indicator */}
                  {idx < adminFlowSteps.length - 1 && (
                    <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 items-center justify-center text-slate-400 shadow-md">
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-3xs font-mono text-slate-400 font-extrabold uppercase">
                            {step.stage}
                          </div>
                        </div>
                      </div>

                      {isPassed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                      )}
                    </div>

                    <span className={`inline-block px-2 py-0.5 rounded-full text-3xs font-bold border ${step.badgeColor}`}>
                      {step.badge}
                    </span>

                    <div>
                      <h5 className="text-xs font-black text-white leading-tight">
                        {step.title}
                      </h5>
                      <div className="text-3xs text-slate-400 font-mono mt-0.5">
                        {step.subtitle}
                      </div>
                    </div>

                    <p className="text-2xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="text-3xs text-amber-400/90 font-medium flex items-center gap-1">
                      <Fingerprint className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{step.securityNotes}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-mono text-slate-500 truncate max-w-[90px]">
                        {step.techStack}
                      </span>
                      <button
                        onClick={() => setShowPayloadModal(JSON.stringify(step.samplePayload, null, 2))}
                        className="text-3xs font-mono text-amber-400 hover:text-amber-300 underline shrink-0"
                      >
                        Payload
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparison Matrix & Security Verification Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer vs Admin Security Isolation Matrix */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Security Boundary Isolation Matrix
            </h5>
          </div>

          <div className="space-y-2 text-2xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white block">Customer / Operator Boundary:</strong>
                <span className="text-slate-400">
                  Operates over public HTTPS with rate limiting, TLS 1.3 encryption, and strict output sanitization. Database schemas, raw KYC files, and supplier contracts never touch the client DOM.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white block">Admin Boundary:</strong>
                <span className="text-slate-400">
                  Protected by multi-factor hardware authentication, IP boundary whitelisting, mTLS certificates, and cryptographic mutation logs. Every administrative action generates an immutable audit record.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live System ASCII Topology */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                ASCII Architecture Pipeline
              </h5>
            </div>
            <span className="text-3xs font-mono text-emerald-400">PORT 3000 COMPLIANT</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-2xs text-emerald-300 whitespace-pre overflow-x-auto leading-relaxed max-h-40">
{`1. CUSTOMER/OPERATOR FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000)
              ▼
          Secure API
              │ (JWT Validation & Rate Limit)
              ▼
       Backend Services
              │ (Booking Engine & Yield)
              ▼
 Database / External Integrations
   (PostgreSQL • Payment Gateway • APIs)

2. ADMIN FLOW:
        Admin Frontend
              │ (Whitelisted Admin Portal)
              ▼
     Admin Authentication
              │ (Hardware MFA & RBAC)
              ▼
          Admin APIs
              │ (mTLS Scoped Gateways)
              ▼
   Backend / Admin Services
              │ (Settlement & Audit Engine)
              ▼
          Database
   (Master Encrypted Ledger Tables)`}
          </div>
        </div>
      </div>

      {/* Payload Modal Inspector */}
      {showPayloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Pipeline Telemetry Payload</h4>
              </div>
              <button
                onClick={() => setShowPayloadModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <pre className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-2xs text-emerald-300 overflow-x-auto leading-relaxed">
              {showPayloadModal}
            </pre>

            <div className="flex items-center justify-between text-2xs text-slate-400">
              <span>Encrypted with AES-256-GCM</span>
              <button
                onClick={() => setShowPayloadModal(null)}
                className="px-3.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
