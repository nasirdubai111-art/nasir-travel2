import React, { useState } from "react";
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plane,
  Train,
  Car,
  Landmark,
} from "lucide-react";
import { TravelNotification, TRAVEL_NOTIFICATIONS } from "../data/travelExperienceData";
import { ServiceCategory } from "../types";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyTrips: () => void;
  onSelectCategory: (cat: ServiceCategory) => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
  onOpenMyTrips,
  onSelectCategory,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<TravelNotification[]>(TRAVEL_NOTIFICATIONS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAction = (notif: TravelNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.actionText === "View Boarding Pass") {
      onClose();
      onOpenMyTrips();
    } else if (notif.category && notif.category !== "general") {
      onClose();
      onSelectCategory(notif.category as ServiceCategory);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    triggerToast("Notification removed");
  };

  const getCategoryIcon = (category: string, type: string) => {
    switch (category) {
      case "flights":
        return <Plane className="w-4 h-4 text-sky-600" />;
      case "trains":
        return <Train className="w-4 h-4 text-indigo-600" />;
      case "cabs":
        return <Car className="w-4 h-4 text-amber-600" />;
      case "pilgrimage":
        return <Landmark className="w-4 h-4 text-orange-600" />;
      default:
        if (type === "success") return <Sparkles className="w-4 h-4 text-emerald-600" />;
        if (type === "warning") return <AlertTriangle className="w-4 h-4 text-amber-600" />;
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

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
                <h3 className="text-base sm:text-lg font-bold">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-slate-200 text-xs font-semibold">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="bg-emerald-50 text-emerald-800 px-6 py-2 border-b border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {toastMsg}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.read
                  ? "bg-white border-slate-200 hover:border-slate-300"
                  : "bg-indigo-50/40 border-indigo-200/80 shadow-2xs"
              }`}
            >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                        notif.category === "flights"
                          ? "bg-sky-50 border-sky-200"
                          : notif.category === "trains"
                          ? "bg-indigo-50 border-indigo-200"
                          : notif.category === "cabs"
                          ? "bg-amber-50 border-amber-200"
                          : notif.category === "pilgrimage"
                          ? "bg-orange-50 border-orange-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {getCategoryIcon(notif.category, notif.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                        <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          • {notif.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {notif.message}
                      </p>

                      {notif.actionText && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notif);
                            }}
                            className="px-3 py-1 rounded-xl bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-700 text-xs font-bold text-slate-700 shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{notif.actionText}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    title="Dismiss notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex items-center justify-between text-xs">
          <p className="text-slate-500 text-[11px]">
            Emergency Travel Assistance 24x7 Helpline:{" "}
            <span className="font-bold text-slate-800">1800-200-YATRA (92872)</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
