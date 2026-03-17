import { supabaseAdmin } from '@/lib/supabase/admin';
import { createBooking } from './actions';

export default async function PublicBookingPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { error?: string };
}) {
  const { slug } = params;

  const { data: notary } = await supabaseAdmin
    .from('users')
    .select('business_name, default_appointment_fee_cents, currency')
    .eq('booking_slug', slug)
    .maybeSingle();

  const feeCents = Number(notary?.default_appointment_fee_cents ?? 0);
  const businessName = notary?.business_name ?? 'Notary';
  const currency = String(notary?.currency ?? 'usd');

  const error = searchParams?.error;
  const errorMessage =
    error === 'not-found'
      ? 'This booking link is invalid.'
      : error === 'invalid'
        ? 'Please fill in all required fields.'
        : error === 'invalid-time'
          ? 'Please select a valid date/time.'
          : error === 'unable-to-book'
            ? 'Unable to create the appointment. Please try again.'
            : error === 'unable-to-invoice'
              ? 'Unable to create the invoice. Please try again.'
              : error === 'time-slot-taken'
                ? 'This time slot was just booked. Please choose another.'
                : null;

  if (!notary) {
    return (
      <div className="mx-auto max-w-lg space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Booking link not found</h1>
        <p className="text-sm text-slate-600">Please contact your notary for a valid link.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Book an appointment</h1>
        <p className="text-lg text-slate-600">{businessName}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure booking</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Stripe payments</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>SSL protected</span>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="flex">
            <svg className="h-5 w-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">{errorMessage}</div>
          </div>
        </div>
      ) : null}

      <form action={createBooking} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
        <input type="hidden" name="notaryId" value={slug} />
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="startAt">
                Date
              </label>
              <input
                id="startAt"
                name="date"
                type="date"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="time">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="clientName"
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="clientEmail"
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="clientPhone"
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main St, City, State"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="notes">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any special instructions or details..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        {feeCents > 0 && (
          <div className="rounded-md bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Appointment fee</span>
              <span className="font-medium text-slate-900">{formatMoney(feeCents, currency)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
        >
          Confirm booking • Pay securely
        </button>

        <div className="space-y-2">
          <p className="text-xs text-slate-500 text-center">
            You'll receive a confirmation email immediately after booking.
          </p>
          <p className="text-xs text-slate-400 text-center">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </form>

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure booking</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Stripe payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMoney(cents: number, currency: string) {
  const dollars = (cents ?? 0) / 100;
  const code = (currency ?? 'usd').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code
    }).format(dollars);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(dollars);
  }
}
