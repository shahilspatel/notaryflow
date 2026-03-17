import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export default async function ClientsPage() {
  // Skip auth check during build
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-slate-600">Configure environment variables to view clients.</p>
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

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id,name,email,phone,address')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-rose-700">{error.message}</p>
      </div>
    );
  }

  const rows = (clients ?? []) as unknown as ClientRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-slate-600">Your mini-CRM.</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
          No clients yet. Clients are created automatically when someone books.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-3">Address</div>
          </div>
          {rows.map((c) => (
            <div key={c.id} className="grid grid-cols-12 px-4 py-3 text-sm">
              <div className="col-span-4 truncate font-medium">{c.name}</div>
              <div className="col-span-3 truncate text-slate-600">{c.email ?? '—'}</div>
              <div className="col-span-2 truncate text-slate-600">{c.phone ?? '—'}</div>
              <div className="col-span-3 truncate text-slate-600">{c.address ?? '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
