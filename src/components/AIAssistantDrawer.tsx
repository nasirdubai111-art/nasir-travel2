import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CityLocation, ServiceCategory } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: CityLocation;
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
}

export function AIAssistantDrawer({
  isOpen,
  onClose,
  currentLocation,
  activeCategory,
  onSelectCategory,
}: AIAssistantDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `**Namaste! I am Maya, your AI India Travel Concierge.** 🇮🇳✨

I can help you plan personalized journeys across:
- ✈️ **Flights & Trains:** Find fastest Vande Bharat routes & fare bargains
- 🏨 **Stays & Havelis:** Heritage palaces, boutique homestays & luxury resorts
- 🛕 **Pilgrimage & Yatra:** Chardham 2026, Tirupati VIP Darshan & Kashi Aarti
- 🚕 **Outstation Cabs & Highway Dhabas:** Route planning & food stops

How can I help plan your upcoming journey?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat-travel-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          activeLocation: currentLocation,
          activeCategory,
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || "I am analyzing your itinerary and will provide custom recommendations shortly.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: "assistant",
          content: `**Maya Travel Tip:** For the best rates on your travel from **${currentLocation.name}**, consider booking early morning Vande Bharat trains or flexible flight fares. You can also explore our curated **Yatra** and **Resort** packages from the home screen.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    `Plan a 4-day spiritual yatra to Varanasi & Ayodhya from ${currentLocation.name}`,
    `Suggest top luxury resorts with private pool in Goa or Kerala under ₹12,000/night`,
    `What are the best Vande Bharat routes and Tatkal timings from ${currentLocation.name}?`,
    `How to register and prepare for Chardham Yatra 2026?`,
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-400 p-0.5 flex items-center justify-center shadow-xs">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base">Maya AI Travel Concierge</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-purple-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-pink-300" />
              <span>Location Context: {currentLocation.name}</span>
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

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none prose prose-slate prose-sm"
              }`}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap">{m.content}</p>
              ) : (
                <div className="space-y-2">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )}
              <span
                className={`block text-[10px] mt-1.5 text-right ${
                  m.role === "user" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>Maya is generating your custom India travel guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Suggested Questions
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sp)}
              className="shrink-0 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-[11px] text-slate-700 font-medium whitespace-nowrap transition-colors"
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask Maya about routes, hotels, yatras, or trains..."
          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
