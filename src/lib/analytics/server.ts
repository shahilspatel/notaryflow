import 'server-only';

// Lightweight analytics helper
// In production, integrate with Plausible, GA4, or PostHog via their server-side APIs

export async function trackEvent({
  event,
  userId,
  properties
}: {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
}) {
  // Placeholder: In production, send to your analytics provider
  console.log('Analytics event:', { event, userId, properties });

  // Example for Plausible (server-side):
  // if (process.env.PLAUSIBLE_API_URL && process.env.PLAUSIBLE_API_KEY) {
  //   const url = process.env.PLAUSIBLE_API_URL;
  //   const body = new URLSearchParams({
  //     name: event,
  //     url: process.env.NEXT_PUBLIC_APP_URL || '',
  //     domain: new URL(process.env.NEXT_PUBLIC_APP_URL || '').hostname,
  //     ...(userId && { 'u-id': userId }),
  //     ...(properties && { props: JSON.stringify(properties) })
  //   });
  //   try {
  //     await fetch(`${url}/api/event`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       body: body.toString()
  //     });
  //   } catch (e) {
  //     console.warn('Analytics send failed:', e);
  //   }
  // }
}

// Key conversion events to track
export const ANALYTICS_EVENTS = {
  BOOKING_CREATED: 'booking_created',
  INVOICE_SENT: 'invoice_sent',
  PAYMENT_COMPLETED: 'payment_completed',
  USER_SIGNED_UP: 'user_signed_up',
  SUBSCRIPTION_ACTIVATED: 'subscription_activated',
  GOOGLE_CALENDAR_CONNECTED: 'google_calendar_connected'
} as const;
