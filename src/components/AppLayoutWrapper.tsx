'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Header/Sidebar logic: 
  // Hidden on root '/' (auth check will redirect), '/login', or '/change-password'.
  const isLoginPage = pathname === '/' || pathname === '/login' || pathname === '/change-password';

  return (
    <>
      {!isLoginPage && (
        <>
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <Sidebar />
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}
      <main className={isLoginPage ? "h-screen w-full overflow-hidden" : "pt-14 md:pt-16 lg:pt-20 md:ml-20 px-4 md:px-6 lg:px-8"}>
        {children}
      </main>
    </>
  );
}
