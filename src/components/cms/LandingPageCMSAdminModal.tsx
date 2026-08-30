import React, { useState } from "react";
import {
  Compass,
  Tag,
  Layers,
  Sparkles,
  Zap,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  ChevronDown,
  X,
  Lock,
  UserCheck,
  Globe,
  Sliders,
  Database,
  Code,
  Check,
  Search,
  Calendar,
  AlertCircle,
  FileText,
  UploadCloud,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  CMSLandingPage,
  ExploreCMSItem,
  CMSOfferRecord,
  CMSPageStatus,
  CMSSectionConfig,
  CMSSectionType,
  AdminRole,
} from "../../types/travelCmsTypes";
import { landingPageService } from "../../services/landingPageService";
import { DEFAULT_16_SECTIONS } from "../../data/travelCmsData";

interface LandingPageCMSAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPageToPreview?: (slug: string) => void;
  onApplyOfferToCart?: (promoCode: string) => void;
}

export function LandingPageCMSAdminModal({
  isOpen,
  onClose,
  onSelectPageToPreview,
  onApplyOfferToCart,
}: LandingPageCMSAdminModalProps) {
  const [activeTab, setActiveTab] = useState<
    "pages" | "explore" | "offers" | "workflow" | "database_schema" | "apis"
  >("pages");

  const [currentRole, setCurrentRole] = useState<AdminRole>("SUPER_ADMIN");
  const [pagesList, setPagesList] = useState<CMSLandingPage[]>(landingPageService.getLandingPages());
  const [exploreList, setExploreList] = useState<ExploreCMSItem[]>(landingPageService.getExploreItems());
  const [offersList, setOffersList] = useState<CMSOfferRecord[]>(landingPageService.getOffers());

  // Page Edit Modal State
  const [selectedPageForEdit, setSelectedPageForEdit] = useState<CMSLandingPage | null>(null);
  const [isCreatingNewPage, setIsCreatingNewPage] = useState(false);

  // New Page Form State
  const [pageFormTitle, setPageFormTitle] = useState("");
  const [pageFormSlug, setPageFormSlug] = useState("");
  const [pageFormType, setPageFormType] = useState<CMSLandingPage["pageType"]>("SERVICE");
  const [pageFormHeroHeadline, setPageFormHeroHeadline] = useState("");
  const [pageFormHeroSubheadline, setPageFormHeroSubheadline] = useState("");
  const [pageFormHeroImg, setPageFormHeroImg] = useState(
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80"
  );
  const [pageFormBadge, setPageFormBadge] = useState("⚡ Newly Configured Route");
  const [pageFormStatus, setPageFormStatus] = useState<CMSPageStatus>("PUBLISHED");

  // Explore Form State
  const [isCreateExploreOpen, setIsCreateExploreOpen] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expSlug, setExpSlug] = useState("");
  const [expCategoryGroup, setExpCategoryGroup] = useState<ExploreCMSItem["categoryGroup"]>("Destinations");
  const [expSubCategory, setExpSubCategory] = useState<ExploreCMSItem["subCategory"]>("Beaches");
  const [expDestination, setExpDestination] = useState("Goa");
  const [expPrice, setExpPrice] = useState(4999);
  const [expCtaText, setExpCtaText] = useState("Explore Now");
  const [expCtaUrl, setExpCtaUrl] = useState("/destinations/goa");

  // Offer Form State
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [offTitle, setOffTitle] = useState("");
  const [offCode, setOffCode] = useState("");
  const [offType, setOffType] = useState<CMSOfferRecord["offerType"]>("FLIGHT");
  const [offDiscountVal, setOffDiscountVal] = useState(15);
  const [offMinBooking, setOffMinBooking] = useState(3000);

  // Save Page
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageFormTitle || !pageFormSlug) return;

    const newPage: CMSLandingPage = {
      id: selectedPageForEdit?.id || `page-${Date.now()}`,
      title: pageFormTitle,
      slug: pageFormSlug.replace(/^\/+|\/+$/g, ""),
      pageType: pageFormType,
      description: pageFormHeroSubheadline,
      heroHeadline: pageFormHeroHeadline,
      heroSubheadline: pageFormHeroSubheadline,
      heroImageUrl: pageFormHeroImg,
      badgeTag: pageFormBadge,
      status: pageFormStatus,
      sections: selectedPageForEdit ? selectedPageForEdit.sections : DEFAULT_16_SECTIONS,
      seo: {
        metaTitle: `${pageFormTitle} | BharatYatra`,
        metaDescription: pageFormHeroSubheadline,
        keywords: [pageFormSlug, pageFormType, "Travel India"],
        canonicalUrl: `https://bharatyatra.in/${pageFormSlug}`,
        ogImage: pageFormHeroImg,
        structuredSchemaType: "TravelAgency",
      },
      createdBy: currentRole,
      updatedAt: new Date().toISOString(),
    };

    const updated = landingPageService.saveLandingPage(newPage);
    setPagesList(updated);
    setIsCreatingNewPage(false);
    setSelectedPageForEdit(null);
  };

  // Section Visibility Toggle
  const handleToggleSection = (pageId: string, sectionId: string) => {
    const page = pagesList.find((p) => p.id === pageId);
    if (!page) return;

    const updatedSections = page.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
    );

    const updatedPage = { ...page, sections: updatedSections };
    const updatedList = landingPageService.saveLandingPage(updatedPage);
    setPagesList(updatedList);
  };

  // Create Explore Item
  const handleCreateExplore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle) return;

    const newItem: ExploreCMSItem = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      slug: expSlug || expTitle.toLowerCase().replace(/\s+/g, "-"),
      description: `Curated ${expSubCategory} experience in ${expDestination} with verified local guides.`,
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
      categoryGroup: expCategoryGroup,
      subCategory: expSubCategory,
      destinationName: expDestination,
      packagePriceStarting: expPrice,
      rating: 4.9,
      reviewCount: 120,
      badge: "Newly Added",
      ctaText: expCtaText,
      ctaUrl: expCtaUrl,
      displayOrder: exploreList.length + 1,
      status: "PUBLISHED",
      seoTitle: `${expTitle} | Explore BharatYatra`,
      metaDescription: `Discover ${expTitle} with best rates and instant booking.`,
      keywords: [expTitle, expDestination, expSubCategory],
    };

    const updated = landingPageService.saveExploreItem(newItem);
    setExploreList(updated);
    setIsCreateExploreOpen(false);
    setExpTitle("");
  };

  // Create Offer Item
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offTitle || !offCode) return;

    const newOffer: CMSOfferRecord = {
      id: `off-${Date.now()}`,
      title: offTitle,
      description: `${offTitle} — Get instant ${offDiscountVal}% discount on minimum booking of ₹${offMinBooking}.`,
      offerType: offType,
      promoCode: offCode.toUpperCase().trim(),
      discountType: "PERCENTAGE",
      discountValue: offDiscountVal,
      minimumBookingValue: offMinBooking,
      maximumDiscountCap: 2000,
      validFrom: "2026-08-01",
      validUntil: "2026-12-31",
      targetCustomer: "ALL",
      partner: "BharatYatra Platform",
      bannerImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      termsAndConditions: ["Valid on all routes.", "100% free cancellation."],
      displayPriority: 8,
      status: "PUBLISHED",
      claimedCount: 0,
      maxUsageLimit: 10000,
      seoData: {
        metaTitle: `${offCode} Promo Code | BharatYatra`,
        metaDescription: `Use code ${offCode} for instant savings.`,
        keywords: [offCode, offType, "Discount"],
      },
    };

    const updated = landingPageService.saveOffer(newOffer);
    setOffersList(updated);
    setIsCreateOfferOpen(false);
    setOffTitle("");
    setOffCode("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden text-slate-100">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Travel Platform — Landing Page + Explore + Offers CMS
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                16 Reusable CMS Sections • 4 Explore Groups • 10 Offer Types • PostgreSQL Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* RBAC Role Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 font-medium">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as AdminRole)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="SUPER_ADMIN" className="bg-slate-900">Super Admin (All Access)</option>
                <option value="CMS_ADMIN" className="bg-slate-900">CMS Admin</option>
                <option value="OFFER_MANAGER" className="bg-slate-900">Offer Manager</option>
                <option value="CONTENT_EDITOR" className="bg-slate-900">Content Editor</option>
                <option value="REVIEWER" className="bg-slate-900">Reviewer</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAV TABS */}
        {/* ========================================================================= */}
        <div className="px-5 bg-slate-950/70 border-b border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 py-2">
          {[
            { id: "pages", label: "1. Landing Pages CMS", icon: Globe, count: pagesList.length },
            { id: "explore", label: "2. Explore CMS Module", icon: Compass, count: exploreList.length },
            { id: "offers", label: "3. Offers CMS Module", icon: Tag, count: offersList.length },
            { id: "workflow", label: "4. Workflow & RBAC", icon: Lock },
            { id: "database_schema", label: "5. PostgreSQL CMS Schema", icon: Database },
            { id: "apis", label: "6. Spring Boot REST APIs", icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB CONTENTS */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* ----------------------------------------------------------------------- */}
          {/* TAB 1: LANDING PAGES CMS */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "pages" && (
            <div className="space-y-6">
              {/* Header & Create Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white">Configured Public Landing Pages</h3>
                  <p className="text-xs text-slate-400">
                    Manage URL routes (`/`, `/travel`, `/flights`, `/destinations/:slug`) and customize their 16 section blocks.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPageForEdit(null);
                    setPageFormTitle("");
                    setPageFormSlug("");
                    setPageFormHeroHeadline("");
                    setPageFormHeroSubheadline("");
                    setIsCreatingNewPage(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Landing Page</span>
                </button>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagesList.map((pg) => (
                  <div
                    key={pg.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                          /{pg.slug || "home"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {pg.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white line-clamp-1">{pg.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {pg.description}
                      </p>

                      <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>
                          Visible Blocks:{" "}
                          <strong className="text-slate-300 font-mono">
                            {pg.sections.filter((s) => s.isVisible).length} / {pg.sections.length}
                          </strong>
                        </span>
                        <span>Updated: {new Date(pg.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Section Visibility Toggles Preview */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Quick Block Toggles:
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        {pg.sections.slice(0, 6).map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => handleToggleSection(pg.id, sec.id)}
                            className={`px-2 py-1 rounded text-left truncate transition-colors flex items-center justify-between ${
                              sec.isVisible
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                : "bg-slate-800/60 text-slate-500 line-through"
                            }`}
                          >
                            <span className="truncate">{sec.title || sec.type}</span>
                            <span className="text-[9px] font-mono">{sec.isVisible ? "ON" : "OFF"}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (onSelectPageToPreview) {
                            onSelectPageToPreview(pg.slug);
                            onClose();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Live Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPageForEdit(pg);
                          setPageFormTitle(pg.title);
                          setPageFormSlug(pg.slug);
                          setPageFormType(pg.pageType);
                          setPageFormHeroHeadline(pg.heroHeadline);
                          setPageFormHeroSubheadline(pg.heroSubheadline);
                          setPageFormHeroImg(pg.heroImageUrl);
                          setPageFormBadge(pg.badgeTag || "");
                          setPageFormStatus(pg.status);
                          setIsCreatingNewPage(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit CMS</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 2: EXPLORE CMS MODULE */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "explore" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white">Explore CMS Catalog (Independent Module)</h3>
                  <p className="text-xs text-slate-400">
                    4 Hierarchy Groups: Destinations (Cities, Beaches, Mountains, Heritage), Experiences (Adventure, Honeymoon, Luxury), Travel Services & Pilgrimage.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateExploreOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Explore Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {exploreList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-32 rounded-xl overflow-hidden relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 text-[10px] font-mono font-bold">
                          {item.subCategory}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{item.packagePriceStarting?.toLocaleString()}
                      </span>
                      <span className="text-slate-400">{item.ctaText} →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 3: OFFERS CMS MODULE */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white">Offers CMS Master (10 Offer Types)</h3>
                  <p className="text-xs text-slate-400">
                    Create promo codes and deals for Flights, Trains, Buses, Hotels, Resorts, Tours, Pilgrimage, Cabs & Seasonal Festivals.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateOfferOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Offer Promo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offersList.map((off) => (
                  <div
                    key={off.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-black">
                          {off.promoCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {off.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{off.title}</h4>
                      <p className="text-xs text-slate-400">{off.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Min Spend: <strong className="text-white font-mono">₹{off.minimumBookingValue}</strong>
                      </span>
                      {onApplyOfferToCart && (
                        <button
                          onClick={() => {
                            onApplyOfferToCart(off.promoCode);
                            onClose();
                          }}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Apply to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 4: WORKFLOW & RBAC (8 STATUSES) */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "workflow" && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  Admin CMS Publishing Workflow Pipeline
                </h3>
                <p className="text-xs text-slate-300">
                  Every CMS landing page, explore card, and offer promo traverses through the enterprise governance pipeline:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                  {[
                    { status: "DRAFT", label: "1. Draft", desc: "Content Editor builds page", color: "text-slate-400 border-slate-700" },
                    { status: "IN_REVIEW", label: "2. In Review", desc: "Submitted to SEO & Lead", color: "text-amber-400 border-amber-500/40" },
                    { status: "APPROVED", label: "3. Approved", desc: "Marketing clearance granted", color: "text-blue-400 border-blue-500/40" },
                    { status: "SCHEDULED", label: "4. Scheduled", desc: "Auto-launches on set date", color: "text-purple-400 border-purple-500/40" },
                    { status: "PUBLISHED", label: "5. Published", desc: "Live on CDN / React Web", color: "text-emerald-400 border-emerald-500/40" },
                    { status: "ARCHIVED", label: "6. Archived", desc: "Historical campaign", color: "text-rose-400 border-rose-500/40" },
                  ].map((st) => (
                    <div key={st.status} className={`p-3 rounded-xl bg-slate-900 border ${st.color} space-y-1`}>
                      <div className="text-xs font-black">{st.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 5: POSTGRESQL CMS DATABASE TABLES */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "database_schema" && (
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                PostgreSQL Relational CMS Schema Architecture
              </h3>
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`-- 1. Landing Pages Master Table
CREATE TABLE landing_pages (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    hero_headline VARCHAR(255),
    hero_subheadline TEXT,
    hero_image_url TEXT,
    theme_accent_color VARCHAR(32) DEFAULT '#4f46e5',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, IN_REVIEW, APPROVED, PUBLISHED, SCHEDULED
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Landing Page 16 Configurable Reusable Sections
CREATE TABLE landing_page_sections (
    id VARCHAR(64) PRIMARY KEY,
    landing_page_id VARCHAR(64) REFERENCES landing_pages(id) ON DELETE CASCADE,
    section_type VARCHAR(64) NOT NULL, -- HERO_BANNER, SEARCH_WIDGET, EXPLORE_SECTION, OFFERS_DEALS, etc.
    display_order INT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    custom_json_config JSONB
);

-- 3. Explore CMS Module Catalog
CREATE TABLE explore_items (
    id VARCHAR(64) PRIMARY KEY,
    category_group VARCHAR(64) NOT NULL, -- Destinations, Experiences, Travel Services, Special Travel
    sub_category VARCHAR(64) NOT NULL,   -- Beaches, Mountains, Heritage, Honeymoon, Pilgrimage
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    destination_name VARCHAR(128) NOT NULL,
    package_price_starting NUMERIC(10, 2),
    cta_url TEXT,
    status VARCHAR(32) DEFAULT 'PUBLISHED'
);

-- 4. Offers CMS Module Master
CREATE TABLE offers (
    id VARCHAR(64) PRIMARY KEY,
    offer_type VARCHAR(32) NOT NULL,     -- FLIGHT, TRAIN, BUS, HOTEL, PILGRIMAGE, FESTIVAL
    promo_code VARCHAR(32) UNIQUE NOT NULL,
    discount_type VARCHAR(16) NOT NULL,  -- PERCENTAGE, FIXED_AMOUNT
    discount_value NUMERIC(10, 2) NOT NULL,
    minimum_booking_value NUMERIC(10, 2) DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'PUBLISHED'
);`}
              </pre>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 6: SPRING BOOT REST APIS */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "apis" && (
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                Spring Boot & Node.js Production REST API Contract
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { method: "GET", path: "/api/public/landing-pages/{slug}", desc: "Fetch complete CMS page layout, 16 section flags, and SEO meta by route slug" },
                  { method: "GET", path: "/api/public/explore", desc: "Fetch all categorized explore items grouped by Destinations, Experiences & Pilgrimage" },
                  { method: "GET", path: "/api/public/offers", desc: "Fetch live validated promo codes, minimum spend caps, and banner URLs" },
                  { method: "POST", path: "/api/admin/cms/landing-pages", desc: "Admin endpoint to create/update dynamic landing page without frontend rebuild" },
                  { method: "POST", path: "/api/admin/cms/explore", desc: "Admin endpoint to publish or reorder explore discovery items" },
                  { method: "POST", path: "/api/admin/cms/offers", desc: "Admin endpoint to create promo code campaigns" },
                ].map((api, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                        api.method === "GET" ? "bg-emerald-500/20 text-emerald-300" : "bg-indigo-500/20 text-indigo-300"
                      }`}>
                        {api.method}
                      </span>
                      <span className="text-white font-bold">{api.path}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-sans">{api.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CREATE / EDIT PAGE MODAL */}
        {/* ========================================================================= */}
        {isCreatingNewPage && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl p-6 space-y-4 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">
                  {selectedPageForEdit ? "Edit Landing Page CMS" : "Create New Dynamic Landing Page"}
                </h3>
                <button onClick={() => setIsCreatingNewPage(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePage} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Page Title</label>
                  <input
                    type="text"
                    required
                    value={pageFormTitle}
                    onChange={(e) => setPageFormTitle(e.target.value)}
                    placeholder="e.g. Kashmir Winter Wonderland 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Route Slug (/...)</label>
                    <input
                      type="text"
                      required
                      value={pageFormSlug}
                      onChange={(e) => setPageFormSlug(e.target.value)}
                      placeholder="e.g. destinations/kashmir"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Page Type</label>
                    <select
                      value={pageFormType}
                      onChange={(e) => setPageFormType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="SERVICE">SERVICE (Flights, Hotels, Trains)</option>
                      <option value="DESTINATION">DESTINATION (Goa, Kashmir, Kerala)</option>
                      <option value="SPECIAL_TRAVEL">SPECIAL_TRAVEL (Pilgrimage, Corporate)</option>
                      <option value="CAMPAIGN">CAMPAIGN (Diwali, Monsoon)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    required
                    value={pageFormHeroHeadline}
                    onChange={(e) => setPageFormHeroHeadline(e.target.value)}
                    placeholder="e.g. Ski Gulmarg Peaks & Cruise Dal Lake in Heated Shikaras"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Hero Sub-headline / Description</label>
                  <textarea
                    rows={2}
                    value={pageFormHeroSubheadline}
                    onChange={(e) => setPageFormHeroSubheadline(e.target.value)}
                    placeholder="e.g. All-inclusive luxury holiday packages starting at ₹12,999 with gondola pass."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Hero Banner Image URL</label>
                    <input
                      type="text"
                      value={pageFormHeroImg}
                      onChange={(e) => setPageFormHeroImg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={pageFormBadge}
                      onChange={(e) => setPageFormBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewPage(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                  >
                    Save & Publish Page
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREATE EXPLORE MODAL */}
        {/* ========================================================================= */}
        {isCreateExploreOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-4 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">Add New Explore CMS Card</h3>
                <button onClick={() => setIsCreateExploreOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExplore} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="e.g. Scuba Diving at Grand Island"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Category Group</label>
                    <select
                      value={expCategoryGroup}
                      onChange={(e) => setExpCategoryGroup(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Destinations">Destinations</option>
                      <option value="Experiences">Experiences</option>
                      <option value="Travel Services">Travel Services</option>
                      <option value="Special Travel">Special Travel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Sub-Category</label>
                    <select
                      value={expSubCategory}
                      onChange={(e) => setExpSubCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Beaches">Beaches</option>
                      <option value="Mountains">Mountains</option>
                      <option value="Heritage">Heritage</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Pilgrimage">Pilgrimage</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Destination Name</label>
                    <input
                      type="text"
                      value={expDestination}
                      onChange={(e) => setExpDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Starting Price (₹)</label>
                    <input
                      type="number"
                      value={expPrice}
                      onChange={(e) => setExpPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateExploreOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                  >
                    Save Explore Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREATE OFFER MODAL */}
        {/* ========================================================================= */}
        {isCreateOfferOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-4 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">Create New Offer Promo Code</h3>
                <button onClick={() => setIsCreateOfferOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={offTitle}
                    onChange={(e) => setOffTitle(e.target.value)}
                    placeholder="e.g. Weekend Flash Deal — Flat 20% Off"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Promo Code</label>
                    <input
                      type="text"
                      required
                      value={offCode}
                      onChange={(e) => setOffCode(e.target.value)}
                      placeholder="e.g. FLASH20"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Offer Type</label>
                    <select
                      value={offType}
                      onChange={(e) => setOffType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="FLIGHT">Flight Offer</option>
                      <option value="HOTEL">Hotel Offer</option>
                      <option value="TRAIN">Train Offer</option>
                      <option value="BUS">Bus Offer</option>
                      <option value="PILGRIMAGE">Pilgrimage Offer</option>
                      <option value="FESTIVAL_SEASONAL">Festival Offer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={offDiscountVal}
                      onChange={(e) => setOffDiscountVal(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Min Booking (₹)</label>
                    <input
                      type="number"
                      value={offMinBooking}
                      onChange={(e) => setOffMinBooking(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateOfferOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black cursor-pointer"
                  >
                    Save & Publish Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
