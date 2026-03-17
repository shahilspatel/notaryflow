import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connectGoogleCalendar, disconnectGoogleCalendar } from './actions';

export default async function SettingsPage({
  searchParams
}: {
  searchParams?: { notice?: string };
}) {
  // Skip auth check during build
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-slate-600">Configure environment variables to view settings.</p>
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

  const { data: profile } = await supabase
    .from('users')
    .select('business_name,business_phone,business_address,default_appointment_fee_cents,currency,google_access_token,google_calendar_id')
    .eq('id', user.id)
    .maybeSingle();

  const isConnected = Boolean(profile?.google_access_token && profile?.google_calendar_id);
  const notice = searchParams?.notice;
  const noticeMessage =
    notice === 'google-connected' ? 'Google Calendar connected.' :
    notice === 'google-disconnected' ? 'Google Calendar disconnected.' :
    null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-600">Business defaults and integrations.</p>
      </div>

      {noticeMessage ? (
        <div className="rounded-md border bg-white p-3 text-sm text-slate-700">{noticeMessage}</div>
      ) : null}

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm font-medium">Billing</div>
        <div className="mt-2 text-sm text-slate-700">
          <a className="text-slate-900 underline" href="/settings/billing">
            Manage subscription
          </a>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm font-medium">Google Calendar</div>
        <div className="mt-2 text-sm text-slate-700">
          {isConnected ? (
            <div className="space-y-2">
              <div>Connected to calendar: {profile?.google_calendar_id}</div>
              <form action={disconnectGoogleCalendar}>
                <button
                  type="submit"
                  className="rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                >
                  Disconnect
                </button>
              </form>
            </div>
          ) : (
            <form action={connectGoogleCalendar}>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Connect Google Calendar
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm font-medium">Business info</div>
        <div className="mt-2 grid gap-2 text-sm text-slate-700">
          <div>
            <span className="text-slate-500">Name: </span>
            {profile?.business_name ?? '—'}
          </div>
          <div>
            <span className="text-slate-500">Phone: </span>
            {profile?.business_phone ?? '—'}
          </div>
          <div>
            <span className="text-slate-500">Address: </span>
            {profile?.business_address ?? '—'}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm font-medium">Default pricing</div>
        <div className="mt-2 text-sm text-slate-700">
          {formatMoney(profile?.default_appointment_fee_cents ?? 0)} ({profile?.currency ?? 'usd'})
        </div>
      </div>
    </div>
  );
}

function formatMoney(cents: number) {
  const dollars = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}
