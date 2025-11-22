import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

type PageProps = {
  params: {
    id: string
  }
}

export default async function QuoteDetailsPage({ params }: PageProps) {
  const supabase = await createClient()

  const { data: quote, error } = await supabase
    .from('rfqs')
    .select(
      `
      id,
      customer_name,
      status
    `
    )
    .eq('id', params.id)
    .single()

  if (error || !quote) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Quote Details: #{quote.id}
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Customer</h3>
            <p className="mt-1 text-sm text-gray-600">{quote.customer_name}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Status</h3>
            <p className="mt-1 text-sm text-gray-600">{quote.status}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Line Items</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p className="text-gray-500 italic">Line items will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}