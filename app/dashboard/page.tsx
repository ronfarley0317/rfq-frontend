import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: rfqs } = await supabase
    .from('rfqs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="flex-1 p-8">
      <div className="flex justify-between items-start mb-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">$42,392</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Pending Quotes</h3>
            <p className="text-3xl font-bold text-gray-800">12</p>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <Link href={`/dashboard/${rfq.id}`} className="hover:text-orange-500 hover:underline">
                      #{rfq.id.substring(0, 4)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    <Link href={`/dashboard/${rfq.id}`} className="hover:text-orange-500 hover:underline">
                      {rfq.customer_name || <span className="text-gray-500 italic">Unknown Customer</span>}
                    </Link>
                  </td>
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
                  No quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}