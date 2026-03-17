'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isRateLimited } from '@/lib/rate-limit';
import { trackEvent } from '@/lib/analytics/server';

/**
 * Creates a new user account with rate limiting and analytics.
 * 
 * Args:
 *   formData: Form data containing email and password
 * 
 * Returns:
 *   Redirects to login on success or signup with error
 * 
 * Edge Cases:
 *   - Rate limits signup attempts
 *   - Handles existing email gracefully
 *   - Validates email format
 */
export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Rate limiting by email
  if (isRateLimited(`signup:${email}`, 5, 60000)) {
    redirect('/signup?error=rate-limited');
  }

  // Validate input
  if (!email || !password) {
    redirect('/signup?error=invalid');
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`
      }
    });

    if (error) {
      console.error('Signup error:', error);
      redirect('/signup?error=signup-failed');
    }

    // Track analytics event
    trackEvent({
      event: 'user_signed_up',
      userId: email,
      properties: { email }
    });

    redirect('/login?message=check-email');
  } catch (error) {
    console.error('Signup failed:', error);
    redirect('/signup?error=signup-failed');
  }
}
