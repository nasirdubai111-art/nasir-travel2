import React, { useState } from "react";
import {
  Database,
  Table,
  Key,
  ShieldAlert,
  Search,
  Lock,
  FileCode,
  Layers,
  CheckCircle2,
  Copy,
} from "lucide-react";

interface DatabaseModuleDef {
  tableName: string;
  category: "Marketing Core" | "SEO Core" | "Social & Reels" | "AI Engine" | "Analytics & Attribution" | "Admin Governance";
  description: string;
  columnsCount: number;
  primaryKey: string;
  foreignKeys: string[];
  fields: { name: string; type: string; isRequired: boolean; isIndex?: boolean; notes?: string }[];
}

export function MarketingDatabaseSchemaView({ onToast }: { onToast: (msg: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const SCHEMA_MODULES: DatabaseModuleDef[] = [
    {
      tableName: "marketing_accounts",
      category: "Marketing Core",
      description: "Google Ads & Meta Ads MCC account credentials, agency tenant linkages, and currency configs.",
      columnsCount: 9,
      primaryKey: "id (UUID)",
      foreignKeys: ["tenant_id -> tenants.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true, isIndex: true },
        { name: "platform", type: "ENUM('GOOGLE_ADS', 'META_ADS')", isRequired: true },
        { name: "account_id", type: "VARCHAR(64)", isRequired: true, isIndex: true },
        { name: "account_name", type: "VARCHAR(255)", isRequired: true },
        { name: "currency", type: "VARCHAR(3) DEFAULT 'INR'", isRequired: true },
        { name: "time_zone", type: "VARCHAR(64) DEFAULT 'Asia/Kolkata'", isRequired: true },
        { name: "encrypted_access_token", type: "TEXT (AES-256-GCM)", isRequired: true },
        { name: "token_expires_at", type: "TIMESTAMPTZ", isRequired: true },
        { name: "is_active", type: "BOOLEAN DEFAULT TRUE", isRequired: true },
      ],
    },
    {
      tableName: "marketing_campaigns",
      category: "Marketing Core",
      description: "Omnichannel campaigns across Google PMax/Search and Meta Feed/Reels with daily budget caps.",
      columnsCount: 14,
      primaryKey: "id (UUID)",
      foreignKeys: ["account_id -> marketing_accounts.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true, isIndex: true },
        { name: "campaign_code", type: "VARCHAR(64)", isRequired: true, isIndex: true },
        { name: "name", type: "VARCHAR(255)", isRequired: true },
        { name: "platform", type: "VARCHAR(32)", isRequired: true },
        { name: "objective", type: "VARCHAR(64)", isRequired: true },
        { name: "daily_budget_inr", type: "NUMERIC(12,2)", isRequired: true },
        { name: "total_spend_inr", type: "NUMERIC(12,2) DEFAULT 0", isRequired: true },
        { name: "bid_strategy", type: "VARCHAR(64)", isRequired: true },
        { name: "target_cpa_inr", type: "NUMERIC(10,2)", isRequired: false },
        { name: "target_roas", type: "NUMERIC(6,2)", isRequired: false },
        { name: "status", type: "ENUM('ACTIVE', 'PAUSED', 'COMPLETED')", isRequired: true },
        { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", isRequired: true },
      ],
    },
    {
      tableName: "marketing_ad_groups",
      category: "Marketing Core",
      description: "Ad groups, asset groups, and targeting cohorts for specific travel destinations.",
      columnsCount: 8,
      primaryKey: "id (UUID)",
      foreignKeys: ["campaign_id -> marketing_campaigns.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "campaign_id", type: "UUID", isRequired: true, isIndex: true },
        { name: "name", type: "VARCHAR(255)", isRequired: true },
        { name: "destination_slug", type: "VARCHAR(64)", isRequired: true, isIndex: true },
        { name: "default_bid_inr", type: "NUMERIC(10,2)", isRequired: false },
        { name: "status", type: "VARCHAR(32)", isRequired: true },
      ],
    },
    {
      tableName: "marketing_ads",
      category: "Marketing Core",
      description: "Individual ad creatives, headlines, descriptions, display URLs, and dynamic UTM tags.",
      columnsCount: 11,
      primaryKey: "id (UUID)",
      foreignKeys: ["ad_group_id -> marketing_ad_groups.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "ad_group_id", type: "UUID", isRequired: true, isIndex: true },
        { name: "headline_1", type: "VARCHAR(60)", isRequired: true },
        { name: "headline_2", type: "VARCHAR(60)", isRequired: true },
        { name: "primary_text", type: "TEXT", isRequired: true },
        { name: "destination_url", type: "VARCHAR(512)", isRequired: true },
        { name: "utm_tracking_template", type: "VARCHAR(512)", isRequired: true },
        { name: "thumbnail_id", type: "UUID", isRequired: false },
      ],
    },
    {
      tableName: "seo_keywords",
      category: "SEO Core",
      description: "Tracked Google SERP organic keywords across India desktop & mobile search with historical rankings.",
      columnsCount: 9,
      primaryKey: "id (UUID)",
      foreignKeys: ["destination_id -> destinations.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "keyword", type: "VARCHAR(255)", isRequired: true, isIndex: true },
        { name: "search_volume_monthly", type: "INTEGER", isRequired: true },
        { name: "keyword_difficulty", type: "SMALLINT", isRequired: true },
        { name: "current_rank", type: "INTEGER", isRequired: true },
        { name: "previous_rank", type: "INTEGER", isRequired: true },
        { name: "target_landing_page", type: "VARCHAR(255)", isRequired: true },
      ],
    },
    {
      tableName: "social_reels",
      category: "Social & Reels",
      description: "9:16 vertical travel reels for Instagram and Facebook with trending audio IDs and hooks.",
      columnsCount: 10,
      primaryKey: "id (UUID)",
      foreignKeys: ["account_id -> social_accounts.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "platform", type: "ENUM('INSTAGRAM', 'FACEBOOK')", isRequired: true },
        { name: "reel_title", type: "VARCHAR(255)", isRequired: true },
        { name: "video_url_s3", type: "VARCHAR(512)", isRequired: true },
        { name: "hook_text", type: "TEXT", isRequired: true },
        { name: "trending_audio_id", type: "VARCHAR(128)", isRequired: false },
        { name: "views_count", type: "INTEGER DEFAULT 0", isRequired: true },
        { name: "leads_generated", type: "INTEGER DEFAULT 0", isRequired: true },
      ],
    },
    {
      tableName: "ai_generated_content",
      category: "AI Engine",
      description: "Stored outputs from the 13 AI content generator tools, prompt versions, and engagement scores.",
      columnsCount: 10,
      primaryKey: "id (UUID)",
      foreignKeys: ["prompt_id -> ai_prompts.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "tool_type", type: "VARCHAR(64)", isRequired: true, isIndex: true },
        { name: "destination_name", type: "VARCHAR(128)", isRequired: true },
        { name: "generated_text", type: "TEXT", isRequired: true },
        { name: "character_count", type: "INTEGER", isRequired: true },
        { name: "engagement_score", type: "SMALLINT", isRequired: true },
        { name: "created_by_admin_id", type: "UUID", isRequired: true },
      ],
    },
    {
      tableName: "marketing_attribution",
      category: "Analytics & Attribution",
      description: "End-to-end attribution links tying Lead ID → Campaign ID → Telesales Rep → Confirmed Booking → Commission.",
      columnsCount: 14,
      primaryKey: "id (UUID)",
      foreignKeys: [
        "lead_id -> crm_leads.id",
        "campaign_id -> marketing_campaigns.id",
        "booking_id -> bookings.id",
      ],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "lead_id", type: "VARCHAR(64)", isRequired: true, isIndex: true },
        { name: "campaign_id", type: "VARCHAR(64)", isRequired: true, isIndex: true },
        { name: "partner_id", type: "VARCHAR(64)", isRequired: true },
        { name: "telesales_exec_id", type: "VARCHAR(64)", isRequired: true },
        { name: "booking_id", type: "VARCHAR(64)", isRequired: false, isIndex: true },
        { name: "booking_value_inr", type: "NUMERIC(12,2)", isRequired: false },
        { name: "commission_rate_percent", type: "NUMERIC(5,2)", isRequired: true },
        { name: "gross_commission_inr", type: "NUMERIC(10,2)", isRequired: true },
        { name: "telesales_incentive_inr", type: "NUMERIC(10,2)", isRequired: true },
        { name: "settlement_status", type: "ENUM('PENDING', 'SETTLED', 'REVERSED')", isRequired: true },
      ],
    },
    {
      tableName: "marketing_audit_logs",
      category: "Admin Governance",
      description: "Immutable cryptographically hashed ledger recording all admin logins, budget shifts, and API actions.",
      columnsCount: 8,
      primaryKey: "id (UUID)",
      foreignKeys: ["admin_user_id -> admin_accounts.id"],
      fields: [
        { name: "id", type: "UUID", isRequired: true },
        { name: "admin_user_id", type: "UUID", isRequired: true, isIndex: true },
        { name: "action_category", type: "VARCHAR(64)", isRequired: true },
        { name: "action_description", type: "TEXT", isRequired: true },
        { name: "ip_address", type: "INET", isRequired: true },
        { name: "sha256_hash", type: "VARCHAR(64)", isRequired: true },
        { name: "timestamp", type: "TIMESTAMPTZ DEFAULT NOW()", isRequired: true },
      ],
    },
  ];

  const filtered = SCHEMA_MODULES.filter((m) => {
    const matchesSearch =
      m.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Backend Database Modules &amp; Schemas</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                Admin-Only Vault
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Production schema architecture for marketing, SEO, reels, AI generators, attribution, and RBAC governance.
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-center gap-2 shrink-0">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Strict Zero-Trust RBAC Isolation</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search database tables or fields..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["All", "Marketing Core", "SEO Core", "Social & Reels", "AI Engine", "Analytics & Attribution", "Admin Governance"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schema Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((mod) => (
          <div key={mod.tableName} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-black font-mono text-white">{mod.tableName}</h4>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-indigo-300 text-[10px] font-bold">
                  {mod.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>PK: <strong className="text-amber-400 font-mono">{mod.primaryKey}</strong></span>
                <span>Fields: <strong className="text-white">{mod.columnsCount}</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-300">{mod.description}</p>

            {/* Foreign keys */}
            {mod.foreignKeys.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-bold text-slate-400">Foreign Keys:</span>
                {mod.foreignKeys.map((fk, idx) => (
                  <span key={idx} className="font-mono text-indigo-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {fk}
                  </span>
                ))}
              </div>
            )}

            {/* Fields table */}
            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/90 text-slate-400 uppercase text-[9px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-2.5">Field Name</th>
                    <th className="p-2.5">Data Type</th>
                    <th className="p-2.5">Required</th>
                    <th className="p-2.5">Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {mod.fields.map((fld) => (
                    <tr key={fld.name} className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-white">{fld.name}</td>
                      <td className="p-2.5 text-indigo-300">{fld.type}</td>
                      <td className="p-2.5">
                        {fld.isRequired ? (
                          <span className="text-emerald-400">YES</span>
                        ) : (
                          <span className="text-slate-500">NULL</span>
                        )}
                      </td>
                      <td className="p-2.5">
                        {fld.isIndex ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px]">BTREE</span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
