import React, { useState } from "react";
import {
  WHATSAPP_THREADS_DATA,
  WhatsAppChatThread,
} from "../../data/aiCrmMarketingData";
import {
  MessageSquare,
  Send,
  CheckCheck,
  Check,
  Phone,
  Paperclip,
  Smile,
  ShieldCheck,
  Search,
  Sparkles,
  Bot,
  User,
  Clock,
} from "lucide-react";

export function WhatsAppCloudCrmDesk() {
  const [threads, setThreads] = useState<WhatsAppChatThread[]>(WHATSAPP_THREADS_DATA);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0].id);
  const [replyInput, setReplyInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isAiDrafting, setIsAiDrafting] = useState(false);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!replyInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "AGENT" as const,
      text: replyInput,
      timestamp: "Just now",
      status: "delivered" as const,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === selectedThread.id) {
          return {
            ...t,
            lastMessage: replyInput,
            lastTimestamp: "Just now",
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );
    setReplyInput("");
  };

  const handleAiSmartReply = () => {
    setIsAiDrafting(true);
    setTimeout(() => {
      if (selectedThread.categoryInterest.includes("Gulmarg")) {
        setReplyInput(
          "Namaste! The Presidential Suite at The Khyber Gulmarg has been provisionally reserved for your dates (24-28 Dec) including private heli-transfers and ski equipment concierge. Would you like me to generate your instant confirmation voucher?"
        );
      } else if (selectedThread.categoryInterest.includes("Houseboat")) {
        setReplyInput(
          "I'm delighted to hear you loved the walkthrough! Our master chef on the luxury Alleppey houseboat can also customize pure-vegetarian or Jain meals upon request. Shall we lock in your dates?"
        );
      } else {
        setReplyInput(
          "Namaste! Yes, continuous medical oxygen cylinders and an on-call paramedic are stationed at our Kedarnath Helipad base camp specifically for senior citizen travelers. Your safety is our highest priority."
        );
      }
      setIsAiDrafting(false);
    }, 600);
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.categoryInterest.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.phone.includes(searchFilter)
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">WhatsApp Business Cloud API (Meta Verified)</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Official BSP Green Tick
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero ban risk • Multi-agent live chat • Webhook synced with BharatYatra Core Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Phone ID</span>
            <span className="text-white font-bold">10982347189201</span>
          </div>
          <div>
            <span className="text-slate-500 block">Quality Rating</span>
            <span className="text-emerald-400 font-bold">High (Green Tier)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Avg Response</span>
            <span className="text-cyan-400 font-bold">1.4 mins</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden min-h-[560px]">
        {/* Thread Sidebar */}
        <div className="md:col-span-4 border-r border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search leads, phone, or package..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedThread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isSelected ? "bg-indigo-950/40 border-l-4 border-l-emerald-500" : "hover:bg-slate-800/40"
                  }`}
                >
                  <img
                    src={thread.avatarUrl}
                    alt={thread.customerName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{thread.customerName}</h4>
                      <span className="text-[10px] text-slate-500">{thread.lastTimestamp}</span>
                    </div>

                    <p className="text-[11px] text-indigo-300 font-medium truncate mt-0.5">
                      {thread.categoryInterest}
                    </p>

                    <p className="text-xs text-slate-400 truncate mt-1">{thread.lastMessage}</p>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Window */}
        <div className="md:col-span-8 flex flex-col bg-slate-950">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <img
                src={selectedThread.avatarUrl}
                alt={selectedThread.customerName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{selectedThread.customerName}</h4>
                  <span className="text-xs font-mono text-slate-400">{selectedThread.phone}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    WhatsApp Cloud Synced
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-indigo-300">{selectedThread.categoryInterest}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAiSmartReply}
                disabled={isAiDrafting}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAiDrafting ? "Drafting..." : "AI Auto-Response"}</span>
              </button>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {selectedThread.messages.map((msg) => {
              const isCustomer = msg.sender === "CUSTOMER";
              const isBot = msg.sender === "BOT";

              return (
                <div key={msg.id} className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs space-y-1.5 shadow-sm ${
                      isCustomer
                        ? "bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80"
                        : isBot
                        ? "bg-purple-950/60 text-purple-100 rounded-br-none border border-purple-500/40"
                        : "bg-emerald-950/70 text-emerald-100 rounded-br-none border border-emerald-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-70">
                      <span className="font-bold flex items-center gap-1">
                        {isCustomer ? <User className="w-3 h-3" /> : isBot ? <Bot className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {isCustomer ? selectedThread.customerName : isBot ? "AI Autonomous Bot" : "You (Agent)"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {msg.mediaUrl && (
                      <div className="rounded-xl overflow-hidden my-1 border border-slate-700">
                        <img src={msg.mediaUrl} alt="Media" className="w-full h-36 object-cover" />
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {!isCustomer && (
                      <div className="flex justify-end text-[10px] text-emerald-400 pt-0.5">
                        {msg.status === "read" ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your WhatsApp message or use AI Auto-Response..."
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!replyInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
