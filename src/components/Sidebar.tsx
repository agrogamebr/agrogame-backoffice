'use client';

import { LayoutDashboard, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, href: '/', label: 'Dashboard' },
  { icon: User, href: '/users', label: 'Usuários' },
  { icon: FileText, href: '/documents', label: 'Documentos' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[97.63px] w-20 h-[calc(100vh-97.63px)] bg-white flex flex-col items-center py-[46px]">
      <div className="w-[44px] flex flex-col gap-2 rounded-[15px] bg-[#F8F9FE] p-[2px]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-center w-10 h-10 rounded-[13px] transition-all
                ${isActive
                  ? 'bg-white border border-[#F9FAFC] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] text-gray-400'
                  : 'bg-transparent text-blue-500 hover:bg-blue-50'
                }
              `}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="w-[14px] h-[14px]" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
