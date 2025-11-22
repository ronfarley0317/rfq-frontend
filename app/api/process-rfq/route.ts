
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pdf_url, user_email, record_id } = await request.json();

    if (!pdf_url || !user_email || !record_id) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not set.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdf_url, user_email, record_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook error:', errorText);
      return NextResponse.json({ error: 'Failed to process RFQ.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error processing RFQ:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
