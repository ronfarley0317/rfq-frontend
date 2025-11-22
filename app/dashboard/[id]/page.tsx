import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { UserCircle, Calendar, FileText } from 'lucide-react';

type QuoteDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function QuoteDetailsPage({ params }: QuoteDetailsPageProps) {
  const supabase = await createClient();
  const { data: rfq } = await supabase
    .from('rfqs')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!rfq) {
    notFound();
  }

  const { id, customer_name, status, created_at } = rfq;
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white">
      {/* Header Bar */}
      <header className="flex items-center justify-between h-16 bg-slate-800 border-b border-slate-700 px-8">
        <div>
          <span className="text-slate-400">Dashboard &gt; Quotes &gt;</span>
          <span className="font-semibold text-white"> Quote #{id.substring(0, 4)}</span>
        </div>
        <div className="flex items-center">
          <UserCircle className="h-10 w-10 text-slate-500" />
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Quote #{id.substring(0, 8)}
            </h1>
            <p className="text-slate-400 mt-1">
              Details for RFQ from {customer_name || 'N/A'}.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <UserCircle className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-400">Customer</p>
                  <p className="text-lg font-semibold text-white">
                    {customer_name || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                 <FileText className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      status === 'Pending'
                        ? 'bg-yellow-900 text-yellow-300'
                        : status === 'Completed'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-lg font-semibold text-white">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Placeholder */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Line Items</h2>
            <div className="bg-slate-800 rounded-lg shadow-lg p-10 border border-slate-700 text-center">
              <p className="text-slate-400">
                Line items processing is not yet implemented.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
