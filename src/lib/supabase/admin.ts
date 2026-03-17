import 'server-only';

import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = (() => {
  // Skip Supabase initialization during build or when env vars are missing
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return a mock client for build time
    return {
      from: () => ({
        select: () => ({
          single: () => ({ data: null })
        })
      })
    } as any;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
})();
