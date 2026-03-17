import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect('/login');
  }

  const { data: expenses } = await supabase
    .from('expenses')
    .select('incurred_on,category,amount_cents,notes')
    .order('incurred_on', { ascending: false });

  const rows = (expenses ?? []) as unknown as {
    incurred_on: string;
    category: string;
    amount_cents: number;
    notes: string | null;
  }[];

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

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="expenses.csv"'
    }
  });
}
