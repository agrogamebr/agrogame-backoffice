'use client';

import { useState } from 'react';
import { LayoutDashboard, User, FileText, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';

const menuItems = [
  { icon: LayoutDashboard, href: '/', label: 'Dashboard' },
  { icon: User, href: '/users', label: 'Usuários' },
  { icon: FileText, href: '/documents', label: 'Documentos' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="block md:hidden"
      aria-label="Menu"
    >
      <Menu className="w-6 h-6 text-gray-700" />
    </Button>
  );
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header do Drawer */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </Button>
        </div>

        {/* Items de Navegação */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer
                      ${isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
