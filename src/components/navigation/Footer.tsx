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
    <footer className={cn("bg-[#111827] border-t border-slate-800 text-[#9CA3AF] text-xs pt-14 pb-8", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#0B5ED7] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                BY
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Bharat<span className="text-[#0B5ED7]">Yatra</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#9CA3AF]">
              India&apos;s unified multi-modal mobility and hospitality platform integrating IRCTC rail bookings, domestic &amp; global flights, intercity bus operators, curated hotels, and sacred yatras.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-[4px] bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/20">
                IRCTC Authorized
              </span>
              <span className="px-2 py-0.5 rounded-[4px] bg-slate-800 text-sky-400 font-semibold border border-sky-500/20">
                DGCA &amp; AAI
              </span>
              <span className="px-2 py-0.5 rounded-[4px] bg-slate-800 text-amber-400 font-semibold border border-amber-500/20">
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
                    className="hover:text-white transition-colors cursor-pointer text-left"
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B5ED7]" />
                <span className="text-slate-300">Maya AI Travel Concierge</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span className="text-slate-300">Price Drop Radar Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                <span className="text-slate-300">Group Split Bills &amp; Sub-PNRs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-slate-300">Enterprise GST Invoicing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-slate-300">Section 194-O TDS Reconciliation</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Support */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Trust &amp; Governance
            </h4>

            <div className="flex items-start gap-2 text-xs text-[#9CA3AF]">
              <Phone className="w-4 h-4 text-[#0B5ED7] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">24x7 Priority Support</span>
                <span>1800-202-YATRA (Toll Free)</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-[#9CA3AF]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">256-Bit SSL Encrypted</span>
                <span>Safe &amp; Secure Digital Payments</span>
              </div>
            </div>

            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/20 transition-colors cursor-pointer"
                >
                  Admin Platform Console
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 BharatYatra Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">User Agreement</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Grievance Officer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
