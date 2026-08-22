import React, { useState } from "react";
import {
  Briefcase,
  ShieldCheck,
  Building,
  CheckCircle2,
  Download,
  Users,
  CreditCard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CityLocation, CorporatePlan } from "../../types";
import { MOCK_CORPORATE_PLANS } from "../../data/mockTravelData";

interface CorporateHomeProps {
  currentLocation: CityLocation;
  onBookCorporate: (plan: CorporatePlan) => void;
  onOpenAIDrawer: () => void;
}

export function CorporateHome({
  currentLocation,
  onBookCorporate,
  onOpenAIDrawer,
}: CorporateHomeProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Corporate Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  BharatYatra for Business &amp; Enterprises
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  Save 18% GST
                </span>
              </div>
              <p className="text-xs text-slate-300">Automated B2B GST Invoicing • Multi-tier Approval Workflows • Centralized Corporate Credit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Features Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">18% GST Input Credit</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download automated monthly consolidated GST tax compliance invoices for your finance team.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Automated Travel Policies</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Set custom spending limits by employee grade with 1-click WhatsApp/Email manager approvals.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <CreditCard className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">30-Day Revolving Credit</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminate employee reimbursement friction with unified corporate ledger credit limits.
          </p>
        </div>
      </div>

      {/* Corporate Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Corporate &amp; SME Onboarding Tiers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_CORPORATE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col justify-between space-y-6 hover:border-slate-900 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                    {plan.employeeCount}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">{plan.gstSavingRate}</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{plan.tier}</h3>
                  <p className="text-xs text-slate-500 mt-1">Revolving Credit: {plan.creditDays} Days Payment Terms</p>
                </div>

                <div className="space-y-2 pt-2">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onBookCorporate(plan)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Activate Corporate Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
