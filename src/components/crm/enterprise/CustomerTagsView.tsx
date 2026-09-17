import React, { useState } from "react";
import {
  CustomerTagEntity,
  CrmLeadEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  Tag,
  Plus,
  Trash2,
  Filter,
  Search,
  Sparkles,
  Layers,
  User,
  CheckCircle,
} from "lucide-react";

interface CustomerTagsViewProps {
  tags: CustomerTagEntity[];
  leads: CrmLeadEntity[];
  onRefresh: () => void;
}

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
};

const PRESET_TAGS = [
  { name: "VIP Platinum Pilgrim", cat: "Segment", color: "amber" },
  { name: "High Net Worth (HNI)", cat: "Spending Tier", color: "purple" },
  { name: "Corporate MICE Group", cat: "Segment", color: "indigo" },
  { name: "Senior Citizen Assistance", cat: "Travel Preference", color: "rose" },
  { name: "Luxury Houseboat Preferred", cat: "Travel Preference", color: "cyan" },
  { name: "Pure Jain Vegetarian", cat: "Travel Preference", color: "emerald" },
  { name: "B2B GST Input Claim", cat: "Behavioral", color: "emerald" },
  { name: "Charter Helicopter Priority", cat: "Urgency", color: "amber" },
  { name: "Budget Backpacker", cat: "Spending Tier", color: "blue" },
  { name: "Immediate Booking Ready", cat: "Urgency", color: "rose" },
];

export const CustomerTagsView: React.FC<CustomerTagsViewProps> = ({
  tags,
  leads,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    customer_id: string;
    tag_name: string;
    color: string;
    category: CustomerTagEntity["category"];
    added_by: string;
  }>({
    customer_id: leads[0]?.customer_id || "CUST-5001",
    tag_name: "VIP Platinum Pilgrim",
    color: "amber",
    category: "Segment",
    added_by: "Rahul Sharma",
  });

  const handleApplyPreset = (preset: { name: string; cat: string; color: string }) => {
    setFormData((prev) => ({
      ...prev,
      tag_name: preset.name,
      category: preset.cat as any,
      color: preset.color,
    }));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tag_name) {
      alert("Tag name cannot be empty.");
      return;
    }

    CrmService.addTag(formData);
    setIsAddTagModalOpen(false);
    onRefresh();
  };

  const handleRemoveTag = (tag_id: string) => {
    if (window.confirm("Remove this tag from customer?")) {
      CrmService.removeTag(tag_id);
      onRefresh();
    }
  };

  const filtered = tags.filter((t) => {
    const matchSearch =
      t.tag_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCat = selectedCategory === "all" || t.category === selectedCategory;

    return matchSearch && matchCat;
  });

  // Unique tags summary
  const tagCounts: Record<string, number> = {};
  tags.forEach((t) => {
    tagCounts[t.tag_name] = (tagCounts[t.tag_name] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Entity Hierarchy Breadcrumb */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-pink-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-pink-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">customer_tags</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Customer Segmentation &amp; Behavioral Tagging</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs border border-pink-500/30">
              {tags.length} Active Tags Assigned
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Classify travelers into spending tiers, dietary preferences, corporate accounts, and pilgrimage segments
          </p>
        </div>

        <button
          onClick={() => setIsAddTagModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Assign Customer Tag</span>
        </button>
      </div>

      {/* Preset Tag Cloud Quick Access */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Popular Travel Segments (Click to Filter)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(tagCounts).map(([tagName, count]) => {
            const isSelected = searchQuery === tagName;
            return (
              <button
                key={tagName}
                onClick={() => setSearchQuery(isSelected ? "" : tagName)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-pink-600 text-white border-pink-500 shadow-sm"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span>{tagName}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-pink-300 font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search tags by name, customer_id, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Segment">Segment</option>
            <option value="Spending Tier">Spending Tier</option>
            <option value="Travel Preference">Travel Preference</option>
            <option value="Urgency">Urgency</option>
            <option value="Behavioral">Behavioral</option>
          </select>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const color = COLOR_CLASSES[item.color] || COLOR_CLASSES["amber"];
          const leadMatch = leads.find((l) => l.customer_id === item.customer_id);

          return (
            <div
              key={item.tag_id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold border ${color.bg} ${color.text} ${color.border}`}
                  >
                    {item.tag_name}
                  </span>

                  <button
                    onClick={() => handleRemoveTag(item.tag_id)}
                    className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                    title="Remove Tag"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 font-mono text-cyan-300">
                      {item.customer_id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-500">
                      {item.tag_id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  {leadMatch && (
                    <div className="text-xs text-slate-300 pt-1">
                      <strong>{leadMatch.customer_name}</strong> •{" "}
                      <span className="text-slate-400 text-[11px]">{leadMatch.destination}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Added by: <strong className="text-slate-400">{item.added_by}</strong></span>
                <span>{item.created_at}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Tag Modal */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-pink-400" />
                  <span>Assign Tag to Customer</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Tag customer profile for automated segmentation
                </p>
              </div>
              <button
                onClick={() => setIsAddTagModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="block text-[11px] text-slate-400 font-semibold">Choose from Common Presets</label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {PRESET_TAGS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 hover:border-pink-500 text-slate-300 text-[11px] transition-all"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddTag} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target Customer *</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.customer_id} value={l.customer_id}>
                      {l.customer_id} — {l.customer_name} ({l.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tag Name *</label>
                <input
                  type="text"
                  required
                  value={formData.tag_name}
                  onChange={(e) => setFormData({ ...formData, tag_name: e.target.value })}
                  placeholder="e.g. VIP Platinum Pilgrim"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Segment">Segment</option>
                    <option value="Spending Tier">Spending Tier</option>
                    <option value="Travel Preference">Travel Preference</option>
                    <option value="Urgency">Urgency</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Color Accent</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="amber">Amber Gold</option>
                    <option value="purple">Royal Purple</option>
                    <option value="rose">Rose Red</option>
                    <option value="cyan">Cyan Teal</option>
                    <option value="indigo">Deep Indigo</option>
                    <option value="emerald">Emerald Green</option>
                    <option value="blue">Sapphire Blue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Added By</label>
                <input
                  type="text"
                  required
                  value={formData.added_by}
                  onChange={(e) => setFormData({ ...formData, added_by: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTagModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-md shadow-pink-600/30"
                >
                  Save Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
