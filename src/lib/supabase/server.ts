import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  // Skip Supabase initialization during build or when env vars are missing
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
  
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value, ...(options ?? {}) });
          } catch {
            // no-op (Server Components can't always set cookies)
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value: '', ...(options ?? {}) });
          } catch {
            // no-op (Server Components can't always set cookies)
          }
        }
      }
    }
  );
}
