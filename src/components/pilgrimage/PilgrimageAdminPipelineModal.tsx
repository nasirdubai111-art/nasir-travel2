import React from "react";
import { X, Sun } from "lucide-react";
import { PilgrimageAdminPipelineView } from "./PilgrimageAdminPipelineView";

interface PilgrimageAdminPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PilgrimageAdminPipelineModal({
  isOpen,
  onClose,
}: PilgrimageAdminPipelineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
              <Sun className="w-4 h-4 text-orange-400" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                Pilgrimage Administrative Governance Pipeline
              </h2>
              <p className="text-[11px] text-slate-400">
                Admin ➔ Pilgrimage Management ➔ Operators ➔ Packages ➔ Bookings ➔ Payments ➔ Reports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/60">
          <PilgrimageAdminPipelineView />
        </div>
      </div>
    </div>
  );
}
