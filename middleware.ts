import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...(options ?? {}) });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: '', ...(options ?? {}) });
        }
      }
    }
  );

  return { supabase, response };
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/clients') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/invoices');

  const isBillingRoute = pathname.startsWith('/settings/billing');

  if (!isAuthRoute && !isProtected) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname + (searchParams.toString() ? `?${searchParams}` : ''));
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (session && isProtected && !isBillingRoute) {
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_subscription_status')
      .eq('id', session.user.id)
      .maybeSingle();

    const status = profile?.stripe_subscription_status ?? 'inactive';
    const isActive = status === 'active' || status === 'trialing';

    if (!isActive) {
      const url = request.nextUrl.clone();
      url.pathname = '/settings/billing';
      url.searchParams.set('blocked', '1');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/appointments/:path*', '/clients/:path*', '/settings/:path*', '/invoices/:path*']
};
