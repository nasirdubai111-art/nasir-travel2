import React from "react";
import { MainNav, MainNavProps } from "./MainNav";
import { StatusTicker } from "../StatusTicker";
import { CityLocation } from "../../types";

export interface HeaderProps extends MainNavProps {
  currentLocation?: CityLocation;
}

export function Header(props: HeaderProps) {
  return (
    <div className="w-full">
      {/* Real-time Status & Advisory Ticker for Location */}
      {props.currentLocation && (
        <StatusTicker
          currentLocation={props.currentLocation}
          onOpenLocationModal={props.onOpenLocationModal}
        />
      )}

      {/* Primary Clean Navigation */}
      <MainNav {...props} />
    </div>
  );
}

export default Header;
