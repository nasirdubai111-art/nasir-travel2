import React from "react";
import {
  Plane,
  Train,
  Bus,
  TreePine,
  Sparkles,
  ShieldCheck,
  Tag,
  Lock,
  Compass,
  Building2,
  ArrowRight,
} from "lucide-react";
import { ServiceCategory } from "../../types";

export interface FooterProps {
  onSelectCategory: (cat: ServiceCategory) => void;
  onOpenAIDrawer: () => void;
  onOpenOffersModal: () => void;
  onOpenPriceWatch?: () => void;
  onOpenAdminPlatform?: () => void;
  onOpenPartnerSubscription?: () => void;
}

export function Footer({
  onSelectCategory,
  onOpenAIDrawer,
  onOpenOffersModal,
  onOpenPriceWatch,
  onOpenAdminPlatform,
  onOpenPartnerSubscription,
}: FooterProps) {
  return (
    <footer className="bg-[#0D2818] border-t border-[#1B4332] text-[#A3B18A] text-xs pt-16 pb-24 sm:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1B4332]/80">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center font-black text-base shadow-sm">
                BY
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">
                  Bharat<span className="text-[#52B788]">Yatra</span>
                </span>
                <span className="text-[10px] text-[#74C69D] uppercase font-semibold tracking-wider block">
                  Unified India Travel Platform
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#BAC7B2] max-w-sm">
              Discover the soul of India through our integrated travel platform connecting IRCTC railway reservations, domestic &amp; global flights, intercity bus networks, luxury backwaters, wildlife safari lodges, and sacred temple yatras.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-[#1B4332] text-[#74C69D] font-bold border border-[#2D6A4F]/60">
                ✓ IRCTC Authorized Rail Partner
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1B4332] text-[#74C69D] font-bold border border-[#2D6A4F]/60">
                ✓ DGCA Certified
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1B4332] text-[#E9C46A] font-bold border border-[#2D6A4F]/60">
                ✓ ISO 27001 Secure
              </span>
            </div>
          </div>

          {/* Column 2: Travel Verticals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Travel Verticals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("flights")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Domestic &amp; Global Flights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("trains")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  IRCTC Vande Bharat &amp; Tatkal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("buses")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  State Roadways &amp; Luxury Sleeper
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("hotels")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hotels &amp; Heritage Havelis
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("resorts")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Luxury Resorts &amp; Villas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("lodges")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Wildlife Safari Lodges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory("pilgrimage")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sacred Yatras &amp; VIP Darshan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenAIDrawer}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>24x7 Travel Concierge</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOffersModal}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-[#E9C46A]" />
                  <span>Verified Promo Coupons</span>
                </button>
              </li>
              {onOpenPriceWatch && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenPriceWatch}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Price Drop Radar Alerts
                  </button>
                </li>
              )}
              {onOpenPartnerSubscription && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenPartnerSubscription}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-300 font-medium"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Open Partner Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Governance & Security */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Trust &amp; Governance
            </h4>
            <div className="space-y-3 text-xs leading-relaxed text-[#BAC7B2]">
              <p>
                Enterprise banking gateways supporting UPI Autopay, Net Banking, Section 194-O TDS reconciliation, and YatraShield instant cancellation refunds.
              </p>

              <div className="space-y-1 text-[11px]">
                <div>
                  <span className="text-white font-semibold">Customer Support:</span> 24x7 Priority Assistance
                </div>
                <div>
                  <span className="text-white font-semibold">Payment Security:</span> 256-Bit Encrypted
                </div>
              </div>

              {/* Discreet Secure Admin Access */}
              {onOpenAdminPlatform && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenAdminPlatform}
                    className="px-2.5 py-1 rounded-md bg-[#1B4332] hover:bg-[#2D6A4F] text-[#E9C46A] border border-[#2D6A4F] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-[#E9C46A]" />
                    <span>Operator &amp; Admin Console</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A8A74]">
          <div>
            © 2026 BharatYatra Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">IRCTC Guidelines</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Grievance Redressal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
