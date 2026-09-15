import React, { useState } from "react";
import { CATEGORY_SEO_DATA, CategorySeoMetric } from "../../data/seoBackendData";
import {
  Search,
  Award,
  Globe,
  Code,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Copy,
  Check,
} from "lucide-react";

export function OrganicSeoHub() {
  const [categories, setCategories] = useState<CategorySeoMetric[]>(CATEGORY_SEO_DATA);
  const [selectedCategory, setSelectedCategory] = useState<CategorySeoMetric>(CATEGORY_SEO_DATA[0]);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const jsonLdPreview = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": selectedCategory.schemaType,
      "name": `BharatYatra ${selectedCategory.category} Services`,
      "description": selectedCategory.metaDescription,
      "url": `https://bharatyatra.in/${selectedCategory.slug}`,
      "areaServed": {
        "@type": "Country",
        "name": "India",
      },
      "provider": {
        "@type": "TravelAgency",
        "name": "BharatYatra SuperApp",
        "priceRange": "₹₹",
      },
    },
    null,
    2
  );

  const handleCopySchema = () => {
    navigator.clipboard.writeText(jsonLdPreview);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Organic SEO &amp; 13 Travel Categories Hub</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                13 Categories #1 on Google
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous programmatic SEO • JSON-LD Schema injection • Zero ad spend organic travel traffic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Total Organic Traffic</span>
            <span className="text-white font-bold">9.8M / month</span>
          </div>
          <div>
            <span className="text-slate-500 block">Indexed Landing Pages</span>
            <span className="text-emerald-400 font-bold">5,980 Pages</span>
          </div>
        </div>
      </div>

      {/* Grid: Categories List & Schema Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Table */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            All 13 SuperApp Travel Verticals
          </h4>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = cat.id === selectedCategory.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-emerald-950/40 border-emerald-500 shadow-sm"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{cat.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                        Rank #{cat.organicRank}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      kw: "{cat.topKeyword}"
                    </p>
                  </div>

                  <div className="text-right text-xs shrink-0">
                    <span className="text-white font-bold block">{cat.monthlySearches}</span>
                    <span className="text-slate-500 text-[10px]">{cat.ctr}% CTR</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Schema & Meta Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Code className="w-4 h-4" />
                <span>JSON-LD Structured Data Schema</span>
              </div>
              <button
                onClick={handleCopySchema}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                {copiedSchema ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSchema ? "Copied" : "Copy Schema"}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Meta Title</span>
                <p className="text-slate-200 font-medium bg-slate-950 p-2 rounded border border-slate-800">
                  {selectedCategory.metaTitle}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Meta Description</span>
                <p className="text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 leading-relaxed">
                  {selectedCategory.metaDescription}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Live Schema Markup</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-[180px]">
                  {jsonLdPreview}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
