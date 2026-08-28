import React, { useState } from "react";
import {
  Shield,
  Lock,
  Key,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Users,
  Clock,
  Activity,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  Check,
  LogOut,
  Smartphone,
  Server,
  Layers,
  Sliders,
  Filter,
  CheckCheck,
  Send,
  Zap,
} from "lucide-react";
import {
  AdminAccount,
  AdminSession,
  AdminAuditLog,
  ApiCredential,
  MarketingBudgetRule,
  CampaignApprovalRequest,
  INITIAL_ADMIN_ACCOUNTS,
  INITIAL_ADMIN_SESSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_API_CREDENTIALS,
  INITIAL_BUDGET_RULES,
  INITIAL_APPROVAL_REQUESTS,
} from "../../data/adminAuthRbacData";

interface AdminAuthRbacViewProps {
  currentAdmin?: AdminAccount;
  onSwitchAdmin?: (admin: AdminAccount) => void;
  onToast: (msg: string) => void;
}

export function AdminAuthRbacView({
  currentAdmin: propAdmin,
  onSwitchAdmin,
  onToast,
}: AdminAuthRbacViewProps) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount>(
    propAdmin || INITIAL_ADMIN_ACCOUNTS[0]
  );
  const [subTab, setSubTab] = useState<
    "overview" | "accounts" | "sessions" | "audit_logs" | "credentials" | "budget_controls" | "approvals" | "mfa_settings"
  >("overview");

  // Accounts state
  const [accounts, setAccounts] = useState<AdminAccount[]>(INITIAL_ADMIN_ACCOUNTS);
  const [sessions, setSessions] = useState<AdminSession[]>(INITIAL_ADMIN_SESSIONS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [credentials, setCredentials] = useState<ApiCredential[]>(INITIAL_API_CREDENTIALS);
  const [budgetRules, setBudgetRules] = useState<MarketingBudgetRule[]>(INITIAL_BUDGET_RULES);
  const [approvals, setApprovals] = useState<CampaignApprovalRequest[]>(INITIAL_APPROVAL_REQUESTS);

  // Search & Filter states
  const [logFilterCategory, setLogFilterCategory] = useState<string>("all");
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);

  // Invite user modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AdminAccount["role"]>("performance_ads_lead");
  const [newUserDept, setNewUserDept] = useState<AdminAccount["department"]>("Growth & Ads");

  // MFA OTP Simulation state
  const [otpCode, setOtpCode] = useState("492810");
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);

  // Total Marketing Budget Metrics
  const totalMonthlyBudget = budgetRules.reduce((acc, b) => acc + b.monthlyCapINR, 0);
  const totalCurrentSpend = budgetRules.reduce((acc, b) => acc + b.currentSpendINR, 0);
  const overallSpendPercent = Math.round((totalCurrentSpend / totalMonthlyBudget) * 100);

  // Revoke session
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "revoked" as const } : s))
    );
    const newLog: AdminAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      userId: currentAdmin.id,
      userName: currentAdmin.name,
      userRole: currentAdmin.roleLabel,
      action: "BUDGET_UPDATED",
      category: "Security & RBAC",
      details: `Revoked active administrator session ${sessionId} remotely.`,
      ipAddress: "103.21.144.92",
      status: "SUCCESS",
    };
    setAuditLogs([newLog, ...auditLogs]);
    onToast(`Session ${sessionId} successfully revoked! 🔒`);
  };

  // Rotate Key
  const handleRotateKey = (keyId: string) => {
    setTestingKeyId(keyId);
    setTimeout(() => {
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === keyId
            ? {
                ...c,
                lastRotated: new Date().toISOString().split("T")[0],
                expiresInDays: 90,
                status: "CONNECTED" as const,
              }
            : c
        )
      );
      setTestingKeyId(null);
      const newLog: AdminAuditLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        userId: currentAdmin.id,
        userName: currentAdmin.name,
        userRole: currentAdmin.roleLabel,
        action: "API_KEY_ROTATED",
        category: "Security & RBAC",
        details: `Rotated API security secret for ${keyId} with HMAC verification.`,
        ipAddress: "103.21.144.92",
        status: "SUCCESS",
      };
      setAuditLogs([newLog, ...auditLogs]);
      onToast(`API key ${keyId} rotated & encrypted with AES-GCM 256! 🔑`);
    }, 800);
  };

  // Handle Approve / Reject Campaign
  const handleApprovalAction = (reqId: string, action: "APPROVED" | "REJECTED") => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === reqId
          ? {
              ...a,
              status: action,
              reviewedBy: currentAdmin.name,
              reviewedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
            }
          : a
      )
    );
    const newLog: AdminAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      userId: currentAdmin.id,
      userName: currentAdmin.name,
      userRole: currentAdmin.roleLabel,
      action: "APPROVAL_GRANTED",
      category: "Budget Control",
      details: `${action === "APPROVED" ? "Approved" : "Rejected"} campaign request ${reqId}.`,
      ipAddress: "103.21.144.92",
      status: "SUCCESS",
    };
    setAuditLogs([newLog, ...auditLogs]);
    onToast(`Campaign request ${reqId} set to ${action}! ✅`);
  };

  // Handle Invite Admin User
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newAccount: AdminAccount = {
      id: `ADM-00${accounts.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      roleLabel:
        newUserRole === "marketing_director"
          ? "Head of Marketing & Growth"
          : newUserRole === "performance_ads_lead"
          ? "Performance Ads Specialist"
          : newUserRole === "reels_content_creator"
          ? "Reels Content Producer"
          : newUserRole === "seo_lead"
          ? "SEO Lead"
          : "Budget Controller",
      department: newUserDept,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone: "+91 98000 12345",
      status: "invited",
      lastLogin: "Never (Invite Sent)",
      twoFactorEnabled: true,
      permissions:
        newUserRole === "marketing_director"
          ? ["google_ads", "meta_ads", "fb_reels", "ig_reels", "seo", "budget", "approvals"]
          : newUserRole === "performance_ads_lead"
          ? ["google_ads", "meta_ads", "budget"]
          : newUserRole === "reels_content_creator"
          ? ["fb_reels", "ig_reels"]
          : newUserRole === "seo_lead"
          ? ["seo"]
          : ["budget", "approvals"],
    };

    setAccounts([...accounts, newAccount]);
    setIsInviteModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");

    const newLog: AdminAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      userId: currentAdmin.id,
      userName: currentAdmin.name,
      userRole: currentAdmin.roleLabel,
      action: "USER_INVITED",
      category: "Security & RBAC",
      details: `Invited new marketing team member ${newUserName} (${newUserEmail}) with role ${newAccount.roleLabel}.`,
      ipAddress: "103.21.144.92",
      status: "SUCCESS",
    };
    setAuditLogs([newLog, ...auditLogs]);
    onToast(`Invitation & 2FA setup link dispatched to ${newUserEmail}! ✉️`);
  };

  // Generate new OTP
  const handleRegenerateOtp = () => {
    setIsGeneratingOtp(true);
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(newOtp);
      setIsGeneratingOtp(false);
      onToast("Generated fresh TOTP 6-digit verification code!");
    }, 400);
  };

  const filteredLogs = auditLogs.filter(
    (l) => logFilterCategory === "all" || l.category.toLowerCase().includes(logFilterCategory.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {[
          { id: "overview", label: "Security & RBAC Overview", icon: ShieldCheck },
          { id: "accounts", label: "Marketing Team Accounts", icon: Users, count: accounts.length },
          { id: "sessions", label: "Active Sessions & IP Logins", icon: Clock, count: sessions.filter((s) => s.status === "active").length },
          { id: "audit_logs", label: "Admin Audit Trail", icon: Activity, count: auditLogs.length },
          { id: "credentials", label: "API Credentials Vault", icon: Key, count: credentials.length },
          { id: "budget_controls", label: "Marketing Budget Controls", icon: DollarSign },
          { id: "approvals", label: "Campaign Approvals", icon: CheckCircle2, count: approvals.filter((a) => a.status === "PENDING_APPROVAL").length },
          { id: "mfa_settings", label: "MFA & 2FA Security", icon: Smartphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-white text-indigo-900" : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW SUB-TAB */}
      {subTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Security Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Hidden Enterprise Marketing &amp; AI Security Gateway</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold">
                    Zero-Trust RBAC Enforced
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  All Google Ads, Meta Ads, Facebook &amp; Instagram Reels, SEO engines, AI prompt architectures, and marketing budgets are completely segregated from public portals, customers, and travel partners.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Admin User</div>
                <div className="text-xs font-black text-white">{currentAdmin.name}</div>
                <div className="text-[10px] text-indigo-300">{currentAdmin.roleLabel}</div>
              </div>
              <img
                src={currentAdmin.avatar}
                alt={currentAdmin.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-500 shadow-md"
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Active Admins</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">{accounts.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> 100% 2FA Enabled
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Monthly Budget</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-2">₹{(totalMonthlyBudget / 100000).toFixed(1)}L</div>
              <div className="text-[11px] text-slate-400 mt-1">
                ₹{(totalCurrentSpend / 100000).toFixed(1)}L spent ({overallSpendPercent}%)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>API Secrets Vault</span>
                <Key className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">{credentials.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> All Live &amp; Connected
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pending Approvals</span>
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-400 mt-2">
                {approvals.filter((a) => a.status === "PENDING_APPROVAL").length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Requiring Director Signoff</div>
            </div>
          </div>

          {/* Role Switching Matrix Demo */}
          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  Live RBAC Role Simulator
                </h4>
                <p className="text-xs text-slate-400">
                  Switch between marketing personas to test access controls, permission scopes, and approval hierarchies.
                </p>
              </div>
              <span className="text-xs text-indigo-300 font-bold bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-700/50">
                Current: {currentAdmin.name} ({currentAdmin.role})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.map((acc) => {
                const isSelected = currentAdmin.id === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setCurrentAdmin(acc);
                      if (onSwitchAdmin) {
                        onSwitchAdmin(acc);
                      }
                      onToast(`Switched active session to ${acc.name} (${acc.roleLabel})`);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-indigo-900/40 border-indigo-500 ring-1 ring-indigo-400"
                        : "bg-slate-900/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{acc.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                      </div>
                      <span className="text-[10px] text-indigo-300 block truncate">{acc.roleLabel}</span>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {acc.permissions.slice(0, 3).map((perm, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-300 uppercase"
                          >
                            {perm}
                          </span>
                        ))}
                        {acc.permissions.length > 3 && (
                          <span className="text-[9px] text-slate-500">+{acc.permissions.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MARKETING TEAM ACCOUNTS SUB-TAB */}
      {subTab === "accounts" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-black text-white">Marketing Team &amp; Operator Accounts</h3>
              <p className="text-xs text-slate-400">
                Manage user credentials, assign granular access scopes, and enforce 2FA verification.
              </p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Invite Team Member
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3.5">User &amp; Department</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Permissions Matrix</th>
                  <th className="p-3.5">2FA Security</th>
                  <th className="p-3.5">Last Login</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div>
                          <div className="font-bold text-white">{acc.name}</div>
                          <div className="text-[11px] text-slate-400">{acc.email}</div>
                          <span className="text-[9px] text-indigo-300 font-semibold">{acc.department}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                        {acc.roleLabel}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {acc.permissions.map((p, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-mono text-slate-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> TOTP Active
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">{acc.lastLogin}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          onSwitchAdmin(acc);
                          onToast(`Logged in as ${acc.name}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Switch Session
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACTIVE SESSIONS SUB-TAB */}
      {subTab === "sessions" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Active Administrator Sessions</h3>
              <p className="text-xs text-slate-400">
                Monitor live logged-in IP addresses, browser agents, and revoke suspicious sessions instantly.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {sessions.filter((s) => s.status === "active").length} Active Sessions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`p-4 rounded-2xl border transition-all ${
                  sess.status === "active"
                    ? "bg-slate-800/80 border-slate-700 shadow-md"
                    : "bg-slate-900/60 border-slate-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-200">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{sess.userName}</div>
                      <div className="text-[10px] text-indigo-300">{sess.userRole}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      sess.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {sess.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-slate-700/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="font-mono text-indigo-200">{sess.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span>{sess.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Device / Browser:</span>
                    <span>
                      {sess.device} • {sess.browser}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Login Timestamp:</span>
                    <span className="text-slate-400">{sess.loginTime}</span>
                  </div>
                </div>

                {sess.status === "active" && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="w-full mt-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Revoke Session Token
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT LOGS SUB-TAB */}
      {subTab === "audit_logs" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-black text-white">Immutable Admin Audit &amp; Activity Log</h3>
              <p className="text-xs text-slate-400">
                Every campaign edit, budget increase, API key rotation, and reel scheduling event is permanently recorded.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none"
              >
                <option value="all">All Event Categories</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="FB Reels">FB Reels</option>
                <option value="IG Reels">IG Reels</option>
                <option value="SEO Engine">SEO Engine</option>
                <option value="Security & RBAC">Security &amp; RBAC</option>
                <option value="Budget Control">Budget Control</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Admin Operator</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Action Type</th>
                  <th className="p-3.5">Event Details</th>
                  <th className="p-3.5">Client IP</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-bold text-white">{log.userName}</div>
                      <div className="text-[10px] text-indigo-300">{log.userRole}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-indigo-300">{log.action}</span>
                    </td>
                    <td className="p-3.5 text-slate-200 max-w-md">{log.details}</td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-400 whitespace-nowrap">{log.ipAddress}</td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API CREDENTIALS VAULT SUB-TAB */}
      {subTab === "credentials" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">API Credentials &amp; Key Vault</h3>
              <p className="text-xs text-slate-400">
                Manage Google Ads Developer tokens, Meta Graph API tokens, Gemini API keys, and WhatsApp Cloud secrets.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              AES-256 GCM Encrypted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((cred) => {
              const isRevealed = visibleKeyId === cred.id;
              const isTesting = testingKeyId === cred.id;
              return (
                <div key={cred.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-indigo-300 uppercase">
                        {cred.category}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">{cred.serviceName}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{cred.keyLabel}</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">
                      {cred.status}
                    </span>
                  </div>

                  {/* Key Display & Toggle */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="font-mono text-xs text-indigo-200 truncate select-all">
                      {isRevealed ? cred.fullKeyValue : cred.maskedKey}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setVisibleKeyId(isRevealed ? null : cred.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isRevealed ? "Hide Key" : "Show Key"}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cred.fullKeyValue);
                          onToast(`Copied ${cred.serviceName} to clipboard!`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Scopes & Expiry */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      Rotated: <strong className="text-slate-300">{cred.lastRotated}</strong>
                    </span>
                    <span>
                      Expires in: <strong className="text-emerald-400">{cred.expiresInDays} days</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                    <button
                      disabled={isTesting}
                      onClick={() => handleRotateKey(cred.id)}
                      className="flex-1 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                      Rotate Key Secret
                    </button>
                    <button
                      onClick={() => onToast(`API handshake test for ${cred.serviceName} succeeded with 28ms latency! ⚡`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ping Test
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MARKETING BUDGET CONTROLS SUB-TAB */}
      {subTab === "budget_controls" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Marketing Budget &amp; Overspend Controls</h3>
              <p className="text-xs text-slate-400">
                Set hard daily/monthly caps, automated pause triggers on overspend, and approval limits.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Monthly Allocation: </span>
              <span className="text-sm font-black text-emerald-400">₹{(totalMonthlyBudget / 100000).toFixed(1)} Lakhs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetRules.map((rule) => {
              const percentUsed = Math.round((rule.currentSpendINR / rule.monthlyCapINR) * 100);
              return (
                <div key={rule.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white">{rule.channel}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                      {rule.allocatedPercentage}% of Total Budget
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">
                        Monthly Spend: ₹{(rule.currentSpendINR / 1000).toLocaleString("en-IN")}k / ₹
                        {(rule.monthlyCapINR / 1000).toLocaleString("en-IN")}k
                      </span>
                      <span className={percentUsed >= rule.alertThresholdPercent ? "text-amber-400" : "text-emerald-400"}>
                        {percentUsed}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentUsed >= rule.alertThresholdPercent ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${percentUsed}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/80 text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Daily Cap:</span>
                      <strong>₹{rule.dailyCapINR.toLocaleString("en-IN")} / day</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Approval Threshold:</span>
                      <strong>Above ₹{rule.approvalRequiredAboveINR.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Auto-pause on overspend: <strong className="text-white">{rule.autoPauseOnOverspend ? "ON" : "OFF"}</strong>
                    </span>

                    <button
                      onClick={() => onToast(`Updated daily budget cap for ${rule.channel}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Adjust Cap
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CAMPAIGN APPROVALS SUB-TAB */}
      {subTab === "approvals" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Campaign &amp; Creative Approval Queue</h3>
              <p className="text-xs text-slate-400">
                Multi-tier signoffs required before paid ads or high-budget Reels go live.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {approvals.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-indigo-300">
                        {req.channel}
                      </span>
                      <h4 className="text-sm font-black text-white">{req.campaignName}</h4>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Requested by <strong className="text-slate-200">{req.requestedBy}</strong> ({req.requesterRole}) on {req.requestedAt}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${
                        req.status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : req.status === "REJECTED"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                    <div className="text-xs font-black text-emerald-400 mt-1">
                      Budget: ₹{req.budgetRequestedINR.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Review Notes:</span>
                  {req.reviewNotes}
                </div>

                {req.status === "PENDING_APPROVAL" && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleApprovalAction(req.id, "REJECTED")}
                      className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleApprovalAction(req.id, "APPROVED")}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve &amp; Launch Campaign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MFA & 2FA SETTINGS SUB-TAB */}
      {subTab === "mfa_settings" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Time-based One-Time Password (TOTP) / Authenticator</h4>
                  <p className="text-xs text-slate-400">
                    Google Authenticator, Microsoft Authenticator &amp; YubiKey hardware keys enforced for all marketing admins.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                MFA Active &amp; Enforced
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Current Session TOTP Authenticator Code:
                </span>
                <div className="text-2xl font-mono font-black text-indigo-300 tracking-widest mt-0.5">
                  {otpCode.slice(0, 3)} {otpCode.slice(3)}
                </div>
                <span className="text-[11px] text-slate-500">Refreshes every 30 seconds (RFC 6238 Standard)</span>
              </div>

              <button
                disabled={isGeneratingOtp}
                onClick={handleRegenerateOtp}
                className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingOtp ? "animate-spin" : ""}`} />
                Simulate New Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">Invite Marketing Team Member</h3>
            <form onSubmit={handleInviteUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="rahul.verma@bharatyatra.ai"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="marketing_director">Marketing Director</option>
                    <option value="performance_ads_lead">Performance Ads Lead</option>
                    <option value="reels_content_creator">Reels Content Producer</option>
                    <option value="seo_lead">SEO Lead</option>
                    <option value="budget_controller">Budget Controller</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Department</label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Growth & Ads">Growth &amp; Ads</option>
                    <option value="Creative Studio">Creative Studio</option>
                    <option value="SEO & Organic">SEO &amp; Organic</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
