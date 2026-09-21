// src/pages/HomePage.tsx
import React from "react";
import { LandingPageMasterView } from "../components/landing/LandingPageMasterView";
import { ServiceCategory } from "../types";

export interface HomePageProps {
  currentCity: string;
  onSelectCategory: (category: ServiceCategory) => void;
  onInitiateBooking: (item: any, category: ServiceCategory) => void;
  onOpenSearchModal: () => void;
  onOpenOffersModal: () => void;
  onOpenPriceWatch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentCity,
  onSelectCategory,
  onInitiateBooking,
  onOpenSearchModal,
  onOpenOffersModal,
  onOpenPriceWatch,
}) => {
  return (
    <LandingPageMasterView
      currentLocation={currentCity}
      onSelectCategory={onSelectCategory}
      onInitiateBooking={onInitiateBooking}
      onOpenSearchModal={onOpenSearchModal}
      onOpenOffersModal={onOpenOffersModal}
      onOpenPriceWatch={onOpenPriceWatch}
    />
  );
};

export default HomePage;
