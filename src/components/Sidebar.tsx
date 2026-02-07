'use client';

import { LayoutDashboard, Users, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, href: '/dashboard', label: 'Dashboard' },
  { icon: Users, href: '/users', label: 'Usuários' },
  { icon: ListTodo, href: '/activities', label: 'Atividades' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:fixed md:left-0 md:top-14 lg:top-16 xl:top-20 md:w-20 md:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] xl:h-[calc(100vh-5rem)] md:bg-white md:flex md:flex-col md:items-center md:py-[46px]">
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
