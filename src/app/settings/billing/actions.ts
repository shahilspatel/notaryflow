'use server';

import { stripe } from '@/lib/stripe/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Plan = 'founding' | 'standard';

export async function startCheckout(formData: FormData) {
  const plan = String(formData.get('plan') ?? '') as Plan;
  const priceId = plan === 'founding'
    ? process.env.STRIPE_PRICE_FOUNDING_MONTHLY
    : plan === 'standard'
      ? process.env.STRIPE_PRICE_STANDARD_MONTHLY
      : null;

  if (!priceId) {
    redirect('/settings/billing?error=missing-price');
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
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: {
        user_id: user.id
      }
    });

    customerId = customer.id;

    await supabase
      .from('users')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl}/settings/billing?success=1`,
    cancel_url: `${appUrl}/settings/billing?canceled=1`
  });

  if (!session.url) {
    redirect('/settings/billing?error=unable-to-start');
  }

  redirect(session.url);
}

export async function openCustomerPortal() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    redirect('/settings/billing?error=no-customer');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/settings/billing`
  });

  redirect(portal.url);
}
