import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type MileageRow = {
  id: string;
  created_at: string;
  miles: number;
  origin_lat: number | null;
  origin_lng: number | null;
  destination_lat: number | null;
  destination_lng: number | null;
  appointments: {
    start_at: string;
    clients: { name: string | null } | null;
  } | null;
};

export default async function MileagePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: mileage, error } = await supabase
    .from('mileage_entries')
    .select('id,created_at,miles,origin_lat,origin_lng,destination_lat,destination_lng,appointments(start_at,clients(name))')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Mileage</h1>
        <p className="text-sm text-rose-700">{error.message}</p>
      </div>
    );
  }

  const rows = (mileage ?? []) as unknown as MileageRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Mileage</h1>
          <p className="text-sm text-slate-600">Track miles per appointment.</p>
        </div>
        <a
          href="/mileage/export"
          className="rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Export CSV
        </a>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
          No mileage entries yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
            <div className="col-span-3">Date</div>
            <div className="col-span-4">Appointment</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-2 text-right">Miles</div>
          </div>
          {rows.map((m) => (
            <div key={m.id} className="grid grid-cols-12 px-4 py-3 text-sm">
              <div className="col-span-3 text-slate-600">{new Date(m.created_at).toLocaleDateString()}</div>
              <div className="col-span-4 text-slate-700">{m.appointments ? new Date(m.appointments.start_at).toLocaleString() : '—'}</div>
              <div className="col-span-3 truncate">{m.appointments?.clients?.name ?? '—'}</div>
              <div className="col-span-2 text-right tabular-nums">{m.miles}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function exportMileage() {
  'use server';

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: mileage } = await supabase
    .from('mileage_entries')
    .select('created_at,miles,appointments(start_at,clients(name))')
    .order('created_at', { ascending: false });

  const rows = (mileage ?? []) as unknown as MileageRow[];

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

  const headers = new Headers();
  headers.set('Content-Type', 'text/csv');
  headers.set('Content-Disposition', 'attachment; filename="mileage.csv"');

  return new Response(csv, { headers });
}
