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

    const { data: mileage, error } = await supabase
      .from('mileage_entries')
      .select('created_at,miles,appointments(start_at,clients(name))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mileage data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch mileage data' },
        { status: 500 }
      );
    }

    const rows = (mileage ?? []) as unknown as {
      created_at: string;
      miles: number;
      appointments: {
        start_at: string;
        clients: { name: string | null } | null;
      } | null;
    }[];

    // Validate data before export
    if (!Array.isArray(rows)) {
      console.error('Invalid mileage data format:', rows);
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 500 }
      );
    }

    const csv = [
      'Date,Appointment,Client,Miles',
      ...rows.map(m =>
        [
          m.created_at || '',
          m.appointments?.start_at ? new Date(m.appointments.start_at).toLocaleString() : '',
          m.appointments?.clients?.name ?? '',
          (m.miles || 0).toString()
        ].map(v => `"${v}"`).join(',')
      )
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="mileage.csv"'
      }
    });
  } catch (error) {
    console.error('Mileage export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
