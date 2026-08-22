import React, { useState } from "react";
import { X, Star, CheckCircle2, ThumbsUp, ShieldCheck, Heart } from "lucide-react";

interface CabReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData?: any;
}

export function CabReviewModal({ isOpen, onClose, tripData }: CabReviewModalProps) {
  if (!isOpen) return null;

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Punctual Chauffeur", "Clean AC Interior", "Safe Driving"]);
  const [feedback, setFeedback] = useState("");
  const [tipAmount, setTipAmount] = useState<number | null>(50);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const TAGS = [
    "Punctual Chauffeur",
    "Clean AC Interior",
    "Safe Driving",
    "Polite & Courteous",
    "Expert Route Knowledge",
    "Quiet Highway Ride",
    "Zero Toll Issues",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 to-slate-950 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black">Rate Your Chauffeur &amp; Ride</h3>
            <p className="text-xs text-cyan-200">Trip Ref: {tripData?.pnr || "CAB-819201"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
            {/* Stars */}
            <div className="text-center space-y-2">
              <span className="text-slate-600 font-bold block">How was your trip with the chauffeur?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-extrabold text-amber-700">
                {rating === 5 ? "🌟 Exceptional Service" : rating === 4 ? "👍 Very Good" : "Good"}
              </span>
            </div>

            {/* Quick Positive Tags */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">What stood out?</label>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Chauffeur Tip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Tip Your Chauffeur (100% goes to driver)</span>
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[30, 50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmount(tipAmount === amt ? null : amt)}
                    className={`py-1.5 rounded-xl font-black border text-center transition-all ${
                      tipAmount === amt
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Written Comment */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Additional Feedback (Optional)</label>
              <textarea
                rows={2}
                placeholder="Share any special appreciation for the chauffeur..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-cyan-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-slate-900 text-white font-black text-xs shadow-md hover:scale-[1.02] transition-all"
            >
              Submit Review &amp; Tip
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-slate-900">Thank You for Rating!</h4>
            <p className="text-xs text-slate-600">
              Your feedback directly rewards high-performing chauffeurs and helps maintain BharatYatra quality standards.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
