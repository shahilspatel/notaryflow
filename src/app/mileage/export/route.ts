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

  const { data: mileage } = await supabase
    .from('mileage_entries')
    .select('created_at,miles,appointments(start_at,clients(name))')
    .order('created_at', { ascending: false });

  const rows = (mileage ?? []) as unknown as {
    created_at: string;
    miles: number;
    appointments: {
      start_at: string;
      clients: { name: string | null } | null;
    } | null;
  }[];

  const csv = [
    'Date,Appointment,Client,Miles',
    ...rows.map(m =>
      [
        m.created_at,
        m.appointments?.start_at ? new Date(m.appointments.start_at).toLocaleString() : '',
        m.appointments?.clients?.name ?? '',
        m.miles.toString()
      ].map(v => `"${v}"`).join(',')
    )
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="mileage.csv"'
    }
  });
}
