'use server';

import { stripe } from '@/lib/stripe/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createInvoicePaymentLink(invoiceId: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('id,status,total_cents,currency,public_id,stripe_checkout_url')
    .eq('id', invoiceId)
    .maybeSingle();

  if (error || !invoice) {
    redirect(`/invoices/${encodeURIComponent(invoiceId)}?error=not-found`);
  }

  if (invoice.status === 'paid') {
    redirect(`/invoices/${encodeURIComponent(invoiceId)}?notice=already-paid`);
  }

  if (invoice.stripe_checkout_url) {
    redirect(`/invoices/${encodeURIComponent(invoiceId)}?notice=link-ready`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    metadata: {
      invoice_id: invoice.id,
      user_id: user.id,
      invoice_public_id: invoice.public_id
    },
    line_items: [
      {
        price_data: {
          currency: String(invoice.currency ?? 'usd'),
          product_data: {
            name: `Invoice ${invoice.public_id}`
          },
          unit_amount: Number(invoice.total_cents ?? 0)
        },
        quantity: 1
      }
    ],
    success_url: `${appUrl}/invoices/${invoiceId}?paid=1`,
    cancel_url: `${appUrl}/invoices/${invoiceId}?canceled=1`
  });

  await supabase
    .from('invoices')
    .update({
      stripe_checkout_session_id: session.id,
      stripe_checkout_url: session.url,
      status: 'sent'
    })
    .eq('id', invoiceId);

  redirect(`/invoices/${encodeURIComponent(invoiceId)}?notice=link-ready`);
}
