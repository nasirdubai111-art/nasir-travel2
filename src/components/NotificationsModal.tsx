import React, { useState, useEffect } from "react";
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
  CheckCheck,
} from "lucide-react";
import { TravelNotification, TRAVEL_NOTIFICATIONS } from "../data/travelExperienceData";
import { ServiceCategory } from "../types";
import { useAuthContext } from "../contexts/AuthContext";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: ServiceCategory) => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
  onSelectCategory,
}: NotificationsModalProps) {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<TravelNotification[]>(TRAVEL_NOTIFICATIONS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLiveNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v2/notifications", {
        headers: {
          "x-user-id": user?.id || "usr_customer_01",
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.notifications && json.notifications.length > 0) {
          const mapped: TravelNotification[] = json.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            category: (n.category || "general").toLowerCase(),
            type: n.type || "info",
            time: new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: n.is_read ?? false,
            actionText: n.action_text || (n.category === "flights" ? "View Details" : undefined),
          }));
          setNotifications(mapped);
        }
      }
    } catch (e) {
      console.warn("Using offline travel notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveNotifications();
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAction = (notif: TravelNotification) => {
    handleMarkAsRead(notif.id);

    if (notif.actionText === "View Boarding Pass") {
      onClose();
    } else if (notif.category && notif.category !== "general") {
      onClose();
      onSelectCategory(notif.category as ServiceCategory);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`/api/v2/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "x-user-id": user?.id || "usr_customer_01" },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/v2/notifications/read-all", {
        method: "POST",
        headers: { "x-user-id": user?.id || "usr_customer_01" },
      });
      triggerToast("All notifications marked as read");
    } catch (e) {
      triggerToast("All notifications marked as read");
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    triggerToast("Notification dismissed");
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E9C46A]/20 border border-[#E9C46A]/30 flex items-center justify-center text-[#E9C46A]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">BharatYatra Live Dispatch</h3>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1B4332] text-xs font-bold">
                    {unreadCount} unread
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-slate-100 text-xs font-semibold">
                    All caught up
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-100/80">Flight gates, train PNR status, cab dispatch, and safari alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
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
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Syncing live notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-white space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No active travel alerts</p>
              <p className="text-[11px] text-slate-400">You will receive real-time gate changes, delay alerts, and cab captain dispatches here.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? "bg-white border-slate-200 hover:border-slate-300"
                    : "bg-emerald-50/40 border-emerald-200 shadow-2xs"
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
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
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
                            className="px-3 py-1 rounded-xl bg-white border border-slate-300 hover:border-[#1B4332] hover:text-[#1B4332] text-xs font-bold text-slate-700 shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
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
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Push &amp; SMS alerts active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#E9C46A] font-bold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
