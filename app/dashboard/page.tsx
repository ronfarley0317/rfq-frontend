import { Plus, UserCircle, BarChart, HardHat, Settings, Building } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: rfqs } = await supabase
    .from('rfqs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold">
          RFQ Engine
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <a href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
            <BarChart className="mr-3 h-6 w-6" />
            Quotes
          </a>
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
        {/* Header Bar */}
        <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-8">
          <div>
            <span className="text-gray-500">Dashboard &gt;</span>
            <span className="font-semibold text-gray-800"> Active Quotes</span>
          </div>
          <div className="flex items-center">
            <UserCircle className="h-10 w-10 text-gray-400" />
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-start mb-8">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-800">42k</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">Pending Quotes</h3>
                <p className="text-3xl font-bold text-gray-800">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
                <p className="text-3xl font-bold text-gray-800">34%</p>
              </div>
            </div>

            {/* Primary Action Button */}
            <Link href="/upload">
              <button className="flex items-center bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                <Plus className="mr-2 h-6 w-6" />
                New RFQ Upload
              </button>
            </Link>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Recent Quotes</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rfqs && rfqs.length > 0 ? (
                  rfqs.map((rfq) => (
                    <tr key={rfq.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{rfq.id.substring(0, 4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{rfq.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rfq.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          rfq.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rfq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-right">
                        {rfq.amount != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rfq.amount) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No quotes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}