import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BarChart, HardHat, Settings, Building, UserCircle } from 'lucide-react';

type Status = 'Pending' | 'Completed' | 'Failed';

function getStatusColor(status: Status) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Failed':
        return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: rfq, error } = await supabase
    .from('rfqs')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !rfq) {
    notFound();
  }

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
            <Link href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
                <HardHat className="mr-3 h-6 w-6" />
                Inventory
            </Link>
            <Link href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
                <Building className="mr-3 h-6 w-6" />
                Clients
            </Link>
            <Link href="#" className="flex items-center px-4 py-2 text-lg text-slate-300 rounded-md hover:bg-slate-700">
                <Settings className="mr-3 h-6 w-6" />
                Settings
            </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
         {/* Header Bar */}
         <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-8">
          <div>
            <Link href="/dashboard" className="text-orange-500 hover:underline">
              &larr; Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center">
            <UserCircle className="h-10 w-10 text-gray-400" />
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Quote Details</h1>

            <div className="space-y-8">
                 {/* Card 1: Top-level Details */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Customer</h3>
                            <p className="text-xl font-semibold text-gray-800">{rfq.customer_name}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Status</h3>
                            <p className="text-xl font-semibold text-gray-800">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(rfq.status as Status)}`}>
                                    {rfq.status}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium text-right">Amount</h3>
                            <p className="text-2xl font-bold text-gray-800 text-right">
                                {rfq.amount != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rfq.amount) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2: Line Items */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Line Items</h2>
                    </div>
                    <div className="p-6">
                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                            {JSON.stringify(rfq.line_items, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>

        </main>
      </div>
    </div>
  );
}
