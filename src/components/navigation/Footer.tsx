import React from "react";
import { ShieldCheck, Phone, Mail, Award } from "lucide-react";
import { cn } from "../../lib/utils";

export interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onOpenAdmin?: () => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  className,
}) => {
  return (
    <footer className={cn("bg-[#081C15] border-t border-[#143225] text-[#9CA3AF] text-xs pt-14 pb-8", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#143225]">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                BY
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Bharat<span className="text-[#52B788]">Yatra</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#A3B18A]">
              India&apos;s unified multi-modal mobility and hospitality platform integrating IRCTC rail bookings, domestic &amp; global flights, intercity bus operators, curated hotels, and sacred yatras.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#143225] text-[#52B788] font-semibold border border-[#52B788]/30">
                IRCTC Authorized
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#143225] text-[#74C69D] font-semibold border border-[#74C69D]/30">
                DGCA &amp; AAI
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#143225] text-[#D8F3DC] font-semibold border border-[#D8F3DC]/30">
                ISO 27001 Certified
              </span>
            </div>
          </div>

          {/* Column 2: Travel Services */}
          <div className="text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Travel Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: "flights", label: "Domestic & Global Flights" },
                { id: "trains", label: "IRCTC Train Bookings & PNR" },
                { id: "buses", label: "State Roadways & Luxury Buses" },
                { id: "hotels", label: "Verified Hotels & Homestays" },
                { id: "pilgrimage", label: "Sacred Yatras & Darshan Passes" },
                { id: "resorts", label: "Luxury Stays & Safari Lodges" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(item.id)}
                    className="text-[#A3B18A] hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform & Features */}
          <div className="text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                <span className="text-[#D8F3DC]">24x7 Travel Concierge</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E9D8A6]" />
                <span className="text-[#D8F3DC]">Price Drop Radar Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#40916C]" />
                <span className="text-[#D8F3DC]">Group Split Bills &amp; Sub-PNRs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]" />
                <span className="text-[#D8F3DC]">Enterprise GST Invoicing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#95D5B2]" />
                <span className="text-[#D8F3DC]">Section 194-O TDS Reconciliation</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Support */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Trust &amp; Governance
            </h4>

            <div className="flex items-start gap-2 text-xs text-[#A3B18A]">
              <Phone className="w-4 h-4 text-[#52B788] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">24x7 Priority Support</span>
                <span>1800-202-YATRA (Toll Free)</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-[#A3B18A]">
              <ShieldCheck className="w-4 h-4 text-[#74C69D] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">256-Bit SSL Encrypted</span>
                <span>Safe &amp; Secure Digital Payments</span>
              </div>
            </div>

            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="px-3.5 py-2 rounded-xl bg-[#143225] hover:bg-[#1B4332] text-[#D8F3DC] font-bold text-xs border border-[#2D6A4F] transition-colors cursor-pointer"
                >
                  Admin Platform Console
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#526658]">
          <div>
            © 2026 BharatYatra Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#A3B18A]">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">User Agreement</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Grievance Officer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
