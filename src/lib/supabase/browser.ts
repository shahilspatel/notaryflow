import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a mock client for build time
    return {
      auth: {
        getUser: () => ({ data: { user: null } })
      },
      from: () => ({
        select: () => ({
          single: () => ({ data: null })
        })
      })
    } as any;
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
