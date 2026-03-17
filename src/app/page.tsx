export default function HomePage() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Run your notary business with less chaos.</h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Accept bookings, sync to Google Calendar, send reminders, generate invoices, collect payments,
            and track mileage—built for loan signing agents.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Start free trial
          </a>
          <a
            href="/book/demo"
            className="inline-flex items-center justify-center rounded-md border bg-white px-6 py-3 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            View booking example
          </a>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Secure Stripe payments</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Trusted by notaries nationwide</h2>
          <p className="text-slate-600 mt-2">Join hundreds of signing agents running their business with NotaryFlow</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-700 mb-3">
              "NotaryFlow saved me 5+ hours per week. The automatic invoicing and Google Calendar sync are game changers."
            </blockquote>
            <div>
              <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
              <p className="text-xs text-slate-500">Loan Signing Agent, California</p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-700 mb-3">
              "Getting paid is now effortless. Clients love the professional booking experience and instant payment receipts."
            </blockquote>
            <div>
              <p className="text-sm font-medium text-slate-900">Michael Chen</p>
              <p className="text-xs text-slate-500">Notary Public, Texas</p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-700 mb-3">
              "The mileage and expense tracking made tax season a breeze. I can't imagine running my business without it."
            </blockquote>
            <div>
              <p className="text-sm font-medium text-slate-900">Emily Rodriguez</p>
              <p className="text-xs text-slate-500">Certified Signing Agent, Florida</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to streamline your notary business?</h2>
          <p className="text-slate-600">Start your free trial today — no credit card required</p>
        </div>
        <a
          href="/signup"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          Start free trial
        </a>
        <p className="mt-3 text-xs text-slate-500">
          30-day money-back guarantee • Cancel anytime
        </p>
      </div>
    </div>
  );
}
