import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type InvoiceRow = {
  id: string;
  status: 'draft' | 'sent' | 'paid';
  total_cents: number;
  created_at: string;
  public_id: string;
};

export default async function InvoicesPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('id,status,total_cents,created_at,public_id')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-rose-700">{error.message}</p>
      </div>
    );
  }

  const rows = (invoices ?? []) as unknown as InvoiceRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-slate-600">Track payments per appointment.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Powered by Stripe</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <svg className="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices yet</h3>
          <p className="text-sm text-slate-600 mb-4">Invoices are created automatically when a booking is made.</p>
          <a
            href="/appointments"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            View appointments
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
            <div className="col-span-4">Invoice</div>
            <div className="col-span-3">Created</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          {rows.map((inv) => (
            <div key={inv.id} className="grid grid-cols-12 px-4 py-3 text-sm border-b border-slate-100 last:border-b-0">
              <div className="col-span-4 truncate font-medium">
                <a className="text-slate-900 hover:text-slate-700 underline" href={`/invoices/${inv.id}`}>
                  {inv.public_id}
                </a>
              </div>
              <div className="col-span-3 text-slate-600">{new Date(inv.created_at).toLocaleDateString()}</div>
              <div className="col-span-2">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  inv.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : inv.status === 'sent'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {inv.status}
                </span>
              </div>
              <div className="col-span-2 text-right tabular-nums font-medium">{formatMoney(inv.total_cents)}</div>
              <div className="col-span-1 text-center">
                {inv.status !== 'paid' && (
                  <a
                    href={`/invoices/${inv.id}`}
                    className="text-slate-600 hover:text-slate-900 underline text-xs"
                  >
                    Pay
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatMoney(cents: number) {
  const dollars = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}
