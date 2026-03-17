import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type ExpenseRow = {
  id: string;
  incurred_on: string;
  category: 'printing' | 'shipping' | 'supplies' | 'parking' | 'tolls' | 'other';
  amount_cents: number;
  notes: string | null;
};

export default async function ExpensesPage() {
  // Skip auth check during build
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <p className="text-slate-600">Configure environment variables to view expenses.</p>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('id,incurred_on,category,amount_cents,notes')
    .order('incurred_on', { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
        <p className="text-sm text-rose-700">{error.message}</p>
      </div>
    );
  }

  const rows = (expenses ?? []) as unknown as ExpenseRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-slate-600">Track business expenses per appointment.</p>
        </div>
        <a
          href="/expenses/export"
          className="rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Export CSV
        </a>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
          No expenses yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-5">Notes</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          {rows.map((e) => (
            <div key={e.id} className="grid grid-cols-12 px-4 py-3 text-sm">
              <div className="col-span-3 text-slate-600">{new Date(e.incurred_on).toLocaleDateString()}</div>
              <div className="col-span-2 text-slate-700">{e.category}</div>
              <div className="col-span-5 truncate">{e.notes ?? '—'}</div>
              <div className="col-span-2 text-right tabular-nums">{formatMoney(e.amount_cents)}</div>
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

async function exportExpenses() {
  'use server';

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: expenses } = await supabase
    .from('expenses')
    .select('incurred_on,category,amount_cents,notes')
    .order('incurred_on', { ascending: false });

  const rows = (expenses ?? []) as unknown as ExpenseRow[];

  const csv = [
    'Date,Category,Notes,Amount (USD)',
    ...rows.map(e =>
      [
        e.incurred_on,
        e.category,
        e.notes ?? '',
        (e.amount_cents / 100).toFixed(2)
      ].map(v => `"${v}"`).join(',')
    )
  ].join('\n');

  const headers = new Headers();
  headers.set('Content-Type', 'text/csv');
  headers.set('Content-Disposition', 'attachment; filename="expenses.csv"');

  return new Response(csv, { headers });
}
