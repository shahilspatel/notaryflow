export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-slate-600">Everything you need to know about NotaryFlow</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">How do I start accepting bookings?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                After signing up and activating your subscription, your public booking link is available on your dashboard. Share this link with clients to accept appointments.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">Can I customize my booking link?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Your booking link is automatically generated and unique to your account. You can update your business name and default pricing in Settings to personalize the booking experience.
              </div>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Security & Privacy</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">Is my data secure?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Yes. We use industry-standard encryption and row-level security to ensure your data is only accessible to you. All payments are processed securely via Stripe.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">Where is my data stored?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Your data is stored securely in Supabase's PostgreSQL database with automatic backups and redundancy.
              </div>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Payments & Billing</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">How do clients pay?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                After booking, an invoice is automatically generated with a secure Stripe payment link. Clients can pay online via card, and you'll receive payment confirmation via email.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">Can I offer a free trial?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Yes. We offer a 30-day money-back guarantee on all plans. You can cancel anytime within the first 30 days for a full refund.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">What payment methods do you accept?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                We accept all major credit and debit cards via Stripe. Your subscription and client invoice payments are processed securely.
              </div>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Features</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">Does NotaryFlow integrate with Google Calendar?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Yes. Connect your Google Calendar in Settings to automatically create events for new bookings. We handle token refresh so it stays in sync.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">Can I export my data?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Yes. You can export expenses and mileage entries to CSV for tax purposes from the respective pages.
              </div>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Support</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-white border rounded-lg hover:bg-slate-50">
                <span className="font-medium">How do I get help?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600">
                Email us at support@notaryflow.com for any questions or issues. We typically respond within 24 hours.
              </div>
            </details>
          </div>
        </section>
      </div>

      <div className="rounded-lg border bg-slate-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Still have questions?</h3>
        <p className="text-sm text-slate-600 mb-4">
          We're here to help you get the most out of NotaryFlow.
        </p>
        <a
          href="mailto:support@notaryflow.com"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
