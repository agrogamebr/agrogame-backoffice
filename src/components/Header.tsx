'use client';

import { Bell, HelpCircle, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MobileMenuButton } from './MobileMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="w-full bg-white fixed top-0 left-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16 lg:h-20">
        <MobileMenuButton onClick={onMenuClick} />

        <div className="hidden lg:flex items-center">
          <Link href="/">
            <Image
              src="/logoagrogame.svg"
              alt="AgroGame Logo"
              width={252.63}
              height={49.63}
              priority
              className="rounded-xl cursor-pointer"
            />
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative w-full md:w-40 lg:w-[238px]">
            <input
              type="text"
              placeholder="Pesquise aqui"
              className="w-full h-[32px] px-3 pr-10 rounded bg-[#E2E8F0] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Dúvidas"
          >
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Perfil"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
