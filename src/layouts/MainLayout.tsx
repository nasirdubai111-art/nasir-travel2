// src/layouts/MainLayout.tsx
import React, { ReactNode } from "react";

export interface MainLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, header, footer }) => {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B4332] flex flex-col font-sans selection:bg-[#1B4332] selection:text-white">
      {header && <header className="sticky top-0 z-40">{header}</header>}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-8">
        {children}
      </main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
};

export default MainLayout;
