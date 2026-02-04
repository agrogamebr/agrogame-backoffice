'use client';

import { Bell, HelpCircle, User } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 h-[97.63px]">
        <div className="flex items-center">
          <Image
            src="/logoagrogame.svg"
            alt="AgroGame Logo"
            width={252.63}
            height={49.63}
            priority
            className="rounded-xl"
          />
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative w-[238px]">
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

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Notificações"
          >
            <Bell className="w-6 h-6 text-blue-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Dúvidas"
          >
            <HelpCircle className="w-6 h-6 text-blue-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Perfil"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
