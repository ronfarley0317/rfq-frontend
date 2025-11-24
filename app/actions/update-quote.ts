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

export async function updateQuoteLineItems(quoteId: string, lineItems: LineItem[], tax?: number, status?: string) {
  const supabase = await createClient();

  console.log('Saving Quote:', quoteId, lineItems.length);

  const updateData: { line_items: LineItem[]; tax?: number; status?: string } = { line_items: lineItems };
  if (status) {
    updateData.status = status;
  }
  if (tax) {
    updateData.tax = tax;
  }

  const { data, error } = await supabase
    .from('rfqs')
    .update(updateData)
    .eq('id', quoteId);

  if (error) {
    console.error('Error updating line items:', error);
    throw new Error('Failed to update line items.');
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/${quoteId}`);

  return data;
}

export async function updateQuoteStatus(quoteId: string, newStatus: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('rfqs')
    .update({ status: newStatus })
    .eq('id', quoteId);

  if (error) {
    console.error('Error updating quote status:', error);
    throw new Error('Failed to update quote status.');
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/${quoteId}`);

  return data;
}
