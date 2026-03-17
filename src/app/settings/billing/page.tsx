import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { openCustomerPortal, startCheckout } from './actions';

export default async function BillingPage({
  searchParams
}: {
  searchParams?: { success?: string; canceled?: string; error?: string; blocked?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('stripe_subscription_status,stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  const status = profile?.stripe_subscription_status ?? 'inactive';

  const success = searchParams?.success === '1';
  const canceled = searchParams?.canceled === '1';
  const blocked = searchParams?.blocked === '1';
  const error = searchParams?.error ?? null;

  const errorMessage =
    error === 'missing-price'
      ? 'Missing Stripe price IDs in env vars.'
      : error === 'unable-to-start'
        ? 'Unable to start checkout. Please try again.'
        : error === 'no-customer'
          ? 'No Stripe customer on file yet.'
          : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-slate-600">Manage your subscription. 30-day money-back guarantee.</p>
      </div>

      {blocked ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Your subscription is inactive. Activate billing to continue using the app.
        </div>
      ) : null}

      {success ? (
        <div className="rounded-md border bg-white p-3 text-sm text-slate-700">
          Checkout completed. Your subscription will activate shortly.
        </div>
      ) : null}

      {canceled ? (
        <div className="rounded-md border bg-white p-3 text-sm text-slate-700">
          Checkout canceled.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-lg border bg-white p-6 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-500">Current status</div>
            <div className="mt-1 font-medium text-slate-900">{status}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>

      {status === 'active' || status === 'trialing' ? (
        <form action={openCustomerPortal}>
          <button
            type="submit"
            className="rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Manage billing
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">Choose a plan</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>30-day guarantee</span>
              </div>
            </div>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <form action={startCheckout} className="rounded-lg border p-4 hover:border-slate-300 transition-colors">
                <input type="hidden" name="plan" value="founding" />
                <div className="text-sm font-medium">Founding</div>
                <div className="text-sm text-slate-600">$29/mo</div>
                <div className="text-xs text-slate-500 mt-1">Early adopter pricing</div>
                <button
                  type="submit"
                  className="mt-3 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Start Founding
                </button>
              </form>
              <form action={startCheckout} className="rounded-lg border p-4 hover:border-slate-300 transition-colors">
                <input type="hidden" name="plan" value="standard" />
                <div className="text-sm font-medium">Standard</div>
                <div className="text-sm text-slate-600">$39/mo</div>
                <div className="text-xs text-slate-500 mt-1">Full feature access</div>
                <button
                  type="submit"
                  className="mt-3 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Start Standard
                </button>
              </form>
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center">
              Cancel anytime • No setup fees • Secure Stripe payments
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500">30-day money-back guarantee.</div>
    </div>
  );
}
