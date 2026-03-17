import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/login`);
    }

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('incurred_on,category,amount_cents,notes')
      .order('incurred_on', { ascending: false });

    if (error) {
      console.error('Error fetching expense data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch expense data' },
        { status: 500 }
      );
    }

    const rows = (expenses ?? []) as unknown as {
      incurred_on: string;
      category: string;
      amount_cents: number;
      notes: string | null;
    }[];

    // Validate data before export
    if (!Array.isArray(rows)) {
      console.error('Invalid expense data format:', rows);
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 500 }
      );
    }

    const csv = [
      'Date,Category,Notes,Amount (USD)',
      ...rows.map(e =>
        [
          e.incurred_on || '',
          e.category || '',
          e.notes ?? '',
          (e.amount_cents ? (e.amount_cents / 100).toFixed(2) : '0.00')
        ].map(v => `"${v}"`).join(',')
      )
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="expenses.csv"'
      }
    });
  } catch (error) {
    console.error('Expense export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
