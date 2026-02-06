'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import { useState } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Não mostra Header e Sidebar na página de login
  const isLoginPage = pathname === '/';

  return (
    <html lang="pt-BR">
      <head>
        <title>AgroGame Backoffice</title>
        <meta name="description" content="Sistema de gestão AgroGame" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
        <main className={isLoginPage ? "" : "pt-14 md:pt-16 lg:pt-20 md:ml-20 px-4 md:px-6 lg:px-8"}>
          {children}
        </main>
      </body>
    </html>
  );
}
