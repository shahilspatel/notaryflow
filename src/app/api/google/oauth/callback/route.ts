import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/google/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=google-oauth-failed`);
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(state, 'base64').toString());
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=google-oauth-failed`);
  }

  const userId = parsed.userId;
  if (!userId || typeof userId !== 'string') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=google-oauth-failed`);
  }

  const tokens = await exchangeCodeForTokens(code);
  if (!tokens.access_token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=google-oauth-failed`);
  }

  const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null;

  await supabaseAdmin
    .from('users')
    .update({
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token ?? null,
      google_token_expires_at: expiresAt,
      google_calendar_id: 'primary'
    })
    .eq('id', userId);

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?notice=google-connected`);
}
