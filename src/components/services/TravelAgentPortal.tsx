import React from "react";
import { BookingItem, UserProfile } from "../../types";
import { AgentPublicProfileView } from "../agent/AgentPublicProfileView";

interface TravelAgentPortalProps {
  onBookItem: (booking: BookingItem) => void;
  onOpenAIDrawer: () => void;
}

export function TravelAgentPortal({ onBookItem, onOpenAIDrawer }: TravelAgentPortalProps) {
  // Mock active user profile for booking pre-fills
  const activeUserProfile: UserProfile = {
    name: "Dr. Vikramaditya Joshi",
    email: "dr.v.joshi@rubyhall.com",
    phone: "+91 98230 45678",
    isLoggedIn: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    tier: "Platinum Yatri",
    yatraCoins: 4500,
    walletBalance: 24500,
    gstNumber: "27AAWFS9102K1ZV",
    companyName: "Joshi Health & Diagnostic Labs LLP",
  };

  return (
    <div className="w-full">
      {/* Customer-Facing Public Profile View */}
      <AgentPublicProfileView
        userProfile={activeUserProfile}
        onInitiateBooking={onBookItem}
        onOpenAIDrawer={onOpenAIDrawer}
      />
    </div>
  );
}
