import React from "react";
import { X, Users, ArrowLeft } from "lucide-react";
import { SplitBillSection } from "./SplitBillSection";
import { SplitBillConfig, ServiceCategory, UserProfile } from "../../types";

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  title: string;
  subtitle?: string;
  serviceCategory?: ServiceCategory;
  pnr?: string;
  userProfile: UserProfile;
  passengersList: Array<{
    id?: string;
    name: string;
    phone?: string;
    email?: string;
    seatPreference?: string;
    seatNumber?: string;
  }>;
  initialConfig?: SplitBillConfig;
  onSaveConfig?: (config: SplitBillConfig) => void;
  isConfirmed?: boolean;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  title,
  subtitle,
  serviceCategory = "flights",
  pnr,
  userProfile,
  passengersList,
  initialConfig,
  onSaveConfig,
  isConfirmed = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Split Booking Bill &amp; Share Links
              </h3>
              <p className="text-xs text-slate-500">
                Easily collect payments from fellow travelers with 1-click UPI links
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <SplitBillSection
            totalAmount={totalAmount}
            title={title}
            subtitle={subtitle}
            serviceCategory={serviceCategory}
            pnr={pnr}
            userProfile={userProfile}
            passengersList={passengersList}
            initialConfig={initialConfig}
            onConfigChange={onSaveConfig}
            isConfirmed={isConfirmed}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
