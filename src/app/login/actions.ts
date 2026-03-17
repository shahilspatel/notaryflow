'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isRateLimited } from '@/lib/rate-limit';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectToRaw = String(formData.get('redirectTo') ?? '/dashboard');
  const redirectTo = safeRedirectPath(redirectToRaw, '/dashboard');

  // Rate limiting by email
  if (isRateLimited(`login:${email}`, 10, 60000)) {
    redirect('/login?error=rate-limited');
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

function safeRedirectPath(value: string, fallback: string) {
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//')) return fallback;
  return value;
}
