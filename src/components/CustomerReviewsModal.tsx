import React, { useState } from "react";
import {
  X,
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Filter,
  Image as ImageIcon,
  ShieldCheck,
  Plane,
  Train,
  Building2,
  Compass,
  Car,
  UtensilsCrossed,
  Sparkles,
  Search,
} from "lucide-react";
import { ServiceCategory } from "../types";

interface CustomerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: ServiceCategory) => void;
}

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  avatar: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  rating: number;
  date: string;
  verifiedBooking: boolean;
  title: string;
  comment: string;
  tags: string[];
  likesCount: number;
  photos?: string[];
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "REV-101",
    author: "Rohit Deshmukh",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    serviceCategory: "trains",
    serviceName: "Vande Bharat Express (Mumbai ➔ Goa)",
    rating: 5,
    date: "18 Aug 2026",
    verifiedBooking: true,
    title: "Executive Class was absolutely world-class!",
    comment: "Seamless IRCTC zero-convenience fee booking on BharatYatra. Clean coaches, super punctual (reached Madgaon 15 min early), and complimentary hot meals. Digital PNR pass worked like magic.",
    tags: ["Punctual", "Clean Coaches", "Great Food"],
    likesCount: 142,
    photos: [
      "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "REV-102",
    author: "Ananya Iyer",
    location: "Bengaluru, Karnataka",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    serviceCategory: "hotels",
    serviceName: "The Leela Palace, Udaipur",
    rating: 5,
    date: "14 Aug 2026",
    verifiedBooking: true,
    title: "Lake Pichola view suite was heavenly",
    comment: "Used YatraCoins for a ₹4,000 instant discount. Royal butler hospitality, private boat arrival, and majestic breakfast spread. Will definitely rebook through BharatYatra!",
    tags: ["Luxury Heritage", "Lake View", "YatraCoins Used"],
    likesCount: 89,
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "REV-103",
    author: "Col. Rajeshwardas",
    location: "Chandigarh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    serviceCategory: "pilgrimage",
    serviceName: "Kedarnath & Badrinath Helicopter Yatra",
    rating: 5,
    date: "10 Aug 2026",
    verifiedBooking: true,
    title: "Divine and seamless VIP Darshan for senior citizens",
    comment: "The biometric helicopter priority boarding at Phata and pre-arranged priest facilitation at Kedarnath temple made the pilgrimage effortless for my 72-year-old mother.",
    tags: ["VIP Darshan", "Senior Citizen Friendly", "Helicopter Priority"],
    likesCount: 215,
  },
  {
    id: "REV-104",
    author: "Sneha Patel",
    location: "Ahmedabad, Gujarat",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    serviceCategory: "flights",
    serviceName: "Air India AI-805 (Delhi ➔ Kochi)",
    rating: 4,
    date: "08 Aug 2026",
    verifiedBooking: true,
    title: "Zero cancellation fee plan saved my trip",
    comment: "Had to reschedule my flight due to client meetings. The Digit Insurance refund addon approved the modification immediately with no extra penalty.",
    tags: ["Zero Penalty", "Instant Reschedule", "Baggage Safe"],
    likesCount: 54,
  },
  {
    id: "REV-105",
    author: "Vikram Malhotra",
    location: "Jaipur, Rajasthan",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
    serviceCategory: "dining",
    serviceName: "Gulshan Dhaba, Murthal (NH44)",
    rating: 5,
    date: "04 Aug 2026",
    verifiedBooking: true,
    title: "Best White Butter Tandoori Parathas on highway",
    comment: "Reserved highway table & EV charging bay via BharatYatra highway companion. Food was steaming hot, washrooms were pristine, and got 10% cash discount.",
    tags: ["Highway Stop", "EV Charging", "Clean Washrooms"],
    likesCount: 76,
  },
  {
    id: "REV-106",
    author: "Pooja Hegde",
    location: "Hyderabad, Telangana",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    serviceCategory: "cabs",
    serviceName: "Toyota Innova Crysta (Delhi ➔ Agra Outstation)",
    rating: 5,
    date: "01 Aug 2026",
    verifiedBooking: true,
    title: "Chauffeur Harpreet Singh was courteous and punctual",
    comment: "Sanitized vehicle, fastag auto-settled, zero surge pricing. Smooth highway cruise on Yamuna Expressway.",
    tags: ["Clean Cab", "Toll Included", "Safe Chauffeur"],
    likesCount: 63,
  },
];

export function CustomerReviewsModal({
  isOpen,
  onClose,
  onSelectCategory,
}: CustomerReviewsModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<ServiceCategory | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userHasLiked, setUserHasLiked] = useState<Record<string, boolean>>({});

  // Review submission state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newAuthor, setNewAuthor] = useState("Aditya Sharma");
  const [newServiceName, setNewServiceName] = useState("");
  const [newCategory, setNewCategory] = useState<ServiceCategory>("flights");
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittedBanner, setSubmittedBanner] = useState(false);

  if (!isOpen) return null;

  const handleLike = (id: string, initialLikes: number) => {
    const isLiked = userHasLiked[id];
    setUserHasLiked((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + (isLiked ? -1 : 1),
    }));
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newTitle || !newComment) {
      alert("Please complete all review fields.");
      return;
    }
    setSubmittedBanner(true);
    setTimeout(() => {
      setIsWritingReview(false);
      setSubmittedBanner(false);
      setNewServiceName("");
      setNewTitle("");
      setNewComment("");
    }, 1500);
  };

  const filteredReviews = MOCK_REVIEWS.filter((rev) => {
    const matchesCategory = selectedFilter === "all" || rev.serviceCategory === selectedFilter;
    const matchesRating = ratingFilter === 0 || rev.rating >= ratingFilter;
    const matchesSearch =
      searchQuery === "" ||
      rev.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRating && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow-md">
              <Star className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Verified Traveler Reviews &amp; Ratings</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  100% PNR Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Authentic feedback from real passengers across Flights, IRCTC Trains, Hotels, Yatras &amp; Cabs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Services" },
              { id: "flights", label: "Flights" },
              { id: "trains", label: "Trains" },
              { id: "hotels", label: "Hotels" },
              { id: "pilgrimage", label: "Yatras" },
              { id: "dining", label: "Dhabas" },
              { id: "cabs", label: "Cabs" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedFilter === cat.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Write Review Trigger */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition-all flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isWritingReview ? "View List" : "Write Review"}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Write Review Form */}
          {isWritingReview ? (
            <form onSubmit={handleCreateReview} className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Share Your Verified Travel Experience</span>
              </h4>

              {submittedBanner && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Review published successfully to BharatYatra verified directory!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Service Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="flights">Flights</option>
                    <option value="trains">Trains</option>
                    <option value="hotels">Hotels</option>
                    <option value="pilgrimage">Pilgrimage / Yatras</option>
                    <option value="dining">Dhabas & Dining</option>
                    <option value="cabs">Cabs & Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Service / Vendor Name</label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g. Vande Bharat Express, Taj Lake Palace"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? "text-amber-500 fill-amber-500" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <label className="text-slate-600 block font-medium">Review Headline</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Exceptional service and punctuality!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="text-xs space-y-2">
                <label className="text-slate-600 block font-medium">Detailed Feedback</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Describe your journey, seating comfort, food quality, or customer support..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          ) : null}

          {/* Rating Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="text-3xl font-black text-amber-400">4.8 ★</div>
              <div>
                <h5 className="font-bold text-sm">Overall BharatYatra Traveler Score</h5>
                <p className="text-xs text-slate-300">Based on 14,280+ verified journey completions across India</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-emerald-300 font-bold border border-white/10">
                98.4% On-Time IRCTC
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-indigo-200 font-bold border border-white/10">
                99.1% Hotel Confirmation
              </span>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((rev) => {
              const currentLikes = likesMap[rev.id] ?? rev.likesCount;
              const isLiked = userHasLiked[rev.id];

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-slate-900">{rev.author}</h5>
                          {rev.verifiedBooking && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-0.5 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" /> PNR Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{rev.location} • {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase">
                        {rev.serviceCategory}
                      </span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-indigo-700 block mb-0.5">{rev.serviceName}</span>
                    <h6 className="text-sm font-bold text-slate-900">{rev.title}</h6>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{rev.comment}</p>
                  </div>

                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {rev.photos.map((photo, pIdx) => (
                        <img
                          key={pIdx}
                          src={photo}
                          alt="Traveler capture"
                          className="w-20 h-14 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {rev.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(rev.id, rev.likesCount)}
                        className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                          isLiked ? "text-indigo-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-indigo-600" : ""}`} />
                        <span>Helpful ({currentLikes})</span>
                      </button>

                      {onSelectCategory && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectCategory(rev.serviceCategory);
                          }}
                          className="text-indigo-600 hover:underline font-bold text-xs"
                        >
                          Book Similar ➔
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
