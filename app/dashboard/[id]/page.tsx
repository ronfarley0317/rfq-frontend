import { createClient } from '@/utils/supabase/server'
import LineItemsTable from '@/components/LineItemsTable'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function QuoteDetailsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  console.log("Attempting to fetch ID:", id);
  const { data: quote, error } = await supabase
    .from('rfqs')
    .select(
      `
      id,
      customer_name,
      status,
      line_items
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error("Supabase Error Details:", error)
    return <div className="p-6">Error loading quote. Check terminal for details.</div>
  }

  if (!quote) {
    return <div className="p-6">Error loading quote. Check terminal for details.</div>
  }

  let displayCustomerName = "Unknown Customer";
  if (quote.customer_name) {
    try {
      const parsedName = JSON.parse(quote.customer_name);
      if (parsedName && typeof parsedName === 'object' && parsedName.customer_name) {
        displayCustomerName = parsedName.customer_name;
      } else {
        displayCustomerName = quote.customer_name;
      }
    } catch (_e) {
      displayCustomerName = quote.customer_name;
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Quote Details: #{quote.id}
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase">Customer</h3>
            <p className="mt-1 text-xl font-medium text-gray-900">{displayCustomerName}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase">Status</h3>
            <p className="mt-1 text-xl font-medium text-gray-900">{quote.status}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Line Items</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <LineItemsTable initialItems={quote.line_items || []} />
        </div>
      </div>
    </div>
  )
}