import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  DollarSign,
  PieChart,
  Bell,
  User,
  Headphones,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Briefcase,
  Compass,
  Car,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export type DashboardRole =
  | "CUSTOMER"
  | "AGENT"
  | "BUS_OPERATOR"
  | "HOTEL_OPERATOR"
  | "TOUR_OPERATOR"
  | "PILGRIMAGE_OPERATOR"
  | "CORPORATE"
  | "DRIVER"
  | "ADMIN";

export interface NavMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface DashboardLayoutProps {
  role: DashboardRole;
  userName?: string;
  userEmail?: string;
  activeNav: string;
  onNavChange: (navId: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  userName = "Travel Admin",
  userEmail = "operator@bharatyatra.gov.in",
  activeNav,
  onNavChange,
  onLogout,
  children,
  className,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getRoleIcon = () => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case "HOTEL_OPERATOR":
        return <Building2 className="w-4 h-4 text-sky-500" />;
      case "CORPORATE":
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "TOUR_OPERATOR":
      case "PILGRIMAGE_OPERATOR":
        return <Compass className="w-4 h-4 text-emerald-500" />;
      case "DRIVER":
        return <Car className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-[#1B4332]" />;
    }
  };

  const navItems: NavMenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings & PNR", icon: Calendar, badge: 12 },
    { id: "inventory", label: "Inventory & Seats", icon: Layers },
    { id: "customers", label: "Travellers & CRM", icon: Users },
    { id: "revenue", label: "Revenue & Payouts", icon: DollarSign },
    { id: "reports", label: "Analytics & Reports", icon: PieChart },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
    { id: "profile", label: "Account Profile", icon: User },
    { id: "support", label: "24x7 Help Desk", icon: Headphones },
  ];

  return (
    <div className={cn("min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row text-[#111827]", className)}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8E5DD]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] bg-[#1B4332] flex items-center justify-center text-white font-bold text-xs">
            BY
          </div>
          <span className="font-bold text-sm">BharatYatra Console</span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-[8px] hover:bg-slate-100 text-[#4B5563] cursor-pointer"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E8E5DD] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#E8E5DD] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#1B4332] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                BY
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#111827] block">
                  Bharat<span className="text-[#1B4332]">Yatra</span>
                </span>
                <span className="text-[10px] text-[#6B7280]">Partner &amp; Admin Hub</span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded hover:bg-slate-100 text-[#6B7280]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User & Role Badge */}
          <div className="p-4 mx-3 my-3 bg-[#FAF9F5] border border-[#E8E5DD] rounded-[10px]">
            <div className="flex items-center gap-2 mb-1.5">
              {getRoleIcon()}
              <Badge variant="primary" size="sm" className="text-[10px] py-0.5">
                {role.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xs font-bold text-[#111827] truncate">{userName}</p>
            <p className="text-[11px] text-[#6B7280] truncate">{userEmail}</p>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 py-2 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer select-none",
                    isActive
                      ? "bg-emerald-50 text-[#1B4332] font-bold"
                      : "text-[#4B5563] hover:bg-[#FAF9F5] hover:text-[#111827]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", isActive ? "text-[#1B4332]" : "text-[#6B7280]")} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        isActive
                          ? "bg-[#1B4332] text-white"
                          : "bg-slate-200 text-[#4B5563]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        {onLogout && (
          <div className="p-4 border-t border-[#E8E5DD]">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Console</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar on Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E5DD]">
          <div>
            <span className="text-xs text-[#6B7280]">Console / {role}</span>
            <h2 className="text-lg font-bold text-[#111827] capitalize">
              {activeNav.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-[#16A34A] font-semibold bg-[#DCFCE7] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Live API Gateway Active
            </span>
          </div>
        </header>

        {/* Page children */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
