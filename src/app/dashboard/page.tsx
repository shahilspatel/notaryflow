import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CopyButton } from '@/components/copy-button';

function formatMoney(cents: number) {
  const dollars = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('booking_slug, stripe_subscription_status, business_name')
    .eq('id', user.id)
    .maybeSingle();

  // Fetch real stats
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const [{ count: appointmentsCount }, { data: revenueData }] = await Promise.all([
    supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('start_at', currentMonth.toISOString()),
    supabase
      .from('invoices')
      .select('total_cents, currency')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .gte('created_at', currentMonth.toISOString())
  ]);

  const totalRevenue = revenueData?.reduce((sum, inv) => sum + (inv.total_cents || 0), 0) || 0;

  const bookingUrl = profile?.booking_slug
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/book/${profile.booking_slug}`
    : null;

  const subStatus = profile?.stripe_subscription_status ?? 'inactive';
  const isActive = subStatus === 'active' || subStatus === 'trialing';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-600">
            Signed in as {user.email}
            {profile?.business_name && ` • ${profile.business_name}`}
          </p>
        </div>
        <form action={signOut}>
          <button
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Booking link</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {bookingUrl ? 'Shareable' : 'Loading…'}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          {bookingUrl && (
            <div className="mt-3">
              <a
                className="text-xs text-slate-600 underline hover:text-slate-900"
                href={bookingUrl}
                target="_blank"
              >
                View link
              </a>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subscription</p>
              <p className="mt-1 text-sm font-medium text-slate-900 capitalize">{subStatus}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <a
              className="text-xs text-slate-600 underline hover:text-slate-900"
              href="/settings/billing"
            >
              {isActive ? 'Manage' : 'Activate'}
            </a>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">This month</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{appointmentsCount || 0} appointments</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <a className="text-xs text-slate-600 underline hover:text-slate-900" href="/appointments">
              View all
            </a>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Revenue</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{formatMoney(totalRevenue)}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <a className="text-xs text-slate-600 underline hover:text-slate-900" href="/invoices">
              View invoices
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-slate-50 p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-slate-900">Get started</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/appointments"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 text-center transition-colors"
          >
            View appointments
          </a>
          <a
            href="/clients"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 text-center transition-colors"
          >
            Manage clients
          </a>
          <a
            href="/invoices"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 text-center transition-colors"
          >
            Create invoice
          </a>
          <a
            href="/settings"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 text-center transition-colors"
          >
            Settings
          </a>
        </div>
        {bookingUrl && (
          <div className="mt-4 p-3 bg-white rounded-md border border-slate-200">
            <p className="text-xs text-slate-600 mb-2">Share your booking link to accept appointments:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={bookingUrl}
                className="flex-1 text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200 font-mono"
              />
              <CopyButton text={bookingUrl} />
            </div>
          </div>
        )}
      </div>

      {!isActive && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Activate your subscription</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Your account is inactive. Choose a plan to continue using NotaryFlow.</p>
                <div className="mt-3">
                  <a
                    href="/settings/billing"
                    className="inline-flex items-center rounded-md border border-transparent bg-amber-100 px-3 py-2 text-sm font-medium leading-4 text-amber-800 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Choose a plan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function signOut() {
  'use server';

  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
