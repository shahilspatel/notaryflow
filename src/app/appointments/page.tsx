import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type AppointmentRow = {
  id: string;
  start_at: string;
  end_at: string;
  status: 'scheduled' | 'completed' | 'canceled';
  fee_cents: number;
  clients: { name: string | null } | null;
};

export default async function AppointmentsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('id,start_at,end_at,status,fee_cents,clients(name)')
    .order('start_at', { ascending: true })
    .limit(50);

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
        <p className="text-sm text-rose-700">{error.message}</p>
      </div>
    );
  }

  const rows = (appointments ?? []) as unknown as AppointmentRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-slate-600">Upcoming and past signings.</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
          No appointments yet. Share your booking link from the dashboard to accept your first booking.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
            <div className="col-span-5">Client</div>
            <div className="col-span-4">Start</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Fee</div>
          </div>
          {rows.map((a) => (
            <div key={a.id} className="grid grid-cols-12 px-4 py-3 text-sm">
              <div className="col-span-5 truncate font-medium">{a.clients?.name ?? '—'}</div>
              <div className="col-span-4 text-slate-600">{new Date(a.start_at).toLocaleString()}</div>
              <div className="col-span-2 text-slate-700">{a.status}</div>
              <div className="col-span-1 text-right tabular-nums">{formatMoney(a.fee_cents)}</div>
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
