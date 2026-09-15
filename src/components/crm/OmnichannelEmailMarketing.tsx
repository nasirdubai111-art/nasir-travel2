import React, { useState } from "react";
import {
  Mail,
  Send,
  Sparkles,
  CheckCircle,
  FileText,
  Clock,
  Eye,
  Percent,
} from "lucide-react";

export function OmnichannelEmailMarketing() {
  const [subject, setSubject] = useState(
    "✈️ Confirming your Kashmir Heli-Ski Chalet Booking [PNR: BY-99214]"
  );
  const [bodyText, setBodyText] = useState(
    `Namaste Dr. Arvind Subramanian,\n\nWe are delighted to confirm your luxury winter expedition to Gulmarg, Kashmir from December 24 to December 28, 2026.\n\nYour reserved package includes:\n• 3-Bedroom Presidential Chalet with private wooden fireplace\n• Daily Gondola Phase-1 & Phase-2 VIP Passes\n• Dedicated mountain driver with 4x4 snow chains\n\nYour official PNR Pass and Dynamic QR Code are attached below.\n\nWarm regards,\nBharatYatra Executive Concierge Desk`
  );
  const [isSending, setIsSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const handleSendTestEmail = () => {
    setIsSending(true);
    setSentNotice("Connecting to AWS SES Dedicated IP cluster (DKIM & SPF verified)...");
    setTimeout(() => {
      setSentNotice(
        "Broadcast delivered to recipient with 0ms latency. Verified 100% inbox placement (0% spam score)."
      );
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Omnichannel Email Marketing &amp; Transactional Engine</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                AWS SES Dedicated IP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              99.4% Inbox deliverability • Real-time open tracking • Dynamic QR PNR attachments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Avg Open Rate</span>
            <span className="text-emerald-400 font-bold">58.4%</span>
          </div>
          <div>
            <span className="text-slate-500 block">CTR</span>
            <span className="text-indigo-400 font-bold">24.2%</span>
          </div>
        </div>
      </div>

      {sentNotice && (
        <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 text-xs font-mono text-amber-300 animate-in fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {/* Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Email Composer</h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Message Body</label>
                <textarea
                  rows={8}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500 leading-relaxed text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSending}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? "Transmitting..." : "Send Test Broadcast"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Inbox Client Rendering Preview</span>
            </h4>

            <div className="rounded-xl bg-white text-slate-900 p-5 space-y-4 shadow-xl text-xs">
              <div className="border-b border-slate-200 pb-3">
                <div className="font-bold text-sm text-slate-900">{subject}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  From: BharatYatra Concierge &lt;vip@bharatyatra.in&gt;
                </div>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-sans">
                {bodyText}
              </div>

              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-800">Attached: PNR_Pass_BY-99214.pdf</span>
                <span className="text-emerald-700 font-bold">QR Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
