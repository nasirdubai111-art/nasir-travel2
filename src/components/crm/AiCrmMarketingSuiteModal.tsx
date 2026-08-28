import React, { useState, useMemo } from "react";
import {
  X,
  Bot,
  Mail,
  MessageSquare,
  Users,
  Search,
  TrendingUp,
  Target,
  FileSpreadsheet,
  BarChart3,
  Shield,
  Lock,
  Key,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Phone,
  Building2,
  DollarSign,
  Award,
  Zap,
  Globe,
  Radio,
  Share2,
  Copy,
  Check,
  Eye,
  Settings,
  Flame,
  Activity,
  Sliders,
  Trash2,
  Database,
  Server,
  KeyRound,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Play,
  Pause,
  Workflow,
  PieChart,
  Tag,
  Calendar,
  Smile,
  Paperclip,
  CheckCheck,
  Video,
  Instagram,
  Facebook,
  Image as ImageIcon,
} from "lucide-react";
import {
  CrmLead,
  EmailCampaign,
  WhatsAppConversation,
  WhatsAppTemplate,
  SeoKeyword,
  MarketingCampaign,
  AutomationWorkflow,
  AdminUser,
  INITIAL_ADMIN_USERS,
  INITIAL_LEADS,
  INITIAL_EMAIL_CAMPAIGNS,
  INITIAL_WHATSAPP_CHATS,
  INITIAL_WHATSAPP_TEMPLATES,
  INITIAL_SEO_KEYWORDS,
  INITIAL_MARKETING_CAMPAIGNS,
  INITIAL_AUTOMATION_WORKFLOWS,
  INTEGRATION_SERVICES,
} from "../../data/aiCrmMarketingData";
import { GoogleAdsManagerView } from "./GoogleAdsManagerView";
import { MetaAdsManagerView } from "./MetaAdsManagerView";
import { FacebookReelsView } from "./FacebookReelsView";
import { InstagramReelsView } from "./InstagramReelsView";
import { SeoBackendView } from "./SeoBackendView";
import { AdminAuthRbacView } from "./AdminAuthRbacView";
import { AiContentEngineView } from "./AiContentEngineView";
import { AiThumbnailGeneratorView } from "./AiThumbnailGeneratorView";
import { AiMarketingAnalyticsView } from "./AiMarketingAnalyticsView";
import { B2bCommissionTelesalesView } from "./B2bCommissionTelesalesView";
import { MarketingDatabaseSchemaView } from "./MarketingDatabaseSchemaView";

interface AiCrmMarketingSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export function AiCrmMarketingSuiteModal({
  isOpen,
  onClose,
  initialTab = "ai_automation",
}: AiCrmMarketingSuiteModalProps) {
  // Authentication & RBAC state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(INITIAL_ADMIN_USERS[0]);
  const [loginPin, setLoginPin] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [is2FaVerified, setIs2FaVerified] = useState<boolean>(true);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // CRM Leads & Pipeline state
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(INITIAL_LEADS[0]);
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>("");
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>("all");
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState<boolean>(false);

  // Email Campaigns state
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(INITIAL_EMAIL_CAMPAIGNS);
  const [selectedEmailTpl, setSelectedEmailTpl] = useState<string>("corp_promo");
  const [aiGeneratedEmail, setAiGeneratedEmail] = useState<string>("");
  const [isGeneratingAiEmail, setIsGeneratingAiEmail] = useState<boolean>(false);

  // WhatsApp CRM state
  const [whatsappChats, setWhatsappChats] = useState<WhatsAppConversation[]>(INITIAL_WHATSAPP_CHATS);
  const [selectedChat, setSelectedChat] = useState<WhatsAppConversation>(INITIAL_WHATSAPP_CHATS[0]);
  const [chatInputText, setChatInputText] = useState<string>("");
  const [whatsappTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);

  // SEO & Keywords state
  const [seoKeywords, setSeoKeywords] = useState<SeoKeyword[]>(INITIAL_SEO_KEYWORDS);
  const [metaTitle, setMetaTitle] = useState<string>("Corporate Travel & GST Invoices | Yatra Enterprise AI Platform");
  const [metaDesc, setMetaDesc] = useState<string>("Book flights, hotels, trains, and VIP Yatra packages with instant 18% GST tax invoices, corporate credit limits, and AI route optimization.");
  const [seoSearchQuery, setSeoSearchQuery] = useState<string>("");

  // Digital Marketing state
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(INITIAL_MARKETING_CAMPAIGNS);
  const [utmSource, setUtmSource] = useState<string>("google");
  const [utmMedium, setUtmMedium] = useState<string>("cpc");
  const [utmCampaignName, setUtmCampaignName] = useState<string>("sacred_yatra_q3");

  // Workflows & AI Automation state
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(INITIAL_AUTOMATION_WORKFLOWS);

  // CSV Import / Export state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>("");
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([]);
  const [csvFieldMapping, setCsvFieldMapping] = useState({
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    company: "Company Name",
    dealValue: "Deal Value",
    source: "Lead Source",
  });
  const [importStatusMessage, setImportStatusMessage] = useState<string>("");
  const [copiedNotification, setCopiedNotification] = useState<string>("");

  // Webhook Test state
  const [webhookTestPayload, setWebhookTestPayload] = useState<string>(
    JSON.stringify({ event: "lead.created", leadId: "LEAD-9921", name: "Sunil Mittal", email: "sunil@airtel.in", dealValue: 850000 }, null, 2)
  );
  const [webhookResponse, setWebhookResponse] = useState<string>("");

  // New Lead Form state
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadSource, setNewLeadSource] = useState<CrmLead["source"]>("Google Ads");
  const [newLeadDealValue, setNewLeadDealValue] = useState("250000");

  if (!isOpen) return null;

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      l.tags.some((t) => t.toLowerCase().includes(leadSearchQuery.toLowerCase()));
    const matchesSource = leadSourceFilter === "all" || l.source === leadSourceFilter;
    return matchesSearch && matchesSource;
  });

  // Calculate CRM Totals
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.stage !== "lost" ? l.dealValue : 0), 0);
  const wonRevenue = leads.filter((l) => l.stage === "won").reduce((acc, l) => acc + l.dealValue, 0);
  const highIntentLeadsCount = leads.filter((l) => l.aiScore >= 80).length;

  // Handle Quick Role Switching
  const handleSwitchAdminRole = (role: AdminUser["role"]) => {
    const targetUser = INITIAL_ADMIN_USERS.find((u) => u.role === role) || INITIAL_ADMIN_USERS[0];
    setCurrentAdmin(targetUser);
    setAuthError("");
  };

  // Handle Admin Auth Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPin === "123456" || loginPin === "admin" || loginPin.length >= 4) {
      setIsAuthenticated(true);
      setIs2FaVerified(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Security PIN. Enter '123456' for instant demo authorization.");
    }
  };

  // Handle Send Chat Message
  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "agent" as const,
      text: chatInputText,
      time: "Just now",
      status: "sent" as const,
    };
    const updatedChats = whatsappChats.map((c) => {
      if (c.id === selectedChat.id) {
        return {
          ...c,
          lastMessage: chatInputText,
          timestamp: "Just now",
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });
    setWhatsappChats(updatedChats);
    const updatedCurrent = updatedChats.find((c) => c.id === selectedChat.id);
    if (updatedCurrent) setSelectedChat(updatedCurrent);
    setChatInputText("");

    // Simulate AI or User Reply after 1.5s if AI bot is active
    if (selectedChat.isAiBotActive) {
      setTimeout(() => {
        const botReply = {
          id: `msg-bot-${Date.now()}`,
          sender: "ai_bot" as const,
          text: `[AI Copilot Auto-Response] Thank you! I have updated our enterprise reservation file and synced the GST invoice with our finance system.`,
          time: "Just now",
          status: "delivered" as const,
        };
        setWhatsappChats((prev) =>
          prev.map((c) => {
            if (c.id === selectedChat.id) {
              return {
                ...c,
                lastMessage: botReply.text,
                messages: [...c.messages, botReply],
              };
            }
            return c;
          })
        );
      }, 1200);
    }
  };

  // Toggle Chat AI Bot
  const handleToggleAiBot = (chatId: string) => {
    setWhatsappChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isAiBotActive: !c.isAiBotActive } : c))
    );
    if (selectedChat.id === chatId) {
      setSelectedChat((prev) => ({ ...prev, isAiBotActive: !prev.isAiBotActive }));
    }
  };

  // Handle Add New Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newLeadDealValue) || 150000;
    const aiCalcScore = Math.min(98, Math.floor(65 + Math.random() * 32));
    const newLead: CrmLead = {
      id: `LEAD-${Math.floor(10500 + Math.random() * 1000)}`,
      name: newLeadName || "New Inbound Prospect",
      email: newLeadEmail || "prospect@company.com",
      phone: newLeadPhone || "+91 98000 00000",
      company: newLeadCompany || "Enterprise Client",
      source: newLeadSource,
      stage: "new",
      dealValue: val,
      aiScore: aiCalcScore,
      qualification: aiCalcScore >= 80 ? "High Intent (BANT Qualified)" : "Warm Lead",
      assignedRep: "Rajesh Kulkarni",
      assignedRepAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      createdAt: new Date().toISOString().split("T")[0],
      lastContacted: "Just Ingested",
      nextFollowUp: "Today (Auto AI Nurture)",
      tags: ["Inbound Webhook", "Fast Response"],
      notes: ["Captured via Multi-Channel Lead Generation Engine."],
      aiRecommendation: "Trigger automated WhatsApp greeting and dispatch tailored corporate travel rate-card.",
      verified: true,
    };
    setLeads([newLead, ...leads]);
    setSelectedLead(newLead);
    setIsAddLeadModalOpen(false);
    setNewLeadName("");
    setNewLeadEmail("");
    setNewLeadPhone("");
    setNewLeadCompany("");
  };

  // Handle CSV File Upload & Parsing
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      // Simple CSV parse
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
        const rows = lines.slice(1).map((line, idx) => {
          const vals = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
          const obj: any = { _id: idx + 1 };
          headers.forEach((h, i) => {
            obj[h] = vals[i] || "";
          });
          return obj;
        });
        setCsvParsedRows(rows);
      }
    };
    reader.readAsText(file);
  };

  // Execute CSV Import into Live Leads
  const handleExecuteCsvImport = () => {
    if (csvParsedRows.length === 0) {
      // Use sample rows if no file uploaded
      const sampleImported: CrmLead[] = [
        {
          id: `LEAD-CSV-881`,
          name: "Suresh Narayanan",
          email: "suresh.n@nestle-india.com",
          phone: "+91 98112 33445",
          company: "Nestle India Corporate",
          source: "CSV Import",
          stage: "qualified",
          dealValue: 620000,
          aiScore: 92,
          qualification: "High Intent (BANT Qualified)",
          assignedRep: "Rajesh Kulkarni",
          assignedRepAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
          createdAt: "2026-08-26",
          lastContacted: "Bulk Imported",
          nextFollowUp: "2026-08-27 (11:00 AM)",
          tags: ["Bulk CSV Import", "Corporate Stays", "High Priority"],
          notes: ["Imported from Q3 Corporate Leads spreadsheet with 42 executives."],
          aiRecommendation: "Auto-send 18% GST credit proforma invoice and corporate portal credentials.",
          verified: true,
        },
        {
          id: `LEAD-CSV-882`,
          name: "Tanya Batra",
          email: "tanya@delhi-events.in",
          phone: "+91 99100 88776",
          company: "Grand Delights Luxury Hospitality",
          source: "CSV Import",
          stage: "new",
          dealValue: 410000,
          aiScore: 84,
          qualification: "High Intent (BANT Qualified)",
          assignedRep: "Kavita Rao",
          assignedRepAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
          createdAt: "2026-08-26",
          lastContacted: "Bulk Imported",
          nextFollowUp: "Today (Auto AI Nurture)",
          tags: ["Bulk CSV Import", "Udaipur & Goa", "Leisure Stays"],
          notes: ["Looking for group bookings for 3 corporate offsites."],
          aiRecommendation: "Trigger customized multi-property quote with complementary airport pickups.",
          verified: true,
        },
      ];
      setLeads((prev) => [...sampleImported, ...prev]);
      setImportStatusMessage("Successfully parsed & ingested 2 sample enterprise leads into live CRM database with 100% field mapping accuracy!");
      return;
    }

    const newImported: CrmLead[] = csvParsedRows.map((r, i) => {
      const val = parseInt(r[csvFieldMapping.dealValue] || r["Deal Value"] || r["dealValue"] || "200000") || 200000;
      const name = r[csvFieldMapping.name] || r["Full Name"] || r["Name"] || `Imported Prospect ${i + 1}`;
      const email = r[csvFieldMapping.email] || r["Email Address"] || r["Email"] || `prospect${i}@imported.com`;
      const phone = r[csvFieldMapping.phone] || r["Phone Number"] || r["Phone"] || "+91 98000 00000";
      const company = r[csvFieldMapping.company] || r["Company Name"] || r["Company"] || "Corporate Client";
      const aiScore = Math.min(96, Math.floor(70 + Math.random() * 26));

      return {
        id: `LEAD-CSV-${Date.now().toString().slice(-4)}-${i + 1}`,
        name,
        email,
        phone,
        company,
        source: "CSV Import",
        stage: "new",
        dealValue: val,
        aiScore,
        qualification: aiScore >= 80 ? "High Intent (BANT Qualified)" : "Warm Lead",
        assignedRep: "Rajesh Kulkarni",
        assignedRepAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        createdAt: new Date().toISOString().split("T")[0],
        lastContacted: "Bulk Imported",
        nextFollowUp: "Today",
        tags: ["Bulk CSV Ingestion", "Auto Mapped"],
        notes: ["Ingested from uploaded CSV dataset with automatic deduplication check."],
        aiRecommendation: "Dispatch instant automated WhatsApp onboarding flow.",
        verified: true,
      };
    });

    setLeads((prev) => [...newImported, ...prev]);
    setImportStatusMessage(`Successfully ingested ${newImported.length} records into the live CRM lead database without duplicate conflicts.`);
  };

  // Export RFC 4180 CSV
  const handleExportCsv = (type: "leads" | "deals" | "campaigns") => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `crm_export_${type}_${new Date().toISOString().split("T")[0]}.csv`;

    if (type === "leads" || type === "deals") {
      headers = ["Lead ID", "Name", "Email", "Phone", "Company", "Source", "Stage", "Deal Value (INR)", "AI Score", "Assigned Rep", "Created Date"];
      rows = leads.map((l) => [
        `"${l.id}"`,
        `"${l.name}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${l.company}"`,
        `"${l.source}"`,
        `"${l.stage.toUpperCase()}"`,
        `${l.dealValue}`,
        `${l.aiScore}`,
        `"${l.assignedRep}"`,
        `"${l.createdAt}"`,
      ]);
    } else {
      headers = ["Campaign Name", "Platform", "Status", "Budget (INR)", "Spend (INR)", "Impressions", "Clicks", "Conversions", "CPA (INR)", "ROAS"];
      rows = marketingCampaigns.map((c) => [
        `"${c.name}"`,
        `"${c.platform}"`,
        `"${c.status.toUpperCase()}"`,
        `${c.budget}`,
        `${c.spend}`,
        `${c.impressions}`,
        `${c.clicks}`,
        `${c.conversions}`,
        `${c.cpa}`,
        `${c.roas}x`,
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(`Exported ${type.toUpperCase()} as RFC 4180 CSV (${rows.length} records)!`);
    setTimeout(() => setCopiedNotification(""), 3500);
  };

  // Trigger AI Email Generation
  const handleGenerateAiEmail = (type: string) => {
    setIsGeneratingAiEmail(true);
    setTimeout(() => {
      if (type === "corp") {
        setAiGeneratedEmail(
          `Subject: Exclusive 18% Corporate GST Savings & Direct Account Management for ${selectedLead?.company || "Your Enterprise"}\n\n` +
          `Dear ${selectedLead?.name || "Sir/Ma'am"},\n\n` +
          `I noticed your enterprise is planning corporate executive travel over the upcoming quarter. Through our Unified AI Corporate Travel Engine, ${selectedLead?.company || "your team"} can automatically capture 100% compliant RFC 4180 GST invoices with correct state SAC codes, reducing your travel overhead by up to 18%.\n\n` +
          `• Instant centralized billing with ₹10,00,000 credit limit\n` +
          `• Zero cancellation charges on flexible Vistara/Air India corporate flights\n` +
          `• Dedicated 24/7 priority WhatsApp concierge desk\n\n` +
          `Would you be open for a quick 10-minute briefing this Thursday at 11:30 AM?\n\n` +
          `Warm regards,\n${currentAdmin.name}\nChief Commercial Officer, Yatra Enterprise`
        );
      } else {
        setAiGeneratedEmail(
          `Subject: 🚩 Sacred Yatra VIP Sugam Darshan & Helicopter Seats Reservation Confirmed\n\n` +
          `Namaste ${selectedLead?.name || "Pilgrim"},\n\n` +
          `We have reserved your VIP Darshan pass for your sacred pilgrimage. Our AI route system has paired your helicopter timing with live DGCA Himalayan weather telemetry to guarantee zero-wait helipad transfers.\n\n` +
          `• VIP Sugam Gate QR Code Ready\n` +
          `• Verified 4-Star Heated Cottages included\n` +
          `• 24/7 Altitude Medical Concierge On-Call\n\n` +
          `Tap below to review your personalized visual itinerary.`
        );
      }
      setIsGeneratingAiEmail(false);
    }, 800);
  };

  // Test Outbound Webhook
  const handleSendTestWebhook = () => {
    setWebhookResponse("Dispatching webhook event to gateway...");
    setTimeout(() => {
      setWebhookResponse(
        JSON.stringify(
          {
            statusCode: 200,
            status: "DELIVERED_SUCCESSFULLY",
            latencyMs: 38,
            timestamp: new Date().toISOString(),
            destination: "https://api.yatra.ai/webhooks/v1/crm-lead-ingest",
            signature: "sha256=8f49b1092eacb8849b29402e8810294ab8e02849",
            payloadEcho: JSON.parse(webhookTestPayload),
          },
          null,
          2
        )
      );
    }, 600);
  };

  // Navigation Items with RBAC permissions
  const NAV_ITEMS = [
    { id: "ai_automation", label: "AI Automation", icon: Bot, badge: "12 Flows", permission: "ai_automation" },
    { id: "ai_content_engine", label: "AI Content Engine", icon: Sparkles, badge: "13 Tools", permission: "marketing" },
    { id: "ai_thumbnail_generator", label: "AI Thumbnail Studio", icon: ImageIcon, badge: "Reel Covers", permission: "marketing" },
    { id: "b2b_commercial_model", label: "B2B Conversion & Telesales", icon: DollarSign, badge: "5-20% Take", permission: "crm_sales" },
    { id: "ai_marketing_analytics", label: "AI Marketing Analytics", icon: BarChart3, badge: "ROAS 8.9x", permission: "analytics" },
    { id: "admin_management", label: "Admin Login & RBAC Vault", icon: Lock, badge: "2FA / MFA", permission: "admin_management" },
    { id: "google_ads", label: "Google Ads Manager", icon: TrendingUp, badge: "PMax & Search", permission: "marketing" },
    { id: "meta_ads", label: "Meta Ads (FB/IG)", icon: Facebook, badge: "CAPI Active", permission: "marketing" },
    { id: "facebook_reels", label: "Facebook Reels Studio", icon: Video, badge: "AI Video", permission: "marketing" },
    { id: "instagram_reels", label: "Instagram Reels Studio", icon: Instagram, badge: "Trending Audio", permission: "marketing" },
    { id: "seo", label: "Organic SEO & 13 Categories", icon: Search, badge: "Rank #1", permission: "seo" },
    { id: "email", label: "Email Marketing", icon: Mail, badge: "4 Campaigns", permission: "email" },
    { id: "whatsapp", label: "WhatsApp CRM", icon: MessageSquare, badge: "3 Live Chats", permission: "whatsapp" },
    { id: "crm_sales", label: "CRM & Sales Pipeline", icon: Users, badge: `₹${(totalPipelineValue / 100000).toFixed(1)}L`, permission: "crm_sales" },
    { id: "leads", label: "Lead Generation Hub", icon: Target, badge: `${leads.length} Leads`, permission: "leads" },
    { id: "csv_tools", label: "CSV Import / Export", icon: FileSpreadsheet, badge: "RFC 4180", permission: "csv_tools" },
    { id: "database_schemas", label: "Backend DB Schemas", icon: Database, badge: "16 Modules", permission: "backend_security" },
    { id: "backend_security", label: "Internal Backend Architecture", icon: Shield, badge: "Zero-Trust", permission: "backend_security" },
    { id: "integrations", label: "Integration Hub", icon: Layers, badge: "6 Connected", permission: "integrations" },
  ];

  // Check if current user has permission
  const hasAccessToTab = (tabPerm: string) => {
    if (currentAdmin.role === "super_admin" || currentAdmin.permissions.includes("all")) return true;
    return currentAdmin.permissions.includes(tabPerm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-7xl max-h-[96vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Banner */}
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  AI Automation, WhatsApp CRM &amp; Growth Suite
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Zero-Trust Enterprise Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400">
                12-Module Operating System: AI Lead Scoring, Email Drips, WhatsApp CRM, SEO Tracker, Paid Ads &amp; CSV Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Admin Role Badge & Switcher */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <img
                src={currentAdmin.avatar}
                alt={currentAdmin.name}
                className="w-6 h-6 rounded-full object-cover border border-indigo-400"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-white block leading-tight">{currentAdmin.name}</span>
                <span className="text-[9px] text-indigo-300 block">{currentAdmin.roleLabel}</span>
              </div>
              <select
                value={currentAdmin.role}
                onChange={(e) => handleSwitchAdminRole(e.target.value as any)}
                className="ml-1 bg-slate-900 text-slate-200 text-[10px] font-semibold rounded px-1.5 py-0.5 border border-slate-600 focus:outline-none focus:border-indigo-400"
                title="Switch Demo Role for RBAC testing"
              >
                <option value="super_admin">Super Admin</option>
                <option value="marketing_lead">Marketing Lead</option>
                <option value="sales_lead">Sales Lead</option>
                <option value="seo_specialist">SEO Specialist</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Enterprise Suite"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Copied Notification */}
        {copiedNotification && (
          <div className="bg-emerald-500/20 text-emerald-200 text-xs py-1.5 px-4 text-center border-b border-emerald-500/30 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Main Content Layout with Left Nav and Center Stage */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
            <div className="hidden md:block px-2 py-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Enterprise Modules (12)
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              const authorized = hasAccessToTab(item.permission);

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : authorized
                      ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      : "text-slate-400 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-indigo-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {!authorized ? (
                    <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
                      Restricted
                    </span>
                  ) : item.badge ? (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                        isSelected ? "bg-indigo-800/80 text-indigo-100" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {/* Quick Metrics summary at bottom of left nav */}
            <div className="hidden md:block mt-auto pt-3 border-t border-slate-800/80 px-2">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Live Pipeline</span>
                  <span className="font-bold text-emerald-400">₹{(totalPipelineValue / 100000).toFixed(1)}L</span>
                </div>
                <div className="text-slate-400 flex items-center justify-between mt-1">
                  <span>High-Intent Leads</span>
                  <span className="font-bold text-amber-400">{highIntentLeadsCount} / {leads.length}</span>
                </div>
                <div className="text-slate-400 flex items-center justify-between mt-1">
                  <span>Ad ROAS Avg</span>
                  <span className="font-bold text-indigo-400">7.4x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Stage Workspace */}
          <div className="flex-1 bg-slate-900/40 p-4 sm:p-6 overflow-y-auto">
            
            {/* RBAC Permission Gate Alert if unauthorized */}
            {!hasAccessToTab(NAV_ITEMS.find((n) => n.id === activeTab)?.permission || "") ? (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-6 text-center max-w-xl mx-auto my-12">
                <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-black text-amber-200">Access Restricted by Role-Based Policy</h3>
                <p className="text-xs text-slate-300 mt-2">
                  Your current active role <strong className="text-white">({currentAdmin.roleLabel})</strong> does not have granted authorization for this module.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleSwitchAdminRole("super_admin")}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Switch to Super Admin Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("ai_automation")}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs transition-all"
                  >
                    Return to AI Automation
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. TAB: AI AUTOMATION */}
                {activeTab === "ai_automation" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-base font-black text-white">AI Automation &amp; Autonomous Trigger Engine</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Autonomous lead scoring, BANT qualification, follow-up recommendations, sales forecasting, and instant copy generation.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                          Gemini 2.5 Active
                        </span>
                      </div>
                    </div>

                    {/* AI Scoring & Forecasting KPI row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                          <span>AI Predictive Score Avg</span>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-black text-white mt-1">88.4 / 100</div>
                        <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                          ↑ 14% higher conversion propensity vs manual leads
                        </p>
                      </div>

                      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                          <span>Q3 Projected Sales Forecast</span>
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-black text-emerald-400 mt-1">₹42.8 Lakhs</div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Based on 91% pipeline velocity &amp; B2B corporate closures
                        </p>
                      </div>

                      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                          <span>Autonomous Workflows</span>
                          <Zap className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="text-2xl font-black text-indigo-300 mt-1">10,370 Runs</div>
                        <p className="text-[11px] text-indigo-400 mt-1 font-semibold">
                          99.4% execution success with 0 human intervention
                        </p>
                      </div>
                    </div>

                    {/* AI Copilot Content Generator Studio */}
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <h4 className="text-sm font-black text-white">AI Instant Copy &amp; Pitch Generator</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGenerateAiEmail("corp")}
                            disabled={isGeneratingAiEmail}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Generate Corporate GST Pitch</span>
                          </button>
                          <button
                            onClick={() => handleGenerateAiEmail("yatra")}
                            disabled={isGeneratingAiEmail}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Generate VIP Yatra Follow-up</span>
                          </button>
                        </div>
                      </div>

                      {isGeneratingAiEmail ? (
                        <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mb-2" />
                          <span className="text-xs text-slate-300 font-bold">Synthesizing personalized copy with Gemini Enterprise Engine...</span>
                        </div>
                      ) : aiGeneratedEmail ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Generated Output (Ready to dispatch via Email/WhatsApp):</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(aiGeneratedEmail);
                                setCopiedNotification("Copied AI Copy to clipboard!");
                                setTimeout(() => setCopiedNotification(""), 3000);
                              }}
                              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Text</span>
                            </button>
                          </div>
                          <pre className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/80 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {aiGeneratedEmail}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-800 text-center">
                          Click above to instantly generate tailored B2B corporate emails, WhatsApp templates, or lead follow-ups.
                        </p>
                      )}
                    </div>

                    {/* Active Visual Automation Workflows */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <Workflow className="w-4 h-4 text-indigo-400" />
                          <span>Active Automation Workflows &amp; Trigger Engine</span>
                        </h4>
                        <span className="text-xs text-slate-400">{workflows.length} Automated Triggers</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {workflows.map((wf) => (
                          <div
                            key={wf.id}
                            className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <h5 className="text-xs font-black text-white">{wf.name}</h5>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                                {wf.runsCount} Runs
                              </span>
                            </div>

                            <div className="text-[11px] space-y-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 font-mono text-slate-300">
                              <div><span className="text-amber-400 font-bold">TRIGGER:</span> {wf.trigger}</div>
                              <div><span className="text-indigo-400 font-bold">CONDITION:</span> {wf.condition}</div>
                              <div><span className="text-emerald-400 font-bold">ACTION:</span> {wf.action}</div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span>Success Rate: <strong className="text-emerald-400">{wf.successRate}%</strong></span>
                              <span className="text-indigo-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                AI Optimized Loop
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TAB: EMAIL MARKETING */}
                {activeTab === "email" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-4 rounded-2xl border border-blue-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-400" />
                          <h3 className="text-base font-black text-white">Enterprise Email Marketing &amp; Drip Sequences</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Bulk newsletter dispatch, automated lead nurturing drips, open/click webhooks &amp; bounce management.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCopiedNotification("Dispatched bulk test email campaign to 500 contacts!");
                            setTimeout(() => setCopiedNotification(""), 3500);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Test Blast</span>
                        </button>
                      </div>
                    </div>

                    {/* Email Campaigns Table */}
                    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Live Campaigns</h4>
                        <span className="text-xs text-slate-400">AWS SES / SendGrid Relay</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                            <tr>
                              <th className="p-3">Campaign Name &amp; Subject</th>
                              <th className="p-3">Audience</th>
                              <th className="p-3">Recipients</th>
                              <th className="p-3">Open Rate</th>
                              <th className="p-3">Click Rate</th>
                              <th className="p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {emailCampaigns.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-white">{c.title}</div>
                                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{c.subject}</div>
                                </td>
                                <td className="p-3 text-slate-300">{c.audience}</td>
                                <td className="p-3 font-semibold text-slate-200">{c.recipientsCount.toLocaleString()}</td>
                                <td className="p-3 font-bold text-emerald-400">{c.openRate > 0 ? `${c.openRate}%` : "—"}</td>
                                <td className="p-3 font-bold text-blue-400">{c.clickRate > 0 ? `${c.clickRate}%` : "—"}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                      c.status === "active"
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    }`}
                                  >
                                    {c.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TAB: WHATSAPP CRM */}
                {activeTab === "whatsapp" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 p-4 rounded-2xl border border-emerald-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-base font-black text-white">WhatsApp Business Cloud CRM &amp; Live Inbox</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Meta Graph API v21.0 integration with automated AI Bot, agent takeover, official templates &amp; read telemetry.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Meta Official API Online
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp 2-Pane Chat Box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[480px] bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden">
                      {/* Left: Chat List */}
                      <div className="border-r border-slate-800 flex flex-col overflow-y-auto">
                        <div className="p-3 border-b border-slate-800 bg-slate-900/60 font-bold text-xs text-slate-300 flex items-center justify-between">
                          <span>Conversations ({whatsappChats.length})</span>
                          <span className="text-[10px] text-emerald-400 font-normal">Active Sync</span>
                        </div>
                        <div className="divide-y divide-slate-800/60 overflow-y-auto">
                          {whatsappChats.map((chat) => (
                            <button
                              key={chat.id}
                              onClick={() => setSelectedChat(chat)}
                              className={`w-full p-3 text-left transition-colors flex flex-col gap-1 cursor-pointer ${
                                selectedChat.id === chat.id ? "bg-emerald-950/40 border-l-4 border-emerald-500" : "hover:bg-slate-900/40"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-white truncate max-w-[150px]">{chat.contactName}</span>
                                <span className="text-[10px] text-slate-400">{chat.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 truncate">{chat.lastMessage}</p>
                              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                                <span>Rep: {chat.assignedAgent}</span>
                                {chat.isAiBotActive && (
                                  <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                                    <Bot className="w-3 h-3" /> AI Active
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right: Active Chat Conversation */}
                      <div className="md:col-span-2 flex flex-col bg-slate-900/40">
                        {/* Chat Header */}
                        <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-xs text-white">{selectedChat.contactName}</h4>
                            <span className="text-[10px] text-slate-400">{selectedChat.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleAiBot(selectedChat.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                selectedChat.isAiBotActive
                                  ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                              }`}
                            >
                              <Bot className="w-3 h-3" />
                              <span>{selectedChat.isAiBotActive ? "AI Copilot Enabled" : "Enable AI Copilot"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                          {selectedChat.messages.map((msg) => {
                            const isMe = msg.sender === "agent" || msg.sender === "ai_bot";
                            return (
                              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div
                                  className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                                    msg.sender === "agent"
                                      ? "bg-emerald-600 text-white rounded-br-none"
                                      : msg.sender === "ai_bot"
                                      ? "bg-indigo-600/90 text-white rounded-br-none border border-indigo-400/40"
                                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                                  }`}
                                >
                                  {msg.sender === "ai_bot" && (
                                    <span className="text-[9px] font-extrabold text-indigo-200 block mb-0.5">
                                      🤖 Yatra AI Autonomous Assistant
                                    </span>
                                  )}
                                  {msg.text}
                                </div>
                                <span className="text-[9px] text-slate-400 mt-0.5 px-1 flex items-center gap-1">
                                  {msg.time}
                                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Chat Input Bar */}
                        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
                          <input
                            type="text"
                            value={chatInputText}
                            onChange={(e) => setChatInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type official WhatsApp message or auto-reply..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                            title="Send Message"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TAB: CRM & SALES PIPELINE */}
                {activeTab === "crm_sales" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/60 to-orange-950/60 p-4 rounded-2xl border border-amber-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-amber-400" />
                          <h3 className="text-base font-black text-white">CRM &amp; Kanban Deal Pipeline</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Track opportunities across stages, calculate closing probabilities &amp; review rep targets.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAddLeadModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Inbound Deal</span>
                        </button>
                      </div>
                    </div>

                    {/* Kanban Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-2">
                      {[
                        { id: "new", label: "New Leads", color: "border-slate-500" },
                        { id: "contacted", label: "Contacted", color: "border-blue-500" },
                        { id: "qualified", label: "Qualified", color: "border-amber-500" },
                        { id: "proposal", label: "Proposal Sent", color: "border-purple-500" },
                        { id: "won", label: "Closed Won", color: "border-emerald-500" },
                      ].map((col) => {
                        const colLeads = leads.filter((l) => l.stage === col.id);
                        const colSum = colLeads.reduce((acc, l) => acc + l.dealValue, 0);

                        return (
                          <div key={col.id} className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2 min-w-[220px]">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <span className="font-black text-xs text-white">{col.label}</span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                                {colLeads.length} (₹{(colSum / 1000).toFixed(0)}k)
                              </span>
                            </div>

                            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px]">
                              {colLeads.map((lead) => (
                                <div
                                  key={lead.id}
                                  onClick={() => setSelectedLead(lead)}
                                  className={`p-3 rounded-xl bg-slate-900/90 border transition-all cursor-pointer hover:border-indigo-400 ${
                                    selectedLead?.id === lead.id ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-800"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-white">{lead.name}</span>
                                    <span className="text-[10px] font-black text-emerald-400">₹{(lead.dealValue / 1000).toFixed(0)}k</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 block truncate">{lead.company}</span>
                                  
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                                      AI Score: {lead.aiScore}
                                    </span>
                                    <span className="text-[9px] text-slate-400">{lead.source}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SEO & 13 TRAVEL CATEGORIES */}
                {activeTab === "seo" && (
                  <SeoBackendView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* GOOGLE ADS MANAGER */}
                {activeTab === "google_ads" && (
                  <GoogleAdsManagerView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* META ADS MANAGER (FB & IG) */}
                {activeTab === "meta_ads" && (
                  <MetaAdsManagerView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* FACEBOOK REELS STUDIO */}
                {activeTab === "facebook_reels" && (
                  <FacebookReelsView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* INSTAGRAM REELS STUDIO */}
                {activeTab === "instagram_reels" && (
                  <InstagramReelsView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* AI CONTENT ENGINE & 13 TOOLS */}
                {activeTab === "ai_content_engine" && (
                  <AiContentEngineView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* AI THUMBNAIL STUDIO & REEL COVERS */}
                {activeTab === "ai_thumbnail_generator" && (
                  <AiThumbnailGeneratorView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* B2B COMMERCIAL CONVERSION & TELESALES */}
                {activeTab === "b2b_commercial_model" && (
                  <B2bCommissionTelesalesView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* AI MARKETING ANALYTICS & ATTRIBUTION */}
                {activeTab === "ai_marketing_analytics" && (
                  <AiMarketingAnalyticsView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* BACKEND DATABASE SCHEMAS & MODULES */}
                {activeTab === "database_schemas" && (
                  <MarketingDatabaseSchemaView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* ADMIN LOGIN, MFA & RBAC VAULT */}
                {activeTab === "admin_management" && (
                  <AdminAuthRbacView
                    onToast={(msg) => {
                      setCopiedNotification(msg);
                      setTimeout(() => setCopiedNotification(""), 3500);
                    }}
                  />
                )}

                {/* 6. TAB: DIGITAL MARKETING */}
                {activeTab === "marketing" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-950/60 to-pink-950/60 p-4 rounded-2xl border border-purple-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                          <h3 className="text-base font-black text-white">Paid Ad Campaigns, UTM Generator &amp; Attribution</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Multi-channel spend tracking across Google Ads, Meta Ads &amp; LinkedIn with ROAS calculation.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                          Blended ROAS: 7.4x
                        </span>
                      </div>
                    </div>

                    {/* Marketing Ad Performance Table */}
                    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                            <tr>
                              <th className="p-3">Campaign</th>
                              <th className="p-3">Platform</th>
                              <th className="p-3">Spend</th>
                              <th className="p-3">Clicks</th>
                              <th className="p-3">Conversions</th>
                              <th className="p-3">CPA</th>
                              <th className="p-3">ROAS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {marketingCampaigns.map((camp) => (
                              <tr key={camp.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="p-3 font-bold text-white">{camp.name}</td>
                                <td className="p-3 text-indigo-300 font-semibold">{camp.platform}</td>
                                <td className="p-3 font-bold text-slate-200">₹{camp.spend.toLocaleString()}</td>
                                <td className="p-3 text-slate-300">{camp.clicks.toLocaleString()}</td>
                                <td className="p-3 font-bold text-emerald-400">{camp.conversions}</td>
                                <td className="p-3 text-slate-300">₹{camp.cpa}</td>
                                <td className="p-3 font-black text-purple-400">{camp.roas}x</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* UTM Campaign URL Builder */}
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        <span>Interactive UTM Campaign URL Builder</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold">UTM Source</label>
                          <input
                            type="text"
                            value={utmSource}
                            onChange={(e) => setUtmSource(e.target.value)}
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold">UTM Medium</label>
                          <input
                            type="text"
                            value={utmMedium}
                            onChange={(e) => setUtmMedium(e.target.value)}
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold">UTM Campaign</label>
                          <input
                            type="text"
                            value={utmCampaignName}
                            onChange={(e) => setUtmCampaignName(e.target.value)}
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-300 break-all flex items-center justify-between gap-2">
                        <span>https://yatra.ai/?utm_source={utmSource}&amp;utm_medium={utmMedium}&amp;utm_campaign={utmCampaignName}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://yatra.ai/?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaignName}`);
                            setCopiedNotification("Copied UTM tracking URL to clipboard!");
                            setTimeout(() => setCopiedNotification(""), 3000);
                          }}
                          className="text-xs text-indigo-400 hover:text-white shrink-0 font-bold"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. TAB: LEAD GENERATION */}
                {activeTab === "leads" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 p-4 rounded-2xl border border-emerald-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-base font-black text-white">Lead Generation &amp; Ingestion Hub</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Multi-channel lead ingestion with auto deduplication, verification &amp; salesperson routing.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAddLeadModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Capture Inbound Lead</span>
                        </button>
                      </div>
                    </div>

                    {/* Leads Filter and Table */}
                    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden space-y-3 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={leadSearchQuery}
                            onChange={(e) => setLeadSearchQuery(e.target.value)}
                            placeholder="Search leads by name, company, email..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Source:</span>
                          <select
                            value={leadSourceFilter}
                            onChange={(e) => setLeadSourceFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option value="all">All Sources</option>
                            <option value="Google Ads">Google Ads</option>
                            <option value="Meta Ads">Meta Ads</option>
                            <option value="SEO Organic">SEO Organic</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Website Form">Website Form</option>
                            <option value="CSV Import">CSV Import</option>
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                            <tr>
                              <th className="p-3">Lead &amp; Company</th>
                              <th className="p-3">Contact</th>
                              <th className="p-3">AI Score</th>
                              <th className="p-3">Deal Value</th>
                              <th className="p-3">Source</th>
                              <th className="p-3">Assigned Rep</th>
                              <th className="p-3">Stage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {filteredLeads.map((l) => (
                              <tr key={l.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-white">{l.name}</div>
                                  <div className="text-[11px] text-slate-400">{l.company}</div>
                                </td>
                                <td className="p-3 text-slate-300">
                                  <div>{l.email}</div>
                                  <div className="text-[10px] text-slate-400">{l.phone}</div>
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                                      l.aiScore >= 80 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                                    }`}
                                  >
                                    {l.aiScore} / 100
                                  </span>
                                </td>
                                <td className="p-3 font-bold text-emerald-400">₹{l.dealValue.toLocaleString()}</td>
                                <td className="p-3 text-slate-300">{l.source}</td>
                                <td className="p-3 text-slate-200">{l.assignedRep}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                                    {l.stage}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. TAB: CSV IMPORT / EXPORT STUDIO */}
                {activeTab === "csv_tools" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 p-4 rounded-2xl border border-emerald-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-base font-black text-white">CSV / XLSX Import &amp; Export Data Studio</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          RFC 4180 compliant 2-way data bridge: Drag &amp; drop field mapping, validation report, and 1-click export.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExportCsv("leads")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Leads CSV</span>
                        </button>
                        <button
                          onClick={() => handleExportCsv("campaigns")}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Campaigns CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Import Status Alert */}
                    {importStatusMessage && (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between">
                        <span>{importStatusMessage}</span>
                        <button onClick={() => setImportStatusMessage("")} className="text-emerald-300 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* CSV Upload & Field Mapping Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Drag & Drop Upload */}
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-emerald-400" />
                          <span>1. Upload CSV / XLSX File</span>
                        </h4>
                        <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-6 text-center transition-colors">
                          <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <label className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer block">
                            Browse CSV File
                            <input type="file" accept=".csv,.xlsx,.txt" onChange={handleCsvFileUpload} className="hidden" />
                          </label>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {csvFile ? `Selected: ${csvFile.name}` : "or drop corporate lead spreadsheet here"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            onClick={handleExecuteCsvImport}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Execute Bulk Ingestion into CRM</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Field Mapping */}
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                          <span>2. Intelligent Field Mapping</span>
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400">Target: Full Name</span>
                            <span className="text-emerald-400 font-mono font-bold">CSV Column: &quot;Full Name&quot;</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400">Target: Work Email</span>
                            <span className="text-emerald-400 font-mono font-bold">CSV Column: &quot;Email Address&quot;</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400">Target: Phone</span>
                            <span className="text-emerald-400 font-mono font-bold">CSV Column: &quot;Phone Number&quot;</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400">Target: Deal Value</span>
                            <span className="text-emerald-400 font-mono font-bold">CSV Column: &quot;Deal Value&quot;</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. TAB: ANALYTICS & REPORTING */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-4 rounded-2xl border border-blue-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          <h3 className="text-base font-black text-white">Full-Funnel Analytics &amp; Performance KPIs</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Real-time conversion rates, salesperson leaderboard, blended CAC &amp; executive revenue attribution.
                        </p>
                      </div>
                    </div>

                    {/* Sales Funnel Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Total Pipeline Ingested</span>
                        <div className="text-xl font-black text-white mt-1">₹{(totalPipelineValue / 100000).toFixed(1)} Lakhs</div>
                        <span className="text-[10px] text-emerald-400 font-semibold">Across all active channels</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Closed Won Revenue</span>
                        <div className="text-xl font-black text-emerald-400 mt-1">₹{(wonRevenue / 100000).toFixed(1)} Lakhs</div>
                        <span className="text-[10px] text-slate-400">100% bank reconciled</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Lead Conversion Rate</span>
                        <div className="text-xl font-black text-indigo-400 mt-1">34.8%</div>
                        <span className="text-[10px] text-emerald-400">↑ 8.2% vs industry benchmark</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Blended CAC (Cost Per Acq)</span>
                        <div className="text-xl font-black text-purple-400 mt-1">₹114.20</div>
                        <span className="text-[10px] text-slate-400">LTV : CAC ratio 18.2x</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. TAB: INTERNAL BACKEND ARCHITECTURE (Zero-Trust) */}
                {activeTab === "backend_security" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-red-950/60 to-slate-950/60 p-4 rounded-2xl border border-red-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-red-400" />
                          <h3 className="text-base font-black text-white">Internal Backend Architecture &amp; Zero-Trust Policy</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Security mandate: API keys, database credentials, AI credentials &amp; webhook secrets are NEVER rendered on frontend.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-red-400" />
                          Isolated Microservices
                        </span>
                      </div>
                    </div>

                    {/* Architecture Topology Card */}
                    <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-2">
                        <Server className="w-4 h-4 text-red-400" />
                        <span>3-Tier Zero-Trust Flow: Frontend → Authorized API Gateway → Backend Services</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span>1. Client Browser (SPA)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Renders clean UI controls with session tokens. Strictly zero direct access to raw database connections, Gemini API keys, or Meta secret tokens.
                          </p>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/40 space-y-2">
                          <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                            <Key className="w-4 h-4 text-indigo-400" />
                            <span>2. Authorized API Gateway</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Validates JWT tokens, RBAC roles, rate limits, and dispatches requests to internal microservices via secure server-side environment variables.
                          </p>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                          <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <Database className="w-4 h-4 text-emerald-400" />
                            <span>3. Encrypted Data Layer</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            AES-256 encrypted storage for CRM records, GST reconciliation logs, customer PII &amp; audit trails behind VPC firewall.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* 12. TAB: INTEGRATION HUB */}
                {activeTab === "integrations" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 p-4 rounded-2xl border border-cyan-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-cyan-400" />
                          <h3 className="text-base font-black text-white">External Integration Hub &amp; Webhook Gateway</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Live telemetry and handshake status for Gemini AI, Meta Graph API, SendGrid &amp; Google Ads.
                        </p>
                      </div>
                    </div>

                    {/* Integrated Service Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {INTEGRATION_SERVICES.map((svc) => (
                        <div key={svc.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-black text-white">{svc.name}</h5>
                              <span className="text-[10px] text-slate-400">{svc.category}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              {svc.status} ({svc.ping})
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {svc.features.map((f, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live Webhook Tester */}
                    <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Live Inbound / Outbound Webhook Dispatcher</span>
                        </h4>
                        <button
                          onClick={handleSendTestWebhook}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                        >
                          Dispatch Test Webhook
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold mb-1">Payload (JSON)</label>
                          <textarea
                            rows={6}
                            value={webhookTestPayload}
                            onChange={(e) => setWebhookTestPayload(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold mb-1">Live Server Handshake Response</label>
                          <pre className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-400 overflow-y-auto h-[126px]">
                            {webhookResponse || "Click 'Dispatch Test Webhook' to test handshake response..."}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Trust Enterprise Protocol Active • All credentials kept server-side</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close Suite
          </button>
        </div>
      </div>

      {/* Add Inbound Lead Modal Overlay */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-black text-white">Capture / Ingest Inbound Lead</h4>
              <button onClick={() => setIsAddLeadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Rahul Bajaj"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="e.g. Bajaj Auto Enterprise"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Lead Source</label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="SEO Organic">SEO Organic</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Est. Deal Value (₹)</label>
                  <input
                    type="number"
                    value={newLeadDealValue}
                    onChange={(e) => setNewLeadDealValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black"
                >
                  Ingest &amp; AI Score Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
