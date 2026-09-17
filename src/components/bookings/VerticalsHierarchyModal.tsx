import React from "react";
import { X, Layers } from "lucide-react";
import { UnifiedVerticalsHierarchyView } from "./UnifiedVerticalsHierarchyView";

interface VerticalsHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerticalsHierarchyModal({
  isOpen,
  onClose,
}: VerticalsHierarchyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                Verticals Relational Hierarchy &amp; Funnels
              </h2>
              <p className="text-[11px] text-slate-400">
                Houseboats (9-step funnel &amp; invoice) • Wildlife Safari (8 package attributes &amp; QR permits) • Cabs (1:many dispatch architecture)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/60">
          <UnifiedVerticalsHierarchyView />
        </div>
      </div>
    </div>
  );
}
