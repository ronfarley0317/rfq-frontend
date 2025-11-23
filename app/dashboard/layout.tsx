import { BarChart, HardHat, Settings, Building } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold">
          RFQ Engine
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
            <BarChart className="mr-3 h-6 w-6" />
            Quotes
          </Link>
          <a href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
            <HardHat className="mr-3 h-6 w-6" />
            Inventory
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
            <Building className="mr-3 h-6 w-6" />
            Clients
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
            <Settings className="mr-3 h-6 w-6" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
