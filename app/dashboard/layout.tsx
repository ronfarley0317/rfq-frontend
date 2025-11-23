'use client';

import { BarChart, HardHat, Settings, Building } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Quotes', icon: BarChart, exact: true },
    { href: '/dashboard/inventory', label: 'Inventory', icon: HardHat },
    { href: '/dashboard/clients', label: 'Clients', icon: Building },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold">
          RFQ Engine
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-lg rounded-md hover:bg-slate-700 ${
                  isActive ? 'bg-slate-700 text-white' : 'text-slate-300'
                }`}
              >
                <Icon className="mr-3 h-6 w-6" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
