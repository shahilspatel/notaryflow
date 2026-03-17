import { login } from './actions';

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string; redirect?: string; notice?: string };
}) {
  const error = searchParams?.error ? safeDecode(searchParams.error) : null;
  const notice = searchParams?.notice;
  const redirectTo = searchParams?.redirect ?? '/dashboard';

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
        <p className="text-sm text-slate-600">Welcome back.</p>
      </div>

      {notice === 'confirm-email' ? (
        <div className="rounded-md border bg-white p-3 text-sm text-slate-700">
          Check your email to confirm your account, then log in.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      <form action={login} className="space-y-4 rounded-lg border bg-white p-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Log in
        </button>

        <p className="text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <a className="text-slate-900 underline" href="/signup">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
