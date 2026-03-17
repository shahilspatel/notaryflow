'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getGoogleAuthUrl } from '@/lib/google/server';

export async function connectGoogleCalendar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
  const authUrl = getGoogleAuthUrl(state);
  redirect(authUrl);
}

export async function disconnectGoogleCalendar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  await supabase
    .from('users')
    .update({
      google_access_token: null,
      google_refresh_token: null,
      google_token_expires_at: null,
      google_calendar_id: null
    })
    .eq('id', user.id);

  redirect('/settings?notice=google-disconnected');
}
