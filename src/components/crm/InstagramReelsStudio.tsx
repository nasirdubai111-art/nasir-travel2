import React, { useState } from "react";
import { REELS_TEMPLATES_DATA, ReelTemplate } from "../../data/reelsMarketingData";
import {
  Video,
  Flame,
  Music,
  Clock,
  Sparkles,
  Share2,
  Copy,
  Check,
  Smartphone,
} from "lucide-react";

export function InstagramReelsStudio() {
  const [templates, setTemplates] = useState<ReelTemplate[]>(REELS_TEMPLATES_DATA);
  const [selectedReelId, setSelectedReelId] = useState<string>(templates[0].id);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedReel = templates.find((r) => r.id === selectedReelId) || templates[0];

  const handleCopyScript = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/60 via-slate-900 to-purple-950/60 border border-pink-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-black">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Instagram Reels &amp; Short-Form Video Marketing</h3>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/40">
                9:16 Aspect Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI-generated 3-second viral hooks • Scene-by-scene timing • Audio sync • Direct WhatsApp lead magnets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedReelId(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedReelId === t.id
                  ? "bg-pink-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {t.title.slice(0, 20)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mock Phone Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[300px] rounded-[36px] bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden p-3 relative flex flex-col justify-between h-[540px]">
            {/* Mock Screen Header */}
            <div className="flex items-center justify-between text-[11px] text-white pt-2 px-3 z-10">
              <span className="font-bold">Reels Studio</span>
              <span className="text-pink-400 font-bold">{selectedReel.aspectRatio}</span>
            </div>

            {/* Visual Center Preview */}
            <div className="p-4 text-center space-y-3 z-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30 animate-pulse">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-sm font-black text-white px-2 leading-snug">
                "{selectedReel.hookText}"
              </p>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 p-1.5 rounded border border-emerald-500/30">
                Viral Algorithm Score: {selectedReel.viralScore} / 100
              </div>
            </div>

            {/* Bottom Controls on Phone */}
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 z-10 text-[11px]">
              <div className="flex items-center gap-1.5 text-pink-300 truncate">
                <Music className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{selectedReel.trendingAudio}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Duration: {selectedReel.durationSeconds}s</span>
                <span className="text-white font-bold">{selectedReel.viewsEstimated} Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Script & Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Production Breakdown &amp; Video Narration</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedReel.title}</h3>
            </div>

            <div className="space-y-3">
              {selectedReel.scriptOutline.map((scene, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold">
                      {scene.timestamp}
                    </span>
                    <button
                      onClick={() => handleCopyScript(scene.narration, idx)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-mono"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Narration</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Visual Scene:</strong> {scene.visualScene}
                    </p>
                    <p className="text-indigo-300 font-semibold">
                      <strong>Text Overlay:</strong> "{scene.overlayText}"
                    </p>
                    <p className="text-white italic bg-slate-900 p-2 rounded border border-slate-800/60">
                      🎙️ Voiceover: "{scene.narration}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
