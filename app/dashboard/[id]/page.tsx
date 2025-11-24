import { createClient } from '@/utils/supabase/server'
import LineItemsTable from '@/components/LineItemsTable'
import GeneratePdfButton from '@/components/GeneratePdfButton'
import StatusDropdown from '@/components/StatusDropdown'


type PageProps = {
  params: Promise<{
    id: string
  }>
}

interface LineItem {
  quantity: number;
  description: string;
  unit_price: number;
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
      quote_number,
      customer_name,
      status,
      line_items,
      tax
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

  const rfq = quote
  let cleanName: string

  if (rfq.customer_name) {
    try {
      const parsed = JSON.parse(rfq.customer_name)
      if (parsed && parsed.customer_name) {
        cleanName = parsed.customer_name
      } else {
        cleanName = rfq.customer_name
      }
    } catch {
      cleanName = rfq.customer_name
    }
  } else {
    cleanName = "Unknown Customer"
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Quote #{quote.quote_number}
        </h1>
        <GeneratePdfButton
          quoteId={quote.id}
          quoteNumber={quote.quote_number}
          customerName={cleanName}
          tax={quote.tax}
          items={quote.line_items?.map((item: LineItem) => ({
            qty: item.quantity,
            description: item.description,
            price: item.unit_price,
          })) || []}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase">Customer</h3>
            <p className="mt-1 text-xl font-medium text-gray-900">{cleanName}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase">Status</h3>
            <StatusDropdown quoteId={quote.id} currentStatus={quote.status} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Line Items</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <LineItemsTable initialItems={quote.line_items || []} quoteId={quote.id} initialTax={quote.tax} />
        </div>
      </div>
    </div>
  )
}