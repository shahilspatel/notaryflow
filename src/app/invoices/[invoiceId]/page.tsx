import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createInvoicePaymentLink } from './actions';

type InvoiceRow = {
  id: string;
  status: 'draft' | 'sent' | 'paid';
  total_cents: number;
  created_at: string;
  public_id: string;
  stripe_checkout_url: string | null;
};

type ItemRow = {
  id: string;
  description: string;
  quantity: number;
  unit_amount_cents: number;
};

export default async function InvoiceDetailPage({
  params,
  searchParams
}: {
  params: { invoiceId: string };
  searchParams?: { notice?: string; error?: string; paid?: string; canceled?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { invoiceId } = params;

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('id,status,total_cents,created_at,public_id,stripe_checkout_url')
    .eq('id', invoiceId)
    .maybeSingle();

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Invoice</h1>
        <p className="text-sm text-rose-700">{error.message}</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Invoice not found</h1>
        <p className="text-sm text-slate-600">This invoice may have been deleted.</p>
      </div>
    );
  }

  const inv = invoice as unknown as InvoiceRow;

  const notice = searchParams?.notice ?? null;
  const paid = searchParams?.paid === '1';
  const canceled = searchParams?.canceled === '1';
  const noticeMessage =
    paid ? 'Payment completed. This invoice will update to paid shortly.' :
    canceled ? 'Payment canceled.' :
    notice === 'link-ready' ? 'Payment link is ready to copy.' :
    notice === 'already-paid' ? 'This invoice is already paid.' :
    null;

  const { data: items } = await supabase
    .from('invoice_items')
    .select('id,description,quantity,unit_amount_cents')
    .eq('invoice_id', inv.id)
    .order('sort_order', { ascending: true });

  const rows = (items ?? []) as unknown as ItemRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Invoice</h1>
        <p className="text-sm text-slate-600">
          Status: <span className="font-medium text-slate-900">{inv.status}</span>
        </p>
      </div>

      {noticeMessage ? (
        <div className="rounded-md border bg-white p-3 text-sm text-slate-700">{noticeMessage}</div>
      ) : null}

      <div className="rounded-lg border bg-white p-4 text-sm">
        <div className="grid gap-1 text-slate-700">
          <div>
            <span className="text-slate-500">Invoice ID: </span>
            <span className="font-mono">{inv.public_id}</span>
          </div>
          <div>
            <span className="text-slate-500">Created: </span>
            {new Date(inv.created_at).toLocaleString()}
          </div>
          <div>
            <span className="text-slate-500">Total: </span>
            {formatMoney(inv.total_cents)}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 text-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Payment</div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Powered by Stripe</span>
          </div>
        </div>
        <div className="mt-2">
          {inv.stripe_checkout_url ? (
            <div className="space-y-3">
              <a
                href={inv.stripe_checkout_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Pay securely with Stripe
              </a>
              <div className="text-xs text-slate-500">
                Share this link with your client to pay via Stripe Checkout.
              </div>
              <div className="text-xs text-slate-400">
                <div className="font-mono break-all bg-slate-50 p-2 rounded border">{inv.stripe_checkout_url}</div>
              </div>
            </div>
          ) : inv.status === 'paid' ? (
            <div className="flex items-center gap-2 text-green-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Paid</span>
            </div>
          ) : (
            <form action={createInvoicePaymentLink.bind(null, inv.id)}>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Create payment link
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
          <div className="col-span-7">Description</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-3 text-right">Unit</div>
        </div>
        {rows.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-700">No line items yet.</div>
        ) : (
          rows.map((it) => (
            <div key={it.id} className="grid grid-cols-12 px-4 py-3 text-sm">
              <div className="col-span-7 truncate">{it.description}</div>
              <div className="col-span-2 text-right tabular-nums text-slate-600">{it.quantity}</div>
              <div className="col-span-3 text-right tabular-nums">{formatMoney(it.unit_amount_cents)}</div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
        Next step: add editable line items and generate a Stripe Checkout payment link.
      </div>
    </div>
  );
}

function formatMoney(cents: number) {
  const dollars = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}
