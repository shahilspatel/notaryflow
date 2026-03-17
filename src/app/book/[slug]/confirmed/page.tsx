export default function BookingConfirmedPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Booked</h1>
        <p className="text-sm text-slate-600">Your appointment request has been received.</p>
      </div>

      <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
        You’ll receive a confirmation email shortly.
      </div>

      <a className="inline-flex text-sm text-slate-900 underline" href="/">
        Back to NotaryFlow
      </a>
    </div>
  );
}
