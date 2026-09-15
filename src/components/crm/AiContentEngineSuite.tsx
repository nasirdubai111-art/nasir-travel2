import React, { useState } from "react";
import { AI_CONTENT_TOOLS, AiMarketingTool } from "../../data/aiContentEngineData";
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Send,
  Languages,
  FileCode,
  Share2,
} from "lucide-react";

export function AiContentEngineSuite() {
  const [tools] = useState<AiMarketingTool[]>(AI_CONTENT_TOOLS);
  const [selectedToolId, setSelectedToolId] = useState<string>(tools[0].id);
  const [inputPrompt, setInputPrompt] = useState<string>(tools[0].samplePrompt);
  const [generatedOutput, setGeneratedOutput] = useState<string>(tools[0].defaultOutput);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedTool = tools.find((t) => t.id === selectedToolId) || tools[0];

  const handleSelectTool = (tool: AiMarketingTool) => {
    setSelectedToolId(tool.id);
    setInputPrompt(tool.samplePrompt);
    setGeneratedOutput(tool.defaultOutput);
  };

  const handleRunAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedOutput(
        `${selectedTool.defaultOutput}\n\n[Refined with custom input: "${inputPrompt}"]`
      );
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">AI Content Engine &amp; Multi-Lingual Copywriter</h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                13 Travel Archetypes
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generates sensory travel itineraries, viral social hooks, Indic language translations, and SEO schema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
          <Wand2 className="w-4 h-4" />
          <span>Gemini Pro Context Tuned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tool Selector */}
        <div className="lg:col-span-4 space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Specialized AI Tools</h4>

          {tools.map((tool) => {
            const isSelected = tool.id === selectedTool.id;
            return (
              <div
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-950/40 border-purple-500 shadow-sm"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                  {tool.category}
                </span>
                <h5 className="text-xs font-bold text-white mt-1">{tool.name}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{tool.description}</p>
              </div>
            );
          })}
        </div>

        {/* Prompt Input & Output */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">{selectedTool.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{selectedTool.description}</p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-400 font-bold block">Input Prompt / Topic</label>
              <textarea
                rows={3}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 text-xs leading-relaxed font-mono"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunAi}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? "Generating Copy..." : "Run AI Copywriter"}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Generated Output:</span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Output"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-mono max-h-[280px] overflow-y-auto">
                {generatedOutput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
