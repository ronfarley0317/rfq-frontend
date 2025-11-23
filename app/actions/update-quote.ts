'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

type LineItem = {
  id: number;
  part_number: string;
  description: string;
  quantity: number;
  unit_price: number;
};

export async function updateQuoteLineItems(quoteId: string, lineItems: LineItem[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('rfqs')
    .update({ line_items: lineItems })
    .eq('id', quoteId);

  if (error) {
    console.error('Error updating line items:', error);
    throw new Error('Failed to update line items.');
  }

  revalidatePath(`/dashboard/${quoteId}`);

  return data;
}
