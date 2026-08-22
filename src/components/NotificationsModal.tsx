import React, { useState } from "react";
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Plane,
  Train,
  Car,
  Landmark,
  ExternalLink,
  Trash2,
  Check,
  Smartphone,
  Mail,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import { TravelNotification, TRAVEL_NOTIFICATIONS } from "../data/travelExperienceData";
import { NOTIFICATION_STREAM_DATA, NotificationChannelMessage } from "../data/notificationData";
import { ServiceCategory } from "../types";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyTrips: () => void;
  onOpenRewards: () => void;
  onSelectCategory: (cat: ServiceCategory) => void;
}

type ChannelTab = "all" | "whatsapp" | "sms" | "email" | "push" | "preferences";

export function NotificationsModal({
  isOpen,
  onClose,
  onOpenMyTrips,
  onOpenRewards,
  onSelectCategory,
}: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<ChannelTab>("all");
  const [notifications, setNotifications] = useState<TravelNotification[]>(TRAVEL_NOTIFICATIONS);
  const [channelMessages, setChannelMessages] = useState<NotificationChannelMessage[]>(NOTIFICATION_STREAM_DATA);
  const [waNotificationsEnabled, setWaNotificationsEnabled] = useState(true);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAction = (notif: TravelNotification) => {
    if (notif.actionText === "View Boarding Pass") {
      onClose();
      onOpenMyTrips();
    } else if (notif.actionText === "Open Rewards Hub") {
      onClose();
      onOpenRewards();
    } else if (notif.category && notif.category !== "general") {
      onClose();
      onSelectCategory(notif.category as ServiceCategory);
    }
  };

  const filteredChannelMessages =
    activeTab === "all"
      ? channelMessages
      : channelMessages.filter((m) => m.channel === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Multi-Channel Notification & Alert Engine</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  DLT & WhatsApp Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Push Radar, WhatsApp Interactive Tickets, Govt DLT SMS & GST Invoices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Navigation Bar */}
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "all" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> All Feeds
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "whatsapp" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Verified Bot
          </button>

          <button
            onClick={() => setActiveTab("sms")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "sms" ? "bg-sky-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-500" /> DLT SMS
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "email" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-500" /> Email Invoices
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              activeTab === "preferences" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> DND & Preferences
          </button>
        </div>

        {toastMsg && (
          <div className="bg-emerald-50 text-emerald-800 px-6 py-2 border-b border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {toastMsg}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
          {/* Channel Feed View */}
          {activeTab !== "preferences" && (
            <div className="space-y-4">
              {filteredChannelMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    msg.channel === "whatsapp"
                      ? "bg-emerald-50/50 border-emerald-300 shadow-xs"
                      : msg.channel === "sms"
                      ? "bg-sky-50/50 border-sky-300 shadow-xs"
                      : msg.channel === "email"
                      ? "bg-amber-50/50 border-amber-300 shadow-xs"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                        {msg.channel === "whatsapp" && <MessageSquare className="w-4 h-4 text-emerald-600" />}
                        {msg.channel === "sms" && <Smartphone className="w-4 h-4 text-sky-600" />}
                        {msg.channel === "email" && <Mail className="w-4 h-4 text-amber-600" />}
                        {msg.channel === "push" && <Bell className="w-4 h-4 text-indigo-600" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{msg.sender}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-slate-200 text-slate-700">
                            {msg.channel}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">• {msg.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-800 font-medium leading-relaxed">{msg.preview}</p>

                        {/* Interactive WhatsApp Quick Reply Buttons Simulator */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {msg.actions.map((act, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  if (act.actionType === "view_ticket") {
                                    onClose();
                                    onOpenMyTrips();
                                  } else {
                                    triggerToast(`Action triggered: ${act.label}`);
                                  }
                                }}
                                className="px-3 py-1 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-xs font-bold text-slate-700 shadow-2xs transition-all flex items-center gap-1.5"
                              >
                                <span>{act.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preferences View */}
          {activeTab === "preferences" && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Communication & Notification Preferences</h4>
                <p className="text-xs text-slate-500">Manage instant channel delivery for e-tickets, platform updates, and alerts</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs space-y-3">
                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">WhatsApp Instant E-Ticket & Status Bot</p>
                    <p className="text-slate-500">Receive boarding pass, live platform radar, and food pre-order alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={waNotificationsEnabled}
                    onChange={(e) => setWaNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">DLT Registered SMS Alerts</p>
                    <p className="text-slate-500">Critical PNR booking, payment receipts, and Tatkal status</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotificationsEnabled}
                    onChange={(e) => setSmsNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Email GST Tax Invoices & Itineraries</p>
                    <p className="text-slate-500">PDF download links with 18% Input Tax Credit breakdown</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotificationsEnabled}
                    onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Mobile Push Alerts</p>
                    <p className="text-slate-500">Price drop radar, airport gate changes, and driver arrival</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotificationsEnabled}
                    onChange={(e) => setPushNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex items-center justify-between text-xs">
          <p className="text-slate-500 text-[11px]">
            Emergency Travel Assistance 24x7 Helpline: <span className="font-bold text-slate-800">1800-200-YATRA (92872)</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
